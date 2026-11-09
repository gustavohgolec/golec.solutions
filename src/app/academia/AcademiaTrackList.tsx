"use client";

import { useState } from "react";
import { toggleItemProgressAction } from "./actions";
import { BookOpen, CheckCircle2 } from "lucide-react";

interface AcademiaTrackListProps {
  tracks: any[];
}

export function AcademiaTrackList({ tracks }: AcademiaTrackListProps) {
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  async function handleToggle(itemId: string, currentStatus: string) {
    setLoadingItemId(itemId);
    await toggleItemProgressAction(itemId, currentStatus);
    setLoadingItemId(null);
  }

  return (
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
            {track.modules.map((module: any) => (
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
                  {module.items.map((item: any) => {
                    const isDone = item.progress?.some((p: any) => p.status === "COMPLETED");
                    const isLoading = loadingItemId === item.id;

                    return (
                      <div
                        key={item.id}
                        onClick={() => !isLoading && handleToggle(item.id, isDone ? "COMPLETED" : "NOT_STARTED")}
                        className={`flex items-center justify-between bg-[#0B1120] border border-slate-800/80 p-2.5 rounded-md hover:border-slate-700 transition-all cursor-pointer select-none ${
                          isLoading ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            className="text-slate-500 hover:text-emerald-400 transition-colors"
                          >
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
  );
}

