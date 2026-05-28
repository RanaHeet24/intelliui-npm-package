/**
 * Express.js Server Template for IntelliUI Backend Orchestration.
 * 
 * Securely communicates with Gemini AI, handles private environment variables,
 * supports cross-origin requests (CORS), and streams responses in real-time.
 * 
 * Usage:
 * 1. Install dependencies: npm install express cors dotenv @google/generative-ai
 * 2. Configure .env with your GEMINI_API_KEY
 * 3. Start the server: node server.js
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS and JSON parsing middlewares
app.use(cors());
app.use(express.json());

// Main /api/chat stream endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'A non-empty messages array is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[IntelliUI Express Server] GEMINI_API_KEY is not defined.');
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is missing.' });
    }

    // Initialize the Gemini client SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    // Format previous messages to Gemini's expected message history format (excluding the last message)
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Start a chat session and stream back the response chunk-by-chunk
    const chat = model.startChat({ history });
    const lastMessageText = messages[messages.length - 1]?.content || '';

    // Set headers for streaming response to client
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const result = await chat.sendMessageStream(lastMessageText);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(chunkText);
    }

    res.end();

  } catch (error) {
    console.error('[IntelliUI Express Server] Request Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Internal Server Error encountered.' });
    } else {
      res.end();
    }
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`\x1b[32m✔ IntelliUI Express Server is running on http://localhost:${PORT}\x1b[0m`);
  console.log(`\x1b[35mStream endpoint active at: http://localhost:${PORT}/api/chat\x1b[0m`);
});
