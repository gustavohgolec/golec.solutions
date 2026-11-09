"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTransactionAction(formData: FormData) {
  try {
    const description = formData.get("description") as string;
    const type = formData.get("type") as string; // INCOME, EXPENSE
    const amount = parseFloat((formData.get("amount") as string) || "0");
    const categoryId = formData.get("categoryId") as string;
    const clientId = formData.get("clientId") as string;
    const dueDateStr = formData.get("dueDate") as string;
    const status = formData.get("status") as string; // PENDING, PAID
    const notes = formData.get("notes") as string;

    if (!description || !description.trim() || !amount || !dueDateStr) {
      return { success: false, error: "Descrição, valor e data de vencimento são obrigatórios." };
    }

    await prisma.financialTransaction.create({
      data: {
        description: description.trim(),
        type: type || "INCOME",
        amount,
        categoryId: categoryId && categoryId.trim() ? categoryId : null,
        clientId: clientId && clientId.trim() ? clientId : null,
        dueDate: new Date(dueDateStr),
        status: status || "PENDING",
        paidDate: status === "PAID" ? new Date() : null,
        notes: notes?.trim() || null,
      },
    });

    revalidatePath("/financeiro");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao registrar transação:", error);
    return { success: false, error: error.message || "Erro ao salvar transação." };
  }
}

export async function updateTransactionStatusAction(transactionId: string, newStatus: string) {
  try {
    await prisma.financialTransaction.update({
      where: { id: transactionId },
      data: {
        status: newStatus,
        paidDate: newStatus === "PAID" ? new Date() : null,
      },
    });

    revalidatePath("/financeiro");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao alterar status da transação:", error);
    return { success: false, error: error.message };
  }
}

