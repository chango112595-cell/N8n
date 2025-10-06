import { useState } from "react";
import Header from "@/components/Header";
import WebhookInfo from "@/components/WebhookInfo";
import ManualCommit from "@/components/ManualCommit";
import CommitHistory from "@/components/CommitHistory";

// todo: remove mock functionality
const initialMockCommits = [
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
];

export default function Home() {
  const [commits, setCommits] = useState(initialMockCommits);

  const handleCommitSuccess = () => {
    // todo: remove mock functionality - add real commit to history
    const newCommit = {
      id: String(Date.now()),
      commitMessage: "Manual commit from UI",
      branch: "main",
      filesChanged: ["example.txt"],
      status: "success" as const,
      createdAt: new Date(),
      commitSha: Math.random().toString(36).substring(2, 15),
    };
    setCommits([newCommit, ...commits]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-6">
            <WebhookInfo />
            <ManualCommit onCommitSuccess={handleCommitSuccess} />
            <CommitHistory commits={commits} />
          </div>
        </div>
      </main>
    </div>
  );
}
