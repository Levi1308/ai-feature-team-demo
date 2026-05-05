# GitHub Copilot Agent Launcher

Automates assigning a GitHub issue to the GitHub Copilot coding agent via GraphQL API, triggered from a GitHub Actions `workflow_dispatch`.

---

## Prerequisites

Before this workflow can run, you need:

1. **A GitHub Copilot plan** that includes the coding agent:
   - GitHub Copilot Pro, Pro+, Business, or Enterprise
   - Free/Basic Copilot does **not** include the coding agent

2. **Copilot coding agent enabled** for your account and repo:
   - Go to: https://github.com/settings/copilot
   - Enable "Copilot coding agent" (or "Coding agent" depending on UI)
   - Verify the agent is enabled for the target repository

3. **A fine-grained PAT** (see setup steps below)

---

## Setup Steps

### Step 1: Create a Fine-Grained Personal Access Token

1. Go to: https://github.com/settings/personal-access-tokens/new
2. Set **Token name**: `copilot-agent-launcher`
3. Set **Expiration**: 90 days (recommended; renew as needed)
4. Set **Resource owner**: your GitHub account (or org if applicable)
5. Under **Repository access**: select **Only select repositories** → choose `ai-feature-team-demo`
6. Under **Permissions**, set:

   | Permission       | Level           |
   |-----------------|-----------------|
   | Issues           | Read & write    |
   | Pull requests    | Read & write    |
   | Contents         | Read & write    |
   | Metadata         | Read-only *(auto-required)* |

   > **Note on "Copilot" permission:** Some account types show a "Copilot" permission in the PAT creator. If you see it, set it to **Read & write**. If you don't see it, the permissions above are sufficient for most plans. If assignment fails with a 403 or "not found in suggestedActors", a classic token with `repo` + `read:org` scope may be needed as a fallback (see Troubleshooting).

7. Click **Generate token**
8. **Copy the token immediately** — you cannot view it again after leaving the page

### Step 2: Store the Token as a Repository Secret

1. Go to your repo: https://github.com/Levi1308/ai-feature-team-demo
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `COPILOT_ASSIGN_PAT`
5. Paste the token value
6. Click **Add secret**

> ⚠️ **Never paste the token into chat, a file, or a commit. It lives only in GitHub Secrets.**

### Step 3: Verify the Workflow File Exists

After the PR for this feature is merged, the workflow will be at:
```
.github/workflows/launch-copilot-agent.yml
```

If it's not there, pull the branch or check the PR.

---

## How to Run the Workflow

1. Go to: https://github.com/Levi1308/ai-feature-team-demo/actions
2. Click **Launch Copilot Agent** in the left sidebar
3. Click **Run workflow**
4. Fill in the inputs:

   | Input | Description | Example |
   |---|---|---|
   | `issue_number` | Issue number to assign | `1` |
   | `target_repo` | Repo for Copilot to work in (leave blank = this repo) | `Levi1308/ai-feature-team-demo` |
   | `base_branch` | Branch to base PR on | `main` |
   | `custom_instructions` | Extra comment to post before assigning | *(leave blank or paste your prompt)* |

5. Click **Run workflow**

---

## How to Verify Copilot Started

After running the workflow:

1. **Check the workflow run** — all 11 steps should be green
2. **Open the issue**: https://github.com/Levi1308/ai-feature-team-demo/issues/1
   - Copilot should appear in the **Assignees** sidebar
   - A "session started" message may appear in the issue comments or timeline
3. **Wait 2–10 minutes** — Copilot creates a branch and opens a draft PR
4. **Check open PRs**: https://github.com/Levi1308/ai-feature-team-demo/pulls
   - Look for a PR from `copilot-swe-agent[bot]`

---

## How to Find the PR

After Copilot starts:
- Go to: https://github.com/Levi1308/ai-feature-team-demo/pulls
- Filter by **Open** PRs
- The PR author will be `copilot-swe-agent[bot]`
- The PR will be linked to Issue #1 (mentioned in the body)

---

## Test Plan for Issue #1

**Mission:** Create AI Website Builder Brief Creator skill  
**Issue:** https://github.com/Levi1308/ai-feature-team-demo/issues/1

### Pre-run checklist
- [ ] `COPILOT_ASSIGN_PAT` secret is set in repo secrets
- [ ] Copilot coding agent is enabled on your GitHub account
- [ ] Issue #1 is open and not already assigned to Copilot

### Run the workflow
- [ ] Go to Actions → Launch Copilot Agent → Run workflow
- [ ] Enter: `issue_number=1`, leave other fields as defaults
- [ ] Click Run workflow

### Verify
- [ ] Workflow run completes with all steps green (no red ❌)
- [ ] Step 3 ("Verify issue exists"): shows issue title
- [ ] Step 5 ("Look up Copilot bot actor ID"): shows "✅ Found Copilot actor"
- [ ] Step 7 ("Assign Copilot to issue"): shows "✅ SUCCESS"
- [ ] Issue #1 shows Copilot in Assignees sidebar
- [ ] PR appears within 10 minutes

### Expected PR
- Branch: `feature/ai-website-builder-brief-creator-skill` (or similar Copilot-generated name)
- File: `.agents/skills/ai-website-builder-brief-creator/SKILL.md`
- Author: `copilot-swe-agent[bot]`
- Status: Open, not merged

---

## Using the Standalone Script (Optional)

If you want to run the assignment locally without triggering Actions:

```bash
# Prerequisites: Node.js 18+
cd ai-feature-team-demo

# Set your token (never paste it into the command itself)
export COPILOT_ASSIGN_PAT=<your-token>

# Run the script
node scripts/launch-copilot-agent.mjs \
  --owner Levi1308 \
  --repo ai-feature-team-demo \
  --issue 1 \
  --base-branch main
```

---

## Troubleshooting

### ❌ "Copilot actor not found in suggestedActors"

**Cause:** One of:
1. Copilot coding agent is not enabled on your plan
2. Copilot coding agent is not enabled for this repository
3. PAT has insufficient permissions

**Fix:**
1. Go to https://github.com/settings/copilot — confirm coding agent is enabled
2. Ensure the repo is not excluded from Copilot usage
3. If using a fine-grained PAT, try a classic token with `repo` + `read:org` scopes as a fallback

### ❌ "Validation Failed" (HTTP 422)

**Cause:** Likely using `GITHUB_TOKEN` instead of the PAT, or wrong assignee format  
**Fix:** The workflow uses `COPILOT_ASSIGN_PAT` — verify the secret is set correctly

### ❌ GraphQL mutation errors ("Something went wrong")

**Cause:** PAT missing the `Copilot` permission scope, or token is a GitHub App token  
**Fix:** GitHub App tokens do NOT work for Copilot assignment — only PATs work. Recreate with correct permissions.

### ❌ Copilot assigned but no PR after 15 minutes

**Cause:** One of:
1. The issue doesn't have enough context for Copilot
2. Copilot hit a usage limit
3. Account plan doesn't include agentic mode

**Fix:** Check the issue comments — Copilot usually posts a message when it starts or if it encounters a blocker.

### Classic PAT fallback (if fine-grained fails)

If fine-grained PAT fails, create a **classic token** at https://github.com/settings/tokens with:
- `repo` (full control)
- `read:org`

Use the same secret name `COPILOT_ASSIGN_PAT`. Classic tokens have broader access — use only if necessary and rotate regularly.

---

## Rollback Instructions

This automation does only one reversible action: assigns an issue to Copilot.

### To undo the assignment:
1. Go to the issue on GitHub
2. Click the **X** next to Copilot in the Assignees sidebar
3. If Copilot has already opened a PR, close the PR (do not merge)
4. Delete the branch Copilot created if needed

### Nothing to roll back for the workflow itself:
- No files were changed by the workflow
- No code was merged
- No deployments were made
- No repository settings were changed

---

## Security Notes

- The `COPILOT_ASSIGN_PAT` is stored only in GitHub Secrets — never in files or logs
- The token is referenced as `${{ secrets.COPILOT_ASSIGN_PAT }}` — GitHub masks it in all logs
- Minimum permissions are requested — no admin, no org-wide access
- The `GITHUB_TOKEN` (auto-provided by Actions) is used only for posting comments, with `issues: write` scope
- The workflow does NOT merge, deploy, delete, or change settings

---

## Architecture Overview

```
[Superagent / You]
       │
       │  triggers workflow_dispatch
       ▼
[GitHub Actions: launch-copilot-agent.yml]
       │
       ├─ Step 1: Validate inputs
       ├─ Step 2: Verify PAT is configured
       ├─ Step 3: Resolve target repo
       ├─ Step 4: Verify issue exists (REST)
       ├─ Step 5: Post custom instructions (optional)
       ├─ Step 6: Look up Copilot actor ID (GraphQL)
       ├─ Step 7: Get issue node ID (GraphQL)
       ├─ Step 8: Assign Copilot (GraphQL mutation)
       ├─ Step 9: Verify assignment (REST)
       ├─ Step 10: Check for existing Copilot PRs
       └─ Step 11: Print summary
              │
              ▼
  [GitHub Copilot Coding Agent]
              │
              ▼
    Creates branch → Opens PR
```

---

## File Map

| File | Purpose |
|---|---|
| `.github/workflows/launch-copilot-agent.yml` | GitHub Actions workflow (manual trigger) |
| `scripts/launch-copilot-agent.mjs` | Standalone Node.js script (local use) |
| `docs/github-copilot-launcher.md` | This documentation |

---

*Maintained by: AI Feature Team Lead Superagent*  
*Last updated: 2026-05-05*
