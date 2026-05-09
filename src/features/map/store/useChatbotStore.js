import { create } from 'zustand';
import {
  createChatSession,
  listChatSessions,
  getSessionMessages,
  sendMessage as apiSendMessage,
  extractBotReply,
} from '@/services/api/chatbot/chatbotService';

const useChatbotStore = create((set, get) => ({
  sessionId: null,
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
      if (sessions.length === 0) {
        set({ isLoading: false });
        return;
      }
      // API returns sessions sorted newest-first; take index 0
      const latest = sessions[0];
      const msgs = await getSessionMessages(latest.id);
      set({ sessionId: latest.id, messages: msgs, isLoading: false });
    } catch (_err) {
      set({ isLoading: false });
    }
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
        set({ sessionId: sid });
      }

      const data = await apiSendMessage(sid, trimmed, language);
      const reply = extractBotReply(data);

      const botMsg = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: reply ?? '…',
        createdAt: new Date().toISOString(),
      };
      set((s) => ({ messages: [...s.messages, botMsg], isSending: false }));
    } catch (_err) {
      set((s) => ({
        isSending: false,
        error: 'send_failed',
        // Remove the optimistic user message on hard failure
        messages: s.messages.filter((m) => m.id !== userMsg.id),
      }));
    }
  },

  clearSession() {
    set({ sessionId: null, messages: [], isSending: false, isLoading: false, error: null });
  },
}));

export default useChatbotStore;
