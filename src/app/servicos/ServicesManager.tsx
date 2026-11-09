"use client";

import { useState } from "react";
import { formatBRL } from "@/lib/utils";
import { createServiceAction } from "./actions";
import {
  Layers,
  Plus,
  X,
  Tag,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface ServicesManagerProps {
  initialUnits: any[];
}

export function ServicesManager({ initialUnits }: ServicesManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string>(initialUnits[0]?.id || "");

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createServiceAction(formData);
    setLoading(false);
    if (res.success) {
      setIsModalOpen(false);
    } else {
      alert(res.error || "Erro ao criar serviço.");
    }
  }

  function openCreateForUnit(unitId: string) {
    setSelectedUnitId(unitId);
    setIsModalOpen(true);
  }

  return (
    <div className="space-y-8">
      {/* Header Informativo */}
      <div className="bg-[#0F172A] border border-blue-900/40 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            REFERÊNCIA DO PLANO MESTRE
          </span>
          <h2 className="text-base font-bold text-white">
            Esteira de Produtos e Serviços por Unidade
          </h2>
          <p className="text-xs text-slate-400">
            Os preços e prazos cadastrados servem de base comercial para propostas rápidas no CRM e criação de projetos operacionais sem retrabalho.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm shadow-blue-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Serviço</span>
        </button>
      </div>

      {/* Grid de Unidades e Serviços */}
      <div className="space-y-8">
        {initialUnits.map((unit) => (
          <div
            key={unit.id}
            className="bg-[#0F172A] border border-slate-800/80 rounded-xl overflow-hidden"
          >
            {/* Header da Unidade */}
            <div className="p-4 bg-[#111A2E] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: unit.color || "#0066FF" }}
                />
                <div>
                  <h3 className="font-bold text-sm text-white">{unit.name}</h3>
                  <p className="text-xs text-slate-400">{unit.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                  {unit.services.length} serviços
                </span>
                <button
                  onClick={() => openCreateForUnit(unit.id)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar
                </button>
              </div>
            </div>

            {/* Grid de Serviços */}
            <div className="p-5">
              {unit.services.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-slate-800/80 rounded-lg text-xs text-slate-500 space-y-2">
                  <p>Nenhum serviço cadastrado nesta unidade ainda.</p>
                  <button
                    onClick={() => openCreateForUnit(unit.id)}
                    className="text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    + Cadastrar primeiro serviço de {unit.name}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unit.services.map((srv: any) => (
                    <div
                      key={srv.id}
                      className="p-4 bg-[#0B1120] border border-slate-800/80 rounded-lg flex flex-col justify-between space-y-3 hover:border-slate-700 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-xs text-slate-100">{srv.name}</h4>
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                            {srv.billingModel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {srv.description || "Sem descrição definida."}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{formatBRL(srv.refPrice)}</span>
                        <span className="text-slate-400 text-[11px]">
                          {srv.defaultDays ? `${srv.defaultDays} dias` : "Sob demanda"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Criar Serviço */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Cadastrar Novo Serviço</h3>
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
                  <label className="text-slate-300 block mb-1 font-medium">Unidade de Negócio *</label>
                  <select
                    name="unitId"
                    value={selectedUnitId}
                    onChange={(e) => setSelectedUnitId(e.target.value)}
                    required
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    {initialUnits.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Modelo de Cobrança</label>
                  <select
                    name="billingModel"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="MONTHLY">Mensal (Retainer)</option>
                    <option value="ONE_OFF">Setup / Projeto Único</option>
                    <option value="HOURLY">Por Hora de Desenvolvimento</option>
                    <option value="CUSTOM">Personalizado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Nome do Serviço *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ex: Gestão de Tráfego Pago & Otimização Meta/Google"
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Preço de Referência (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="refPrice"
                    placeholder="2500"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Prazo Padrão (Dias)</label>
                  <input
                    type="number"
                    name="defaultDays"
                    placeholder="15"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Descrição / Entregáveis</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Defina o escopo, limites de revisões e itens incluídos..."
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
                  {loading ? "Salvando..." : "Salvar Serviço"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

