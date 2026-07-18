import OpenAI from "openai";
import { NormalizedGithubData } from "@/types/github";
import { RepositoryAnalysis } from "@/types/analysis";
import { buildAnalysisPrompt } from "./prompts";

export async function analyzeWithOpenAI(repositoryData: NormalizedGithubData): Promise<RepositoryAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key is missing. Please set OPENAI_API_KEY.");
  }

  const openai = new OpenAI({ apiKey });
  const prompt = buildAnalysisPrompt(repositoryData);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using mini for speed and cost, but can be configured
      messages: [
        {
          role: "system",
          content: "You are a senior software architect. Output ONLY valid JSON matching the schema provided."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "repository_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              summary: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  projectType: { type: "string" },
                  primaryLanguage: { type: "string" },
                  difficulty: { type: "string", enum: ["Beginner", "Intermediate", "Advanced"] }
                },
                required: ["title", "description", "projectType", "primaryLanguage", "difficulty"],
                additionalProperties: false
              },
              architecture: {
                type: "object",
                properties: {
                  overview: { type: "string" },
                  patterns: { type: "array", items: { type: "string" } },
                  importantDirectories: { type: "array", items: { type: "string" } }
                },
                required: ["overview", "patterns", "importantDirectories"],
                additionalProperties: false
              },
              folderExplanations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    folder: { type: "string" },
                    purpose: { type: "string" },
                    importance: { type: "string" }
                  },
                  required: ["folder", "purpose", "importance"],
                  additionalProperties: false
                }
              },
              beginnerGuide: {
                type: "object",
                properties: {
                  whereToStart: { type: "string" },
                  learningPath: { type: "array", items: { type: "string" } },
                  recommendedReadingOrder: { type: "array", items: { type: "string" } }
                },
                required: ["whereToStart", "learningPath", "recommendedReadingOrder"],
                additionalProperties: false
              },
              codeQuality: {
                type: "object",
                properties: {
                  strengths: { type: "array", items: { type: "string" } },
                  possibleIssues: { type: "array", items: { type: "string" } },
                  maintainabilityScore: { type: "number" }
                },
                required: ["strengths", "possibleIssues", "maintainabilityScore"],
                additionalProperties: false
              },
              readmeSuggestions: {
                type: "array",
                items: { type: "string" }
              },
              mermaidDiagram: { type: "string" }
            },
            required: [
              "summary",
              "architecture",
              "folderExplanations",
              "beginnerGuide",
              "codeQuality",
              "readmeSuggestions",
              "mermaidDiagram"
            ],
            additionalProperties: false
          }
        }
      },
      temperature: 0.1,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    return JSON.parse(content) as RepositoryAnalysis;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`AI Analysis failed: ${error.message}`);
    }
    throw new Error("AI Analysis failed due to an unknown error.");
  }
}
