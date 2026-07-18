"use client";

import { Search, RefreshCcw, CheckCircle2, User } from "lucide-react";

interface TopBarProps {
  onAnalyzeAgain: () => void;
  isAnalyzed: boolean;
  onExport: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function TopBar({ onAnalyzeAgain, isAnalyzed, onExport, searchTerm, onSearchChange }: TopBarProps) {
  return (
    <header className="h-16 border-b border-white/[0.06] bg-[#09090B]/80 backdrop-blur-xl sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative group max-w-sm w-full hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-hover:text-white/50 transition-colors" />
          <input 
            type="text" 
            placeholder="Search repository..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-[#111113] border border-white/[0.06] rounded-md text-sm text-white outline-none focus:border-white/[0.15] transition-all placeholder:text-white/20"
            disabled={!isAnalyzed}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] text-white/40 font-mono hidden md:inline-block">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] text-white/40 font-mono hidden md:inline-block">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isAnalyzed && (
          <>
            <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-green-400/80 bg-green-400/10 px-2.5 py-1 rounded-full border border-green-400/20">
              <CheckCircle2 size={12} />
              Synced
            </div>
            <button 
              onClick={onExport}
              className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white bg-[#111113] hover:bg-white/[0.05] border border-white/[0.06] px-3 py-1.5 rounded-md transition-all active:scale-[0.98]"
            >
              <span className="hidden sm:inline">Export</span>
            </button>
            <button 
              onClick={onAnalyzeAgain}
              className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white bg-[#111113] hover:bg-white/[0.05] border border-white/[0.06] px-3 py-1.5 rounded-md transition-all active:scale-[0.98]"
            >
              <RefreshCcw size={14} />
              <span className="hidden sm:inline">Analyze Another</span>
            </button>
            <div className="w-[1px] h-6 bg-white/[0.06]" />
          </>
        )}
        <button aria-label="User profile" className="w-8 h-8 rounded-full bg-[#111113] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-colors">
          <User size={14} />
        </button>
      </div>
    </header>
  );
}
