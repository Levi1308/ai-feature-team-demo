#!/usr/bin/env node
/**
 * launch-copilot-agent.mjs
 *
 * Standalone script to assign a GitHub issue to the GitHub Copilot coding agent
 * via the GraphQL API with the required "issues_copilot_assignment_api_support" header.
 *
 * Usage:
 *   node scripts/launch-copilot-agent.mjs \
 *     --owner Levi1308 \
 *     --repo ai-feature-team-demo \
 *     --issue 1 \
 *     --base-branch main \
 *     --token-env COPILOT_ASSIGN_PAT
 *
 * The token is read from the environment variable named by --token-env.
 * It is NEVER printed to stdout or stderr.
 *
 * Safety guarantees:
 *   - Does NOT merge anything
 *   - Does NOT deploy anything
 *   - Does NOT change repository settings
 *   - Does NOT print the token
 *   - Does NOT commit or push anything
 */

import { parseArgs } from "node:util";
import https from "node:https";

// ── Arg parsing ──────────────────────────────────────────────────────────────

const { values: args } = parseArgs({
  options: {
    owner:       { type: "string", short: "o" },
    repo:        { type: "string", short: "r" },
    issue:       { type: "string", short: "i" },
    "base-branch": { type: "string", default: "main" },
    "token-env": { type: "string", default: "COPILOT_ASSIGN_PAT" },
    help:        { type: "boolean", short: "h", default: false },
  },
});

if (args.help || !args.owner || !args.repo || !args.issue) {
  console.log(`
Usage:
  node scripts/launch-copilot-agent.mjs \\
    --owner <github-owner> \\
    --repo  <repo-name> \\
    --issue <issue-number> \\
    [--base-branch <branch>] \\
    [--token-env <ENV_VAR_NAME>]

Environment:
  The token must be set as an environment variable (default: COPILOT_ASSIGN_PAT).
  Never pass the token as a CLI argument.

Example:
  COPILOT_ASSIGN_PAT=ghp_xxx node scripts/launch-copilot-agent.mjs \\
    --owner Levi1308 --repo ai-feature-team-demo --issue 1
`);
  process.exit(args.help ? 0 : 1);
}

// ── Token retrieval (never printed) ─────────────────────────────────────────

const tokenEnvName = args["token-env"];
const token = process.env[tokenEnvName];

if (!token) {
  console.error(`❌ ERROR: Environment variable '${tokenEnvName}' is not set.`);
  console.error("");
  console.error("Set it before running:");
  console.error(`  export ${tokenEnvName}=<your-fine-grained-PAT>`);
  console.error("");
  console.error("Required PAT permissions:");
  console.error("  - Issues: Read & write");
  console.error("  - Pull requests: Read & write");
  console.error("  - Contents: Read & write");
  console.error("  - Metadata: Read-only");
  console.error("  - Copilot: Read & write (if available on your plan)");
  process.exit(1);
}

const OWNER      = args.owner;
const REPO       = args.repo;
const ISSUE_NUM  = parseInt(args.issue, 10);
const BASE_BRANCH = args["base-branch"];

console.log("═══════════════════════════════════════════════════════");
console.log("  GitHub Copilot Agent Launcher");
console.log("═══════════════════════════════════════════════════════");
console.log(`  Repo   : ${OWNER}/${REPO}`);
console.log(`  Issue  : #${ISSUE_NUM}`);
console.log(`  Branch : ${BASE_BRANCH}`);
console.log("═══════════════════════════════════════════════════════");

// ── GraphQL helper ───────────────────────────────────────────────────────────

function graphql(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query, variables });
    const options = {
      hostname: "api.github.com",
      path: "/graphql",
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,   // token not echoed
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        "User-Agent": "launch-copilot-agent/1.0",
        "GraphQL-Features": "issues_copilot_assignment_api_support",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.errors) {
            reject(new Error(JSON.stringify(parsed.errors, null, 2)));
          } else {
            resolve(parsed.data);
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ── REST helper ───────────────────────────────────────────────────────────────

function restGet(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path,
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "launch-copilot-agent/1.0",
      },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { reject(new Error(`Parse error: ${data}`)); }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // Step 1: Verify issue exists
  console.log(`\n[1/4] Verifying issue #${ISSUE_NUM} exists...`);
  const issueResp = await restGet(`/repos/${OWNER}/${REPO}/issues/${ISSUE_NUM}`);
  if (issueResp.status !== 200) {
    console.error(`❌ Issue #${ISSUE_NUM} not found (HTTP ${issueResp.status}).`);
    process.exit(1);
  }
  console.log(`     ✅ Found: "${issueResp.body.title}" (state: ${issueResp.body.state})`);
  if (issueResp.body.state !== "open") {
    console.warn(`     ⚠️  Issue is not open — Copilot may not start.`);
  }

  // Step 2: Find Copilot actor ID
  console.log(`\n[2/4] Looking up Copilot actor ID...`);
  const actorsData = await graphql(`
    query($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        suggestedActors(capabilities: [CAN_BE_ASSIGNED], first: 100) {
          nodes {
            login
            __typename
            ... on Bot { id }
            ... on User { id }
          }
        }
      }
    }
  `, { owner: OWNER, repo: REPO });

  const nodes = actorsData?.repository?.suggestedActors?.nodes ?? [];
  const copilotActor = nodes.find((n) => n.login.toLowerCase().includes("copilot"));

  if (!copilotActor) {
    console.error("❌ Copilot actor not found in suggestedActors.");
    console.error("   Available actors: " + nodes.map((n) => n.login).join(", "));
    console.error("");
    console.error("   Likely causes:");
    console.error("   1. Copilot coding agent not enabled on your account/plan.");
    console.error("      Required: GitHub Copilot Pro, Pro+, Business, or Enterprise.");
    console.error("   2. Copilot coding agent not enabled for this repository.");
    console.error("      Go to: https://github.com/settings/copilot");
    console.error("   3. PAT lacks necessary permissions.");
    process.exit(1);
  }
  console.log(`     ✅ Copilot actor found: ${copilotActor.login} (${copilotActor.__typename})`);

  // Step 3: Get issue node ID
  console.log(`\n[3/4] Retrieving issue node ID...`);
  const issueData = await graphql(`
    query($owner: String!, $repo: String!, $number: Int!) {
      repository(owner: $owner, name: $repo) {
        issue(number: $number) { id title }
      }
    }
  `, { owner: OWNER, repo: REPO, number: ISSUE_NUM });

  const issueNodeId = issueData?.repository?.issue?.id;
  if (!issueNodeId) {
    console.error("❌ Could not retrieve issue node ID.");
    process.exit(1);
  }
  console.log(`     ✅ Issue node ID retrieved.`);

  // Step 4: Assign Copilot via replaceActorsForAssignable
  console.log(`\n[4/4] Assigning Copilot to issue #${ISSUE_NUM}...`);
  const assignData = await graphql(`
    mutation($assignableId: ID!, $actorIds: [ID!]!) {
      replaceActorsForAssignable(input: {
        assignableId: $assignableId,
        actorIds: $actorIds
      }) {
        assignable {
          ... on Issue {
            id title url
            assignees(first: 10) {
              nodes { login }
            }
          }
        }
      }
    }
  `, {
    assignableId: issueNodeId,
    actorIds: [copilotActor.id],
  });

  const assignable = assignData?.replaceActorsForAssignable?.assignable;
  const assignees = assignable?.assignees?.nodes?.map((n) => n.login) ?? [];
  const issueUrl  = assignable?.url ?? `https://github.com/${OWNER}/${REPO}/issues/${ISSUE_NUM}`;

  const copilotAssigned = assignees.some((a) => a.toLowerCase().includes("copilot"));

  if (copilotAssigned) {
    console.log(`     ✅ SUCCESS! Copilot assigned.`);
  } else {
    console.warn(`     ⚠️  Mutation succeeded but Copilot not confirmed in assignees: [${assignees.join(", ")}]`);
    console.warn(`        Copilot may still start — check the issue page.`);
  }

  // Summary
  console.log("\n═══════════════════════════════════════════════════════");
  console.log("  ✅ Launch complete");
  console.log(`  Issue     : ${issueUrl}`);
  console.log(`  Assignees : ${assignees.join(", ") || "none confirmed"}`);
  console.log("");
  console.log("  Next steps:");
  console.log(`  1. Open: ${issueUrl}`);
  console.log(`  2. Confirm Copilot appears in the Assignees sidebar`);
  console.log(`  3. Copilot will open a PR in ~2–10 minutes`);
  console.log(`  4. PR will appear at: https://github.com/${OWNER}/${REPO}/pulls`);
  console.log("═══════════════════════════════════════════════════════");
  console.log("");
  console.log("SAFETY: Nothing was merged. Nothing was deployed. No secrets were printed.");
}

main().catch((err) => {
  console.error("\n❌ Unexpected error:");
  console.error(err.message ?? err);
  process.exit(1);
});
