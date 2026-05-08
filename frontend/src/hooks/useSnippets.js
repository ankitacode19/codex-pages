import { useState, useCallback } from 'react';
import { getSnippets, saveSnippet, deleteSnippet, updateSnippet } from '../services/api.js';

export function useSnippets() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSnippets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSnippets();
      setSnippets(data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load snippets');
    } finally {
      setLoading(false);
    }
  }, []);

  const addSnippet = useCallback(async ({ title, language, code }) => {
    const data = await saveSnippet({ title, language, code });
    setSnippets(prev => [data.snippet, ...prev]);
    return data.snippet;
  }, []);

  const removeSnippet = useCallback(async (id) => {
    await deleteSnippet(id);
    setSnippets(prev => prev.filter(s => s.id !== id));
  }, []);

  const editSnippet = useCallback(async (id, fields) => {
    const updated = await updateSnippet(id, fields);
    setSnippets(prev => prev.map(s => s.id === id ? updated : s));
    return updated;
  }, []);

  return {
    snippets,
    loading,
    error,
    fetchSnippets,
    addSnippet,
    removeSnippet,
    editSnippet,
  };
}
