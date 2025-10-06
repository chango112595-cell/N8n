import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Changeset } from "@shared/schema";

interface ManualCommitProps {
  onCommitSuccess?: () => void;
}

export default function ManualCommit({ onCommitSuccess }: ManualCommitProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!jsonInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a changeset JSON",
        variant: "destructive",
      });
      return;
    }

    let changeset: Changeset;
    try {
      changeset = JSON.parse(jsonInput);
    } catch (e) {
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/commits", changeset);

      toast({
        title: "Success",
        description: "Changeset committed successfully to GitHub",
      });
      
      setJsonInput("");
      await queryClient.invalidateQueries({ queryKey: ["/api/commits"] });
      onCommitSuccess?.();
    } catch (error) {
      toast({
        title: "Commit Failed",
        description: error instanceof Error ? error.message : "Failed to commit to GitHub",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card data-testid="card-manual-commit">
      <CardHeader>
        <CardTitle>Manual Commit</CardTitle>
        <CardDescription>Paste Aurora changeset JSON and commit to GitHub</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="changeset-input">Changeset JSON</Label>
          <Textarea
            id="changeset-input"
            placeholder='{"repo":"chango112595-cell/Aurora-x","branch":"main","commit_message":"chore: update","files":{"README.md":"content"}}'
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="font-mono text-sm min-h-48 resize-y"
            data-testid="input-changeset-json"
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
          data-testid="button-submit-commit"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Committing...
            </>
          ) : (
            "Commit to GitHub"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
