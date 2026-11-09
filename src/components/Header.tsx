import { Bell, Search, Plus } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: {
    label: string;
    onClick?: () => void;
  };
}

export function Header({ title, subtitle, actionButton }: HeaderProps) {
  return (
    <header className="h-16 px-8 border-b border-slate-800/80 bg-[#090D16]/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Global Search shortcut */}
        <div className="relative w-64 hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar lead, cliente, tarefa..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Action Button */}
        {actionButton && (
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm shadow-blue-600/30 transition-all">
            <Plus className="w-4 h-4" />
            <span>{actionButton.label}</span>
          </button>
        )}

        {/* Notifications */}
        <button className="w-8 h-8 rounded-lg border border-slate-800 hover:bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-1.5 right-1.5" />
        </button>
      </div>
    </header>
  );
}

