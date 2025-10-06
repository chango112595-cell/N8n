import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { changesetSchema } from "@shared/schema";
import { commitFilesToGitHub } from "./github";
import { createHmac } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/webhook/aurora/changeset", async (req, res) => {
    try {
      const payload = req.body;
      
      const validationResult = changesetSchema.safeParse(payload);
      if (!validationResult.success) {
        return res.status(400).json({ 
          ok: false, 
          error: "Invalid changeset format",
          details: validationResult.error.errors 
        });
      }

      const { repo, branch, commit_message, files, sig } = validationResult.data;

      const auroraSecret = process.env.AURORA_SECRET || process.env.Aurora_secret;
      if (auroraSecret && auroraSecret !== 'dev-skip') {
        const expectedSig = 'sha256=' + createHmac('sha256', auroraSecret)
          .update(JSON.stringify(payload))
          .digest('hex');
        
        if (sig !== expectedSig) {
          return res.status(401).json({ ok: false, error: "Invalid signature" });
        }
      }

      const commit = await storage.createCommit({
        commitMessage: commit_message,
        branch,
        filesChanged: Object.keys(files),
        status: "pending",
        errorMessage: null,
        commitSha: null,
      });

      try {
        const result = await commitFilesToGitHub(repo, branch, commit_message, files);
        
        await storage.updateCommit(commit.id, {
          status: "success",
          commitSha: result.sha,
        });

        res.json({ ok: true, commitId: commit.id, sha: result.sha });
      } catch (error) {
        await storage.updateCommit(commit.id, {
          status: "error",
          errorMessage: error instanceof Error ? error.message : "Unknown error",
        });

        throw error;
      }
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ 
        ok: false, 
        error: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  });

  app.post("/api/commits", async (req, res) => {
    try {
      const payload = req.body;
      
      const validationResult = changesetSchema.safeParse(payload);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid changeset format",
          details: validationResult.error.errors 
        });
      }

      const { repo, branch, commit_message, files } = validationResult.data;

      const commit = await storage.createCommit({
        commitMessage: commit_message,
        branch,
        filesChanged: Object.keys(files),
        status: "pending",
        errorMessage: null,
        commitSha: null,
      });

      try {
        const result = await commitFilesToGitHub(repo, branch, commit_message, files);
        
        const updatedCommit = await storage.updateCommit(commit.id, {
          status: "success",
          commitSha: result.sha,
        });

        res.json(updatedCommit);
      } catch (error) {
        await storage.updateCommit(commit.id, {
          status: "error",
          errorMessage: error instanceof Error ? error.message : "Unknown error",
        });

        throw error;
      }
    } catch (error) {
      console.error("Commit error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  });

  app.get("/api/commits", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const commits = await storage.getCommits(limit);
      res.json(commits);
    } catch (error) {
      console.error("Get commits error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
