import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/utils";
import {
  TrendingUp,
  DollarSign,
  Users,
  FolderKanban,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  // Buscar métricas reais do banco
  const [
    totalLeads,
    openOpportunities,
    activeProjects,
    pendingTasks,
    knowledgeItemsCount,
    completedProgressCount,
    serviceUnits,
  ] = await Promise.all([
    prisma.lead.count({ where: { isArchived: false } }),
    prisma.opportunity.findMany({
      where: { isWon: false, isLost: false, isArchived: false },
      select: { value: true },
    }),
    prisma.project.count({ where: { status: { in: ["PLANEJAMENTO", "EM_ANDAMENTO", "EM_REVISAO"] } } }),
    prisma.task.count({ where: { status: { not: "DONE" } } }),
    prisma.knowledgeItem.count(),
    prisma.knowledgeProgress.count({ where: { status: "COMPLETED" } }),
    prisma.serviceUnit.findMany({ include: { _count: { select: { services: true } } } }),
  ]);

  const pipelineValue = openOpportunities.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const academyProgressPercent = knowledgeItemsCount > 0 
    ? Math.round((completedProgressCount / knowledgeItemsCount) * 100) 
    : 0;

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-[#090D16]">
        <Header
          title="Centro de Comando"
          subtitle="Visão geral da operação, vendas e implantação da Golec.Solutions"
        />

        <main className="p-8 space-y-8 flex-1 max-w-7xl">
          {/* Banner de Boas-vindas & Plano Mestre */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-900 border border-blue-900/40 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Golec Hub Operacional 1.0 Ativo</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Jornada de Implantação da Golec.Solutions
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                O Plano Mestre de Implantação de 90 dias está carregado na{" "}
                <strong className="text-cyan-400">Academia Golec</strong>. Acompanhe a esteira de abertura, tarefas contábeis, catálogo e prospecção em tempo real.
              </p>
            </div>

            <Link
              href="/academia"
              className="shrink-0 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all group"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Acessar Academia Golec</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Cards de KPIs Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pipeline Ponderado */}
            <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Pipeline Comercial
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{formatBRL(pipelineValue)}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {openOpportunities.length} oportunidades ativas
                </p>
              </div>
            </div>

            {/* Leads Ativos */}
            <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Leads no Funil
                </span>
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalLeads}</p>
                <p className="text-xs text-slate-400 mt-1">Prontos para contato e qualificação</p>
              </div>
            </div>

            {/* Projetos em Andamento */}
            <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Projetos Operando
                </span>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <FolderKanban className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{activeProjects}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {pendingTasks} tarefas em execução
                </p>
              </div>
            </div>

            {/* Progresso da Academia Golec */}
            <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Implantação Golec
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400">{academyProgressPercent}%</p>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${academyProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seção das 4 Unidades de Negócio Golec */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Unidades Estratégicas de Negócio
                </h3>
                <p className="text-xs text-slate-400">
                  Estrutura modular de serviços definida no Plano Mestre
                </p>
              </div>
              <Link
                href="/servicos"
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
              >
                Ver catálogo completo <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {serviceUnits.map((u) => (
                <div
                  key={u.id}
                  className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: u.color || "#0066FF" }}
                      />
                      <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
                        {u.code}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-100 text-sm">{u.name}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {u.description}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>{u._count.services} serviços ativos</span>
                    <span className="text-cyan-400 font-medium">Ver detalhes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
