import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthModal({ isOpen, onClose }) {
  const { signIn, signUp, signInWithGoogle, isConfigured } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        onClose();
      } else {
        await signUp(email, password);
        setSuccess('Check your email to confirm your account.');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-lab-panel border border-lab-border rounded-xl shadow-2xl w-full max-w-sm mx-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-lab-border">
          <div>
            <h2 className="text-base font-semibold text-lab-text">
              {mode === 'signin' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-xs text-lab-muted mt-0.5">
              {mode === 'signin' ? 'Sign in to save and share snippets' : 'Join to save your code snippets'}
            </p>
          </div>
          <button onClick={onClose} className="text-lab-muted hover:text-lab-text transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {!isConfigured && (
            <div className="bg-lab-yellow/10 border border-lab-yellow/30 rounded-lg px-4 py-3 text-xs text-lab-yellow">
              ⚠ Supabase not configured. Auth is unavailable in demo mode.
            </div>
          )}

          {error && (
            <div className="bg-lab-red/10 border border-lab-red/30 rounded-lg px-4 py-3 text-xs text-lab-red">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-lab-green/10 border border-lab-green/30 rounded-lg px-4 py-3 text-xs text-lab-green">
              {success}
            </div>
          )}

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            disabled={!isConfigured || loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-lab-border hover:border-lab-accent/50 text-sm text-lab-text hover:bg-lab-border transition-all disabled:opacity-40"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 text-lab-muted">
            <div className="flex-1 h-px bg-lab-border" />
            <span className="text-xs">or</span>
            <div className="flex-1 h-px bg-lab-border" />
          </div>

          {/* Email/password form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-lab-muted mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-lab-bg border border-lab-border rounded-lg px-3 py-2 text-sm text-lab-text placeholder-lab-muted/40 outline-none focus:border-lab-accent/60 transition-colors font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-lab-muted mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full bg-lab-bg border border-lab-border rounded-lg px-3 py-2 text-sm text-lab-text placeholder-lab-muted/40 outline-none focus:border-lab-accent/60 transition-colors font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={!isConfigured || loading}
              className="w-full py-2.5 rounded-lg bg-lab-accent text-lab-bg text-sm font-semibold hover:bg-lab-accent-dim transition-all disabled:opacity-40 mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-lab-bg border-t-transparent animate-spin" />
                  {mode === 'signin' ? 'Signing in…' : 'Creating account…'}
                </span>
              ) : (
                mode === 'signin' ? 'Sign in' : 'Create account'
              )}
            </button>
          </form>

          <p className="text-xs text-center text-lab-muted">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(null); setSuccess(null); }}
              className="text-lab-accent hover:underline"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
