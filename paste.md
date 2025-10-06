# 🧠 Aurora → n8n → GitHub → Replit Setup Guide

**Purpose:** Run n8n on Replit (free) so it auto-commits Aurora changesets to your GitHub repo.

---

### 🚀 Steps

1. **Environment Secrets**
   - Open the 🔒 “Secrets” tab in Replit.
   - Add:
     ```
     GITHUB_TOKEN = ghp_your_github_pat_here
     AURORA_SECRET = dev-skip
     ```
     > Use `dev-skip` for first tests; replace later with a strong secret.

2. **Install and start n8n**
   - Open the Shell and run:
     ```bash
     npm install -g n8n
     n8n
     ```
   - Wait until it says:  
     `n8n ready on port 5678`
   - Click **“Open in new tab.”**  
     You’ll see the n8n dashboard running at  
     `https://<your-repl-name>.<your-username>.repl.co`

3. **In the n8n Dashboard**
   - Create a **New Workflow**
   - Add a **Webhook node**
     - Method: `POST`
     - Path: `aurora/changeset`
   - Add a **GitHub node**
     - Operation: `Create or Update File`
     - Owner: `chango112595-cell`
     - Repository: `Aurora-x`
     - Branch: `main`
     - Commit Message: `chore: test commit from n8n`
     - File Path: `README.md`
     - File Content: `# Aurora-X\n\nTest commit from n8n running on Replit`
   - Connect **Webhook → GitHub**
   - Save and click **Activate**

4. **Test the Webhook**
   - In Replit’s Shell, run:
     ```bash
     curl -X POST https://<your-repl-name>.<your-username>.repl.co/webhook/aurora/changeset \
       -H 'Content-Type: application/json' \
       -d '{
         "repo":"chango112595-cell/Aurora-x",
         "branch":"main",
         "base":"main",
         "commit_message":"chore: Replit n8n test",
         "files":{"README.md":"Hello from Replit n8n!"},
         "sig":"sha256=dev"
       }'
     ```
   - You should see `{ ok: true }`  
     → check your GitHub repo, new commit should appear.

5. **Optional**
   - Replace `AURORA_SECRET` with a real secret.
   - Use the larger JSON workflow if you want multi-file commits or PRs.
   - Add `.replit` file in Aurora repo to auto-pull latest commits on startup:
     ```ini
     run = "bash -lc 'git pull --ff-only || true; make run'"
     onBoot = "bash -lc 'git pull --ff-only || true'"
     ```

---

### ✅ You’re Done

Now, whenever Aurora (in this chat) outputs a “changeset JSON,”  
paste it into the `curl` command and it will automatically commit to your GitHub repo.
