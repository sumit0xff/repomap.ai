export interface RepositoryAnalysis {
  summary: {
    title: string;
    description: string;
    projectType: string;
    primaryLanguage: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
  };
  architecture: {
    overview: string;
    patterns: string[];
    importantDirectories: string[];
  };
  folderExplanations: {
    folder: string;
    purpose: string;
    importance: string;
  }[];
  beginnerGuide: {
    whereToStart: string;
    learningPath: string[];
    recommendedReadingOrder: string[];
  };
  codeQuality: {
    strengths: string[];
    possibleIssues: string[];
    maintainabilityScore: number;
  };
  readmeSuggestions: string[];
  mermaidDiagram: string;
}
