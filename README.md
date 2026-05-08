# Codex Pages

A browser-based code editor and runner. Write code, execute it instantly, and save or share snippets — no setup required on the user's end.

## What it does

Codex Pages gives you a Monaco-powered editor (the same one used in VS Code) paired with a live execution engine. You pick a language, write your code, hit Run, and see the output immediately in the split panel beside your editor. You can also provide standard input for programs that need it.

Signed-in users can save snippets to their account, manage them from the sidebar, and generate shareable links that anyone can open without logging in.

# [Check it out](https://codex-pages.vercel.app)

## Stack

- **Frontend** — React, Vite, Tailwind CSS, Monaco Editor
- **Backend** — Node.js, Express
- **Code execution** — Judge0 (self-hosted public instance)
- **Auth & database** — Supabase

## Supported languages

JavaScript, TypeScript, Python, C, C++, Java, Rust, Go

## Running locally

```bash
# Install dependencies
npm run install:all

# Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Fill in your Supabase keys (see .env.example files)

# Start both services
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:3001`.

## Environment variables

The only things you need to provide are your Supabase credentials. Code execution works out of the box with no API key.

See `backend/.env.example` and `frontend/.env.example` for the full list.

## Keyboard shortcuts

| Action | Shortcut |
|--------|----------|
| Run code | `Ctrl + Enter` |
| Save snippet | `Ctrl + S` |
