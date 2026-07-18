"use client";

import { NormalizedGithubData } from "@/types/github";
import { FileCode, FolderTree, Library, Archive, CalendarClock } from "lucide-react";
import { motion } from "framer-motion";

interface MetricCardsProps {
  data: NormalizedGithubData;
}

export default function MetricCards({ data }: MetricCardsProps) {
  const { repository, tree } = data;

  const totalFiles = tree.filter(n => n.type === "blob").length;
  const totalFolders = tree.filter(n => n.type === "tree").length;
  const totalLanguages = Object.keys(repository.languages || {}).length;
  const sizeMb = (repository.size / 1024).toFixed(1);

  const metrics = [
    { label: "Files", value: totalFiles.toLocaleString(), icon: FileCode, delay: 0.1 },
    { label: "Folders", value: totalFolders.toLocaleString(), icon: FolderTree, delay: 0.2 },
    { label: "Languages", value: totalLanguages.toString(), icon: Library, delay: 0.3 },
    { label: "Repository Size", value: `${sizeMb} MB`, icon: Archive, delay: 0.4 },
    { label: "Last Push", value: new Date(repository.updatedAt || "").toLocaleDateString(), icon: CalendarClock, delay: 0.5 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-8">
      {metrics.map((metric, i) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: metric.delay, ease: "easeOut" }}
          key={i}
          className="flex flex-col gap-2 p-4 rounded-xl bg-[#111113] border border-white/[0.06] hover:border-white/[0.12] hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-center gap-2 text-white/40 mb-1">
            <metric.icon size={14} />
            <span className="text-xs font-medium uppercase tracking-wider">{metric.label}</span>
          </div>
          <span className="text-2xl font-semibold text-white tracking-tight">{metric.value}</span>
        </motion.div>
      ))}
    </div>
  );
}
