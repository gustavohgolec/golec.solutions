import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { FinanceiroManager } from "./FinanceiroManager";

export default async function FinanceiroPage() {
  const [categories, transactions, clients] = await Promise.all([
    prisma.financialCategory.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.financialTransaction.findMany({
      include: {
        category: true,
        client: { include: { company: true } },
      },
      orderBy: { dueDate: "asc" },
    }),
    prisma.client.findMany({
      include: { company: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-[#090D16]">
        <Header
          title="Financeiro & Fluxo de Caixa"
          subtitle="Controle gerencial de receitas, despesas operacionais e contas a receber"
        />

        <main className="p-8 space-y-8 flex-1 max-w-7xl">
          <FinanceiroManager
            initialTransactions={transactions}
            categories={categories}
            clients={clients}
          />
        </main>
      </div>
    </div>
  );
}
