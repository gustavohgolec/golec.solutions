"use client";

import { useState } from "react";
import { formatDateBR } from "@/lib/utils";
import {
  createProjectAction,
  updateTaskStatusAction,
  createQuickTaskAction,
} from "./actions";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Plus,
  X,
  Building2,
  ListTodo,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ProjectManagerProps {
  initialProjects: any[];
  clients: any[];
  services: any[];
}

export function ProjectManager({
  initialProjects,
  clients,
  services,
}: ProjectManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(
    initialProjects[0]?.id || null
  );
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);

  const activeCount = initialProjects.filter((p) => p.status !== "CONCLUIDO").length;
  const allTasks = initialProjects.flatMap((p) => p.tasks);
  const pendingTasksCount = allTasks.filter((t) => t.status !== "DONE").length;
  const completedTasksCount = allTasks.filter((t) => t.status === "DONE").length;

  async function handleCreateProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createProjectAction(formData);
    setLoading(false);
    if (res.success) {
      setIsModalOpen(false);
    } else {
      alert(res.error || "Erro ao criar projeto.");
    }
  }

  async function handleToggleTask(taskId: string, currentStatus: string) {
    setLoadingTaskId(taskId);
    const newStatus = currentStatus === "DONE" ? "TODO" : "DONE";
    await updateTaskStatusAction(taskId, newStatus);
    setLoadingTaskId(null);
  }

  async function handleAddTask(projectId: string) {
    if (!newTaskTitle.trim()) return;
    await createQuickTaskAction(projectId, newTaskTitle);
    setNewTaskTitle("");
  }

  return (
    <div className="space-y-8">
      {/* Métricas Operacionais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Projetos Ativos
          </span>
          <p className="text-2xl font-bold text-white">{activeCount}</p>
          <p className="text-xs text-slate-400">Em planejamento ou produção</p>
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
            Tarefas Concluídas
          </span>
          <p className="text-2xl font-bold text-emerald-400">{completedTasksCount}</p>
          <p className="text-xs text-slate-400">Itens entregues com sucesso</p>
        </div>

        <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Projetos Concluídos
          </span>
          <p className="text-2xl font-bold text-blue-400">
            {initialProjects.filter((p) => p.status === "CONCLUIDO").length}
          </p>
          <p className="text-xs text-slate-400">Histórico de entregas</p>
        </div>
      </div>

      {/* Lista de Projetos e Tarefas */}
      <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-sm text-white">Esteira de Projetos & Entregáveis</h3>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm shadow-blue-600/30 transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Projeto</span>
          </button>
        </div>

        {initialProjects.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
              <ListTodo className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200">Nenhum projeto em andamento</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Crie o primeiro projeto vinculando-o a um cliente e acompanhe o checklist de entregas e prazos.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Criar Primeiro Projeto
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {initialProjects.map((proj) => {
              const isExpanded = expandedProjectId === proj.id;
              const projectCompletedTasks = proj.tasks.filter((t: any) => t.status === "DONE").length;
              const projectProgressPercent =
                proj.tasks.length > 0
                  ? Math.round((projectCompletedTasks / proj.tasks.length) * 100)
                  : 0;

              return (
                <div
                  key={proj.id}
                  className="bg-[#0B1120] border border-slate-800 rounded-xl overflow-hidden"
                >
                  {/* Cabeçalho do Projeto */}
                  <div
                    onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{proj.name}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{proj.client?.company?.name || "Golec Interno"}</span>
                        {proj.service && (
                          <>
                            <span>•</span>
                            <span className="text-indigo-400">{proj.service.name}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>Prazo: {formatDateBR(proj.dueDate)}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="font-semibold text-slate-200">
                          {projectCompletedTasks}/{proj.tasks.length} tarefas
                        </span>
                        <div className="w-24 bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-1.5 rounded-full"
                            style={{ width: `${projectProgressPercent}%` }}
                          />
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Checklist de Tarefas do Projeto Expandido */}
                  {isExpanded && (
                    <div className="p-4 border-t border-slate-800 bg-[#080D1A] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300">
                          Tarefas & Checklist de Entrega
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Clique na tarefa para alternar o status
                        </span>
                      </div>

                      <div className="space-y-2">
                        {proj.tasks.map((task: any) => {
                          const isDone = task.status === "DONE";
                          const isTaskLoading = loadingTaskId === task.id;

                          return (
                            <div
                              key={task.id}
                              onClick={() => !isTaskLoading && handleToggleTask(task.id, task.status)}
                              className={`flex items-center justify-between p-2.5 rounded-lg bg-[#0F172A] border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer select-none ${
                                isTaskLoading ? "opacity-50" : ""
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <button type="button" className="text-slate-500">
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
                                  {task.title}
                                </span>
                              </div>

                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                                  task.priority === "HIGH"
                                    ? "bg-rose-950 text-rose-400 border border-rose-800/40"
                                    : "bg-slate-800 text-slate-400"
                                }`}
                              >
                                {task.priority}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Input Rápido de Nova Tarefa */}
                      <div className="pt-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddTask(proj.id)}
                          placeholder="+ Adicionar nova tarefa e pressionar Enter..."
                          className="flex-1 bg-[#0F172A] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddTask(proj.id)}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium"
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Criar Projeto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Criar Novo Projeto</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Nome do Projeto *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ex: Identidade Visual & Kit de Redes Sociais"
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Cliente *</label>
                  <select
                    name="clientId"
                    required
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Selecione um cliente...</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Serviço Associado</label>
                  <select
                    name="serviceId"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Nenhum (Serviço Avulso)</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.unit?.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Data de Entrega / Prazo</label>
                  <input
                    type="date"
                    name="dueDate"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Orçamento / Budget (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="budget"
                    placeholder="2500"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Descrição / Escopo</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Detalhes dos entregáveis e diretrizes acordadas..."
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
                  {loading ? "Criando..." : "Criar Projeto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

