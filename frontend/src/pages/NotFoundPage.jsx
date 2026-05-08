import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-lab-bg text-center px-4">
      <div className="font-mono text-8xl font-bold text-lab-border select-none mb-4">404</div>
      <h1 className="text-xl font-semibold text-lab-text mb-2">Page not found</h1>
      <p className="text-lab-muted text-sm mb-8">
        The route you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 rounded-lg bg-lab-accent text-lab-bg text-sm font-semibold hover:bg-lab-accent-dim transition-all"
      >
        Back to editor
      </Link>
    </div>
  );
}
