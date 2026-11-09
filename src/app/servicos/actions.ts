"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createServiceAction(formData: FormData) {
  try {
    const unitId = formData.get("unitId") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const billingModel = formData.get("billingModel") as string;
    const refPrice = parseFloat((formData.get("refPrice") as string) || "0");
    const defaultDays = parseInt((formData.get("defaultDays") as string) || "0", 10);
    const scope = formData.get("scope") as string;

    if (!unitId || !name || !name.trim()) {
      return { success: false, error: "Unidade e nome do serviço são obrigatórios." };
    }

    await prisma.service.create({
      data: {
        unitId,
        name: name.trim(),
        description: description?.trim() || null,
        billingModel: billingModel || "MONTHLY",
        refPrice: refPrice || 0,
        defaultDays: defaultDays > 0 ? defaultDays : null,
        scope: scope?.trim() || null,
        active: true,
      },
    });

    revalidatePath("/servicos");
    revalidatePath("/projetos");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao cadastrar serviço:", error);
    return { success: false, error: error.message || "Erro ao salvar serviço." };
  }
}

