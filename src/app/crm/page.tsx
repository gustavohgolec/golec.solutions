import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { KanbanBoard } from "./KanbanBoard";

export default async function CRMPage() {
  const stages = await prisma.pipelineStage.findMany({
    orderBy: { order: "asc" },
    include: {
      opportunities: {
        where: { isArchived: false },
        include: {
          company: true,
          contact: true,
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-[#090D16]">
        <Header
          title="CRM & Pipeline de Vendas"
          subtitle="Funil de oportunidades, conversão de clientes e gestão comercial"
        />

        <main className="p-8 space-y-6 flex-1">
          <KanbanBoard stages={stages} />
        </main>
      </div>
    </div>
  );
}
