# Skill Name

**agent-status-reporter**

---

## Overview

Query Base44 entity data and generate a human-readable markdown status report on all active or recent **AgentRun** records.

Use this skill when you need a quick summary of what every coding agent is currently doing — including its assigned mission, the branch it is working on, its latest pull-request URL, and whether the run is still in progress, completed, or failed.

---

## Inputs

| Input | Type | Required | Default | Description |
|---|---|---|---|---|
| `status_filter` | `string` | No | *(none — returns all)* | Filter results to a specific run status. Accepted values: `"in_progress"`, `"completed"`, `"failed"` |

---

## Steps

Follow these steps in order to produce the status report:

1. **Fetch AgentRun records** — Query the Base44 `AgentRun` entity. If `status_filter` is provided, apply it as a `where` clause (e.g., `status == "in_progress"`). Retrieve all records if no filter is given.

2. **Handle empty results** — If the query returns zero records, skip to the Output Format section and emit the empty-state message instead of a table.

3. **Sort records** — Sort the results by `updated_at` descending so the most recently active runs appear first.

4. **Map each record** — For every `AgentRun` record extract the following fields:
   - `mission_title` — The human-readable name of the mission assigned to this agent.
   - `branch` — The Git branch the agent is working on.
   - `pr_url` — The URL of the pull request the agent opened (may be `null` if no PR has been created yet).
   - `status` — The current run status (`in_progress`, `completed`, or `failed`).

5. **Format status badge** — Convert the raw `status` value to an emoji badge for readability:
   - `in_progress` → 🔄 In Progress
   - `completed` → ✅ Completed
   - `failed` → ❌ Failed
   - *(unknown value)* → ⚪ Unknown

6. **Format PR link** — If `pr_url` is non-null, render it as a markdown hyperlink (`[View PR](url)`). If `pr_url` is `null`, render the string `—` (em dash).

7. **Assemble the report** — Produce the final markdown output using the Output Format template below.

8. **Return the report** — Output the completed markdown string as the skill's result.

---

## Output Format

Use this template exactly when generating the report:

```
## 🤖 Agent Status Report

_Generated: {timestamp}_
_Filter: {status_filter value, or "All statuses" if no filter was applied}_

| Mission | Branch | PR | Status |
|---|---|---|---|
| {mission_title} | `{branch}` | {pr_link} | {status_badge} |
| {mission_title} | `{branch}` | {pr_link} | {status_badge} |
```

**Sample output (populated):**

```
## 🤖 Agent Status Report

_Generated: 2026-05-05 10:30 UTC_
_Filter: All statuses_

| Mission | Branch | PR | Status |
|---|---|---|---|
| Create Agent Status Reporter skill | `feature/agent-status-reporter` | [View PR](https://github.com/org/repo/pull/42) | ✅ Completed |
| Build user authentication flow | `feature/auth-flow` | [View PR](https://github.com/org/repo/pull/39) | 🔄 In Progress |
| Fix checkout bug | `fix/checkout-total` | — | ❌ Failed |
```

**Empty-state output (no records found):**

```
## 🤖 Agent Status Report

_Generated: 2026-05-05 10:30 UTC_
_Filter: in_progress_

> No AgentRun records found matching the current filter.
```

---

## Notes

- **Empty state** — If the Base44 query returns no records (either because none exist or the filter matches nothing), output the empty-state template above. Do not return an error; an empty result is a valid state.
- **Missing fields** — If a record is missing `mission_title`, display `(untitled)`. If `branch` is missing, display `(no branch)`.
- **Query errors** — If the Base44 API call fails (network error, permission denied, etc.), output a single error line: `> ⚠️ Unable to retrieve AgentRun data: {error message}`. Do not partially render the report.
- **Unknown status values** — Treat any unrecognized `status` value as `⚪ Unknown` rather than throwing an error.
- **Timestamp** — Use UTC time for the generated timestamp. Format: `YYYY-MM-DD HH:MM UTC`.
- **Ordering** — Always sort by `updated_at` descending. If `updated_at` is unavailable, fall back to `created_at` descending.
