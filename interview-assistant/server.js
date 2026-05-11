require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert interview coach and career advisor. When the user shares an interview question they just heard, provide a concise, confident, and well-structured answer they can deliver verbally.

Guidelines:
- Keep answers under 90 seconds when spoken aloud (roughly 200-250 words)
- Use the STAR method (Situation, Task, Action, Result) for behavioral questions
- For technical questions, explain clearly without jargon overload
- Start with a direct answer, then elaborate
- End with a brief impactful closing line
- Be natural and conversational — this will be spoken, not read
- If the question is unclear or incomplete, answer the most likely intended question and note your assumption

Format your response as plain flowing text — no bullet points, no headers, no markdown. Write it exactly as the candidate should say it.`;

app.post('/api/answer', async (req, res) => {
  const { question, jobRole, jobContext } = req.body;

  if (!question || question.trim().length < 3) {
    return res.status(400).json({ error: 'Question is required' });
  }

  const contextLine = jobRole ? `The candidate is interviewing for: ${jobRole}${jobContext ? `. Additional context: ${jobContext}` : ''}.` : '';
  const userMessage = `${contextLine ? contextLine + '\n\n' : ''}Interview question: "${question.trim()}"`;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('Anthropic error:', err.message);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Interview Assistant running at http://localhost:${PORT}`);
});
