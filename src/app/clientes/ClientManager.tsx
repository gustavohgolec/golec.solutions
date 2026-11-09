"use client";

import { useState } from "react";
import { formatBRL, formatDateBR } from "@/lib/utils";
import { createClientAction, updateClientStatusAction } from "./actions";
import {
  Users,
  Building2,
  FolderKanban,
  CheckCircle2,
  Clock,
  Plus,
  X,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  FileText,
  Lock,
} from "lucide-react";

interface ClientManagerProps {
  initialClients: any[];
}

export function ClientManager({ initialClients }: ClientManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);

  const activeClients = initialClients.filter((c) => c.status === "ACTIVE").length;
  const onboardingClients = initialClients.filter((c) => c.status === "ONBOARDING").length;
  const totalContracts = initialClients.reduce((acc, c) => acc + c.contracts.length, 0);
  const totalProjects = initialClients.reduce((acc, c) => acc + c.projects.length, 0);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createClientAction(formData);
    setLoading(false);
    if (res.success) {
      setIsModalOpen(false);
    } else {
      alert(res.error || "Erro ao criar cliente.");
    }
  }

  async function handleStatusChange(clientId: string, newStatus: string) {
    setStatusLoadingId(clientId);
    await updateClientStatusAction(clientId, newStatus);
    setStatusLoadingId(null);
  }

  return (
    <div className="space-y-8">
      {/* Métricas da Carteira */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Clientes Ativos
          </span>
          <p className="text-2xl font-bold text-white">{activeClients}</p>
          <p className="text-xs text-slate-400">Contratos operando regularmente</p>
        </div>

        <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Em Onboarding
          </span>
          <p className="text-2xl font-bold text-cyan-400">{onboardingClients}</p>
          <p className="text-xs text-slate-400">Briefing e recolhimento de acessos</p>
        </div>

        <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total de Contratos
          </span>
          <p className="text-2xl font-bold text-blue-400">{totalContracts}</p>
          <p className="text-xs text-slate-400">Retainers e pacotes fechados</p>
        </div>

        <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Projetos Ativos
          </span>
          <p className="text-2xl font-bold text-emerald-400">{totalProjects}</p>
          <p className="text-xs text-slate-400">Entregáveis em execução</p>
        </div>
      </div>

      {/* Esteira Visual de Onboarding */}
      <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              Esteira Oficial de Onboarding do Cliente
            </h3>
            <p className="text-xs text-slate-400">
              Processo padronizado para recepção e preparação operacional de cada nova conta
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm shadow-blue-600/30 transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Cliente</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-[#0B1120] border border-slate-800 rounded-lg text-xs space-y-1">
            <span className="text-blue-400 font-mono text-[10px] font-bold">ETAPA 1</span>
            <p className="font-semibold text-slate-200">Contrato & Pagamento</p>
            <p className="text-[11px] text-slate-400">Assinatura digital e confirmação do setup inicial</p>
          </div>

          <div className="p-3 bg-[#0B1120] border border-slate-800 rounded-lg text-xs space-y-1">
            <span className="text-cyan-400 font-mono text-[10px] font-bold">ETAPA 2</span>
            <p className="font-semibold text-slate-200">Briefing & Alinhamento</p>
            <p className="text-[11px] text-slate-400">Reunião de kickoff e definição das metas</p>
          </div>

          <div className="p-3 bg-[#0B1120] border border-slate-800 rounded-lg text-xs space-y-1">
            <span className="text-indigo-400 font-mono text-[10px] font-bold">ETAPA 3</span>
            <p className="font-semibold text-slate-200 flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" /> Acessos Seguros
            </p>
            <p className="text-[11px] text-slate-400">Cofre de credenciais sem senhas em texto puro</p>
          </div>

          <div className="p-3 bg-[#0B1120] border border-slate-800 rounded-lg text-xs space-y-1">
            <span className="text-emerald-400 font-mono text-[10px] font-bold">ETAPA 4</span>
            <p className="font-semibold text-slate-200">Canais de Comunicação</p>
            <p className="text-[11px] text-slate-400">Grupo de atendimento e primeiro projeto aberto</p>
          </div>
        </div>
      </div>

      {/* Tabela de Clientes */}
      <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-white">Carteira de Clientes</h3>
          <span className="text-xs text-slate-400">{initialClients.length} cadastrados</span>
        </div>

        {initialClients.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200">Nenhum cliente cadastrado ainda</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Quando você marcar uma oportunidade como <strong>Ganho</strong> no CRM, o cliente é criado automaticamente, ou você pode cadastrar manualmente agora mesmo.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Cadastrar Primeiro Cliente
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B1120] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Empresa / Razão</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Responsável</th>
                  <th className="p-3.5">Contratos</th>
                  <th className="p-3.5">Projetos</th>
                  <th className="p-3.5">Início</th>
                  <th className="p-3.5 text-right">Mudar Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {initialClients.map((client) => {
                  const isPending = statusLoadingId === client.id;

                  return (
                    <tr
                      key={client.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isPending ? "opacity-50" : ""
                      }`}
                    >
                      <td className="p-3.5 font-medium text-white">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
                          <div>
                            <p className="text-white font-semibold">{client.company.name}</p>
                            {client.company.segment && (
                              <p className="text-[10px] text-slate-400">{client.company.segment}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                            client.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : client.status === "ONBOARDING"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {client.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300">{client.internalLead || "Golec"}</td>
                      <td className="p-3.5">
                        {client.contracts.length > 0 ? (
                          <div className="space-y-0.5">
                            <span className="text-slate-200 font-medium">
                              {client.contracts.length} contrato(s)
                            </span>
                            <p className="text-[10px] text-slate-400">
                              {formatBRL(client.contracts[0].monthlyFee)}/mês
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-500">Sem contrato</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className="text-slate-300">{client.projects.length} projeto(s)</span>
                      </td>
                      <td className="p-3.5 text-slate-400">{formatDateBR(client.startDate)}</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {client.status === "ONBOARDING" && (
                            <button
                              onClick={() => handleStatusChange(client.id, "ACTIVE")}
                              className="text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-2 py-1 rounded hover:bg-emerald-900 transition-colors"
                            >
                              Ativar Conta
                            </button>
                          )}
                          {client.status === "ACTIVE" && (
                            <button
                              onClick={() => handleStatusChange(client.id, "PAUSED")}
                              className="text-[11px] bg-amber-950 text-amber-400 border border-amber-800/40 px-2 py-1 rounded hover:bg-amber-900 transition-colors"
                            >
                              Pausar
                            </button>
                          )}
                          {client.status === "PAUSED" && (
                            <button
                              onClick={() => handleStatusChange(client.id, "ACTIVE")}
                              className="text-[11px] bg-blue-950 text-blue-400 border border-blue-800/40 px-2 py-1 rounded hover:bg-blue-900 transition-colors"
                            >
                              Reativar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Criar Cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Cadastrar Novo Cliente</h3>
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
                  <label className="text-slate-300 block mb-1 font-medium">Nome da Empresa *</label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    placeholder="Ex: Beta Engenharia"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">CNPJ / CPF</label>
                  <input
                    type="text"
                    name="document"
                    placeholder="00.000.000/0001-00"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Segmento de Atuação</label>
                  <input
                    type="text"
                    name="segment"
                    placeholder="Ex: Saúde, Construção Civil, Varejo"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Cidade / Estado</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="São Paulo - SP"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Contato Principal</label>
                  <input
                    type="text"
                    name="contactName"
                    placeholder="Nome do responsável"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">E-mail</label>
                  <input
                    type="email"
                    name="contactEmail"
                    placeholder="email@cliente.com"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">WhatsApp</label>
                  <input
                    type="text"
                    name="contactPhone"
                    placeholder="(11) 99999-9999"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Título do Contrato</label>
                  <input
                    type="text"
                    name="contractTitle"
                    placeholder="Ex: Gestão de Tráfego + Social Media"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Honorário Mensal (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="monthlyFee"
                    placeholder="3000"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Gestor da Conta (Golec)</label>
                  <input
                    type="text"
                    name="internalLead"
                    defaultValue="Gustavo H. Golec"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Link Pasta Google Drive</label>
                  <input
                    type="url"
                    name="driveFolderUrl"
                    placeholder="https://drive.google.com/..."
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
                  {loading ? "Cadastrando..." : "Salvar Cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

