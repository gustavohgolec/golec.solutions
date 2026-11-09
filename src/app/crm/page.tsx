import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/utils";
import {
  KanbanSquare,
  Building2,
  User,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default async function CRMPage() {
  const [stages, opportunities, leads] = await Promise.all([
    prisma.pipelineStage.findMany({
      orderBy: { order: "asc" },
      include: {
        opportunities: {
          where: { isArchived: false },
          include: {
            company: true,
            contact: true,
          },
        },
      },
    }),
    prisma.opportunity.findMany({
      where: { isArchived: false },
      include: { company: true },
    }),
    prisma.lead.findMany({
      where: { isArchived: false },
      include: { company: true, contact: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const totalValue = opportunities.reduce((acc, curr) => acc + (curr.value || 0), 0);

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-[#090D16]">
        <Header
          title="CRM & Pipeline de Vendas"
          subtitle="Funil de oportunidades, qualificação de leads e gestão comercial"
          actionButton={{ label: "Nova Oportunidade" }}
        />

        <main className="p-8 space-y-6 flex-1 overflow-x-auto">
          {/* Métricas do Funil */}
          <div className="flex items-center justify-between bg-[#0F172A] border border-slate-800/80 rounded-xl p-4">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-xs text-slate-400">Total em Negociação</span>
                <p className="text-xl font-bold text-white">{formatBRL(totalValue)}</p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-xs text-slate-400">Total de Oportunidades</span>
                <p className="text-xl font-bold text-cyan-400">{opportunities.length}</p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-xs text-slate-400">Leads em Prospecção</span>
                <p className="text-xl font-bold text-blue-400">{leads.length}</p>
              </div>
            </div>

            <button className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Adicionar Lead
            </button>
          </div>

          {/* Kanban Board */}
          <div className="flex gap-4 items-start min-w-[1200px] pb-6">
            {stages.map((stage) => {
              const stageTotal = stage.opportunities.reduce((acc, opp) => acc + (opp.value || 0), 0);

              return (
                <div
                  key={stage.id}
                  className="w-72 bg-[#0C1322] border border-slate-800/70 rounded-xl flex flex-col max-h-[calc(100vh-230px)] shrink-0"
                >
                  {/* Stage Header */}
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

                  <div className="px-3.5 py-2 bg-slate-900/40 border-b border-slate-800/50 flex justify-between text-[11px] text-slate-400">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-300">{formatBRL(stageTotal)}</span>
                  </div>

                  {/* Cards Container */}
                  <div className="p-2 space-y-2 overflow-y-auto flex-1">
                    {stage.opportunities.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800/60 rounded-lg">
                        Nenhuma oportunidade nesta etapa
                      </div>
                    ) : (
                      stage.opportunities.map((opp) => (
                        <div
                          key={opp.id}
                          className="bg-[#111A2E] hover:bg-[#16213B] border border-slate-800 p-3 rounded-lg cursor-pointer transition-all shadow-sm space-y-2 group"
                        >
                          <div className="flex items-start justify-between">
                            <h5 className="font-semibold text-xs text-slate-100 group-hover:text-cyan-400 transition-colors">
                              {opp.title}
                            </h5>
                          </div>

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
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

