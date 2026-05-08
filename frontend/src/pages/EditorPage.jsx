import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Editor from '../components/Editor.jsx';
import OutputPanel from '../components/OutputPanel.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ShareModal from '../components/ShareModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { runCode, saveSnippet, getSnippet } from '../services/api.js';
import { DEFAULT_CODE } from '../utils/languages.js';

export default function EditorPage({
  onAuthOpen,
  snippetTitle,
  onTitleChange,
  onIsSavingChange,
  onRegisterSave,
}) {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [stdin, setStdin] = useState('');
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [currentSnippetId, setCurrentSnippetId] = useState(null);
  const [splitPos, setSplitPos] = useState(55);
  const isDragging = useRef(false);

  useEffect(() => { onIsSavingChange?.(isSaving); }, [isSaving]);

  
  useEffect(() => {
    const loadId = searchParams.get('load');
    if (loadId) handleLoadSnippet(loadId);
  }, []);

  const handleSave = useCallback(async () => {
    if (!user) { onAuthOpen?.(); return; }
    setIsSaving(true);
    try {
      const data = await saveSnippet({
        title: snippetTitle || 'Untitled Snippet',
        language,
        code,
      });
      setCurrentSnippetId(data.snippet.id);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save snippet');
    } finally {
      setIsSaving(false);
    }
  }, [user, snippetTitle, language, code, onAuthOpen]);

  // Register save handler with App shell so Navbar can trigger it
  useEffect(() => {
    onRegisterSave?.(() => handleSave);
  }, [handleSave, onRegisterSave]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang] || '');
    setResult(null);
  };

  const handleRun = useCallback(async () => {
    if (!code.trim()) return;
    setIsRunning(true);
    setResult(null);
    try {
      const data = await runCode({ code, language, stdin });
      setResult(data);
    } catch (err) {
      setResult({
        status: { id: 0, description: 'Error' },
        stderr: err.response?.data?.error || err.message || 'Execution failed',
      });
    } finally {
      setIsRunning(false);
    }
  }, [code, language, stdin]);

  const handleLoadSnippet = async (id) => {
    try {
      const snippet = await getSnippet(id);
      setLanguage(snippet.language);
      setCode(snippet.code);
      onTitleChange?.(snippet.title);
      setCurrentSnippetId(snippet.id);
      setResult(null);
    } catch {
      alert('Failed to load snippet');
    }
  };

  // Drag-to-resize panels
  const startDrag = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    const container = e.currentTarget.parentElement;
    const onMove = (ev) => {
      if (!isDragging.current) return;
      const rect = container.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setSplitPos(Math.min(80, Math.max(20, pct)));
    };
    const onUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRun(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSave(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleRun, handleSave]);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Snippets sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onLoad={handleLoadSnippet}
        currentSnippetId={currentSnippetId}
      />

      {/* Editor + output area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Sub-toolbar */}
        <div className="flex items-center gap-2 px-4 py-1.5 border-b border-lab-border bg-lab-panel shrink-0">
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className={`p-1.5 rounded transition-all ${sidebarOpen ? 'text-lab-accent bg-lab-accent/10' : 'text-lab-muted hover:text-lab-text'}`}
            title="Toggle snippets sidebar (saved code)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>

          <div className="w-px h-4 bg-lab-border" />

          {/* Share */}
          <button
            onClick={() => user ? setShareOpen(true) : onAuthOpen?.()}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-lab-muted hover:text-lab-text hover:bg-lab-border transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>

          {/* Saved indicator */}
          {currentSnippetId && (
            <span className="text-[10px] text-lab-green font-mono animate-fade-in">● saved</span>
          )}

          {/* Keyboard shortcut hints */}
          <div className="ml-auto hidden sm:flex items-center gap-1 text-[10px] text-lab-muted font-mono select-none">
            <kbd className="px-1.5 py-0.5 bg-lab-border rounded">⌘</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 bg-lab-border rounded">↵</kbd>
            <span className="ml-1 mr-4">run</span>
            <kbd className="px-1.5 py-0.5 bg-lab-border rounded">⌘S</kbd>
            <span className="ml-1">save</span>
          </div>
        </div>

        {/* Split panes */}
        <div className="flex flex-1 overflow-hidden">
          {/* Editor pane */}
          <div style={{ width: `${splitPos}%` }} className="flex flex-col overflow-hidden border-r border-lab-border">
            <Editor
              code={code}
              language={language}
              onCodeChange={setCode}
              onLanguageChange={handleLanguageChange}
            />
          </div>

          {/* Drag handle */}
          <div className="resizer" onMouseDown={startDrag} />

          {/* Output pane */}
          <div style={{ width: `${100 - splitPos}%` }} className="flex flex-col overflow-hidden bg-lab-bg">
            <OutputPanel
              result={result}
              isRunning={isRunning}
              stdin={stdin}
              onStdinChange={setStdin}
              onRun={handleRun}
              language={language}
            />
          </div>
        </div>
      </div>

      {/* Share modal */}
      <ShareModal
        snippetId={currentSnippetId}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </div>
  );
}
