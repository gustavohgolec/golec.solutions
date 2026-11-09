import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export default async function AcademiaPage() {
  const tracks = await prisma.knowledgeTrack.findMany({
    orderBy: { order: "asc" },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          items: {
            orderBy: { order: "asc" },
            include: { progress: true },
          },
        },
      },
    },
  });

  const totalItems = tracks.reduce(
    (acc, t) => acc + t.modules.reduce((mAcc, m) => mAcc + m.items.length, 0),
    0
  );

  const completedItems = tracks.reduce(
    (acc, t) =>
      acc +
      t.modules.reduce(
        (mAcc, m) =>
          mAcc +
          m.items.filter((i) => i.progress?.some((p) => p.status === "COMPLETED")).length,
        0
      ),
    0
  );

  const percent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-[#090D16]">
        <Header
          title="Academia Golec — Plano Mestre de Implantação"
          subtitle="Jornada de abertura, estrutura, serviços e operação de 90 dias"
        />

        <main className="p-8 space-y-8 flex-1 max-w-6xl">
          {/* Card de Visão Geral do Plano Mestre */}
          <div className="bg-[#0F172A] border border-blue-900/40 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-mono font-semibold">
                  PLANO MESTRE V1.0
                </span>
                <span className="text-xs text-slate-400">Novembro / 2026</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                Estratégia que conecta. Soluções que impulsionam.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cada módulo abaixo corresponde a um capítulo do documento-base da Golec.Solutions.
                Acompanhe o checklist de execução para transformar o planejamento em rotina comercial
                e operacional sem perder prazos.
              </p>
            </div>

            {/* Barra de Progresso Geral */}
            <div className="bg-[#111A2E] border border-slate-800 p-4 rounded-xl min-w-[220px] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Progresso Geral</span>
                <span className="font-bold text-emerald-400">{percent}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                {completedItems} de {totalItems} tarefas concluídas
              </p>
            </div>
          </div>

          {/* Lista de Trilhas de Conhecimento e Implantação */}
          <div className="space-y-6">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="bg-[#0D1527] border border-slate-800/80 rounded-xl overflow-hidden"
              >
                {/* Cabeçalho da Trilha */}
                <div className="p-4 bg-[#101930] border-b border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: track.badgeColor || "#0066FF" }}
                    />
                    <div>
                      <h3 className="font-bold text-sm text-white">{track.title}</h3>
                      <p className="text-xs text-slate-400">{track.description}</p>
                    </div>
                  </div>
                </div>

                {/* Módulos e Checklists */}
                <div className="p-5 space-y-5">
                  {track.modules.map((module) => (
                    <div
                      key={module.id}
                      className="bg-[#121C35]/60 border border-slate-800/60 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-xs text-slate-100 flex items-center gap-2">
                            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                            {module.title}
                          </h4>
                          {module.summary && (
                            <p className="text-[11px] text-slate-400 mt-0.5">{module.summary}</p>
                          )}
                        </div>

                        {module.pdfChapterRef && (
                          <span className="text-[10px] text-slate-500 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 self-start sm:self-auto">
                            {module.pdfChapterRef}
                          </span>
                        )}
                      </div>

                      {/* Itens do Checklist */}
                      <div className="pt-2 border-t border-slate-800/60 space-y-2">
                        {module.items.map((item) => {
                          const isDone = item.progress?.some((p) => p.status === "COMPLETED");

                          return (
                            <div
                              key={item.id}
                              className="flex items-center justify-between bg-[#0B1120] border border-slate-800/80 p-2.5 rounded-md hover:border-slate-700 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <button className="text-slate-500 hover:text-emerald-400 transition-colors">
                                  {isDone ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <div className="w-4 h-4 rounded border border-slate-600 hover:border-emerald-400" />
                                  )}
                                </button>
                                <span
                                  className={`text-xs ${
                                    isDone ? "text-slate-500 line-through" : "text-slate-200"
                                  }`}
                                >
                                  {item.title}
                                </span>
                              </div>

                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                                  isDone
                                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800/40"
                                    : "bg-slate-800/80 text-slate-400"
                                }`}
                              >
                                {isDone ? "Concluído" : "Pendente"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

