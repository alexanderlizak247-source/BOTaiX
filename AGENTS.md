# Guide for AI assistants

Cinima Private Gallery: a dependency-free Node.js server plus a vanilla browser app. No build step, no test suite.

## Layout
- `src/server.js` – ESM static server, `GET /api/config`, `POST /api/chat` (providers: `openai`, `anthropic`, `xai`).
- `public/index.html`, `public/styles.css`, `public/app.js` – UI, scenes, companions, chat, scene studio, IndexedDB media library.
- `README.md` – setup, env vars, Chat API and privacy notes.

## Commands
- Run: `npm start` (use `npm.cmd` in Windows PowerShell; `npm.ps1` is blocked).
- Verify: `npm run check` (syntax check of both JS files). Run it after every change.

## Rules
- No new dependencies; keep server and browser code plain JS.
- API keys stay server-side. `/api/config` must never return keys or URLs.
- External AI is opt-in from the UI; keep the server limits (12 messages, 2000 chars each, 8000 total, 16 KiB body, 25 s timeout).
- Provider env vars: `OPENAI_*`, `ANTHROPIC_*`, `XAI_*` (`_API_KEY`, `_API_URL`, `_MODEL`) and `CHAT_PROVIDER`. Legacy `CHAT_API_*` maps to xAI.
- Add a new provider by extending `providerDefinitions` and the request/reply adapters in `src/server.js`, then the README.
- Keep UI accessible (labels, `aria-live` status) and update the README when behavior changes.

## Working in parallel
- Pull latest and touch only the files your task needs; avoid reformatting unrelated code.
- Don't commit secrets, install global tools, or push without the owner's approval.
- "gump" is not part of this repo (it's an external KODA worker); don't try to run it here.
