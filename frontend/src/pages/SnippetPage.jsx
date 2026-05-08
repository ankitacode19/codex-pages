import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';
import { getSnippet } from '../services/api.js';
import { getLanguageById } from '../utils/languages.js';

export default function SnippetPage() {
  const { id } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getSnippet(id)
      .then(data => { setSnippet(data); setLoading(false); })
      .catch(() => { setError('Snippet not found'); setLoading(false); });
  }, [id]);

  const handleCopy = () => {
    if (snippet?.code) {
      navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const langConfig = snippet ? getLanguageById(snippet.language) : null;

  return (
    <div className="min-h-screen bg-lab-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-lab-border bg-lab-panel">
        <Link to="/" className="text-lab-accent font-mono font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
          {'<'}Codex Pages{'>'}
        </Link>
        <Link
          to="/"
          className="px-4 py-1.5 rounded-md bg-lab-accent text-lab-bg text-sm font-medium hover:bg-lab-accent-dim transition-all"
        >
          Open Editor
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col max-w-5xl w-full mx-auto px-4 py-8 gap-6">
        {loading ? (
          <div className="flex items-center justify-center flex-1">
            <span className="w-6 h-6 rounded-full border-2 border-lab-accent border-t-transparent animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-lab-red text-4xl mb-4">404</div>
            <div className="text-lab-muted">{error}</div>
            <Link to="/" className="mt-4 inline-block text-lab-accent hover:underline">Back to editor</Link>
          </div>
        ) : (
          <>
            {/* Snippet meta */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-lab-text">{snippet.title}</h1>
                <div className="flex items-center gap-3 mt-1 text-xs text-lab-muted font-mono">
                  <span className="text-lab-accent">{snippet.language}</span>
                  <span>·</span>
                  <span>{new Date(snippet.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${
                    copied
                      ? 'bg-lab-green/20 text-lab-green border border-lab-green/40'
                      : 'bg-lab-border text-lab-text hover:border-lab-accent/50 border border-lab-border'
                  }`}
                >
                  {copied ? '✓ Copied' : 'Copy code'}
                </button>
                <Link
                  to={`/?load=${snippet.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-lab-accent text-lab-bg hover:bg-lab-accent-dim transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Run in editor
                </Link>
              </div>
            </div>

            {/* Editor (read-only) */}
            <div className="flex-1 min-h-[500px] rounded-xl overflow-hidden border border-lab-border bg-[#0d0f14]">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-lab-border bg-lab-panel">
                <span className="text-xs font-mono text-lab-muted">
                  main.{langConfig?.ext || 'txt'}
                </span>
                <div className="flex gap-1 ml-auto">
                  <div className="w-2 h-2 rounded-full bg-lab-red/60" />
                  <div className="w-2 h-2 rounded-full bg-lab-yellow/60" />
                  <div className="w-2 h-2 rounded-full bg-lab-green/60" />
                </div>
              </div>
              <MonacoEditor
                height="500px"
                language={langConfig?.monacoLang || 'javascript'}
                value={snippet.code}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontLigatures: true,
                  lineNumbers: 'on',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  padding: { top: 16, bottom: 16 },
                  renderLineHighlight: 'none',
                  scrollbar: { verticalScrollbarSize: 6 },
                }}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
