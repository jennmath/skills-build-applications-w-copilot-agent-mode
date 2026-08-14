# OctoFit Tracker — Backend (Codespaces & Localhost)

This file documents how the backend builds its API base URL and how to test the API from GitHub Codespaces and from localhost.

Summary
- Backend default port: 8000
- Codespaces base URL (when CODESPACE_NAME is set): `https://$CODESPACE_NAME-8000.app.github.dev`
- Localhost fallback (when CODESPACE_NAME is not set): `http://localhost:8000`

How the base URL is chosen
- The server reads the environment variable `CODESPACE_NAME` and constructs the base URL as `https://$CODESPACE_NAME-8000.app.github.dev` when present.
- If `CODESPACE_NAME` is not present, the server falls back to `http://localhost:8000`.
- See the implementation in [server.ts](/workspaces/skills-build-applications-w-copilot-agent-mode/octofit-tracker/backend/src/server.ts).

Important environment variables
- `PORT` — optional; defaults to `8000`.
- `CODESPACE_NAME` — set automatically by GitHub Codespaces. When set, the server builds the Codespaces-hosted URL as described above.
- `MONGODB_URI` — MongoDB connection string; defaults to `mongodb://localhost:27017/octofit_db`.

Ports and visibility
- Backend (API): 8000 (public in Codespaces setup)
- Frontend (Vite dev): 5173 (public in Codespaces setup)
- MongoDB: 27017 (private)

The repository's devcontainer/post_start.sh already includes gh cs ports visibility commands to expose ports 8000 and 5173 and keep 27017 private.

Run the backend
- Install dependencies (from repository root):
  npm ci --prefix octofit-tracker/backend

- Development (hot-run with tsx):
  npm --prefix octofit-tracker/backend run dev

- Production (build + start):
  npm --prefix octofit-tracker/backend run build
  npm --prefix octofit-tracker/backend start

Verify MongoDB
- Check if mongod is running on the host container:
  ps aux | grep mongod | grep -v grep || true
- By default the server connects to `mongodb://localhost:27017/octofit_db` unless `MONGODB_URI` is set.

Testing the API
- Health endpoint (shows effective baseUrl and codespaceName):

  # From localhost (no Codespaces name set)
  curl -sS http://localhost:8000/api/health | jq .

  # From a Codespace (example)
  export CODESPACE_NAME=your-codespace-name
  curl -sS https://$CODESPACE_NAME-8000.app.github.dev/api/health | jq .

- Example resources to verify:
  curl -sS http://localhost:8000/api/users | jq .
  curl -sS http://localhost:8000/api/activities | jq .

  # From Codespaces-hosted URL (when CODESPACE_NAME is set):
  curl -sS https://$CODESPACE_NAME-8000.app.github.dev/api/users | jq .
  curl -sS https://$CODESPACE_NAME-8000.app.github.dev/api/activities | jq .

Frontend note
- The frontend should use a Vite environment variable (for example `VITE_CODESPACE_NAME`) to apply the same pattern when constructing its API base URL.
- See the frontend README for details: [frontend README](/workspaces/skills-build-applications-w-copilot-agent-mode/octofit-tracker/frontend/README.md)

If any changes are desired (for example, exposing an /api/config endpoint that returns the computed API base URL for clients), say which approach is preferred and it can be added.
