"use client";

import { useState } from "react";
import { formatBRL, formatDateBR } from "@/lib/utils";
import { createTransactionAction, updateTransactionStatusAction } from "./actions";
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
  X,
  Building2,
  FileText,
  Filter,
} from "lucide-react";

interface FinanceiroManagerProps {
  initialTransactions: any[];
  categories: any[];
  clients: any[];
}

export function FinanceiroManager({
  initialTransactions,
  categories,
  clients,
}: FinanceiroManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);

  const totalIncome = initialTransactions
    .filter((t) => t.type === "INCOME" && t.status === "PAID")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = initialTransactions
    .filter((t) => t.type === "EXPENSE" && t.status === "PAID")
    .reduce((acc, t) => acc + t.amount, 0);

  const pendingReceivables = initialTransactions
    .filter((t) => t.type === "INCOME" && t.status === "PENDING")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const filteredTransactions = initialTransactions.filter((t) => {
    if (filterType === "ALL") return true;
    return t.type === filterType;
  });

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createTransactionAction(formData);
    setLoading(false);
    if (res.success) {
      setIsModalOpen(false);
    } else {
      alert(res.error || "Erro ao criar lançamento.");
    }
  }

  async function handleToggleStatus(transactionId: string, currentStatus: string) {
    setStatusLoadingId(transactionId);
    const newStatus = currentStatus === "PAID" ? "PENDING" : "PAID";
    await updateTransactionStatusAction(transactionId, newStatus);
    setStatusLoadingId(null);
  }

  return (
    <div className="space-y-8">
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

      {/* Extrato de Lançamentos */}
      <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-sm text-white">Extrato de Lançamentos Financeiros</h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#0B1120] border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setFilterType("ALL")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterType === "ALL" ? "bg-blue-600 text-white font-medium" : "text-slate-400"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterType("INCOME")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterType === "INCOME" ? "bg-emerald-600 text-white font-medium" : "text-slate-400"
                }`}
              >
                Receitas
              </button>
              <button
                onClick={() => setFilterType("EXPENSE")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterType === "EXPENSE" ? "bg-rose-600 text-white font-medium" : "text-slate-400"
                }`}
              >
                Despesas
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm shadow-blue-600/30 transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Lançamento</span>
            </button>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
              <DollarSign className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200">Nenhuma movimentação encontrada</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Cadastre receitas de contratos e despesas operacionais para acompanhar o fluxo de caixa gerencial em tempo real.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Registrar Primeiro Lançamento
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B1120] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Descrição</th>
                  <th className="p-3.5">Tipo</th>
                  <th className="p-3.5">Categoria</th>
                  <th className="p-3.5">Cliente / Vínculo</th>
                  <th className="p-3.5">Vencimento</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Valor</th>
                  <th className="p-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredTransactions.map((tx) => {
                  const isPendingStatus = statusLoadingId === tx.id;

                  return (
                    <tr
                      key={tx.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isPendingStatus ? "opacity-50" : ""
                      }`}
                    >
                      <td className="p-3.5 font-medium text-white">{tx.description}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                            tx.type === "INCOME"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {tx.type === "INCOME" ? "Receita" : "Despesa"}
                        </span>
                      </td>
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
                          {tx.status === "PAID" ? "Pago" : "Pendente"}
                        </span>
                      </td>
                      <td
                        className={`p-3.5 text-right font-bold ${
                          tx.type === "INCOME" ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {tx.type === "INCOME" ? "+" : "-"} {formatBRL(tx.amount)}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleToggleStatus(tx.id, tx.status)}
                          className={`text-[11px] px-2 py-1 rounded transition-colors font-medium ${
                            tx.status === "PAID"
                              ? "bg-amber-950 text-amber-400 border border-amber-800/40 hover:bg-amber-900"
                              : "bg-emerald-950 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900"
                          }`}
                        >
                          {tx.status === "PAID" ? "Marcar Pendente" : "Marcar Pago"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Criar Transação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Novo Lançamento Financeiro</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Tipo *</label>
                  <select
                    name="type"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="INCOME">Receita (Entrada)</option>
                    <option value="EXPENSE">Despesa (Saída)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Status Inicial</label>
                  <select
                    name="status"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="PENDING">Pendente</option>
                    <option value="PAID">Já Pago / Liquidado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Descrição *</label>
                <input
                  type="text"
                  name="description"
                  required
                  placeholder="Ex: Mensalidade Retainer - Alpha Clínica"
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="amount"
                    required
                    placeholder="2500"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Data de Vencimento *</label>
                  <input
                    type="date"
                    name="dueDate"
                    required
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Categoria</label>
                  <select
                    name="categoryId"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Geral / Sem categoria</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.costCenter})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Cliente Vinculado</label>
                  <select
                    name="clientId"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Nenhum (Operação Interna Golec)</option>
                    {clients.map((cl) => (
                      <option key={cl.id} value={cl.id}>
                        {cl.company.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Observações / Comprovante</label>
                <input
                  type="text"
                  name="notes"
                  placeholder="Informações adicionais ou link do comprovante..."
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  {loading ? "Salvando..." : "Salvar Lançamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

