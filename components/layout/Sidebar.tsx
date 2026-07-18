"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, FolderTree, GitMerge, FileText, Compass, BookOpen, Settings, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "explorer", label: "File Explorer", icon: FolderTree },
    { id: "architecture", label: "Architecture", icon: GitMerge },
    { id: "guide", label: "Beginner Guide", icon: Compass },
    { id: "readme", label: "README", icon: FileText },
    { id: "insights", label: "Insights", icon: Zap },
  ];

  return (
    <aside className="w-64 hidden md:flex flex-col border-r border-white/[0.06] bg-[#09090B] h-screen sticky top-0 flex-shrink-0 pt-6 px-4">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#4d4da8] to-[#6b6bc6] flex items-center justify-center shadow-[0_0_15px_rgba(77,77,168,0.3)]">
          <BookOpen size={16} className="text-white" />
        </div>
        <span className="font-semibold text-white tracking-tight text-lg">RepoMap AI</span>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <div className="text-xs font-medium text-white/30 uppercase tracking-widest px-2 mb-2">Menu</div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm group outline-none",
                isActive ? "text-white font-medium" : "text-white/50 hover:text-white hover:bg-white/[0.03]"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-white/[0.06] rounded-lg border border-white/[0.04]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon size={16} className={cn("relative z-10 transition-colors", isActive ? "text-white" : "text-white/40 group-hover:text-white/70")} />
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="pb-6">
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg transition-colors text-sm text-white/50 hover:text-white hover:bg-white/[0.03]">
          <Settings size={16} className="text-white/40" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
