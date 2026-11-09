"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleItemProgressAction(itemId: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === "COMPLETED" ? "NOT_STARTED" : "COMPLETED";

    await prisma.knowledgeProgress.upsert({
      where: { itemId },
      update: {
        status: newStatus,
        completedAt: newStatus === "COMPLETED" ? new Date() : null,
      },
      create: {
        itemId,
        status: newStatus,
        completedAt: newStatus === "COMPLETED" ? new Date() : null,
      },
    });

    revalidatePath("/academia");
    revalidatePath("/");
    return { success: true, status: newStatus };
  } catch (error: any) {
    console.error("Erro ao alternar progresso:", error);
    return { success: false, error: error.message };
  }
}

