import React, { useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useTheme } from '../context/ThemeContext.jsx';
import { LANGUAGES, getLanguageById } from '../utils/languages.js';

export default function Editor({ code, language, onCodeChange, onLanguageChange }) {
  const { theme } = useTheme();
  const editorRef = useRef(null);

  const monacoTheme = theme === 'dark' ? 'codelab-dark' : 'codelab-light';
  const langConfig = getLanguageById(language);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;

    
    monaco.editor.defineTheme('codelab-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '4a5568', fontStyle: 'italic' },
        { token: 'keyword', foreground: '00d9ff' },
        { token: 'string', foreground: '00e676' },
        { token: 'number', foreground: 'ffcc00' },
        { token: 'type', foreground: 'b388ff' },
        { token: 'function', foreground: '00d9ff' },
        { token: 'variable', foreground: 'c9d1e0' },
      ],
      colors: {
        'editor.background': '#0d0f14',
        'editor.foreground': '#c9d1e0',
        'editor.lineHighlightBackground': '#13161e',
        'editor.selectionBackground': '#00d9ff22',
        'editorLineNumber.foreground': '#2a3040',
        'editorLineNumber.activeForeground': '#5a6480',
        'editorIndentGuide.background': '#1e2330',
        'editorIndentGuide.activeBackground': '#2a3040',
        'editorCursor.foreground': '#00d9ff',
        'editor.findMatchBackground': '#00d9ff33',
        'scrollbar.shadow': '#00000000',
        'scrollbarSlider.background': '#1e233055',
        'scrollbarSlider.hoverBackground': '#2a304088',
      },
    });

   
    monaco.editor.defineTheme('codelab-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '9ca3af', fontStyle: 'italic' },
        { token: 'keyword', foreground: '0891b2' },
        { token: 'string', foreground: '16a34a' },
        { token: 'number', foreground: 'd97706' },
        { token: 'type', foreground: '7c3aed' },
      ],
      colors: {
        'editor.background': '#f8fafc',
        'editor.foreground': '#1e293b',
        'editor.lineHighlightBackground': '#f1f5f9',
        'editor.selectionBackground': '#0891b233',
        'editorLineNumber.foreground': '#cbd5e1',
        'editorLineNumber.activeForeground': '#94a3b8',
        'editorCursor.foreground': '#0891b2',
      },
    });

    monaco.editor.setTheme(monacoTheme);

    
    editor.focus();
  }

  return (
    <div className="flex flex-col h-full">
      {/* Editor toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-lab-border bg-lab-panel shrink-0">
        {/* Language selector */}
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-lab-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <select
            value={language}
            onChange={e => onLanguageChange(e.target.value)}
            className="bg-lab-border text-lab-text text-xs font-mono px-2 py-1 rounded border border-lab-border hover:border-lab-accent/50 outline-none transition-colors cursor-pointer"
          >
            {LANGUAGES.map(l => (
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
          </select>
        </div>

        {/* File name indicator */}
        <span className="text-xs text-lab-muted font-mono">
          main.{langConfig?.ext || 'js'}
        </span>

        <div className="ml-auto flex items-center gap-3 text-[10px] text-lab-muted font-mono">
          <span>UTF-8</span>
          <span>LF</span>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          height="100%"
          language={langConfig?.monacoLang || 'javascript'}
          value={code}
          theme={monacoTheme}
          onChange={value => onCodeChange(value || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'line',
            cursorBlinking: 'phase',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            bracketPairColorization: { enabled: true },
            formatOnPaste: true,
            formatOnType: true,
            suggest: { showKeywords: true },
            quickSuggestions: true,
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
          }}
        />
      </div>
    </div>
  );
}
