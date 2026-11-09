import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { ServicesManager } from "./ServicesManager";

export default async function ServicosPage() {
  const units = await prisma.serviceUnit.findMany({
    include: {
      services: {
        where: { active: true },
        orderBy: { name: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-[#090D16]">
        <Header
          title="Catálogo de Serviços"
          subtitle="Tabela oficial das 4 unidades Golec, escopos, modelos de cobrança e entregáveis"
        />

        <main className="p-8 space-y-8 flex-1 max-w-7xl">
          <ServicesManager initialUnits={units} />
        </main>
      </div>
    </div>
  );
}
