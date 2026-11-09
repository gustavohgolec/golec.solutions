"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createClientAction(formData: FormData) {
  try {
    const companyName = formData.get("companyName") as string;
    const document = formData.get("document") as string;
    const segment = formData.get("segment") as string;
    const city = formData.get("city") as string;
    const contactName = formData.get("contactName") as string;
    const contactEmail = formData.get("contactEmail") as string;
    const contactPhone = formData.get("contactPhone") as string;
    const contractTitle = formData.get("contractTitle") as string;
    const monthlyFee = parseFloat((formData.get("monthlyFee") as string) || "0");
    const driveFolderUrl = formData.get("driveFolderUrl") as string;
    const internalLead = formData.get("internalLead") as string;

    if (!companyName || !companyName.trim()) {
      return { success: false, error: "Nome da empresa/cliente é obrigatório." };
    }

    // 1. Criar ou encontrar empresa
    let company = await prisma.company.findFirst({
      where: { name: { equals: companyName.trim() } },
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: companyName.trim(),
          document: document?.trim() || null,
          segment: segment?.trim() || null,
          city: city?.trim() || null,
        },
      });
    }

    // 2. Criar contato se fornecido
    if (contactName && contactName.trim()) {
      await prisma.contact.create({
        data: {
          companyId: company.id,
          name: contactName.trim(),
          email: contactEmail?.trim() || null,
          phone: contactPhone?.trim() || null,
          isPrimary: true,
        },
      });
    }

    // 3. Criar Cliente na esteira de Onboarding
    const client = await prisma.client.create({
      data: {
        companyId: company.id,
        status: "ONBOARDING",
        internalLead: internalLead?.trim() || "Golec",
        driveFolderUrl: driveFolderUrl?.trim() || null,
        startDate: new Date(),
      },
    });

    // 4. Criar contrato se especificado
    if (contractTitle && contractTitle.trim()) {
      await prisma.contract.create({
        data: {
          clientId: client.id,
          code: `CTR-${Date.now().toString().slice(-6)}`,
          title: contractTitle.trim(),
          monthlyFee: monthlyFee || 0,
          totalValue: monthlyFee || 0,
          startDate: new Date(),
          billingType: "MONTHLY",
        },
      });
    }

    revalidatePath("/clientes");
    revalidatePath("/projetos");
    revalidatePath("/");
    return { success: true, clientId: client.id };
  } catch (error: any) {
    console.error("Erro ao criar cliente:", error);
    return { success: false, error: error.message || "Erro ao cadastrar cliente." };
  }
}

export async function updateClientStatusAction(clientId: string, newStatus: string) {
  try {
    await prisma.client.update({
      where: { id: clientId },
      data: { status: newStatus },
    });

    revalidatePath("/clientes");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao atualizar status do cliente:", error);
    return { success: false, error: error.message };
  }
}

