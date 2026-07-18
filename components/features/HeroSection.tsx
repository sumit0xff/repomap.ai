"use client";

import { NormalizedRepository } from "@/types/github";
import { Star, GitFork, Globe, Clock, GitBranch, ExternalLink } from "lucide-react";

interface HeroSectionProps {
  repository: NormalizedRepository;
}

export default function HeroSection({ repository }: HeroSectionProps) {
  const formattedDate = repository.updatedAt 
    ? new Date(repository.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Unknown';

  return (
    <div className="flex flex-col gap-6 py-8 border-b border-white/[0.06]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center p-3 shadow-sm">
            <GitBranch className="w-full h-full text-white/80" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-white">
                {repository.owner} <span className="text-white/40">/</span> {repository.repo}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.05] text-white/70 border border-white/[0.08]">
                Public
              </span>
            </div>
            <a 
              href={repository.homepage || `https://github.com/${repository.owner}/${repository.repo}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-[#4d4da8] hover:text-[#5e5eb8] flex items-center gap-1.5 mt-1 transition-colors w-fit"
            >
              {repository.homepage ? new URL(repository.homepage).hostname : 'github.com'}
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      <p className="text-lg text-white/65 max-w-3xl leading-relaxed">
        {repository.description || "No description provided for this repository."}
      </p>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/50">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#4d4da8]" />
          <span className="font-medium text-white/80">{repository.language || "Unknown"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Star size={16} className="text-white/40" />
          <span>{repository.stars.toLocaleString()} stars</span>
        </div>
        <div className="flex items-center gap-1.5">
          <GitFork size={16} className="text-white/40" />
          <span>{repository.forks.toLocaleString()} forks</span>
        </div>
        {repository.license && (
          <div className="flex items-center gap-1.5">
            <Globe size={16} className="text-white/40" />
            <span>{repository.license}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Clock size={16} className="text-white/40" />
          <span>Updated {formattedDate}</span>
        </div>
      </div>
      
      {repository.topics && repository.topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {repository.topics.map(topic => (
            <span key={topic} className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#111113] text-white/60 border border-white/[0.06]">
              {topic}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
