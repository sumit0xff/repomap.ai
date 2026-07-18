"use client";

import { useState } from "react";
import { parseGithubUrl } from "@/lib/github-parser";
import { NormalizedGithubData } from "@/types/github";
import { RepositoryAnalysis } from "@/types/analysis";
import { motion, AnimatePresence } from "framer-motion";
import { Command, FolderTree, GitMerge, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

import ParticleBackground from "@/components/features/ParticleBackground";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import RightSidebar from "@/components/layout/RightSidebar";
import HeroSection from "@/components/features/HeroSection";
import MetricCards from "@/components/features/MetricCards";
import FileExplorer from "@/components/features/FileExplorer";
import ArchitecturePanel from "@/components/features/ArchitecturePanel";
import BeginnerGuide from "@/components/features/BeginnerGuide";
import ReadmeSuggestions from "@/components/features/ReadmeSuggestions";
import LoadingState from "@/components/ui/LoadingState";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [githubData, setGithubData] = useState<NormalizedGithubData | null>(null);
  const [analysisData, setAnalysisData] = useState<RepositoryAnalysis | null>(null);
  
  const [activeTab, setActiveTab] = useState("overview");

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loading || !url) return;

    setError(null);
    setGithubData(null);
    setAnalysisData(null);
    setLoading(true);

    try {
      const { owner, repo } = parseGithubUrl(url);

      const githubRes = await fetch("/api/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo }),
      });
      const ghData = await githubRes.json();

      if (!githubRes.ok || !ghData.success) {
        throw new Error(ghData.error || "Failed to fetch repository data.");
      }
      setGithubData(ghData);

      const aiRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ghData),
      });
      const aiData = await aiRes.json();

      if (!aiRes.ok || !aiData.success) {
        throw new Error(aiData.error || "Failed to analyze repository.");
      }

      setAnalysisData(aiData.analysis);
      setActiveTab("overview");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An unexpected error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const resetState = () => {
    setUrl("");
    setGithubData(null);
    setAnalysisData(null);
    setError(null);
  };

  const isAnalyzed = !!(githubData && analysisData);

  return (
    <div className="flex bg-[#09090B] min-h-screen text-white font-sans selection:bg-[#4d4da8]/30">
      <ParticleBackground />

      <AnimatePresence>
        {isAnalyzed && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex-shrink-0"
          >
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {!isAnalyzed && !loading && (
          <div className="absolute inset-0 flex items-center justify-center p-6 z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center w-full max-w-2xl"
            >
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#4d4da8] to-[#6b6bc6] flex items-center justify-center shadow-[0_0_30px_rgba(77,77,168,0.2)] mb-8">
                <Command size={28} className="text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4 text-center">
                Understand any codebase.
              </h1>
              <p className="text-lg text-white/50 mb-10 text-center max-w-lg">
                Paste a GitHub repository to instantly generate an AI-powered architecture explanation.
              </p>

              <form onSubmit={handleSubmit} className="w-full relative group">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="https://github.com/owner/repo"
                  className="w-full h-16 pl-6 pr-32 rounded-2xl bg-[#111113] border border-white/[0.08] text-lg text-white outline-none focus:border-white/[0.2] transition-all placeholder:text-white/20 shadow-2xl"
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={loading || !url}
                  className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Analyze
                </button>
              </form>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium"
                >
                  {error}
                </motion.div>
              )}
            </motion.div>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 overflow-auto z-10 bg-[#09090B]/80 backdrop-blur-sm">
            <LoadingState />
          </div>
        )}

        <AnimatePresence>
          {isAnalyzed && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col h-full z-10"
            >
              <TopBar onAnalyzeAgain={resetState} isAnalyzed={true} />
              
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="max-w-6xl mx-auto flex gap-10">
                  <div className="flex-1 flex flex-col min-w-0 gap-10">
                    <HeroSection repository={githubData!.repository} />
                    <MetricCards data={githubData!} />
                    
                    <div className="flex flex-col gap-6">
                      {activeTab === "overview" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                          <div className="p-6 rounded-2xl bg-[#111113] border border-white/[0.06]">
                            <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
                            <p className="text-white/70 leading-relaxed">
                              {analysisData!.architecture.overview}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl bg-[#111113] border border-white/[0.06]">
                              <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">Architecture Patterns</h3>
                              <ul className="flex flex-col gap-3">
                                {analysisData!.architecture.patterns.map((p, i) => (
                                  <li key={i} className="flex items-start gap-2.5 text-sm text-white/80">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#4d4da8] mt-1.5 flex-shrink-0" />
                                    <span>{p}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="p-6 rounded-2xl bg-[#111113] border border-white/[0.06]">
                              <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">Important Directories</h3>
                              <ul className="flex flex-col gap-3">
                                {analysisData!.architecture.importantDirectories.map((d, i) => (
                                  <li key={i} className="flex items-start gap-2.5 text-sm text-white/80">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 flex-shrink-0" />
                                    <span className="font-mono text-white/90">{d}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === "explorer" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <FileExplorer tree={githubData!.tree} />
                        </motion.div>
                      )}

                      {activeTab === "architecture" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <ArchitecturePanel diagram={analysisData!.mermaidDiagram} />
                        </motion.div>
                      )}

                      {activeTab === "guide" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <BeginnerGuide guide={analysisData!.beginnerGuide} />
                        </motion.div>
                      )}

                      {activeTab === "readme" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <ReadmeSuggestions suggestions={analysisData!.readmeSuggestions} />
                        </motion.div>
                      )}

                      {activeTab === "insights" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                           <div className="p-6 rounded-2xl bg-[#111113] border border-white/[0.06]">
                            <h2 className="text-xl font-semibold mb-4">Folder Explanations</h2>
                            <div className="flex flex-col gap-4">
                              {analysisData!.folderExplanations.map((f, i) => (
                                <div key={i} className="flex flex-col p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-mono text-sm font-semibold text-[#4d4da8]">{f.folder}</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.05] text-white/50">{f.importance}</span>
                                  </div>
                                  <p className="text-sm text-white/70 leading-relaxed">{f.purpose}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  <RightSidebar data={githubData!} analysis={analysisData!} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Nav */}
      <AnimatePresence>
        {isAnalyzed && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 inset-x-0 md:hidden bg-[#09090B]/90 backdrop-blur-xl border-t border-white/[0.06] p-4 z-50 flex items-center justify-around"
          >
            {[
              { id: "overview", icon: Command },
              { id: "explorer", icon: FolderTree },
              { id: "architecture", icon: GitMerge },
              { id: "guide", icon: Compass },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "p-3 rounded-xl transition-all",
                  activeTab === item.id ? "bg-white/[0.08] text-white" : "text-white/40 hover:text-white/70"
                )}
              >
                <item.icon size={20} />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
