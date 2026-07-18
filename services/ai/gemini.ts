import { GoogleGenAI, Type } from "@google/genai";
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
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        systemInstruction: "You are a senior software architect. Output ONLY valid JSON matching the schema provided.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                projectType: { type: Type.STRING },
                primaryLanguage: { type: Type.STRING },
                difficulty: { type: Type.STRING }
              },
              required: ["title", "description", "projectType", "primaryLanguage", "difficulty"]
            },
            architecture: {
              type: Type.OBJECT,
              properties: {
                overview: { type: Type.STRING },
                patterns: { type: Type.ARRAY, items: { type: Type.STRING } },
                importantDirectories: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["overview", "patterns", "importantDirectories"]
            },
            folderExplanations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  folder: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  importance: { type: Type.STRING }
                },
                required: ["folder", "purpose", "importance"]
              }
            },
            beginnerGuide: {
              type: Type.OBJECT,
              properties: {
                whereToStart: { type: Type.STRING },
                learningPath: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendedReadingOrder: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["whereToStart", "learningPath", "recommendedReadingOrder"]
            },
            codeQuality: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                possibleIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
                maintainabilityScore: { type: Type.NUMBER }
              },
              required: ["strengths", "possibleIssues", "maintainabilityScore"]
            },
            readmeSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            mermaidDiagram: { type: Type.STRING }
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
