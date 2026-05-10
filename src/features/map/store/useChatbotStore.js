import { create } from 'zustand';
import {
  createChatSession,
  listChatSessions,
  getSessionMessages,
  sendMessage as apiSendMessage,
  deleteChatSession,
  extractBotReply,
} from '@/services/api/chatbot/chatbotService';

const useChatbotStore = create((set, get) => ({
  sessionId: null,
  sessions: [],
  messages: [],
  isSending: false,
  isLoading: false,
  error: null,

  async loadRecentSession() {
    const { sessionId } = get();
    if (sessionId) return;
    set({ isLoading: true, error: null });
    try {
      const sessions = await listChatSessions();
      set({ sessions });
      if (sessions.length === 0) {
        set({ isLoading: false });
        return;
      }
      const latest = sessions[0];
      const msgs = await getSessionMessages(latest.id);
      set({ sessionId: latest.id, messages: msgs, isLoading: false });
    } catch (_err) {
      set({ isLoading: false });
    }
  },

  async loadAllSessions() {
    try {
      const sessions = await listChatSessions();
      set({ sessions });
    } catch (_err) {}
  },

  async switchSession(id) {
    if (get().sessionId === id) return;
    set({ isLoading: true, error: null });
    try {
      const msgs = await getSessionMessages(id);
      set({ sessionId: id, messages: msgs, isLoading: false });
    } catch (_err) {
      set({ isLoading: false });
    }
  },

  async deleteSession(id) {
    try {
      await deleteChatSession(id);
    } catch (_err) {}
    const { sessionId, sessions } = get();
    const remaining = sessions.filter((s) => s.id !== id);
    if (sessionId === id) {
      // Go to blank "new chat" state — session is created on next send
      set({ sessionId: null, messages: [], sessions: remaining, error: null });
    } else {
      set({ sessions: remaining });
    }
  },

  startNewChat() {
    set({ sessionId: null, messages: [], isSending: false, error: null });
  },

  async sendMessage(text, language = 'vi') {
    const trimmed = text?.trim();
    if (!trimmed || get().isSending) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ messages: [...s.messages, userMsg], isSending: true, error: null }));

    try {
      let sid = get().sessionId;
      if (!sid) {
        const session = await createChatSession(language);
        sid = session.id;
        set((s) => ({
          sessionId: sid,
          sessions: s.sessions.some((x) => x.id === sid)
            ? s.sessions
            : [session, ...s.sessions],
        }));
      }

      const data = await apiSendMessage(sid, trimmed, language);
      const msgData = data?.message && typeof data.message === 'object' ? data.message : null;
      const botMsg = {
        id: msgData?.id ? String(msgData.id) : `bot-${Date.now()}`,
        role: 'assistant',
        content: msgData?.content ?? extractBotReply(data) ?? '…',
        createdAt: msgData?.created_at ?? new Date().toISOString(),
      };
      set((s) => ({ messages: [...s.messages, botMsg], isSending: false }));
    } catch (_err) {
      set((s) => ({
        isSending: false,
        error: 'send_failed',
        messages: s.messages.filter((m) => m.id !== userMsg.id),
      }));
    }
  },

  clearSession() {
    set({ sessionId: null, sessions: [], messages: [], isSending: false, isLoading: false, error: null });
  },
}));

export default useChatbotStore;
