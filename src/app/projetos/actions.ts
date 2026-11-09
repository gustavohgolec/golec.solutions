"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProjectAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const clientId = formData.get("clientId") as string;
    const serviceId = formData.get("serviceId") as string;
    const description = formData.get("description") as string;
    const dueDateStr = formData.get("dueDate") as string;
    const budget = parseFloat((formData.get("budget") as string) || "0");

    if (!name || !name.trim() || !clientId) {
      return { success: false, error: "Nome do projeto e cliente são obrigatórios." };
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        clientId,
        serviceId: serviceId && serviceId.trim() ? serviceId : null,
        description: description?.trim() || null,
        dueDate: dueDateStr ? new Date(dueDateStr) : null,
        budget: budget || null,
        status: "PLANEJAMENTO",
      },
    });

    // Criar tarefas padrão baseadas no escopo inicial
    const defaultTasks = [
      { title: "Briefing & Coleta de Ativos", priority: "HIGH" },
      { title: "Estruturação & Produção", priority: "MEDIUM" },
      { title: "Revisão Interna de Qualidade", priority: "MEDIUM" },
      { title: "Apresentação & Aprovação Final com Cliente", priority: "HIGH" },
    ];

    for (const t of defaultTasks) {
      await prisma.task.create({
        data: {
          projectId: project.id,
          title: t.title,
          priority: t.priority,
          status: "TODO",
        },
      });
    }

    revalidatePath("/projetos");
    revalidatePath("/clientes");
    revalidatePath("/");
    return { success: true, projectId: project.id };
  } catch (error: any) {
    console.error("Erro ao criar projeto:", error);
    return { success: false, error: error.message || "Erro ao cadastrar projeto." };
  }
}

export async function updateTaskStatusAction(taskId: string, newStatus: string) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus },
    });

    revalidatePath("/projetos");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao atualizar tarefa:", error);
    return { success: false, error: error.message };
  }
}

export async function createQuickTaskAction(projectId: string, title: string, priority = "MEDIUM") {
  try {
    if (!title || !title.trim()) return { success: false, error: "Título obrigatório." };

    await prisma.task.create({
      data: {
        projectId,
        title: title.trim(),
        priority,
        status: "TODO",
      },
    });

    revalidatePath("/projetos");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

