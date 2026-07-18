"use client";

import { useState, useEffect, useRef } from "react";
import { parseGithubUrl } from "@/lib/github-parser";
import { NormalizedGithubData } from "@/types/github";
import { RepositoryAnalysis } from "@/types/analysis";
import { motion, AnimatePresence } from "framer-motion";
import { Command, FolderTree, GitMerge, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

import dynamic from "next/dynamic";

const ParticleBackground = dynamic(() => import("@/components/features/ParticleBackground"), { 
  ssr: false,
});

const ArchitecturePanel = dynamic(() => import("@/components/features/ArchitecturePanel"), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-white/50 bg-[#111113] rounded-2xl border border-white/[0.06] animate-pulse h-96 flex items-center justify-center">Loading Architecture...</div>
});

import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import RightSidebar from "@/components/layout/RightSidebar";
import HeroSection from "@/components/features/HeroSection";
import MetricCards from "@/components/features/MetricCards";
import FileExplorer from "@/components/features/FileExplorer";
import BeginnerGuide from "@/components/features/BeginnerGuide";
import ReadmeSuggestions from "@/components/features/ReadmeSuggestions";
import LoadingState from "@/components/ui/LoadingState";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{title: string, description: string, action: string} | null>(null);
  
  const [githubData, setGithubData] = useState<NormalizedGithubData | null>(null);
  const [analysisData, setAnalysisData] = useState<RepositoryAnalysis | null>(null);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const [recentRepos, setRecentRepos] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentRepos");
      if (stored) {
        const parsed = JSON.parse(stored);
        setTimeout(() => {
          setRecentRepos(parsed);
          if (parsed.length > 0 && !url) {
            setUrl(parsed[0]);
          }
        }, 0);
      }
    } catch {
      // ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveRecentRepo = (repoUrl: string) => {
    try {
      const updated = [repoUrl, ...recentRepos.filter(r => r !== repoUrl)].slice(0, 5);
      setRecentRepos(updated);
      localStorage.setItem("recentRepos", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const parseErrorMessage = (msg: string) => {
    if (msg.includes("404") || msg.includes("not found")) {
      return {
        title: "Repository not found",
        description: "We couldn't find a public GitHub repository at that URL. Make sure it's not private or deleted.",
        action: "Check the URL"
      };
    }
    if (msg.includes("403") || msg.includes("rate limit")) {
      return {
        title: "Rate Limit Exceeded",
        description: "GitHub API rate limit reached. Please try again later or provide a smaller repository.",
        action: "Try again later"
      };
    }
    if (msg.includes("Failed to fetch") || msg.includes("Network")) {
      return {
        title: "Network Failure",
        description: "Unable to connect to the server. Please check your internet connection.",
        action: "Retry connection"
      };
    }
    if (msg.includes("analyze") || msg.includes("OpenAI") || msg.includes("timeout")) {
      return {
        title: "AI Engine Unavailable",
        description: "The AI engine took too long to respond or is currently experiencing issues.",
        action: "Try again"
      };
    }
    if (msg.includes("Invalid GitHub URL")) {
      return {
        title: "Invalid URL format",
        description: "Please provide a valid public GitHub repository URL.",
        action: "Check the URL"
      };
    }
    return {
      title: "Analysis Failed",
      description: msg,
      action: "Dismiss"
    };
  };

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
      saveRecentRepo(url);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(parseErrorMessage(err.message));
      } else {
        setError(parseErrorMessage("An unexpected error occurred."));
      }
      setTimeout(() => inputRef.current?.focus(), 100);
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

  const handleExport = () => {
    if (!githubData || !analysisData) return;
    
    const repo = githubData.repository;
    const ai = analysisData;
    
    const markdown = `# ${repo.owner}/${repo.repo} - RepoMap AI Analysis

## Overview
${ai.architecture.overview}

## Architecture Flow
\`\`\`mermaid
${ai.mermaidDiagram}
\`\`\`

## Key Strengths
${ai.codeQuality.strengths.map(s => `- ${s}`).join('\\n')}

## Beginner Guide
**Where to start:** ${ai.beginnerGuide.whereToStart}

**Learning Path:**
${ai.beginnerGuide.learningPath.map(s => `- ${s}`).join('\\n')}

## Folder Explanations
${ai.folderExplanations.map(f => `### ${f.folder}\\n${f.purpose}\\n`).join('\\n')}

## README Suggestions
${ai.readmeSuggestions.map(s => `- [ ] ${s}`).join('\\n')}
`;
    
    const blob = new Blob([markdown], { type: "text/markdown" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "repomap-analysis.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                  ref={inputRef}
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
                  className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                  aria-label="Analyze repository"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    "Analyze"
                  )}
                </button>
              </form>
              
              <div className="w-full mt-6 flex flex-col sm:flex-row items-start justify-between gap-6 text-sm">
                {recentRepos.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-white/40 font-medium">Recent</span>
                    <div className="flex flex-wrap gap-2">
                      {recentRepos.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => setUrl(r)}
                          className="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-white/70 hover:text-white transition-colors"
                        >
                          {r.replace("https://github.com/", "")}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <span className="text-white/40 font-medium">Try Examples</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "React", url: "https://github.com/facebook/react" },
                      { name: "Next.js", url: "https://github.com/vercel/next.js" },
                      { name: "TypeScript", url: "https://github.com/microsoft/TypeScript" },
                      { name: "Tailwind CSS", url: "https://github.com/tailwindlabs/tailwindcss" },
                      { name: "OpenAI", url: "https://github.com/openai/openai-node" },
                    ].map((ex, i) => (
                      <button
                        key={i}
                        onClick={() => setUrl(ex.url)}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-[#4d4da8] hover:text-[#6b6bc6] transition-colors"
                      >
                        {ex.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 w-full p-6 rounded-2xl bg-[#111113] border border-red-500/20 shadow-2xl flex flex-col items-center text-center gap-4 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-red-500/5 mix-blend-screen" />
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-2 z-10">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div className="z-10">
                    <h3 className="text-lg font-medium text-white mb-2">{error.title}</h3>
                    <p className="text-sm text-red-400/80 max-w-md">{error.description}</p>
                  </div>
                  <button 
                    onClick={() => setError(null)}
                    className="z-10 mt-2 px-5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-sm font-medium text-white transition-colors"
                  >
                    {error.action || "Dismiss"}
                  </button>
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
              <TopBar 
                onAnalyzeAgain={resetState} 
                isAnalyzed={true} 
                onExport={handleExport} 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
              
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="max-w-6xl mx-auto flex gap-10">
                  <div className="flex-1 flex flex-col min-w-0 gap-10">
                    <HeroSection repository={githubData!.repository} />
                    <MetricCards data={githubData!} />
                    
                    <div className="flex flex-col gap-6">
                      {activeTab === "overview" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                          <div className="p-6 rounded-2xl bg-[#111113] border border-white/[0.06] relative group">
                            <button 
                              aria-label="Copy overview"
                              onClick={() => {
                                navigator.clipboard.writeText(analysisData!.architecture.overview);
                                const btn = document.getElementById("copy-overview-btn");
                                if (btn) {
                                  btn.innerText = "Copied!";
                                  setTimeout(() => btn.innerText = "Copy", 2000);
                                }
                              }}
                              className="absolute top-4 right-4 px-2 py-1 text-xs rounded-md bg-white/[0.05] hover:bg-white/[0.1] opacity-0 group-hover:opacity-100 transition-opacity text-white/50 hover:text-white"
                              id="copy-overview-btn"
                            >
                              Copy
                            </button>
                            <h2 className="text-xl font-semibold mb-4 pr-10">Project Overview</h2>
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
                          <FileExplorer tree={githubData!.tree} searchTerm={searchTerm} />
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
                          <ReadmeSuggestions suggestions={analysisData!.readmeSuggestions} searchTerm={searchTerm} />
                        </motion.div>
                      )}

                      {activeTab === "insights" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                           <div className="p-6 rounded-2xl bg-[#111113] border border-white/[0.06]">
                            <h2 className="text-xl font-semibold mb-4">Folder Explanations</h2>
                            {searchTerm && analysisData!.folderExplanations.filter(f => f.folder.toLowerCase().includes(searchTerm.toLowerCase()) || f.purpose.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                              <div className="text-center py-10 text-white/40">No matching files found.</div>
                            ) : (
                              <div className="flex flex-col gap-4">
                                {analysisData!.folderExplanations
                                  .filter(f => !searchTerm || f.folder.toLowerCase().includes(searchTerm.toLowerCase()) || f.purpose.toLowerCase().includes(searchTerm.toLowerCase()))
                                  .map((f, i) => (
                                  <div key={i} className="flex flex-col p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-mono text-sm font-semibold text-[#4d4da8]">
                                        {searchTerm ? (
                                          <span dangerouslySetInnerHTML={{__html: f.folder.replace(new RegExp(`(${searchTerm})`, 'gi'), '<span class="bg-yellow-500/30 text-yellow-200 rounded-sm px-0.5">$1</span>')}} />
                                        ) : f.folder}
                                      </span>
                                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.05] text-white/50">{f.importance}</span>
                                    </div>
                                    <p className="text-sm text-white/70 leading-relaxed">
                                      {searchTerm ? (
                                        <span dangerouslySetInnerHTML={{__html: f.purpose.replace(new RegExp(`(${searchTerm})`, 'gi'), '<span class="bg-yellow-500/30 text-yellow-200 rounded-sm px-0.5">$1</span>')}} />
                                      ) : f.purpose}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
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
                aria-label={`Open ${item.id} tab`}
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
