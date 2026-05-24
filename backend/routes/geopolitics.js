import Anthropic from '@anthropic-ai/sdk';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, '../cache');

if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

// Remove cache files older than 2 days on startup
const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
fs.readdirSync(CACHE_DIR).forEach(file => {
  const filePath = path.join(CACHE_DIR, file);
  if (fs.statSync(filePath).mtimeMs < twoDaysAgo) fs.unlinkSync(filePath);
});

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function getCachePath(countryCode) {
  const today = new Date().toISOString().split('T')[0];
  return path.join(CACHE_DIR, `${countryCode}-${today}.json`);
}

async function fetchNews(countryName) {
  if (!process.env.NEWS_API_KEY) return [];
  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(countryName + ' politics')}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.articles || [];
  } catch {
    return [];
  }
}

router.get('/geopolitics/:countryCode', async (req, res) => {
  const { countryCode } = req.params;
  const countryName = req.query.countryName || countryCode;
  const cachePath = getCachePath(countryCode);

  if (fs.existsSync(cachePath)) {
    return res.json(JSON.parse(fs.readFileSync(cachePath, 'utf-8')));
  }

  try {
    const articles = await fetchNews(countryName);
    const newsContext = articles.length
      ? articles.map(a => `- ${a.title}: ${a.description || ''}`).join('\n')
      : null;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 700,
      messages: [{
        role: 'user',
        content: `Provide a concise geopolitical briefing for ${countryName}.
${newsContext ? `\nRecent news context:\n${newsContext}\n` : ''}
Structure your response with exactly these four sections:

**Political Situation**
[2-3 sentences on government, stability, key political events]

**International Relations**
[2-3 sentences on alliances, tensions, diplomatic activity]

**Active Conflicts**
[2-3 sentences, or "No significant active conflicts." if none]

**Economic Outlook**
[2-3 sentences on economic situation and key drivers]

Keep tone neutral and factual.`
      }]
    });

    const result = {
      country: countryName,
      analysis: message.content[0].text,
      updatedAt: new Date().toISOString(),
      sources: articles.slice(0, 3).map(a => ({ title: a.title, url: a.url }))
    };

    fs.writeFileSync(cachePath, JSON.stringify(result));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate geopolitical briefing.' });
  }
});

export default router;
