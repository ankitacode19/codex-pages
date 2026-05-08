import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();


const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62,
  c: 50,
  typescript: 74,
  rust: 73,
  go: 60,
};


const JUDGE0_URL = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';

// POST /run
router.post('/', async (req, res) => {
  const { code, language, stdin = '' } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: 'code and language are required' });
  }

  const languageId = LANGUAGE_IDS[language.toLowerCase()];
  if (!languageId) {
    return res.status(400).json({
      error: `Unsupported language: ${language}`,
      supported: Object.keys(LANGUAGE_IDS),
    });
  }

  try {
    
    const submitRes = await axios.post(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
      {
        source_code: code,
        language_id: languageId,
        stdin: stdin || null,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      }
    );

    const result = submitRes.data;

    return res.json({
      stdout: result.stdout || null,
      stderr: result.stderr || null,
      compile_output: result.compile_output || null,
      status: result.status,
      time: result.time,
      memory: result.memory,
    });

  } catch (err) {
    console.error('Judge0 error:', err.response?.data || err.message);

    if (err.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit hit — wait a moment and try again.' });
    }
    if (err.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Code execution timed out.' });
    }

    return res.status(500).json({ error: 'Execution failed. The Judge0 service may be temporarily down — try again in a moment.' });
  }
});

export default router;
