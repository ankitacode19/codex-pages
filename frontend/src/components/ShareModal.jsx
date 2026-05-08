import React, { useState } from 'react';

export default function ShareModal({ snippetId, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = snippetId
    ? `${window.location.origin}/snippet/${snippetId}`
    : null;

  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-lab-panel border border-lab-border rounded-xl shadow-2xl w-full max-w-md mx-4 animate-fade-in p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-lab-text">Share Snippet</h2>
          <button onClick={onClose} className="text-lab-muted hover:text-lab-text">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!snippetId ? (
          <p className="text-sm text-lab-muted">Save the snippet first before sharing.</p>
        ) : (
          <>
            <p className="text-xs text-lab-muted mb-3">Anyone with this link can view your code:</p>
            <div className="flex gap-2">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 bg-lab-bg border border-lab-border rounded-lg px-3 py-2 text-xs font-mono text-lab-text outline-none"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  copied
                    ? 'bg-lab-green/20 text-lab-green border border-lab-green/40'
                    : 'bg-lab-accent text-lab-bg hover:bg-lab-accent-dim'
                }`}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
