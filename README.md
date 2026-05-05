# ai-feature-team-demo
AI Feature Team Lead — demo repo for Superagent workflow with ClickUp and GitHub

## Running the server

```bash
node server.js
# Server listening on http://localhost:3000
```

The default port is **3000**. Override with the `PORT` environment variable:

```bash
PORT=8080 node server.js
```

## Endpoints

| Method | Path      | Response                                          |
|--------|-----------|---------------------------------------------------|
| GET    | `/`       | `{"message":"AI Feature Team Demo"}`              |
| GET    | `/health` | `{"status":"ok","timestamp":"<ISO 8601 string>"}` |

### Health check

```bash
curl http://localhost:3000/health
# {"status":"ok","timestamp":"2026-05-05T11:12:18.604Z"}
```

Returns HTTP 200 with a JSON body containing `status` and an ISO 8601 `timestamp`. Use this endpoint as a liveness probe to verify the server is running.
