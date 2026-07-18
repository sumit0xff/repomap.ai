"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Command, 
  Search, 
  ArrowRight, 
  Cpu, 
  FolderTree, 
  GitMerge, 
  Compass, 
  CheckSquare, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Rocket, 
  ChevronDown, 
  Check, 
  ExternalLink, 
  Code2, 
  Terminal, 
  Layers,
  Star,
  FileCode,
  Box
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LandingPageProps {
  url: string;
  setUrl: (url: string) => void;
  handleSubmit: (e?: React.FormEvent) => void;
  loading: boolean;
  error: { title: string; description: string; action: string } | null;
  setError: (err: { title: string; description: string; action: string } | null) => void;
  recentRepos: string[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function LandingPage({
  url,
  setUrl,
  handleSubmit,
  loading,
  error,
  setError,
  recentRepos,
  inputRef,
  handleKeyDown
}: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [exampleTab, setExampleTab] = useState<"summary" | "architecture" | "guide" | "tree">("summary");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrolled(container.scrollTop > 20);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToInput = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    setTimeout(() => {
      inputRef.current?.focus();
    }, 400);
  };

  const fillAndSubmit = (exampleUrl: string) => {
    setUrl(exampleUrl);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  };

  const trustLogos = [
    { name: "GitHub", icon: Code2 },
    { name: "React", icon: Layers },
    { name: "Next.js", icon: Terminal },
    { name: "Node.js", icon: Cpu },
    { name: "TypeScript", icon: FileCode },
    { name: "OpenAI", icon: Sparkles },
    { name: "Tailwind CSS", icon: Box },
    { name: "Docker", icon: ShieldCheck }
  ];

  const features = [
    {
      title: "AI Architecture Breakdown",
      description: "Instant high-level system overview. Identifies architectural design patterns, core modules, and data flow across layers.",
      icon: Cpu,
      badge: "Core Engine"
    },
    {
      title: "Interactive File Explorer",
      description: "Mac Finder-styled expandable file tree. Automatically filters noise, highlights core configuration files, and supports live search.",
      icon: FolderTree,
      badge: "Smart Tree"
    },
    {
      title: "Mermaid Architecture Diagrams",
      description: "Auto-generated interactive system flowcharts with pan, zoom, and SVG export. Visualize complex interactions in seconds.",
      icon: GitMerge,
      badge: "Visual Flow"
    },
    {
      title: "Developer Onboarding Guides",
      description: "Tailored beginner guides answering 'Where should I start?' with structured reading paths for junior to senior engineers.",
      icon: Compass,
      badge: "Onboarding"
    },
    {
      title: "README Improvement Checklist",
      description: "Intelligent documentation audit. Identifies critical gaps in existing readmes and provides actionable items to elevate quality.",
      icon: CheckSquare,
      badge: "Documentation"
    },
    {
      title: "Code Quality Insights",
      description: "Automatic detection of engineering strengths, design decisions, and tech stack clarity with precise summary scoring.",
      icon: Sparkles,
      badge: "Analytics"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Paste Repository URL",
      description: "Enter any public GitHub repository link into our high-speed validation input."
    },
    {
      number: "02",
      title: "Server-Side Truncation",
      description: "Our proxy recursively extracts and normalizes the file tree, filtering out build noise and binaries."
    },
    {
      number: "03",
      title: "AI Schema Engine",
      description: "Structured prompts analyze dependencies, folder relationships, and core abstractions using strict JSON schemas."
    },
    {
      number: "04",
      title: "Interactive Report",
      description: "Receive a live, multi-tab architecture overview, interactive diagram, and onboarding guide."
    }
  ];

  const faqs = [
    {
      q: "How does RepoMap AI analyze repositories so quickly?",
      a: "RepoMap AI uses a dedicated server-side normalization pipeline that fetches recursive Git trees via the GitHub REST API. We intelligently filter out binaries, node_modules, and build artifacts while prioritizing source code, architecture directories, and key configuration files (`package.json`, `tsconfig.json`, `Dockerfile`) before sending the exact structural representation to high-speed OpenAI models."
    },
    {
      q: "Does RepoMap AI support private GitHub repositories?",
      a: "Currently, RepoMap AI works instantly with any public GitHub repository without requiring login or authentication. Private repository support with secure enterprise OAuth token integration is on our immediate product roadmap."
    },
    {
      q: "Why are the outputs formatted as structured JSON?",
      a: "Unlike standard chatbots that hallucinate markdown formatting or produce unpredictable responses, RepoMap AI uses strict `json_schema` response enforcement (`Structured Outputs`). This guarantees zero parsing errors, 100% type safety, and reliable Mermaid syntax rendering every single time."
    },
    {
      q: "What happens if a repository has over 10,000 files?",
      a: "For massive monorepos, our intelligent truncation algorithm prioritizes shallower directories, core configuration definitions, and essential entry points up to 2,500 items. This ensures the AI receives maximum architectural signal without exceeding context limits or sacrificing latency."
    },
    {
      q: "Is RepoMap AI free to use during the hackathon demo?",
      a: "Yes! You can test as many public GitHub repositories as you like during the launch window. Explore examples like Next.js, React, or TypeScript with a single click."
    }
  ];

  return (
    <div 
      ref={scrollContainerRef}
      className="w-full h-full overflow-y-auto overflow-x-hidden bg-transparent text-white font-sans selection:bg-[#4d4da8]/30 relative scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
    >
      {/* Background Subtle Grid & Noise */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(77,77,168,0.18)_0%,transparent_70%)] blur-[100px] pointer-events-none z-0" />

      {/* STICKY NAVBAR */}
      <nav className={cn(
        "sticky top-0 z-50 transition-all duration-300 px-6 md:px-12 py-4 flex items-center justify-between border-b",
        scrolled 
          ? "bg-[#09090B]/85 backdrop-blur-xl border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.4)]" 
          : "bg-transparent border-transparent"
      )}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={scrollToInput}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4d4da8] to-[#6b6bc6] flex items-center justify-center shadow-[0_0_20px_rgba(77,77,168,0.3)] border border-white/10">
            <Command size={18} className="text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-white flex items-center gap-2">
            RepoMap AI
            <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/70">
              v1.0
            </span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
          <a href="#features" className="hover:text-white transition-colors relative py-1 group">
            Features
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
          </a>
          <a href="#how-it-works" className="hover:text-white transition-colors relative py-1 group">
            How it Works
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
          </a>
          <a href="#examples" className="hover:text-white transition-colors relative py-1 group">
            Examples
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
          </a>
          <a href="#faq" className="hover:text-white transition-colors relative py-1 group">
            FAQ
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 text-xs font-medium text-white/70 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] px-3.5 py-2 rounded-xl transition-all"
          >
            <span>GitHub</span>
            <ExternalLink size={12} />
          </a>
          <button
            onClick={scrollToInput}
            className="px-4 py-2 rounded-xl bg-[#4d4da8] hover:bg-[#5e5ec2] text-white text-xs md:text-sm font-medium transition-all shadow-[0_0_20px_rgba(77,77,168,0.25)] hover:shadow-[0_0_25px_rgba(77,77,168,0.4)] active:scale-95"
          >
            Analyze Repo
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 md:pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-start">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-8 text-xs font-medium text-white/80 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#4d4da8] animate-pulse" />
          <span>Hackathon MVP — Built for 4-Hour Codebase Mastery</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05] max-w-5xl text-left"
        >
          Understand <br />
          any GitHub <br />
          repository. <br />
          <span className="bg-gradient-to-r from-white via-white/90 to-[#6b6bc6] bg-clip-text text-transparent">
            Instantly.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-2xl text-white/50 max-w-2xl text-left mt-6 leading-relaxed font-normal"
        >
          Architecture. Documentation. Developer onboarding. <br />
          Generated in seconds using AI.
        </motion.p>

        {/* ANALYZE INPUT FORM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-3xl mt-10 relative group"
        >
          <form onSubmit={handleSubmit} className="w-full relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#4d4da8] transition-colors pointer-events-none">
              <Search size={22} />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://github.com/owner/repository"
              className="w-full h-18 pl-14 pr-36 rounded-2xl bg-[#111113] border border-white/[0.1] focus:border-white/[0.25] text-lg text-white outline-none transition-all placeholder:text-white/25 shadow-[0_10px_40px_rgba(0,0,0,0.6)] focus:shadow-[0_0_40px_rgba(77,77,168,0.2)] font-mono text-sm sm:text-base"
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !url}
              className="absolute right-2.5 top-2.5 bottom-2.5 px-6 rounded-xl bg-gradient-to-r from-white to-white/90 text-black font-semibold hover:opacity-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center min-w-[110px] shadow-lg active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-1.5">
                  Analyze
                  <ArrowRight size={16} className="text-black/70" />
                </span>
              )}
            </button>
          </form>

          {/* ERROR ALERT IF APPLICABLE */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-5 rounded-2xl bg-[#161113] border border-red-500/30 flex items-center justify-between gap-4 text-left shadow-xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-400 font-bold text-sm">!</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{error.title}</h4>
                  <p className="text-xs text-red-400/90 mt-0.5">{error.description}</p>
                </div>
              </div>
              <button
                onClick={() => setError(null)}
                className="px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-white transition-colors flex-shrink-0"
              >
                {error.action || "Dismiss"}
              </button>
            </motion.div>
          )}

          {/* POPULAR & RECENT REPOSITORIES PILLS */}
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs">
            <div className="flex items-center gap-2 text-white/40 flex-shrink-0 font-medium">
              <span>Popular repositories:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Next.js", repo: "https://github.com/vercel/next.js" },
                { name: "React", repo: "https://github.com/facebook/react" },
                { name: "OpenAI", repo: "https://github.com/openai/openai-node" },
                { name: "TypeScript", repo: "https://github.com/microsoft/TypeScript" },
                { name: "Tailwind", repo: "https://github.com/tailwindlabs/tailwindcss" }
              ].map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => fillAndSubmit(ex.repo)}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] text-white/70 hover:text-white transition-all font-mono"
                >
                  {ex.name}
                </button>
              ))}
            </div>
          </div>

          {recentRepos.length > 0 && (
            <div className="mt-3 flex items-center gap-2 text-xs flex-wrap">
              <span className="text-white/30 font-medium">Recent:</span>
              {recentRepos.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => fillAndSubmit(r)}
                  className="px-2.5 py-1 rounded-md bg-[#4d4da8]/10 hover:bg-[#4d4da8]/20 border border-[#4d4da8]/20 text-[#6b6bc6] hover:text-white transition-colors font-mono text-[11px]"
                >
                  {r.replace("https://github.com/", "")}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* ANIMATED SCROLL INDICATOR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 sm:mt-24 flex items-center gap-3 text-xs text-white/40 font-mono tracking-wider uppercase"
        >
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <motion.div 
              animate={{ y: [0, 8, 0] }} 
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 rounded-full bg-[#4d4da8]" 
            />
          </div>
          <span>Scroll to explore architecture view</span>
        </motion.div>
      </section>

      {/* DASHBOARD PREVIEW SECTION */}
      <section className="relative z-10 px-6 md:px-12 pb-28 max-w-7xl mx-auto">
        <motion.div
          initial={{ rotateX: 6, scale: 0.96, opacity: 0 }}
          whileInView={{ rotateX: 0, scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full bg-[#111113]/95 border border-white/[0.08] rounded-2xl md:rounded-3xl shadow-[0_0_80px_rgba(77,77,168,0.16)] overflow-hidden [transform-style:preserve-3d] [perspective:1000px]"
        >
          {/* MAC WINDOW HEADER */}
          <div className="h-12 border-b border-white/[0.06] bg-black/40 px-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 font-mono text-xs text-white/50 hidden sm:inline-block">
                vercel / next.js — RepoMap AI Analysis
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Synced
              </span>
              <span className="px-3 py-1 rounded-md bg-white/[0.04] text-white/60 border border-white/[0.06] hidden md:inline-block font-mono text-[11px]">
                gpt-4o-mini
              </span>
            </div>
          </div>

          {/* PREVIEW CONTENT */}
          <div className="p-6 md:p-8 flex flex-col gap-6">
            {/* HERO BAR INSIDE WINDOW */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center font-mono font-bold text-xl text-white">
                  N
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    vercel/next.js
                    <span className="text-xs px-2 py-0.5 rounded-md bg-[#4d4da8]/20 text-[#8b8bee] border border-[#4d4da8]/30 font-mono">
                      App Router
                    </span>
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    The React Framework for the Web. Built with hybrid SSR and edge primitives.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-white/70">
                <div className="flex flex-col items-end">
                  <span className="text-white/40">Stars</span>
                  <span className="text-sm font-semibold text-white flex items-center gap-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" /> 118.4k
                  </span>
                </div>
                <div className="w-[1px] h-8 bg-white/[0.06]" />
                <div className="flex flex-col items-end">
                  <span className="text-white/40">Primary Language</span>
                  <span className="text-sm font-semibold text-white">TypeScript (89%)</span>
                </div>
              </div>
            </div>

            {/* INTERACTIVE MOCK TABS */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-2/3 flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
                  {[
                    { id: "summary", label: "Project Overview", icon: Cpu },
                    { id: "architecture", label: "Architecture Flow", icon: GitMerge },
                    { id: "guide", label: "Beginner Guide", icon: Compass },
                    { id: "tree", label: "File Explorer", icon: FolderTree }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setExampleTab(t.id as unknown as "summary")}
                      className={cn(
                        "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                        exampleTab === t.id 
                          ? "bg-white/[0.08] text-white border border-white/[0.1]" 
                          : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                      )}
                    >
                      <t.icon size={13} />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>

                {/* TAB SHOWCASE BOX */}
                <div className="p-6 rounded-2xl bg-[#09090B] border border-white/[0.06] min-h-[300px] flex flex-col justify-between">
                  {exampleTab === "summary" && (
                    <div className="flex flex-col gap-4">
                      <h4 className="text-sm font-semibold text-white">System Summary & Core Abstractions</h4>
                      <p className="text-sm text-white/70 leading-relaxed">
                        Next.js operates on a layered server-first architecture combining a high-performance Rust compiler (<span className="text-[#8b8bee] font-mono text-xs">Turbopack</span>) with React Server Components (<span className="text-[#8b8bee] font-mono text-xs">RSC</span>). The application runtime splits requests between static compilation graphs and dynamic Node.js / Edge workers orchestrated via <span className="font-mono text-xs text-white/90">packages/next/src/server</span>.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                          <span className="text-[11px] font-mono text-white/40 uppercase">Key Architecture Pattern</span>
                          <p className="text-xs text-white/90 font-medium mt-1">Hybrid Server/Client Rendering Graph</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                          <span className="text-[11px] font-mono text-white/40 uppercase">Primary Bundler Layer</span>
                          <p className="text-xs text-white/90 font-medium mt-1">SWC / Turbopack Native Engine</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {exampleTab === "architecture" && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-white/50">Mermaid.js Flowchart Preview</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#4d4da8]/20 text-[#8b8bee] font-mono">Interactive SVG</span>
                      </div>
                      <div className="p-6 rounded-xl bg-[#111113] border border-white/[0.06] font-mono text-xs text-white/80 flex flex-col items-center justify-center gap-3 overflow-x-auto">
                        <div className="flex items-center gap-3 flex-wrap justify-center">
                          <div className="px-3 py-2 rounded bg-white/[0.05] border border-white/[0.1]">Browser Client (SPA)</div>
                          <span className="text-white/30">──▶</span>
                          <div className="px-3 py-2 rounded bg-[#4d4da8]/30 border border-[#4d4da8]">App Router Server Handler</div>
                          <span className="text-white/30">──▶</span>
                          <div className="px-3 py-2 rounded bg-white/[0.05] border border-white/[0.1]">RSC Payload Generator</div>
                        </div>
                        <span className="text-white/30">▼</span>
                        <div className="px-4 py-2 rounded bg-green-500/10 border border-green-500/20 text-green-300">
                          Compiled HTML Stream + Server Actions Runtime
                        </div>
                      </div>
                    </div>
                  )}

                  {exampleTab === "guide" && (
                    <div className="flex flex-col gap-3">
                      <h4 className="text-sm font-semibold text-white">Where should a new contributor start?</h4>
                      <div className="flex flex-col gap-2.5">
                        {[
                          { step: "1", path: "packages/next/src/client/index.tsx", desc: "Examine client entry point and hydration logic." },
                          { step: "2", path: "packages/next/src/server/next-server.ts", desc: "Understand core request handling and routing lifecycles." },
                          { step: "3", path: "packages/next/src/build/index.ts", desc: "Explore static page generation and webpack/turbopack configs." }
                        ].map((g, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                            <span className="w-5 h-5 rounded-md bg-[#4d4da8] text-white font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                              {g.step}
                            </span>
                            <div>
                              <span className="font-mono text-xs text-white/90 font-medium">{g.path}</span>
                              <p className="text-xs text-white/60 mt-0.5">{g.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {exampleTab === "tree" && (
                    <div className="flex flex-col gap-2 font-mono text-xs text-white/80 max-h-[240px] overflow-y-auto">
                      <div className="flex items-center gap-2 py-1 px-2 rounded hover:bg-white/[0.03]">
                        <FolderTree size={14} className="text-[#4d4da8]" /> <span>packages/next/src/server</span> <span className="ml-auto text-white/30">Server Core</span>
                      </div>
                      <div className="flex items-center gap-2 py-1 px-2 rounded hover:bg-white/[0.03] pl-6">
                        <FileCode size={14} className="text-white/40" /> <span>next-server.ts</span> <span className="ml-auto text-white/30">142.1 KB</span>
                      </div>
                      <div className="flex items-center gap-2 py-1 px-2 rounded hover:bg-white/[0.03] pl-6">
                        <FileCode size={14} className="text-white/40" /> <span>app-render.tsx</span> <span className="ml-auto text-white/30">89.4 KB</span>
                      </div>
                      <div className="flex items-center gap-2 py-1 px-2 rounded hover:bg-white/[0.03]">
                        <FolderTree size={14} className="text-[#4d4da8]" /> <span>packages/next/src/client</span> <span className="ml-auto text-white/30">Client Runtime</span>
                      </div>
                      <div className="flex items-center gap-2 py-1 px-2 rounded hover:bg-white/[0.03] pl-6">
                        <FileCode size={14} className="text-white/40" /> <span>components/app-router.tsx</span> <span className="ml-auto text-white/30">34.2 KB</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40">
                    <span>Generated by RepoMap AI Engine</span>
                    <span className="font-mono text-[#8b8bee] cursor-pointer hover:underline" onClick={scrollToInput}>Try your repo above ↑</span>
                  </div>
                </div>
              </div>

              {/* RIGHT HAND SIDE INSIGHTS CARD IN PREVIEW */}
              <div className="lg:w-1/3 flex flex-col gap-4">
                <div className="p-5 rounded-2xl bg-[#09090B] border border-white/[0.06] flex flex-col gap-4 h-full justify-between">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 mb-3">Code Quality Insights</h4>
                    <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                      <span className="text-xs font-medium text-green-400">Architecture Clarity</span>
                      <span className="font-mono text-sm font-bold text-green-300">96 / 100</span>
                    </div>
                    <ul className="flex flex-col gap-2.5 text-xs text-white/70">
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-green-400 flex-shrink-0" />
                        <span>Strict boundary separation between compiler and runtime</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-green-400 flex-shrink-0" />
                        <span>High TypeScript type coverage across internal packages</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-green-400 flex-shrink-0" />
                        <span>Comprehensive documentation across config files</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06]">
                    <span className="text-[11px] text-white/40 block">Want to inspect your team&apos;s codebase?</span>
                    <button
                      onClick={scrollToInput}
                      className="mt-2 w-full py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-white transition-colors"
                    >
                      Analyze Custom Repo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* TRUST LOGOS SECTION */}
      <section className="py-16 border-t border-b border-white/[0.06] bg-black/40 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
          <span className="text-xs font-mono uppercase tracking-widest text-white/40">
            Works beautifully with modern engineering ecosystems
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
            {trustLogos.map((logo, i) => (
              <div 
                key={i} 
                className="flex items-center gap-2 text-white/40 hover:text-white/90 transition-colors cursor-default group"
              >
                <logo.icon size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm tracking-tight">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES GRID SECTION */}
      <section id="features" className="py-28 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-mono uppercase tracking-widest text-[#8b8bee] px-3 py-1 rounded-full bg-[#4d4da8]/10 border border-[#4d4da8]/20 mb-4">
            Product Capabilities
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Engineered for clarity
          </h2>
          <p className="text-base md:text-lg text-white/50 leading-relaxed">
            Everything you need to master unfamiliar codebases, evaluate open-source dependencies, and onboard engineers in record time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="p-8 rounded-3xl bg-[#111113] border border-white/[0.06] hover:border-white/[0.18] transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#4d4da8]/10 rounded-full blur-2xl group-hover:bg-[#4d4da8]/25 transition-colors pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#8b8bee] group-hover:bg-[#4d4da8] group-hover:text-white transition-all shadow-md">
                    <feat.icon size={22} />
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/[0.03] text-white/50 border border-white/[0.06]">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#8b8bee] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/[0.04] flex items-center gap-1.5 text-xs font-medium text-white/40 group-hover:text-white/80 transition-colors">
                <span>Explore capability</span>
                <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS TIMELINE SECTION */}
      <section id="how-it-works" className="py-28 border-t border-white/[0.06] bg-black/30 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8b8bee] px-3 py-1 rounded-full bg-[#4d4da8]/10 border border-[#4d4da8]/20 mb-4">
              System Pipeline
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
              How RepoMap AI works
            </h2>
            <p className="text-base md:text-lg text-white/50 leading-relaxed">
              A robust server-side processing engine transforms raw repository trees into actionable structured knowledge in under 15 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Horizontal connector line for desktop */}
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />

            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-start md:items-center text-left md:text-center p-6 rounded-2xl bg-[#111113]/80 border border-white/[0.06] hover:border-white/[0.14] transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-[#4d4da8]/20 border border-[#4d4da8]/40 flex items-center justify-center font-mono font-bold text-base text-[#8b8bee] mb-6 shadow-md">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY REPOMAP 3 COLUMNS SECTION */}
      <section id="examples" className="py-28 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Why leading teams choose RepoMap
          </h2>
          <p className="text-base md:text-lg text-white/50 leading-relaxed">
            Eliminate cognitive overload when navigating unfamiliar open-source projects or enterprise codebases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Save Hours of Digging",
              description: "Stop manually opening dozens of nested files just to understand how state is managed or where API routes terminate.",
              icon: Clock
            },
            {
              title: "Understand Faster",
              description: "Grasp complex design patterns, system boundaries, and architectural dependencies in under 30 seconds.",
              icon: Zap
            },
            {
              title: "Ship Confidently",
              description: "Onboard junior engineers immediately and make high-impact refactoring decisions with complete architectural context.",
              icon: Rocket
            }
          ].map((col, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-[#111113] border border-white/[0.06] flex flex-col items-start">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#8b8bee] mb-6">
                <col.icon size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{col.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{col.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 border-t border-white/[0.06] bg-black/40 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Loved by engineers and technical founders
            </h2>
            <p className="text-base text-white/50">
              See what developers say about generating instant codebase maps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "RepoMap AI saved me at least 3 days during our hackathon. I pasted a massive 5,000-file repository and instantly understood the module structure.",
                name: "Alex Rivera",
                role: "Senior Staff Software Engineer"
              },
              {
                quote: "The auto-generated Mermaid flowcharts are incredible. Being able to export the exact request lifecycle into SVG for our documentation is a superpower.",
                name: "Sarah Jenkins",
                role: "Lead Frontend Developer"
              },
              {
                quote: "It feels like having the original system architect sitting next to you explaining where every file belongs. A must-have for developer onboarding.",
                name: "David Chen",
                role: "VP of Engineering"
              }
            ].map((t, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-[#111113] border border-white/[0.06] flex flex-col justify-between gap-6">
                <p className="text-sm text-white/80 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#4d4da8] to-[#6b6bc6] flex items-center justify-center font-bold text-sm text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{t.name}</h4>
                    <span className="text-xs text-white/40">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-28 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-white/50">
            Everything you need to know about our analysis engine.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#111113] border border-white/[0.06] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left text-white font-medium text-base hover:text-[#8b8bee] transition-colors"
                >
                  <span>{faq.q}</span>
                  <div className={cn("w-6 h-6 rounded-full bg-white/[0.04] flex items-center justify-center transition-transform", isOpen && "rotate-180 bg-[#4d4da8]/20 text-[#8b8bee]")}>
                    <ChevronDown size={16} />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-6 pb-6 text-sm text-white/60 leading-relaxed border-t border-white/[0.04] pt-4 font-normal"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL HUGE CTA SECTION */}
      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-b from-[#111113] to-[#161426] border border-white/[0.1] p-12 md:p-20 text-center flex flex-col items-center justify-center overflow-hidden shadow-[0_0_100px_rgba(77,77,168,0.2)]">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#4d4da8]/30 rounded-full blur-3xl pointer-events-none" />
          
          <span className="text-xs font-mono uppercase tracking-widest text-[#8b8bee] px-3.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] mb-6 relative z-10">
            Start Exploring Immediately
          </span>
          
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 relative z-10 max-w-3xl">
            Ready to understand your next repository?
          </h2>
          
          <p className="text-base md:text-lg text-white/60 mb-10 relative z-10 max-w-xl">
            Paste any GitHub repository right now and receive an instant, AI-powered architectural summary in seconds.
          </p>

          <button
            onClick={scrollToInput}
            className="relative z-10 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#4d4da8] to-[#6b6bc6] text-white font-semibold text-lg hover:opacity-95 transition-all shadow-[0_0_35px_rgba(77,77,168,0.5)] active:scale-95 flex items-center gap-2"
          >
            <span>Analyze a Repository Now</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] bg-[#09090B] py-12 px-6 md:px-12 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#4d4da8] flex items-center justify-center text-white font-bold">
              <Command size={13} />
            </div>
            <span className="font-semibold text-white/80">RepoMap AI</span>
            <span>— Complete Codebase Mastery</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="#features" className="hover:text-white transition-colors">Documentation</a>
            <a href="#faq" className="hover:text-white transition-colors">Privacy</a>
            <a href="#faq" className="hover:text-white transition-colors">Terms</a>
          </div>

          <div className="flex items-center gap-1 font-mono">
            <span>Made with ❤️ for developers during the Hackathon.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
