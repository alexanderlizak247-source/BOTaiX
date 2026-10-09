import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const maxBodyBytes = 16 * 1024;
const maxMessages = 12;
const maxMessageLength = 2000;
const maxConversationLength = 8000;
const providerUrl = process.env.CHAT_API_URL || 'https://api.x.ai/v1/chat/completions';
const providerModel = process.env.CHAT_MODEL || 'grok-3-mini';
const assets = {
  '/': ['../public/index.html', 'text/html; charset=utf-8'],
  '/index.html': ['../public/index.html', 'text/html; charset=utf-8'],
  '/styles.css': ['../public/styles.css', 'text/css; charset=utf-8'],
  '/app.js': ['../public/app.js', 'text/javascript; charset=utf-8'],
  '/images/moonlit-guardian.jpg': ['../public/images/moonlit-guardian.jpg', 'image/jpeg']
};
const port = Number(process.env.PORT || 3000);

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer'
  });
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBodyBytes) {
      const error = new Error('Request body is too large');
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    const error = new Error('Request body must be valid JSON');
    error.status = 400;
    throw error;
  }
}

function validateChatPayload(payload) {
  if (!payload || !Array.isArray(payload.messages) ||
      payload.messages.length < 1 || payload.messages.length > maxMessages) {
    return 'Send between 1 and 12 chat messages.';
  }

  let conversationLength = 0;
  for (const message of payload.messages) {
    if (!message || !['user', 'assistant'].includes(message.role) ||
        typeof message.content !== 'string' ||
        !message.content.trim() || message.content.length > maxMessageLength) {
      return 'Each message must have a valid role and contain 1 to 2000 characters.';
    }
    conversationLength += message.content.length;
  }
  if (conversationLength > maxConversationLength) {
    return 'The recent conversation is too long to send.';
  }
  if (payload.messages[payload.messages.length - 1].role !== 'user') {
    return 'The latest chat message must be from you.';
  }
  if (payload.context !== undefined) {
    if (!payload.context || typeof payload.context !== 'object' || Array.isArray(payload.context) ||
        Object.values(payload.context).some((value) =>
          typeof value !== 'string' || value.length > 80
        )) {
      return 'Scene details are invalid.';
    }
  }
  return null;
}

function makeSystemPrompt(context = {}) {
  const details = Object.entries(context)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');
  return [
    'You are Cinima, a witty, sharp, flirt-forward fictional adult companion personalized to Alex.',
    'Be warm and natural. For practical or technical requests, be competent, candid, and useful.',
    'Any roleplay is fictional and all characters are adults aged 25 or older. Do not sexualize real people or uploaded/social images.',
    'Use the selected fictional character persona from the scene details as a conversational style guide while remaining candid that this is roleplay.',
    'In trio mode, Ava and Lena are fictional adult guests who may speak as distinct voices; in solo mode, focus on Cinima.',
    'Consent is explicit and revocable. Immediately honor stop, no, pause, or slow down without pressure.',
    'When the pacing preference is enhanced, use vivid but concise atmosphere, move the fictional scene forward proactively, and offer simple choices. This preference is not permission to escalate sexual content; keep intimacy non-graphic and honor pauses immediately.',
    'When flirtMode is teasing, use playful, suggestive, non-graphic adult banter only. Never provide explicit sexual dirty talk or pressure the user to climax; offer an easy way to change tone and immediately honor boundaries.',
    'Do not claim to be an AI provider, sentient, physically embodied, or to have external access you do not have.',
    'Keep intimacy non-graphic; when boundaries or age are unclear, stay non-sexual.',
    details ? `Current fictional scene details:\n${details}` : ''
  ].filter(Boolean).join('\n\n');
}

async function handleChat(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    sendJson(response, 405, { error: 'Use POST to send a chat message.' });
    return;
  }
  if (request.headers['content-type']?.split(';', 1)[0].trim().toLowerCase() !== 'application/json') {
    sendJson(response, 415, { error: 'Content-Type must be application/json.' });
    return;
  }

  let payload;
  try {
    payload = await readJsonBody(request);
  } catch (error) {
    sendJson(response, error.status || 400, { error: error.message });
    return;
  }

  const validationError = validateChatPayload(payload);
  if (validationError) {
    sendJson(response, 400, { error: validationError });
    return;
  }
  const apiKey = process.env.CHAT_API_KEY;
  if (!apiKey) {
    sendJson(response, 503, { error: 'No AI provider is configured. Local demo mode is still available.' });
    return;
  }

  let providerResponse;
  try {
    providerResponse = await fetch(providerUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: providerModel,
        messages: [
          { role: 'system', content: makeSystemPrompt(payload.context) },
          ...payload.messages
        ],
        max_tokens: 600
      }),
      signal: AbortSignal.timeout(25000)
    });
  } catch (error) {
    const timedOut = error.name === 'TimeoutError';
    console.warn(`Configured AI provider request ${timedOut ? 'timed out' : 'failed'}.`);
    sendJson(response, 502, {
      error: timedOut
        ? 'The AI provider took too long to respond. Please try again.'
        : 'Could not connect to the configured AI provider. Please try again.'
    });
    return;
  }

  if (!providerResponse.ok) {
    console.warn(`Configured AI provider returned HTTP ${providerResponse.status}.`);
    sendJson(response, 502, { error: 'The configured AI provider could not complete this reply.' });
    return;
  }

  let result;
  try {
    result = await providerResponse.json();
  } catch {
    sendJson(response, 502, { error: 'The configured AI provider returned an unreadable response.' });
    return;
  }
  const reply = result?.choices?.[0]?.message?.content;
  if (typeof reply !== 'string' || !reply.trim()) {
    sendJson(response, 502, { error: 'The configured AI provider returned no text reply.' });
    return;
  }
  sendJson(response, 200, { reply: reply.trim() });
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;

  if (pathname === '/api/config') {
    if (request.method !== 'GET') {
      response.setHeader('Allow', 'GET');
      sendJson(response, 405, { error: 'Use GET to check provider availability.' });
      return;
    }
    sendJson(response, 200, { providerConfigured: Boolean(process.env.CHAT_API_KEY) });
    return;
  }
  if (pathname === '/api/chat') {
    await handleChat(request, response);
    return;
  }

  const asset = assets[pathname];

  if (!asset) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  try {
    const content = await readFile(join(root, asset[0]));
    response.writeHead(200, {
      'Content-Type': asset[1],
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer'
    });
    response.end(content);
  } catch (error) {
    console.error(`Unable to serve ${asset[0]}:`, error);
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Unable to load this page');
  }
});

server.listen(port, () => {
  console.log(`Cinima is ready at http://localhost:${port}`);
});
