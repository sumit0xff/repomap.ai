"use client";

import { useState } from "react";
import { parseGithubUrl } from "@/lib/github-parser";
import { RepositoryAnalysis } from "@/types/analysis";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<RepositoryAnalysis | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (loading) return;

    setError(null);
    setAnalysisData(null);
    setLoading(true);

    try {
      const { owner, repo } = parseGithubUrl(url);

      // 1. Fetch normalized repository data
      const githubRes = await fetch("/api/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo }),
      });

      const githubData = await githubRes.json();

      if (!githubRes.ok || !githubData.success) {
        throw new Error(githubData.error || "Failed to fetch repository data.");
      }

      // 2. Perform AI analysis
      const aiRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(githubData),
      });

      const aiData = await aiRes.json();

      if (!aiRes.ok || !aiData.success) {
        throw new Error(aiData.error || "Failed to analyze repository.");
      }

      setAnalysisData(aiData.analysis);
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

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="w-full max-w-2xl flex-col items-center justify-center bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col items-center gap-6 text-center mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            RepoMap AI
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Paste a public GitHub repository URL to instantly generate an AI-powered explanation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://github.com/owner/repo"
            className="w-full h-12 px-4 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-50 transition-all"
            disabled={loading}
          />
          
          {error && (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          )}

          {analysisData && (
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 rounded-md text-sm border border-zinc-200 dark:border-zinc-700 overflow-x-auto max-h-[400px] overflow-y-auto">
              <h2 className="font-bold text-lg mb-2 text-black dark:text-white">Raw Analysis Output (Debug)</h2>
              <pre className="text-xs">
                {JSON.stringify(analysisData, null, 2)}
              </pre>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 flex items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black font-medium transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>
      </main>
    </div>
  );
}
