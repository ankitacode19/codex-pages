import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../services/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();


router.post('/save', requireAuth, async (req, res) => {
  const { language, code, title = 'Untitled Snippet' } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: 'language and code are required' });
  }

  if (!supabase) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  try {
    const snippet = {
      id: uuidv4(),
      user_id: req.user.id,
      title,
      language,
      code,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('snippets')
      .insert([snippet])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ snippet: data });
  } catch (err) {
    console.error('Save snippet error:', err);
    return res.status(500).json({ error: 'Failed to save snippet' });
  }
});

// GET /snippets
router.get('/snippets', requireAuth, async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'Database unavailable' });

  try {
    const { data, error } = await supabase
      .from('snippets')
      .select('id, title, language, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return res.json({ snippets: data || [] });
  } catch (err) {
    console.error('Fetch snippets error:', err);
    return res.status(500).json({ error: 'Failed to fetch snippets' });
  }
});


router.get('/snippet/:id', async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'Database unavailable' });

  try {
    const { data, error } = await supabase
      .from('snippets')
      .select('id, title, language, code, created_at')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Snippet not found' });
    }

    return res.json({ snippet: data });
  } catch (err) {
    console.error('Fetch snippet error:', err);
    return res.status(500).json({ error: 'Failed to fetch snippet' });
  }
});


router.put('/snippet/:id', requireAuth, async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'Database unavailable' });

  const { language, code, title } = req.body;

  try {
    const { data, error } = await supabase
      .from('snippets')
      .update({ language, code, title, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Snippet not found or not authorized' });
    }

    return res.json({ snippet: data });
  } catch (err) {
    console.error('Update snippet error:', err);
    return res.status(500).json({ error: 'Failed to update snippet' });
  }
});


router.delete('/snippet/:id', requireAuth, async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'Database unavailable' });

  try {
    const { error } = await supabase
      .from('snippets')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    return res.json({ message: 'Snippet deleted successfully' });
  } catch (err) {
    console.error('Delete snippet error:', err);
    return res.status(500).json({ error: 'Failed to delete snippet' });
  }
});

export default router;
