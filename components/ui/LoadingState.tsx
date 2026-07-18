"use client";

import { motion } from "framer-motion";
import { Command } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 py-12 px-6">
      <div className="flex flex-col gap-4 items-center text-center mb-8">
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#4d4da8] to-[#6b6bc6] flex items-center justify-center shadow-[0_0_30px_rgba(77,77,168,0.3)] mb-4"
        >
          <Command size={28} className="text-white" />
        </motion.div>
        <h2 className="text-2xl font-medium text-white tracking-tight">Analyzing Repository</h2>
        <p className="text-white/40 text-sm max-w-md">
          Fetching repository data, normalizing tree structures, and generating AI insights. This takes a few moments.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-[#111113] border border-white/[0.06] overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: i * 0.1 }}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-8 mt-4">
        <div className="flex-1 flex flex-col gap-6">
          <div className="h-64 rounded-2xl bg-[#111113] border border-white/[0.06] overflow-hidden relative">
             <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="h-96 rounded-2xl bg-[#111113] border border-white/[0.06] overflow-hidden relative">
             <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
            />
          </div>
        </div>
        <div className="w-80 hidden lg:block h-[500px] rounded-2xl bg-[#111113] border border-white/[0.06] overflow-hidden relative">
           <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.2 }}
            />
        </div>
      </div>
    </div>
  );
}
