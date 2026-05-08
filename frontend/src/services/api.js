import axios from 'axios';
import { supabase } from './supabase.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Attach auth token to requests
api.interceptors.request.use(async (config) => {
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  }
  return config;
});

// Run code via Judge0
export async function runCode({ code, language, stdin = '' }) {
  const res = await api.post('/run', { code, language, stdin });
  return res.data;
}

// Save snippet
export async function saveSnippet({ title, language, code }) {
  const res = await api.post('/save', { title, language, code });
  return res.data;
}

// Get user's snippets
export async function getSnippets() {
  const res = await api.get('/snippets');
  return res.data.snippets;
}

// Get single snippet (public)
export async function getSnippet(id) {
  const res = await api.get(`/snippet/${id}`);
  return res.data.snippet;
}

// Update snippet
export async function updateSnippet(id, { title, language, code }) {
  const res = await api.put(`/snippet/${id}`, { title, language, code });
  return res.data.snippet;
}

// Delete snippet
export async function deleteSnippet(id) {
  const res = await api.delete(`/snippet/${id}`);
  return res.data;
}
