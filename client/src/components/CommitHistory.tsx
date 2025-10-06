import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Commit {
  id: string;
  commitMessage: string;
  branch: string;
  filesChanged: string[];
  status: "success" | "error" | "pending";
  createdAt: Date;
  commitSha?: string;
}

interface CommitHistoryProps {
  commits: Commit[];
}

export default function CommitHistory({ commits }: CommitHistoryProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-chart-2" />;
      case "error":
        return <XCircle className="w-4 h-4 text-destructive" />;
      case "pending":
        return <Clock className="w-4 h-4 text-chart-3" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="outline" className="text-chart-2 border-chart-2/30 bg-chart-2/10" data-testid={`badge-status-success`}>Success</Badge>;
      case "error":
        return <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10" data-testid={`badge-status-error`}>Failed</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-chart-3 border-chart-3/30 bg-chart-3/10" data-testid={`badge-status-pending`}>Pending</Badge>;
      default:
        return null;
    }
  };

  if (commits.length === 0) {
    return (
      <Card data-testid="card-commit-history">
        <CardHeader>
          <CardTitle>Recent Commits</CardTitle>
          <CardDescription>View your latest commit activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground" data-testid="text-no-commits">
            <p>No commits yet</p>
            <p className="text-sm mt-1">Your commit history will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-commit-history">
      <CardHeader>
        <CardTitle>Recent Commits</CardTitle>
        <CardDescription>View your latest commit activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {commits.map((commit, index) => (
            <div
              key={commit.id}
              className="flex items-start gap-3 p-4 rounded-lg border hover-elevate"
              data-testid={`commit-item-${index}`}
            >
              <div className="mt-0.5">{getStatusIcon(commit.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-medium text-sm" data-testid={`text-commit-message-${index}`}>
                    {commit.commitMessage}
                  </p>
                  {getStatusBadge(commit.status)}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono" data-testid={`text-branch-${index}`}>{commit.branch}</span>
                  <span>•</span>
                  <span data-testid={`text-files-changed-${index}`}>
                    {commit.filesChanged.length} {commit.filesChanged.length === 1 ? "file" : "files"}
                  </span>
                  <span>•</span>
                  <span data-testid={`text-timestamp-${index}`}>
                    {formatDistanceToNow(commit.createdAt, { addSuffix: true })}
                  </span>
                </div>
                {commit.commitSha && (
                  <div className="mt-2">
                    <code className="text-xs font-mono text-muted-foreground" data-testid={`text-commit-sha-${index}`}>
                      {commit.commitSha.substring(0, 7)}
                    </code>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
