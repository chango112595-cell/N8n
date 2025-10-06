import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WebhookInfo() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const webhookUrl = `${window.location.origin}/api/webhook/aurora/changeset`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Webhook URL has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card data-testid="card-webhook-info">
      <CardHeader>
        <CardTitle>Webhook Endpoint</CardTitle>
        <CardDescription>Use this URL to receive Aurora changesets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <code className="flex-1 text-sm font-mono bg-muted px-3 py-2 rounded-md overflow-x-auto" data-testid="text-webhook-url">
            {webhookUrl}
          </code>
          <Button
            size="icon"
            variant="outline"
            onClick={handleCopy}
            data-testid="button-copy-url"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        
        <div className="pt-2">
          <p className="text-sm text-muted-foreground mb-2">Example payload:</p>
          <pre className="text-xs font-mono bg-muted p-3 rounded-md overflow-x-auto" data-testid="text-example-payload">
{`{
  "repo": "chango112595-cell/Aurora-x",
  "branch": "main",
  "commit_message": "chore: update from Aurora",
  "files": {
    "README.md": "# Hello from Aurora"
  }
}`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
