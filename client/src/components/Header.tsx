import { Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  return (
    <header className="border-b h-16 flex items-center px-6" data-testid="header-main">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Github className="w-6 h-6" data-testid="icon-github" />
          <h1 className="text-xl font-semibold" data-testid="text-app-title">
            Aurora Changeset Manager
          </h1>
        </div>
        <Badge variant="outline" className="gap-2" data-testid="badge-connection-status">
          <div className="w-2 h-2 rounded-full bg-chart-2" data-testid="indicator-connected" />
          <span className="text-xs">Connected</span>
        </Badge>
      </div>
    </header>
  );
}
