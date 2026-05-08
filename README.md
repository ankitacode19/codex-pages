# CodeLab — Online Code Editor & Runner

A full-stack VS Code-style browser IDE with real code execution, snippet saving, and shareable links.

```
Frontend: React + Vite + Tailwind CSS + Monaco Editor
Backend:  Node.js + Express
Execution: Judge0 (via RapidAPI)
Database:  Supabase (PostgreSQL + Auth)
Deploy:    Vercel (frontend) + Render (backend)
```

---

## Features

- **Monaco Editor** — VS Code-quality editor with syntax highlighting for JS, Python, C++, Java, C, TypeScript, Rust, Go
- **Live code execution** — Run code via Judge0 with stdin support, stdout/stderr output, execution time & memory
- **Dark / light theme** — Persistent toggle
- **Drag-to-resize** — Adjustable editor / output split pane
- **Auth** — Supabase email+password and Google OAuth
- **Snippet management** — Save, load, edit, delete snippets with a sidebar
- **Shareable links** — Public read-only view for any saved snippet
- **Keyboard shortcuts** — `⌘ Enter` to run, `⌘ S` to save
- **Demo mode** — Works without API keys (mocked execution output)

---

## Project Structure

```
codelab/
├── package.json              ← root scripts (runs both services)
├── supabase_schema.sql       ← DB schema to run in Supabase
├── .gitignore
│
├── backend/
│   ├── package.json
│   ├── nodemon.json
│   ├── render.yaml           ← Render deployment config
│   ├── .env.example
│   └── src/
│       ├── index.js          ← Express app entry
│       ├── routes/
│       │   ├── code.js       ← POST /run
│       │   └── snippets.js   ← CRUD /save /snippets /snippet/:id
│       ├── middleware/
│       │   └── auth.js       ← JWT verification via Supabase
│       └── services/
│           └── supabase.js   ← Supabase admin client
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── vercel.json           ← Vercel deployment config
    ├── .env.example
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   ├── Editor.jsx        ← Monaco wrapper
        │   ├── OutputPanel.jsx   ← stdout/stderr/stdin tabs
        │   ├── AuthModal.jsx     ← sign-in / sign-up
        │   └── ShareModal.jsx
        ├── pages/
        │   ├── EditorPage.jsx    ← main IDE view
        │   ├── SnippetPage.jsx   ← public read-only view
        │   └── NotFoundPage.jsx
        ├── context/
        │   ├── AuthContext.jsx
        │   └── ThemeContext.jsx
        ├── hooks/
        │   ├── useSnippets.js
        │   └── useLocalStorage.js
        ├── services/
        │   ├── api.js            ← Axios calls to backend
        │   └── supabase.js       ← Supabase browser client
        └── utils/
            └── languages.js      ← language list + default code
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- npm 9+
- A free [RapidAPI](https://rapidapi.com) account (for Judge0)
- A free [Supabase](https://supabase.com) project

---

### Step 1 — Clone and install

```bash
git clone https://github.com/your-username/codelab.git
cd codelab

# Install root dev tools
npm install

# Install backend + frontend deps
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

---

### Step 2 — Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
# Judge0 — https://rapidapi.com/judge0-official/api/judge0-ce
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key_here
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com

# Supabase — Project Settings > API > service_role key (keep secret!)
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

> **Note:** If you skip `JUDGE0_API_KEY`, the app runs in Demo Mode — it returns fake output so you can develop the UI without an API key.

---

### Step 3 — Configure the frontend

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001

# Supabase — Project Settings > API > anon/public key (safe to expose)
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Note:** If you skip Supabase keys, auth and snippet saving are disabled. The editor and code execution still work.

---

### Step 4 — Set up Supabase database

1. Go to [supabase.com](https://supabase.com) → your project → **SQL Editor**
2. Paste the entire contents of `supabase_schema.sql`
3. Click **Run**

This creates the `snippets` table with RLS policies.

**Enable Google OAuth (optional):**

1. Supabase Dashboard → Authentication → Providers → Google
2. Add your Google OAuth client ID and secret
3. Set the redirect URL in your Google Cloud Console to:
   `https://xxxxxxxxxxxx.supabase.co/auth/v1/callback`

---



1. Go to [RapidAPI — Judge0 CE](https://rapidapi.com/judge0-official/api/judge0-ce)
2. Click **Subscribe to Test** (free tier: 50 req/day)
3. Copy your `X-RapidAPI-Key` from the code examples panel
4. Paste it into `backend/.env` as `JUDGE0_API_KEY`

---

### Step 6 — Run locally

From the project root:

```bash
npm run dev
```

This starts both services concurrently:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

Or run them separately:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

---

## API Reference

All routes are on the backend (`http://localhost:3001`).

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/run` | No | Execute code via Judge0 |
| `POST` | `/save` | ✅ Bearer token | Save a snippet |
| `GET` | `/snippets` | ✅ Bearer token | List user's snippets |
| `GET` | `/snippet/:id` | No | Get a single snippet (public) |
| `PUT` | `/snippet/:id` | ✅ Bearer token | Update a snippet |
| `DELETE` | `/snippet/:id` | ✅ Bearer token | Delete a snippet |
| `GET` | `/health` | No | Health check |

### POST /run — Request body

```json
{
  "code": "print('hello')",
  "language": "python",
  "stdin": "optional input"
}
```

Supported `language` values: `javascript`, `python`, `cpp`, `java`, `c`, `typescript`, `rust`, `go`

### POST /run — Response

```json
{
  "stdout": "hello\n",
  "stderr": null,
  "compile_output": null,
  "status": { "id": 3, "description": "Accepted" },
  "time": "0.05",
  "memory": 2048
}
```

---

## Deployment

### Deploy Backend to Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo, set **Root Directory** to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables from `backend/.env` in the Render dashboard
7. Note your Render URL (e.g. `https://codelab-backend.onrender.com`)

### Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo, set **Root Directory** to `frontend`
3. Framework preset: **Vite**
4. Add environment variables:
   - `VITE_API_URL` = your Render backend URL
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
5. Deploy

### Post-deployment

Update `FRONTEND_URL` in your Render backend env vars to your Vercel URL so CORS works correctly.

---

## Environment Variables Summary

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `JUDGE0_API_URL` | No* | Judge0 base URL |
| `JUDGE0_API_KEY` | No* | RapidAPI key for Judge0 |
| `JUDGE0_API_HOST` | No* | RapidAPI host header |
| `SUPABASE_URL` | No* | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | No* | Supabase service role key |
| `PORT` | No | Server port (default: 3001) |
| `FRONTEND_URL` | No | Allowed CORS origin |
| `NODE_ENV` | No | `development` or `production` |

*App runs in demo/degraded mode without these.

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Backend URL (default: localhost:3001) |
| `VITE_SUPABASE_URL` | No* | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | No* | Supabase anon public key |

*Auth + snippets disabled without these.

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘ Enter` / `Ctrl Enter` | Run code |
| `⌘ S` / `Ctrl S` | Save snippet |

---

## Extending the Project

**Add a new language:**
1. Add an entry to `frontend/src/utils/languages.js` (LANGUAGES array + DEFAULT_CODE)
2. Add the Judge0 language ID to `backend/src/routes/code.js` (LANGUAGE_IDS map)

**Self-host Judge0:**
Change `JUDGE0_API_URL` to your self-hosted instance and remove the RapidAPI headers from `backend/src/routes/code.js`.

**Add a themes picker:**
The Monaco editor `defineTheme` / `setTheme` API in `Editor.jsx` makes it easy to add more themes.

---

## Judge0 — No API Key Needed

This project uses the **free public Judge0 instance** at `https://ce.judge0.com`.

- ✅ Completely free
- ✅ No account required
- ✅ No credit card
- ✅ Supports all 8 languages out of the box

The backend calls it directly with no authentication headers. It has a fair-use rate limit (a few requests per second), which is more than enough for personal or small-team use.

If you ever hit rate limits (very unlikely for personal use), you can [self-host Judge0](https://github.com/judge0/judge0) for free on any server.
