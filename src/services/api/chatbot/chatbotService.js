import apiClient from '@/services/apiClient';

/** POST /chatbot/sessions  →  { id, language, session_type, ... } */
export async function createChatSession(language = 'vi') {
  const res = await apiClient.post('/chatbot/sessions', { language });
  return res.data?.data ?? res.data;
}

/** GET /chatbot/sessions  →  { items: [...], pagination: {...} } */
export async function listChatSessions() {
  const res = await apiClient.get('/chatbot/sessions');
  const payload = res.data?.data ?? res.data;
  return Array.isArray(payload) ? payload : (payload?.items ?? []);
}

/** GET /chatbot/sessions/:id  →  session + messages array */
export async function getSessionMessages(sessionId) {
  if (!sessionId) return [];
  const res = await apiClient.get(`/chatbot/sessions/${sessionId}`);
  const payload = res.data?.data ?? res.data;
  return normalizeMessages(payload);
}

/** POST /chatbot/sessions/:id/messages  →  bot reply data */
export async function sendMessage(sessionId, message, language = 'vi') {
  const res = await apiClient.post(`/chatbot/sessions/${sessionId}/messages`, {
    message,
    language,
  });
  return res.data?.data ?? res.data;
}

/** DELETE /chatbot/sessions/:id */
export async function deleteChatSession(sessionId) {
  const res = await apiClient.delete(`/chatbot/sessions/${sessionId}`);
  return res.data;
}

/**
 * Extract map_actions array from the send-message response.
 * Returns null if absent or empty.
 */
export function extractMapActions(data) {
  const actions = data?.map_actions;
  return Array.isArray(actions) && actions.length > 0 ? actions : null;
}

/**
 * Extract the bot reply string from the send-message response.
 * Handles multiple common API shapes.
 */
export function extractBotReply(data) {
  if (!data) return null;
  // Actual API shape: { message: { role, content, ... }, map_actions: [] }
  if (data.message && typeof data.message === 'object' && data.message.content)
    return String(data.message.content);
  if (data.reply?.content) return String(data.reply.content);
  if (data.bot_message?.content) return String(data.bot_message.content);
  if (data.assistant_message?.content) return String(data.assistant_message.content);
  if (typeof data.reply === 'string') return data.reply;
  if (typeof data.response === 'string') return data.response;
  if (typeof data.content === 'string') return data.content;
  if (typeof data.message === 'string' && data.message.length > 30) return data.message;
  return null;
}

function normalizeMessages(payload) {
  const raw =
    payload?.messages ??
    payload?.items ??
    (Array.isArray(payload) ? payload : []);
  return raw.map((m, i) => ({
    id: m.id ?? `msg-${i}`,
    role: m.role ?? (m.sender === 'bot' ? 'assistant' : 'user'),
    content: m.content ?? m.text ?? m.message ?? '',
    createdAt: m.created_at ?? m.createdAt ?? new Date().toISOString(),
  }));
}
