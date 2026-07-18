"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReadmeSuggestionsProps {
  suggestions: string[];
}

export default function ReadmeSuggestions({ suggestions }: ReadmeSuggestionsProps) {
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);

  const toggleComplete = (index: number) => {
    const newCompleted = new Set(completed);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompleted(newCompleted);
  };

  const handleCopyAll = () => {
    const text = suggestions.map(s => `- [ ] ${s}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="p-8 text-center text-white/50 bg-[#111113] rounded-2xl border border-white/[0.06]">
        No specific README improvements suggested by the AI. It looks good!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-medium text-white">Suggested Improvements</h2>
          <div className="px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs font-medium text-white/60">
            {completed.size} / {suggestions.length}
          </div>
        </div>
        <button 
          onClick={handleCopyAll}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] rounded-md transition-colors"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy List"}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {suggestions.map((suggestion, i) => {
          const isDone = completed.has(i);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => toggleComplete(i)}
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer group",
                isDone 
                  ? "bg-green-500/[0.02] border-green-500/20" 
                  : "bg-[#111113] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02]"
              )}
            >
              <div className={cn(
                "mt-0.5 transition-colors",
                isDone ? "text-green-400" : "text-white/30 group-hover:text-white/50"
              )}>
                {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
              </div>
              <p className={cn(
                "text-sm leading-relaxed transition-colors",
                isDone ? "text-white/40 line-through" : "text-white/80"
              )}>
                {suggestion}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
