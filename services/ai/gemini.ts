import { GoogleGenAI } from "@google/genai";
import { NormalizedGithubData } from "@/types/github";
import { RepositoryAnalysis } from "@/types/analysis";
import { buildAnalysisPrompt } from "./prompts";

export async function analyzeWithGemini(repositoryData: NormalizedGithubData): Promise<RepositoryAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please set GEMINI_API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildAnalysisPrompt(repositoryData);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a senior software architect. Output ONLY valid JSON matching the schema provided.",
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            summary: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING" },
                description: { type: "STRING" },
                projectType: { type: "STRING" },
                primaryLanguage: { type: "STRING" },
                difficulty: { type: "STRING" }
              },
              required: ["title", "description", "projectType", "primaryLanguage", "difficulty"]
            },
            architecture: {
              type: "OBJECT",
              properties: {
                overview: { type: "STRING" },
                patterns: { type: "ARRAY", items: { type: "STRING" } },
                importantDirectories: { type: "ARRAY", items: { type: "STRING" } }
              },
              required: ["overview", "patterns", "importantDirectories"]
            },
            folderExplanations: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  folder: { type: "STRING" },
                  purpose: { type: "STRING" },
                  importance: { type: "STRING" }
                },
                required: ["folder", "purpose", "importance"]
              }
            },
            beginnerGuide: {
              type: "OBJECT",
              properties: {
                whereToStart: { type: "STRING" },
                learningPath: { type: "ARRAY", items: { type: "STRING" } },
                recommendedReadingOrder: { type: "ARRAY", items: { type: "STRING" } }
              },
              required: ["whereToStart", "learningPath", "recommendedReadingOrder"]
            },
            codeQuality: {
              type: "OBJECT",
              properties: {
                strengths: { type: "ARRAY", items: { type: "STRING" } },
                possibleIssues: { type: "ARRAY", items: { type: "STRING" } },
                maintainabilityScore: { type: "NUMBER" }
              },
              required: ["strengths", "possibleIssues", "maintainabilityScore"]
            },
            readmeSuggestions: {
              type: "ARRAY",
              items: { type: "STRING" }
            },
            mermaidDiagram: { type: "STRING" }
          },
          required: [
            "summary",
            "architecture",
            "folderExplanations",
            "beginnerGuide",
            "codeQuality",
            "readmeSuggestions",
            "mermaidDiagram"
          ]
        },
        temperature: 0.1,
      }
    });

    const content = response.text;
    if (!content) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(content) as RepositoryAnalysis;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`AI Analysis failed: ${error.message}`);
    }
    throw new Error("AI Analysis failed due to an unknown error.");
  }
}
