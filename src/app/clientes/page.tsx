import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { formatBRL, formatDateBR } from "@/lib/utils";
import {
  Users,
  Building2,
  FolderKanban,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  UserCheck,
  FileCheck,
} from "lucide-react";

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
          actionButton={{ label: "Novo Cliente" }}
        />

        <main className="p-8 space-y-8 flex-1 max-w-7xl">
          {/* Métricas da Carteira */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Clientes Ativos
              </span>
              <p className="text-2xl font-bold text-white">
                {clients.filter((c) => c.status === "ACTIVE").length}
              </p>
              <p className="text-xs text-slate-400">Com contratos em vigor</p>
            </div>

            <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Em Onboarding
              </span>
              <p className="text-2xl font-bold text-cyan-400">
                {clients.filter((c) => c.status === "ONBOARDING").length}
              </p>
              <p className="text-xs text-slate-400">Briefing e recolhimento de acessos</p>
            </div>

            <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total de Contratos
              </span>
              <p className="text-2xl font-bold text-blue-400">
                {clients.reduce((acc, c) => acc + c.contracts.length, 0)}
              </p>
              <p className="text-xs text-slate-400">Serviços e retainers ativos</p>
            </div>

            <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Projetos Vinculados
              </span>
              <p className="text-2xl font-bold text-emerald-400">
                {clients.reduce((acc, c) => acc + c.projects.length, 0)}
              </p>
              <p className="text-xs text-slate-400">Entregas em andamento</p>
            </div>
          </div>

          {/* Área do Checklist Padrão de Onboarding */}
          <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  Esteira Oficial de Onboarding do Cliente
                </h3>
                <p className="text-xs text-slate-400">
                  Etapas obrigatórias para entrada de qualquer novo cliente na Golec
                </p>
              </div>
              <span className="text-xs text-blue-400 font-medium">Configurar Modelo</span>
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
                <p className="text-[11px] text-slate-400">Reunião inicial e definição de metas e tom de voz</p>
              </div>

              <div className="p-3 bg-[#0B1120] border border-slate-800 rounded-lg text-xs space-y-1">
                <span className="text-indigo-400 font-mono text-[10px] font-bold">ETAPA 3</span>
                <p className="font-semibold text-slate-200">Acessos Seguros</p>
                <p className="text-[11px] text-slate-400">Cofre de senhas e permissões (Meta, Google, Host)</p>
              </div>

              <div className="p-3 bg-[#0B1120] border border-slate-800 rounded-lg text-xs space-y-1">
                <span className="text-emerald-400 font-mono text-[10px] font-bold">ETAPA 4</span>
                <p className="font-semibold text-slate-200">Criação de Canais & Kickoff</p>
                <p className="text-[11px] text-slate-400">Grupo de comunicação e abertura de projeto no Hub</p>
              </div>
            </div>
          </div>

          {/* Tabela de Clientes */}
          <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-white">Carteira de Clientes</h3>
              <span className="text-xs text-slate-400">{clients.length} cadastrados</span>
            </div>

            {clients.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-200">Nenhum cliente cadastrado ainda</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Quando uma oportunidade no CRM for marcada como <strong>Ganha</strong>, ela se tornará um cliente automaticamente, ou você pode cadastrar manualmente.
                </p>
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
                      <th className="p-3.5">Início</th>
                      <th className="p-3.5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {clients.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-medium text-white flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          {client.company.name}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {client.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-400">{client.internalLead || "Golec"}</td>
                        <td className="p-3.5">{client.contracts.length} contrato(s)</td>
                        <td className="p-3.5 text-slate-400">{formatDateBR(client.startDate)}</td>
                        <td className="p-3.5 text-right">
                          <button className="text-cyan-400 hover:text-cyan-300 font-medium">
                            Abrir Hub
                          </button>
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

