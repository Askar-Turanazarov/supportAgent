import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { chatRouter } from './routes/chat.js';
import { getLlmMode } from './services/llmService.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', llmMode: getLlmMode() });
});

app.use('/api/chat', chatRouter);

app.listen(PORT, () => {
  console.log(`[support-agent-backend] listening on http://localhost:${PORT} (LLM mode: ${getLlmMode()})`);
});
