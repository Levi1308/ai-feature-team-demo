# ai-feature-team-demo
AI Feature Team Lead — demo repo for Superagent workflow with ClickUp and GitHub

## Running the Server

```bash
node server.js
# Server running on http://localhost:3000
```

The default port is **3000**. Set the `PORT` environment variable to override it.

## Endpoints

| Method | Path      | Description              | Response                                          |
|--------|-----------|--------------------------|---------------------------------------------------|
| GET    | `/`       | Root                     | `{"message":"AI Feature Team Demo"}`              |
| GET    | `/health` | Liveness health check    | `{"status":"ok","timestamp":"<ISO 8601>"}`        |

### Health Check

```bash
curl http://localhost:3000/health
# {"status":"ok","timestamp":"2026-05-05T11:11:58.658Z"}
```
