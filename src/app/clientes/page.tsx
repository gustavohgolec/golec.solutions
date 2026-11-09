import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { ClientManager } from "./ClientManager";

export default async function ClientesPage() {
  const clients = await prisma.client.findMany({
    include: {
      company: true,
      contracts: true,
      projects: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-[#090D16]">
        <Header
          title="Clientes & Onboarding"
          subtitle="Gestão da carteira de clientes ativos, processo de boas-vindas e contratos"
        />

        <main className="p-8 space-y-8 flex-1 max-w-7xl">
          <ClientManager initialClients={clients} />
        </main>
      </div>
    </div>
  );
}
