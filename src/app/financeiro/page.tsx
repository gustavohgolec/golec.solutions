import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { formatBRL, formatDateBR } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Calendar,
  Clock,
  Plus,
  Building2,
  FileText,
} from "lucide-react";

export default async function FinanceiroPage() {
  const [categories, transactions] = await Promise.all([
    prisma.financialCategory.findMany(),
    prisma.financialTransaction.findMany({
      include: {
        category: true,
        client: { include: { company: true } },
      },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME" && t.status === "PAID")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE" && t.status === "PAID")
    .reduce((acc, t) => acc + t.amount, 0);

  const pendingReceivables = transactions
    .filter((t) => t.type === "INCOME" && t.status === "PENDING")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-[#090D16]">
        <Header
          title="Financeiro & Fluxo de Caixa"
          subtitle="Controle gerencial de receitas, despesas operacionais e contas a receber"
          actionButton={{ label: "Novo Lançamento" }}
        />

        <main className="p-8 space-y-8 flex-1 max-w-7xl">
          {/* Cards de Métricas Financeiras */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Saldo em Caixa
                </span>
                <Wallet className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white">{formatBRL(balance)}</p>
              <p className="text-xs text-slate-400">Realizado no período</p>
            </div>

            <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Receitas Realizadas
                </span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-emerald-400">{formatBRL(totalIncome)}</p>
              <p className="text-xs text-slate-400">Honorários e setups pagos</p>
            </div>

            <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Despesas Pagas
                </span>
                <ArrowDownRight className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-2xl font-bold text-rose-400">{formatBRL(totalExpense)}</p>
              <p className="text-xs text-slate-400">Ferramentas, parceiros e fixos</p>
            </div>

            <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Contas a Receber
                </span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-amber-400">{formatBRL(pendingReceivables)}</p>
              <p className="text-xs text-slate-400">Faturas previstas / pendentes</p>
            </div>
          </div>

          {/* Tabela de Lançamentos */}
          <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-white">Extrato de Lançamentos Financeiros</h3>
              <div className="flex gap-2">
                <button className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700">
                  Filtrar por Categoria
                </button>
                <button className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700">
                  Exportar CSV
                </button>
              </div>
            </div>

            {transactions.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-200">Nenhuma movimentação registrada</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Cadastre receitas de contratos e despesas da operação para acompanhar o fluxo de caixa gerencial em tempo real.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0B1120] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Descrição</th>
                      <th className="p-3.5">Categoria</th>
                      <th className="p-3.5">Cliente / Vínculo</th>
                      <th className="p-3.5">Vencimento</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-medium text-white">{tx.description}</td>
                        <td className="p-3.5 text-slate-400">{tx.category?.name || "Geral"}</td>
                        <td className="p-3.5 text-slate-400">
                          {tx.client?.company?.name || "Golec Interno"}
                        </td>
                        <td className="p-3.5 text-slate-400">{formatDateBR(tx.dueDate)}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                              tx.status === "PAID"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td
                          className={`p-3.5 text-right font-bold ${
                            tx.type === "INCOME" ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {tx.type === "INCOME" ? "+" : "-"} {formatBRL(tx.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

