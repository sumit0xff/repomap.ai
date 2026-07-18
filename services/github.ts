import { NormalizedGithubData, NormalizedRepository, TreeNode } from "@/types/github";

const GITHUB_API_BASE = "https://api.github.com";

const getHeaders = () => {
  const headers: Record<string, string> = {
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "RepoMap-AI",
  };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
};

async function fetchFromGithub(endpoint: string): Promise<unknown> {
  const res = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    if (res.status === 404) throw new Error("Repository not found (404)");
    if (res.status === 403) throw new Error("GitHub API rate limit exceeded (403)");
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

const IGNORED_DIRS = new Set([
  "node_modules", ".next", "dist", "build", "coverage", ".cache", ".git", "vendor", "target", "bin", "obj"
]);

const IGNORED_EXTS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".ico", ".webp", ".mp4", ".mov", ".pdf", ".zip", ".exe", ".dll"
]);

const CONFIG_FILES = [
  "package.json", "README.md", "Dockerfile", "docker-compose.yml", "tsconfig.json", "requirements.txt",
  "Cargo.toml", "go.mod", "composer.json", "pom.xml"
];

const CONFIG_PATTERNS = [
  /^next\.config\..+$/,
  /^vite\.config\..+$/,
  /^eslint\.config\..+$/,
  /^tailwind\.config\..+$/,
];

function isConfigFile(filename: string): boolean {
  if (CONFIG_FILES.includes(filename)) return true;
  if (CONFIG_PATTERNS.some(pattern => pattern.test(filename))) return true;
  // Also treat .gitignore, .env.example etc as config
  if (filename.startsWith('.')) return true;
  return false;
}

function shouldKeepFile(path: string, type: string): boolean {
  const parts = path.split('/');
  const filename = parts[parts.length - 1];

  // Check if any parent dir is ignored
  for (const part of parts) {
    if (IGNORED_DIRS.has(part)) return false;
  }

  if (type === "blob") {
    // Check extension
    const extMatch = filename.match(/\.[0-9a-z]+$/i);
    if (extMatch && IGNORED_EXTS.has(extMatch[0].toLowerCase())) {
      return false;
    }
  }

  return true;
}

export async function fetchAndNormalizeRepository(owner: string, repo: string): Promise<NormalizedGithubData> {
  try {
    // Fetch repository metadata and languages concurrently
    const [repoData, languagesData] = await Promise.all([
      fetchFromGithub(`/repos/${owner}/${repo}`),
      fetchFromGithub(`/repos/${owner}/${repo}/languages`).catch(() => ({}))
    ]) as [Record<string, unknown>, Record<string, number>];

    const repository: NormalizedRepository = {
      owner: (repoData.owner as Record<string, string>).login,
      repo: repoData.name as string,
      description: (repoData.description as string) || null,
      homepage: (repoData.homepage as string) || null,
      stars: repoData.stargazers_count as number,
      forks: repoData.forks_count as number,
      language: (repoData.language as string) || null,
      languages: languagesData,
      license: (repoData.license as Record<string, string>)?.name || null,
      topics: (repoData.topics as string[]) || [],
      size: repoData.size as number,
      updatedAt: (repoData.updated_at as string) || null,
      defaultBranch: repoData.default_branch as string
    };

    // Fetch recursive tree
    const treeData = await fetchFromGithub(`/repos/${owner}/${repo}/git/trees/${repository.defaultBranch}?recursive=1`);
    
    const rawTree: unknown[] = (treeData as { tree?: unknown[] }).tree || [];
    
    // Filter out ignored files/dirs
    let filteredTree = rawTree
      .map(item => item as { path: string; type: string; size?: number; sha?: string })
      .filter(item => shouldKeepFile(item.path, item.type))
      .map(item => ({
        path: item.path,
        type: item.type === "tree" ? "tree" : "blob",
        size: item.size,
        sha: item.sha
      } as TreeNode));

    // Handle large repositories
    const MAX_TREE_SIZE = 2500;
    if (filteredTree.length > MAX_TREE_SIZE) {
      // Prioritize top-level directories, config files, and shallow source files
      filteredTree.sort((a, b) => {
        const aDepth = a.path.split('/').length;
        const bDepth = b.path.split('/').length;
        
        const aIsConfig = isConfigFile(a.path.split('/').pop() || "");
        const bIsConfig = isConfigFile(b.path.split('/').pop() || "");

        if (aIsConfig && !bIsConfig) return -1;
        if (!aIsConfig && bIsConfig) return 1;

        if (aDepth !== bDepth) return aDepth - bDepth; // Shallower first

        return a.path.localeCompare(b.path);
      });

      filteredTree = filteredTree.slice(0, MAX_TREE_SIZE);
      
      // Sort back by path for readability
      filteredTree.sort((a, b) => a.path.localeCompare(b.path));
    }

    return {
      repository,
      tree: filteredTree
    };

  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch repository data.");
    }
    throw new Error("Failed to fetch repository data.");
  }
}
