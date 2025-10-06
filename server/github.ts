import { Octokit } from '@octokit/rest';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

export async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

export async function commitFilesToGitHub(
  repo: string,
  branch: string,
  commitMessage: string,
  files: Record<string, string>
): Promise<{ sha: string }> {
  const octokit = await getUncachableGitHubClient();
  
  const [owner, repoName] = repo.split('/');
  if (!owner || !repoName) {
    throw new Error('Invalid repo format. Expected: owner/repo');
  }

  const { data: refData } = await octokit.git.getRef({
    owner,
    repo: repoName,
    ref: `heads/${branch}`,
  });

  const currentCommitSha = refData.object.sha;

  const { data: commitData } = await octokit.git.getCommit({
    owner,
    repo: repoName,
    commit_sha: currentCommitSha,
  });

  const baseTreeSha = commitData.tree.sha;

  const tree = await Promise.all(
    Object.entries(files).map(async ([path, content]) => ({
      path,
      mode: '100644' as const,
      type: 'blob' as const,
      content,
    }))
  );

  const { data: newTree } = await octokit.git.createTree({
    owner,
    repo: repoName,
    base_tree: baseTreeSha,
    tree,
  });

  const { data: newCommit } = await octokit.git.createCommit({
    owner,
    repo: repoName,
    message: commitMessage,
    tree: newTree.sha,
    parents: [currentCommitSha],
  });

  await octokit.git.updateRef({
    owner,
    repo: repoName,
    ref: `heads/${branch}`,
    sha: newCommit.sha,
  });

  return { sha: newCommit.sha };
}
