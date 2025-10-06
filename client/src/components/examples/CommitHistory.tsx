import CommitHistory from '../CommitHistory';

// todo: remove mock functionality
const mockCommits = [
  {
    id: "1",
    commitMessage: "chore: update README with new features",
    branch: "main",
    filesChanged: ["README.md"],
    status: "success" as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    commitSha: "a1b2c3d4e5f6g7h8i9j0",
  },
  {
    id: "2",
    commitMessage: "feat: add new Aurora integration",
    branch: "main",
    filesChanged: ["src/integrations/aurora.ts", "src/types/aurora.d.ts"],
    status: "success" as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    commitSha: "b2c3d4e5f6g7h8i9j0k1",
  },
  {
    id: "3",
    commitMessage: "fix: resolve authentication issue",
    branch: "develop",
    filesChanged: ["src/auth/index.ts"],
    status: "error" as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "4",
    commitMessage: "docs: update API documentation",
    branch: "main",
    filesChanged: ["docs/api.md", "docs/getting-started.md", "docs/examples.md"],
    status: "success" as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    commitSha: "c3d4e5f6g7h8i9j0k1l2",
  },
];

export default function CommitHistoryExample() {
  return <CommitHistory commits={mockCommits} />;
}
