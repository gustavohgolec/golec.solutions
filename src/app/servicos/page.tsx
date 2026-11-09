import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/utils";
import {
  Layers,
  Plus,
  Tag,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default async function ServicosPage() {
  const units = await prisma.serviceUnit.findMany({
    include: {
      services: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-[#090D16]">
        <Header
          title="Catálogo de Serviços"
          subtitle="Tabela oficial das 4 unidades Golec, escopos, modelos de cobrança e entregáveis"
          actionButton={{ label: "Novo Serviço" }}
        />

        <main className="p-8 space-y-8 flex-1 max-w-7xl">
          {/* Header de Apoio com base no Plano Mestre */}
          <div className="bg-[#0F172A] border border-blue-900/40 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                REFERÊNCIA DO PLANO MESTRE
              </span>
              <h2 className="text-base font-bold text-white">
                Esteira de Produtos e Serviços por Unidade
              </h2>
              <p className="text-xs text-slate-400">
                Os preços e prazos cadastrados servem de base comercial para propostas rápidas no CRM e criação de projetos sem retrabalho.
              </p>
            </div>
            <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-lg border border-slate-700 transition-colors shrink-0">
              Gerenciar Unidades
            </button>
          </div>

          {/* Unidades & Seus Serviços */}
          <div className="space-y-8">
            {units.map((unit) => (
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
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                    {unit.services.length} serviços
                  </span>
                </div>

                {/* Grid de Serviços */}
                <div className="p-5">
                  {unit.services.length === 0 ? (
                    <div className="py-8 text-center border border-dashed border-slate-800/80 rounded-lg text-xs text-slate-500 space-y-2">
                      <p>Nenhum serviço cadastrado nesta unidade ainda.</p>
                      <button className="text-cyan-400 hover:text-cyan-300 font-medium">
                        + Cadastrar primeiro serviço de {unit.name}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {unit.services.map((srv) => (
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
        </main>
      </div>
    </div>
  );
}

