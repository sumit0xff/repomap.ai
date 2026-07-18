export interface GithubRepoInfo {
  owner: string;
  repo: string;
  normalizedUrl: string;
}

export function parseGithubUrl(url: string): GithubRepoInfo {
  if (!url || url.trim() === '') {
    throw new Error('Please enter a GitHub repository URL.');
  }

  const trimmedUrl = url.trim();
  
  // Basic sanity check to prevent non-GitHub URLs early
  if (trimmedUrl.length > 0 && !trimmedUrl.includes('github.com')) {
    throw new Error('Invalid GitHub repository.');
  }

  let parseableUrl = trimmedUrl;
  
  // Add protocol if missing so URL constructor works
  if (!/^https?:\/\//i.test(parseableUrl)) {
    parseableUrl = 'https://' + parseableUrl;
  }

  try {
    const parsedUrl = new URL(parseableUrl);

    if (parsedUrl.hostname !== 'github.com' && parsedUrl.hostname !== 'www.github.com') {
      throw new Error('Invalid GitHub repository.');
    }

    // Split path into parts, filtering out empty strings (e.g., from trailing slashes)
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);

    if (pathParts.length < 2) {
      if (pathParts.length === 1) {
        throw new Error('Repository URL is incomplete.');
      } else {
        throw new Error('Invalid GitHub repository.');
      }
    }

    const owner = pathParts[0];
    const repo = pathParts[1].replace(/\.git$/, '');

    return {
      owner,
      repo,
      normalizedUrl: `https://github.com/${owner}/${repo}`
    };
  } catch (error) {
    if (error instanceof Error && error.message !== 'Invalid URL') {
       throw error;
    }
    throw new Error('Invalid GitHub repository.');
  }
}
