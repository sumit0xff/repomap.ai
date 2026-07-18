"use client";

import { useState } from "react";
import { parseGithubUrl } from "@/lib/github-parser";
import { NormalizedGithubData } from "@/types/github";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<NormalizedGithubData | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (loading) return;

    setError(null);
    setSuccessData(null);
    setLoading(true);

    try {
      const { owner, repo } = parseGithubUrl(url);

      const response = await fetch("/api/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch repository data.");
      }

      setSuccessData(data);
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
      <main className="w-full max-w-xl flex-col items-center justify-center bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
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

          {successData && (
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 rounded-md text-sm border border-zinc-200 dark:border-zinc-700">
              <h2 className="font-bold text-lg mb-2 text-black dark:text-white">Debug Info</h2>
              <ul className="space-y-1">
                <li><span className="font-semibold">Repository:</span> {successData.repository.owner}/{successData.repository.repo}</li>
                <li><span className="font-semibold">Description:</span> {successData.repository.description || 'N/A'}</li>
                <li><span className="font-semibold">Stars:</span> {successData.repository.stars}</li>
                <li><span className="font-semibold">Forks:</span> {successData.repository.forks}</li>
                <li><span className="font-semibold">Languages:</span> {Object.keys(successData.repository.languages || {}).join(', ') || 'N/A'}</li>
                <li><span className="font-semibold">Total files:</span> {successData.tree.length}</li>
                <li>
                  <span className="font-semibold">Top-level folders: </span> 
                  {Array.from(new Set(successData.tree.map(n => n.path.split('/')[0]))).filter(p => !p.includes('.')).join(', ') || 'None'}
                </li>
              </ul>
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
