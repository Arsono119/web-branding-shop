import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'Arsono119/web-branding-shop';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

const headers = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
};

function getContentPath(filename: string): string {
  return `src/content/${filename}`;
}

export async function readGitHubFile(filename: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${getContentPath(filename)}?ref=${GITHUB_BRANCH}`,
      { headers }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return Buffer.from(data.content, 'base64').toString('utf-8');
  } catch {
    return null;
  }
}

export async function writeGitHubFile(filename: string, content: string): Promise<boolean> {
  try {
    const path = getContentPath(filename);

    const resGet = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
      { headers }
    );

    if (!resGet.ok) return false;
    const fileData = await resGet.json();

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: `update: ${filename}`,
          content: Buffer.from(content).toString('base64'),
          sha: fileData.sha,
          branch: GITHUB_BRANCH,
        }),
      }
    );

    return res.ok;
  } catch {
    return false;
  }
}

// Local fallback for development / self-hosted
export function readLocalFile<T>(filename: string): T {
  const filePath = join(process.cwd(), 'src', 'content', filename);
  if (!existsSync(filePath)) return [] as unknown as T;
  return JSON.parse(readFileSync(filePath, 'utf-8')) as T;
}
