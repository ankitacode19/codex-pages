import React, { useState } from 'react';

const STATUS_COLORS = {
  3: 'text-lab-green',  
  6: 'text-lab-red',    
  11: 'text-lab-red',   
  5: 'text-lab-yellow', 
};

const STATUS_ICONS = {
  3: '✓',
  6: '✗',
  11: '✗',
  5: '⏱',
};

export default function OutputPanel({ result, isRunning, stdin, onStdinChange, onRun, language }) {
  const [activeTab, setActiveTab] = useState('output');

  const hasOutput = result?.stdout || result?.stderr || result?.compile_output;
  const statusColor = result?.status ? STATUS_COLORS[result.status.id] || 'text-lab-muted' : '';
  const statusIcon = result?.status ? STATUS_ICONS[result.status.id] || '●' : '';

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-lab-border bg-lab-panel shrink-0">
        <div className="flex items-center gap-1">
          {['output', 'input'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded text-xs font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'bg-lab-accent/15 text-lab-accent border border-lab-accent/30'
                  : 'text-lab-muted hover:text-lab-text'
              }`}
            >
              {tab === 'input' ? 'stdin' : tab}
            </button>
          ))}
        </div>

        {/* Run button */}
        <button
          onClick={onRun}
          disabled={isRunning}
          className={`
            flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all
            ${isRunning
              ? 'bg-lab-border text-lab-muted cursor-not-allowed'
              : 'bg-lab-accent text-lab-bg hover:bg-lab-accent-dim active:scale-95'
            }
          `}
        >
          {isRunning ? (
            <>
              <span className="w-3 h-3 rounded-full border-2 border-lab-bg border-t-transparent animate-spin" />
              Running…
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Run
            </>
          )}
        </button>
      </div>

      {/* Status bar */}
      {result?.status && (
        <div className={`flex items-center gap-3 px-4 py-1.5 border-b border-lab-border text-xs font-mono ${statusColor} bg-lab-panel/50`}>
          <span>{statusIcon} {result.status.description}</span>
          {result.time && <span className="text-lab-muted">· {result.time}s</span>}
          {result.memory && <span className="text-lab-muted">· {Math.round(result.memory / 1024)}KB</span>}
          {result.demo && <span className="text-lab-yellow">· Demo Mode</span>}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'input' ? (
          <div className="h-full flex flex-col p-4 gap-2">
            <label className="text-xs text-lab-muted font-mono">Standard Input (stdin)</label>
            <textarea
              value={stdin}
              onChange={e => onStdinChange(e.target.value)}
              placeholder="Enter input for your program here..."
              className="flex-1 bg-transparent text-lab-text text-sm font-mono resize-none outline-none placeholder-lab-muted/40 leading-relaxed"
              spellCheck={false}
            />
          </div>
        ) : (
          <div className="h-full overflow-auto p-4 font-mono text-sm leading-relaxed">
            {isRunning ? (
              <div className="flex items-center gap-3 text-lab-muted">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-lab-accent animate-pulse-dot"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
                Executing {language} code…
              </div>
            ) : !hasOutput ? (
              <div className="text-lab-muted/50 select-none">
                <div className="mb-2">▸ Press Run to execute your code</div>
                <div className="text-xs">Output will appear here</div>
              </div>
            ) : (
              <div className="space-y-4">
                {result.stdout && (
                  <div>
                    <div className="text-[10px] text-lab-muted uppercase tracking-widest mb-2">stdout</div>
                    <pre className="text-lab-green whitespace-pre-wrap break-words">{result.stdout}</pre>
                  </div>
                )}
                {result.stderr && (
                  <div>
                    <div className="text-[10px] text-lab-muted uppercase tracking-widest mb-2">stderr</div>
                    <pre className="text-lab-red whitespace-pre-wrap break-words">{result.stderr}</pre>
                  </div>
                )}
                {result.compile_output && (
                  <div>
                    <div className="text-[10px] text-lab-muted uppercase tracking-widest mb-2">compiler</div>
                    <pre className="text-lab-yellow whitespace-pre-wrap break-words">{result.compile_output}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
