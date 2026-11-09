import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { formatDateBR } from "@/lib/utils";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Calendar,
  Building2,
  ListTodo,
} from "lucide-react";

export default async function ProjetosPage() {
  const [projects, tasks] = await Promise.all([
    prisma.project.findMany({
      include: {
        client: { include: { company: true } },
        service: true,
        tasks: true,
        deliverables: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.findMany({
      include: {
        project: { include: { client: { include: { company: true } } } },
        assignedTo: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const activeCount = projects.filter((p) => p.status !== "CONCLUIDO").length;
  const pendingTasksCount = tasks.filter((t) => t.status !== "DONE").length;

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-[#090D16]">
        <Header
          title="Projetos & Tarefas"
          subtitle="Acompanhamento de entregas, cronogramas, prazos e aprovações"
          actionButton={{ label: "Novo Projeto" }}
        />

        <main className="p-8 space-y-8 flex-1 max-w-7xl">
          {/* Métricas Operacionais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Projetos Ativos
              </span>
              <p className="text-2xl font-bold text-white">{activeCount}</p>
              <p className="text-xs text-slate-400">Em produção ou revisão</p>
            </div>

            <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Tarefas Pendentes
              </span>
              <p className="text-2xl font-bold text-cyan-400">{pendingTasksCount}</p>
              <p className="text-xs text-slate-400">A fazer ou em andamento</p>
            </div>

            <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Aprovações Pendentes
              </span>
              <p className="text-2xl font-bold text-indigo-400">0</p>
              <p className="text-xs text-slate-400">Aguardando feedback do cliente</p>
            </div>

            <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Concluídos no Mês
              </span>
              <p className="text-2xl font-bold text-emerald-400">
                {projects.filter((p) => p.status === "CONCLUIDO").length}
              </p>
              <p className="text-xs text-slate-400">Entregues dentro do prazo</p>
            </div>
          </div>

          {/* Lista de Projetos */}
          <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-sm text-white">Esteira de Projetos</h3>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors">
                  Visualização Lista
                </button>
                <button className="text-xs bg-blue-600/20 text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/30 transition-colors font-medium">
                  Kanban
                </button>
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
                  <ListTodo className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-200">Nenhum projeto em andamento</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Os projetos surgem da contratação de serviços ou podem ser criados diretamente por aqui vinculados a um cliente.
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 bg-[#0B1120] border border-slate-800 rounded-lg flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-white">{proj.name}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{proj.client?.company?.name || "Cliente Interno"}</span>
                        <span>•</span>
                        <span>{proj.service?.name || "Serviço Avulso"}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-slate-400">
                      <div>
                        <span>Prazo: </span>
                        <strong className="text-slate-200">{formatDateBR(proj.dueDate)}</strong>
                      </div>
                      <div>
                        <span>Tarefas: </span>
                        <strong className="text-slate-200">{proj.tasks.length}</strong>
                      </div>
                      <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
                        Ver Quadro
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

