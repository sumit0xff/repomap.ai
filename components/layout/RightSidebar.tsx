"use client";

import { RepositoryAnalysis } from "@/types/analysis";
import { NormalizedGithubData } from "@/types/github";
import { Activity, ShieldCheck, Code2, AlertTriangle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface RightSidebarProps {
  data: NormalizedGithubData;
  analysis: RepositoryAnalysis;
}

export default function RightSidebar({ data, analysis }: RightSidebarProps) {
  const maintainability = analysis.codeQuality.maintainabilityScore || 80;
  
  let healthColor = "text-green-400";
  let healthBg = "bg-green-400/10";
  if (maintainability < 70) {
    healthColor = "text-yellow-400";
    healthBg = "bg-yellow-400/10";
  }
  if (maintainability < 40) {
    healthColor = "text-red-400";
    healthBg = "bg-red-400/10";
  }

  return (
    <div className="w-80 flex-shrink-0 hidden lg:flex flex-col gap-6 sticky top-24 self-start pb-12">
      {/* Maintainability Score */}
      <div className="flex flex-col p-5 rounded-2xl bg-[#111113] border border-white/[0.06]">
        <div className="flex items-center gap-2 text-white/50 mb-4 text-xs font-medium uppercase tracking-wider">
          <Activity size={14} />
          <span>Health Score</span>
        </div>
        <div className="flex items-end gap-3">
          <span className={cn("text-4xl font-semibold tracking-tighter", healthColor)}>
            {maintainability}
          </span>
          <span className="text-white/40 mb-1 font-medium">/ 100</span>
        </div>
        
        <div className="w-full h-1.5 bg-white/[0.05] rounded-full mt-4 overflow-hidden">
          <div 
            className={cn("h-full rounded-full", healthBg.replace("/10", ""))} 
            style={{ width: `${maintainability}%` }}
          />
        </div>
      </div>

      {/* Quick Insights */}
      <div className="flex flex-col p-5 rounded-2xl bg-[#111113] border border-white/[0.06] gap-4">
        <div className="flex items-center gap-2 text-white/50 text-xs font-medium uppercase tracking-wider">
          <Lightbulb size={14} />
          <span>Key Strengths</span>
        </div>
        <ul className="flex flex-col gap-3">
          {analysis.codeQuality.strengths.slice(0, 3).map((strength, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-white/80">
              <ShieldCheck size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
              <span className="leading-snug">{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Potential Issues */}
      {analysis.codeQuality.possibleIssues.length > 0 && (
        <div className="flex flex-col p-5 rounded-2xl bg-[#111113] border border-white/[0.06] gap-4">
          <div className="flex items-center gap-2 text-white/50 text-xs font-medium uppercase tracking-wider">
            <AlertTriangle size={14} />
            <span>Considerations</span>
          </div>
          <ul className="flex flex-col gap-3">
            {analysis.codeQuality.possibleIssues.slice(0, 3).map((issue, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-white/80">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50 mt-1.5 flex-shrink-0" />
                <span className="leading-snug">{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tech Stack */}
      <div className="flex flex-col p-5 rounded-2xl bg-[#111113] border border-white/[0.06] gap-4">
        <div className="flex items-center gap-2 text-white/50 text-xs font-medium uppercase tracking-wider">
          <Code2 size={14} />
          <span>Languages</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(data.repository.languages || {}).slice(0, 6).map(([lang]) => (
            <span key={lang} className="px-2.5 py-1 text-xs font-medium rounded-md bg-white/[0.03] text-white/70 border border-white/[0.06]">
              {lang}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
