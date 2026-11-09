import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { AcademiaTrackList } from "./AcademiaTrackList";

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
                Clique em cada tarefa para marcar seu progresso e atualizar automaticamente os indicadores da diretoria.
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

          {/* Componente Interativo de Trilhas e Checklists */}
          <AcademiaTrackList tracks={tracks} />
        </main>
      </div>
    </div>
  );
}
