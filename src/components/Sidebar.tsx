"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  FolderKanban,
  Layers,
  DollarSign,
  GraduationCap,
  FileText,
  Settings,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Visão Geral", href: "/", icon: LayoutDashboard },
  { name: "CRM & Pipeline", href: "/crm", icon: KanbanSquare },
  { name: "Clientes & Onboarding", href: "/clientes", icon: Users },
  { name: "Projetos & Tarefas", href: "/projetos", icon: FolderKanban },
  { name: "Catálogo de Serviços", href: "/servicos", icon: Layers },
  { name: "Financeiro & Caixa", href: "/financeiro", icon: DollarSign },
  { name: "Academia Golec", href: "/academia", icon: GraduationCap, badge: "Plano Mestre" },
  { name: "Documentos & Modelos", href: "/documentos", icon: FileText },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0B1120] border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-black text-white text-lg tracking-wider shadow-lg shadow-blue-500/20">
              G
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-sm">GOLEC</span>
              <span className="text-cyan-400 font-medium text-xs">.SOLUTIONS</span>
            </div>
          </Link>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-mono">
            HUB 1.0
          </span>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-cyan-400"
                    )}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-semibold",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-cyan-950 text-cyan-400 border border-cyan-800/50"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile / System status footer */}
      <div className="p-4 border-t border-slate-800/80 bg-[#080D1A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200">
              GH
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">Gustavo H. Golec</p>
              <p className="text-[10px] text-cyan-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Owner / Diretor
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

