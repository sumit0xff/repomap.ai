"use client";

import { useState } from "react";
import { parseGithubUrl, GithubRepoInfo } from "@/lib/github-parser";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<GithubRepoInfo | null>(null);

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
        throw new Error(data.error || "Failed to parse repository.");
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
            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md text-sm border border-green-200 dark:border-green-900/50">
              <p>Successfully parsed!</p>
              <p>Owner: {successData.owner}</p>
              <p>Repo: {successData.repo}</p>
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
