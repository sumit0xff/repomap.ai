export interface NormalizedRepository {
  owner: string;
  repo: string;
  description: string | null;
  homepage: string | null;
  stars: number;
  forks: number;
  language: string | null;
  languages: Record<string, number>;
  license: string | null;
  topics: string[];
  size: number;
  updatedAt: string | null;
  defaultBranch: string;
}

export interface TreeNode {
  path: string;
  type: "blob" | "tree";
  size?: number;
  sha?: string;
}

export interface NormalizedGithubData {
  repository: NormalizedRepository;
  tree: TreeNode[];
}
