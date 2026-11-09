"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createOpportunityAction(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const companyName = formData.get("companyName") as string;
    const contactName = formData.get("contactName") as string;
    const contactEmail = formData.get("contactEmail") as string;
    const contactPhone = formData.get("contactPhone") as string;
    const stageId = formData.get("stageId") as string;
    const value = parseFloat((formData.get("value") as string) || "0");
    const probability = parseInt((formData.get("probability") as string) || "50", 10);
    const expectedCloseStr = formData.get("expectedClose") as string;

    if (!title || !companyName || !stageId) {
      return { success: false, error: "Título, empresa e etapa são obrigatórios." };
    }

    // 1. Criar ou encontrar empresa
    let company = await prisma.company.findFirst({
      where: { name: { equals: companyName.trim() } },
    });
    if (!company) {
      company = await prisma.company.create({
        data: { name: companyName.trim() },
      });
    }

    // 2. Criar contato se fornecido
    let contactId: string | undefined = undefined;
    if (contactName && contactName.trim()) {
      const contact = await prisma.contact.create({
        data: {
          companyId: company.id,
          name: contactName.trim(),
          email: contactEmail?.trim() || null,
          phone: contactPhone?.trim() || null,
        },
      });
      contactId = contact.id;
    }

    // 3. Criar oportunidade vinculada
    const opportunity = await prisma.opportunity.create({
      data: {
        title: title.trim(),
        companyId: company.id,
        contactId: contactId || null,
        stageId,
        value,
        probability,
        expectedClose: expectedCloseStr ? new Date(expectedCloseStr) : null,
      },
    });

    revalidatePath("/crm");
    revalidatePath("/");
    return { success: true, opportunityId: opportunity.id };
  } catch (error: any) {
    console.error("Erro ao criar oportunidade:", error);
    return { success: false, error: error.message || "Erro interno ao cadastrar." };
  }
}

export async function updateOpportunityStageAction(opportunityId: string, newStageId: string) {
  try {
    const stage = await prisma.pipelineStage.findUnique({ where: { id: newStageId } });
    if (!stage) return { success: false, error: "Etapa não encontrada." };

    const isWon = stage.name.toLowerCase().includes("ganho");
    const isLost = stage.name.toLowerCase().includes("perdido");

    const opp = await prisma.opportunity.update({
      where: { id: opportunityId },
      data: {
        stageId: newStageId,
        isWon,
        isLost,
      },
      include: {
        company: true,
      },
    });

    // Se foi ganha, criar cliente automaticamente se não existir
    if (isWon) {
      const existingClient = await prisma.client.findFirst({
        where: { companyId: opp.companyId },
      });

      if (!existingClient) {
        const client = await prisma.client.create({
          data: {
            companyId: opp.companyId,
            opportunityId: opp.id,
            status: "ONBOARDING",
            startDate: new Date(),
          },
        });

        // Criar contrato inicial se tiver valor
        if (opp.value > 0) {
          await prisma.contract.create({
            data: {
              clientId: client.id,
              code: `CTR-${Date.now().toString().slice(-6)}`,
              title: `Contrato Inicial - ${opp.title}`,
              monthlyFee: opp.value,
              totalValue: opp.value,
              startDate: new Date(),
              billingType: "MONTHLY",
            },
          });
        }
      }
    }

    revalidatePath("/crm");
    revalidatePath("/clientes");
    revalidatePath("/projetos");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao mover oportunidade:", error);
    return { success: false, error: error.message };
  }
}

