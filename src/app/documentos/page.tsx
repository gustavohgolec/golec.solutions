import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import {
  FileText,
  Download,
  ExternalLink,
  Plus,
  Folder,
  FileCheck,
  ShieldCheck,
} from "lucide-react";

export default function DocumentosPage() {
  const documentTemplates = [
    {
      title: "Contrato Padrão de Prestação de Serviços (Retainer)",
      category: "Jurídico & Contratos",
      description: "Minuta contratual com cláusulas de escopo, limites de revisões e proteção LGPD.",
      tag: "V1.0",
      type: "Minuta",
    },
    {
      title: "Modelo de Proposta Comercial Rápida",
      category: "Comercial",
      description: "Estrutura enxuta para apresentação de diagnóstico, cronograma e valor de investimento.",
      tag: "V1.0",
      type: "Apresentação",
    },
    {
      title: "Briefing Operacional de Entrada",
      category: "Operação",
      description: "Questionário de descoberta para captação de identidade, referências e objetivos do cliente.",
      tag: "V1.0",
      type: "Formulário",
    },
    {
      title: "Checklist de Onboarding e Cofre de Acessos",
      category: "Operação & Segurança",
      description: "Instruções seguras para concessão de acessos a Meta Business Suite, Google e domínios sem envio de senhas abertas.",
      tag: "V1.0",
      type: "Guia",
    },
    {
      title: "Relatório de Prestação de Contas Mensal",
      category: "Atendimento & Retenção",
      description: "Template de acompanhamento de KPIs, entregas realizadas e planejamento do próximo ciclo.",
      tag: "V1.0",
      type: "Relatório",
    },
  ];

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-[#090D16]">
        <Header
          title="Documentos & Modelos"
          subtitle="Biblioteca central de minutas, briefings, propostas e manuais operacionais da Golec"
          actionButton={{ label: "Novo Modelo" }}
        />

        <main className="p-8 space-y-8 flex-1 max-w-7xl">
          {/* Header de Gestão do Conhecimento */}
          <div className="bg-[#0F172A] border border-blue-900/40 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                PADRONIZAÇÃO OPERACIONAL
              </span>
              <h2 className="text-base font-bold text-white">
                Biblioteca de Ativos e Modelos da Golec.Solutions
              </h2>
              <p className="text-xs text-slate-400">
                Arquivos e minutas oficiais para garantir segurança jurídica, agilidade no fechamento de contratos e padronização na entrega.
              </p>
            </div>
            <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-lg border border-slate-700 transition-colors shrink-0">
              Conectar Google Drive
            </button>
          </div>

          {/* Grid de Modelos Oficiais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentTemplates.map((doc, idx) => (
              <div
                key={idx}
                className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      {doc.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{doc.tag}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {doc.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{doc.type}</span>
                  <button className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Baixar Modelo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

