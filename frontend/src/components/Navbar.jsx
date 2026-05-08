import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Navbar({ onAuthOpen, onSave, isSaving, currentSnippetTitle, onTitleChange }) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(currentSnippetTitle || 'Untitled Snippet');

  const handleTitleBlur = () => {
    setEditingTitle(false);
    onTitleChange?.(titleInput);
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-lab-border bg-lab-panel shrink-0 z-10">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-lab-accent font-mono font-bold text-lg tracking-tight">
            {'<'}Codex Pages{'>'}
          </span>
        </div>

        {/* Title */}
        <div className="hidden sm:flex items-center gap-1 text-lab-muted">
          <span>/</span>
          {editingTitle ? (
            <input
              autoFocus
              value={titleInput}
              onChange={e => setTitleInput(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={e => e.key === 'Enter' && handleTitleBlur()}
              className="bg-lab-border text-lab-text px-2 py-0.5 rounded text-sm font-mono outline-none border border-lab-accent w-48"
            />
          ) : (
            <button
              onClick={() => setEditingTitle(true)}
              className="text-sm font-mono text-lab-text hover:text-lab-accent transition-colors truncate max-w-[200px]"
              title="Click to rename"
            >
              {titleInput}
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md text-lab-muted hover:text-lab-text hover:bg-lab-border transition-all"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14A7 7 0 0012 5z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Save Button */}
        {user && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-lab-border hover:bg-lab-accent/10 border border-lab-border hover:border-lab-accent text-sm text-lab-text hover:text-lab-accent transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="w-3 h-3 rounded-full border-2 border-lab-accent border-t-transparent animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save
              </>
            )}
          </button>
        )}

        {/* Auth */}
        {user ? (
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-xs text-lab-muted font-mono truncate max-w-[120px]">
              {user.email}
            </span>
            <button
              onClick={signOut}
              className="px-3 py-1.5 rounded-md text-sm text-lab-muted hover:text-lab-red border border-transparent hover:border-lab-red/40 transition-all"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={onAuthOpen}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-lab-accent text-lab-bg hover:bg-lab-accent-dim transition-all"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
