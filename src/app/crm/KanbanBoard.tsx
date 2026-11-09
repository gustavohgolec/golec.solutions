"use client";

import { useState } from "react";
import { formatBRL } from "@/lib/utils";
import { updateOpportunityStageAction, createOpportunityAction } from "./actions";
import {
  Building2,
  User,
  Plus,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";

interface Stage {
  id: string;
  name: string;
  order: number;
  color: string | null;
  opportunities: any[];
}

interface KanbanBoardProps {
  stages: Stage[];
}

export function KanbanBoard({ stages }: KanbanBoardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [movingId, setMovingId] = useState<string | null>(null);

  const totalValue = stages.reduce(
    (acc, st) =>
      acc +
      st.opportunities.reduce((sAcc, opp) => sAcc + (opp.value || 0), 0),
    0
  );

  const totalOpps = stages.reduce((acc, st) => acc + st.opportunities.length, 0);

  async function handleMoveStage(opportunityId: string, targetStageId: string) {
    setMovingId(opportunityId);
    await updateOpportunityStageAction(opportunityId, targetStageId);
    setMovingId(null);
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createOpportunityAction(formData);
    setLoading(false);
    if (res.success) {
      setIsModalOpen(false);
    } else {
      alert(res.error || "Erro ao criar oportunidade.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Bar com Métricas e Botão de Ação */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0F172A] border border-slate-800/80 rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <span className="text-xs text-slate-400">Total em Negociação</span>
            <p className="text-xl font-bold text-white">{formatBRL(totalValue)}</p>
          </div>
          <div className="h-8 w-px bg-slate-800 hidden sm:block" />
          <div>
            <span className="text-xs text-slate-400">Oportunidades Ativas</span>
            <p className="text-xl font-bold text-cyan-400">{totalOpps}</p>
          </div>
          <div className="h-8 w-px bg-slate-800 hidden sm:block" />
          <div>
            <span className="text-xs text-slate-400">Taxa de Conversão</span>
            <p className="text-xl font-bold text-emerald-400">
              {totalOpps > 0
                ? `${Math.round(
                    ((stages.find((s) => s.name === "Ganho")?.opportunities.length || 0) /
                      totalOpps) *
                      100
                  )}%`
                : "0%"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm shadow-blue-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Oportunidade</span>
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="flex gap-4 items-start min-w-[1250px] pb-6 overflow-x-auto">
        {stages.map((stage, stageIndex) => {
          const stageTotal = stage.opportunities.reduce(
            (acc, opp) => acc + (opp.value || 0),
            0
          );
          const prevStage = stages[stageIndex - 1];
          const nextStage = stages[stageIndex + 1];

          return (
            <div
              key={stage.id}
              className="w-72 bg-[#0C1322] border border-slate-800/70 rounded-xl flex flex-col max-h-[calc(100vh-250px)] shrink-0"
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: stage.color || "#3B82F6" }}
                  />
                  <h4 className="font-semibold text-xs text-slate-200">{stage.name}</h4>
                </div>
                <span className="text-[10px] bg-slate-800/80 text-slate-400 px-1.5 py-0.5 rounded-full font-mono">
                  {stage.opportunities.length}
                </span>
              </div>

              {/* Subtotal */}
              <div className="px-3.5 py-1.5 bg-slate-900/40 border-b border-slate-800/50 flex justify-between text-[11px] text-slate-400">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-300">{formatBRL(stageTotal)}</span>
              </div>

              {/* Cards Container */}
              <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                {stage.opportunities.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800/60 rounded-lg">
                    Vazio
                  </div>
                ) : (
                  stage.opportunities.map((opp) => (
                    <div
                      key={opp.id}
                      className={`bg-[#111A2E] hover:bg-[#16213B] border border-slate-800 p-3 rounded-lg transition-all shadow-sm space-y-2 group ${
                        movingId === opp.id ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      <h5 className="font-semibold text-xs text-slate-100 group-hover:text-cyan-400 transition-colors">
                        {opp.title}
                      </h5>

                      <div className="space-y-1 text-[11px] text-slate-400">
                        {opp.company && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate">{opp.company.name}</span>
                          </div>
                        )}
                        {opp.contact && (
                          <div className="flex items-center gap-1.5 truncate">
                            <User className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate">{opp.contact.name}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{formatBRL(opp.value)}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {opp.probability}% prob.
                        </span>
                      </div>

                      {/* Botões Rápidos de Avançar / Recuar Etapa */}
                      <div className="pt-2 border-t border-slate-800/50 flex items-center justify-between">
                        {prevStage ? (
                          <button
                            title={`Mover para ${prevStage.name}`}
                            onClick={() => handleMoveStage(opp.id, prevStage.id)}
                            className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-0.5 p-1 rounded hover:bg-slate-800 transition-colors"
                          >
                            <ChevronLeft className="w-3 h-3" />
                            <span>Voltar</span>
                          </button>
                        ) : (
                          <div />
                        )}

                        {nextStage && (
                          <button
                            title={`Avançar para ${nextStage.name}`}
                            onClick={() => handleMoveStage(opp.id, nextStage.id)}
                            className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-0.5 p-1 rounded hover:bg-slate-800 transition-colors"
                          >
                            <span>Avançar</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Criar Oportunidade */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Cadastrar Nova Oportunidade</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">
                  Título da Negociação *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Ex: Retainer de Marketing Digital - Semestral"
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">
                    Nome da Empresa / Cliente *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    placeholder="Ex: Alfa Odontologia"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Etapa Inicial</label>
                  <select
                    name="stageId"
                    defaultValue={stages[0]?.id}
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    {stages.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Nome do Contato</label>
                  <input
                    type="text"
                    name="contactName"
                    placeholder="Ex: Dr. Roberto"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">E-mail</label>
                  <input
                    type="email"
                    name="contactEmail"
                    placeholder="contato@empresa.com"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    name="contactPhone"
                    placeholder="(11) 99999-9999"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Valor Estimado (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="value"
                    placeholder="2500"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Probabilidade (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    name="probability"
                    defaultValue="50"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Previsão Fechamento</label>
                  <input
                    type="date"
                    name="expectedClose"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
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
                  {loading ? "Cadastrando..." : "Salvar Oportunidade"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

