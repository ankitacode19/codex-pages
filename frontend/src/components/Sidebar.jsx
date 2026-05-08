import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getSnippets, deleteSnippet } from '../services/api.js';

export default function Sidebar({ isOpen, onLoad, currentSnippetId }) {
  const { user } = useAuth();
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && isOpen) {
      fetchSnippets();
    }
  }, [user, isOpen]);

  const fetchSnippets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSnippets();
      setSnippets(data);
    } catch (e) {
      setError('Failed to load snippets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Delete this snippet?')) return;
    try {
      await deleteSnippet(id);
      setSnippets(s => s.filter(x => x.id !== id));
    } catch {
      alert('Failed to delete snippet');
    }
  };

  const handleCopyLink = (e, id) => {
    e.stopPropagation();
    const url = `${window.location.origin}/snippet/${id}`;
    navigator.clipboard.writeText(url);
  };

  const LANG_COLORS = {
    javascript: '#ffcc00',
    python: '#4ade80',
    cpp: '#60a5fa',
    java: '#f97316',
    c: '#a78bfa',
    typescript: '#38bdf8',
    rust: '#fb923c',
    go: '#34d399',
  };

  return (
    <aside
      className={`
        flex flex-col bg-lab-panel border-r border-lab-border transition-all duration-300 shrink-0 overflow-hidden
        ${isOpen ? 'w-64' : 'w-0'}
      `}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-lab-border">
        <span className="text-xs font-semibold text-lab-muted uppercase tracking-widest">Snippets</span>
        <button
          onClick={fetchSnippets}
          className="text-lab-muted hover:text-lab-accent transition-colors"
          title="Refresh"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {!user ? (
          <div className="text-center py-8 px-4">
            <div className="text-lab-muted text-xs leading-relaxed">
              Sign in to save and view your snippets
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-8">
            <span className="w-4 h-4 rounded-full border-2 border-lab-accent border-t-transparent animate-spin" />
          </div>
        ) : error ? (
          <div className="text-lab-red text-xs text-center py-4 px-2">{error}</div>
        ) : snippets.length === 0 ? (
          <div className="text-lab-muted text-xs text-center py-8 px-4 leading-relaxed">
            No snippets yet. Run some code and save it!
          </div>
        ) : (
          <ul className="space-y-1">
            {snippets.map(snippet => (
              <li
                key={snippet.id}
                onClick={() => onLoad(snippet.id)}
                className={`
                  group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all
                  ${currentSnippetId === snippet.id
                    ? 'bg-lab-accent/10 border border-lab-accent/30'
                    : 'hover:bg-lab-border border border-transparent'
                  }
                `}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: LANG_COLORS[snippet.language] || '#5a6480' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-lab-text truncate">{snippet.title}</div>
                  <div className="text-[10px] text-lab-muted font-mono">
                    {snippet.language} · {new Date(snippet.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={e => handleCopyLink(e, snippet.id)}
                    className="p-0.5 text-lab-muted hover:text-lab-accent"
                    title="Copy share link"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={e => handleDelete(e, snippet.id)}
                    className="p-0.5 text-lab-muted hover:text-lab-red"
                    title="Delete"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
