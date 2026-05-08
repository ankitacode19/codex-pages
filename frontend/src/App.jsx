import React, { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Navbar from './components/Navbar.jsx';
import AuthModal from './components/AuthModal.jsx';
import EditorPage from './pages/EditorPage.jsx';
import SnippetPage from './pages/SnippetPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function AppShell() {
  const [authOpen, setAuthOpen] = useState(false);
  const [snippetTitle, setSnippetTitle] = useState('Untitled Snippet');
  const [isSaving, setIsSaving] = useState(false);
  const [saveRef, setSaveRef] = useState(null);

  const handleRegisterSave = useCallback((fn) => {
    setSaveRef(() => fn);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-lab-bg overflow-hidden">
      <Navbar
        onAuthOpen={() => setAuthOpen(true)}
        onSave={() => saveRef?.()()}
        isSaving={isSaving}
        currentSnippetTitle={snippetTitle}
        onTitleChange={setSnippetTitle}
      />

      <div className="flex-1 flex overflow-hidden">
        <Routes>
          <Route
            path="/"
            element={
              <EditorPage
                onAuthOpen={() => setAuthOpen(true)}
                snippetTitle={snippetTitle}
                onTitleChange={setSnippetTitle}
                onIsSavingChange={setIsSaving}
                onRegisterSave={handleRegisterSave}
              />
            }
          />
          <Route path="/snippet/:id" element={<SnippetPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ThemeProvider>
  );
}
