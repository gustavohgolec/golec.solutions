import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";
import {
  Settings,
  Users,
  ShieldCheck,
  Database,
  Building,
  Key,
  BellRing,
  ExternalLink,
} from "lucide-react";

export default async function ConfiguracoesPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-[#090D16]">
        <Header
          title="Configurações & Governança"
          subtitle="Controle de usuários, papéis de acesso (RBAC), dados da empresa e segurança"
        />

        <main className="p-8 space-y-8 flex-1 max-w-7xl">
          {/* Sessão de Usuários e Permissões */}
          <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Membros da Equipe & Permissões (RBAC)
                </h3>
                <p className="text-xs text-slate-400">
                  Gerencie quem tem acesso aos módulos comerciais, financeiros e de projetos
                </p>
              </div>
              <button className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors font-medium">
                Convidar Membro
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B1120] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Nome / Colaborador</th>
                    <th className="p-3.5">E-mail</th>
                    <th className="p-3.5">Papel (Role)</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                    {
                      users.map((u: any) => (
                        <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5 font-medium text-white flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-semibold text-slate-200">
                              {u.name.slice(0, 2).toUpperCase()}
                            </div>
                            {u.name}
                          </td>
                          <td className="p-3.5 text-slate-400">{u.email}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                              {u.role}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {u.active ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button className="text-cyan-400 hover:text-cyan-300 font-medium">
                              Editar Papel
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                </tbody>
              </table>
            </div>
          </div>

          {/* Dados da Empresa & Parâmetros do Hub */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-4">
              <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-400" />
                Dados da Organização
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Nome Comercial</label>
                  <input
                    type="text"
                    defaultValue="GOLEC.SOLUTIONS"
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2 text-slate-200"
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Slogan Oficial</label>
                  <input
                    type="text"
                    defaultValue="Estratégia que conecta. Soluções que impulsionam."
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-lg p-2 text-slate-200"
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Fuso Horário & Moeda</label>
                  <p className="text-slate-400 font-mono text-[11px]">
                    America/Sao_Paulo (UTC-3) • BRL (R$)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 space-y-4">
              <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                Infraestrutura & Banco de Dados
              </h3>
              <div className="space-y-2 text-xs text-slate-400">
                <p>
                  <strong>Provedor de Dados:</strong> SQLite Local (Ambiente de Desenvolvimento) / Preparado para PostgreSQL em Produção.
                </p>
                <p>
                  <strong>ORM:</strong> Prisma Client v6
                </p>
                <p>
                  <strong>Auditoria:</strong> Logs de ações críticas ativados no schema.
                </p>
                <div className="pt-4">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded font-mono">
                    SISTEMA OPERACIONAL SAUDÁVEL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

