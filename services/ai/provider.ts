import { NormalizedGithubData } from "@/types/github";
import { RepositoryAnalysis } from "@/types/analysis";
import { analyzeWithGemini } from "./gemini";

export async function analyzeRepository(repositoryData: NormalizedGithubData): Promise<RepositoryAnalysis> {
  // In the future, we can switch providers based on config or env variables.
  // For now, we always use Gemini.
  return analyzeWithGemini(repositoryData);
}
