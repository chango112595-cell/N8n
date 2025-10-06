import Header from "@/components/Header";
import WebhookInfo from "@/components/WebhookInfo";
import ManualCommit from "@/components/ManualCommit";
import CommitHistory from "@/components/CommitHistory";
import { useQuery } from "@tanstack/react-query";
import type { Commit } from "@shared/schema";

export default function Home() {
  const { data: commits = [], isLoading } = useQuery<Commit[]>({
    queryKey: ["/api/commits"],
  });

  const formattedCommits = commits.map(commit => ({
    id: commit.id,
    commitMessage: commit.commitMessage,
    branch: commit.branch,
    filesChanged: commit.filesChanged,
    status: commit.status as "success" | "error" | "pending",
    createdAt: new Date(commit.createdAt),
    commitSha: commit.commitSha ?? undefined,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-6">
            <WebhookInfo />
            <ManualCommit />
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading commits...
              </div>
            ) : (
              <CommitHistory commits={formattedCommits} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
