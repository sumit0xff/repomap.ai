"use client";

import { motion } from "framer-motion";
import { BookOpen, Map, ArrowDownRight, Compass } from "lucide-react";

interface BeginnerGuideProps {
  guide: {
    whereToStart: string;
    learningPath: string[];
    recommendedReadingOrder: string[];
  };
}

export default function BeginnerGuide({ guide }: BeginnerGuideProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="p-6 rounded-2xl bg-[#111113] border border-white/[0.06]">
        <div className="flex items-center gap-3 mb-4">
          <Compass className="text-[#4d4da8]" size={24} />
          <h2 className="text-xl font-semibold text-white">Where to Start</h2>
        </div>
        <p className="text-white/70 leading-relaxed text-sm">
          {guide.whereToStart}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2 text-white/80">
            <Map size={18} />
            <h3 className="font-medium">Learning Path</h3>
          </div>
          <div className="relative pl-6 border-l border-white/[0.06] flex flex-col gap-6 ml-2">
            {guide.learningPath.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="absolute -left-[30px] top-1 w-2.5 h-2.5 rounded-full bg-[#111113] border-2 border-[#4d4da8] shadow-[0_0_8px_rgba(77,77,168,0.5)]" />
                <p className="text-sm text-white/70 leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2 text-white/80">
            <BookOpen size={18} />
            <h3 className="font-medium">Reading Order</h3>
          </div>
          <div className="flex flex-col gap-3">
            {guide.recommendedReadingOrder.map((file, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] transition-colors"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded bg-[#4d4da8]/20 text-[#4d4da8] flex items-center justify-center text-xs font-bold mt-0.5">
                  {i + 1}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-mono text-white/90 break-all">{file}</span>
                  {i < guide.recommendedReadingOrder.length - 1 && (
                    <ArrowDownRight size={14} className="text-white/20 mt-2 ml-1" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
