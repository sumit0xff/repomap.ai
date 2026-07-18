import { NormalizedGithubData } from "@/types/github";

export function buildAnalysisPrompt(repositoryData: NormalizedGithubData): string {
  const { repository, tree } = repositoryData;

  const topLevelFolders = Array.from(new Set(tree.map(n => n.path.split('/')[0]))).filter(p => !p.includes('.'));
  const configFiles = tree.filter(n => n.path.includes('.')).map(n => n.path);
  const languages = Object.keys(repository.languages || {});

  return `
You are a senior software architect. Your task is to analyze a software repository and explain its architecture and structure for developers.

Repository Information:
- Name: ${repository.owner}/${repository.repo}
- Description: ${repository.description || 'N/A'}
- Primary Language: ${repository.language || 'N/A'}
- All Languages: ${languages.join(', ')}
- Default Branch: ${repository.defaultBranch}

Structure Overview:
- Top-level folders: ${topLevelFolders.join(', ')}
- Configuration files found: ${configFiles.slice(0, 30).join(', ')}
- Total tracked files (after filtering): ${tree.length}

File Tree (Truncated for relevance):
${tree.slice(0, 500).map(n => n.path).join('\n')}

Based on this information, provide a structured architectural analysis in JSON format exactly matching the schema.

Guidelines:
- Never invent files. Only reason from the supplied data.
- If information is missing, state it clearly.
- Provide a simple valid Mermaid flowchart representing the high-level architecture (e.g., App -> Components -> API).
- Estimate maintainability based on folder organization and configuration presence.
- Keep observations high-level. Do not invent bugs or vulnerabilities.
- Return ONLY valid JSON.
`;
}
