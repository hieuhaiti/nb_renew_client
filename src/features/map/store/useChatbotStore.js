import { create } from 'zustand';
import {
  createChatSession,
  listChatSessions,
  getSessionMessages,
  sendMessage as apiSendMessage,
  deleteChatSession,
  extractBotReply,
  extractMapActions,
} from '@/services/api/chatbot/chatbotService';
import useAuthStore from '@/stores/useAuthStore';
import { getAnonymousId } from '@/lib/anonymousId';
import { tokenManager } from '@/lib/tokenManager';

function resolveAnonymousId() {
  const hasAccessToken = !!tokenManager.getAccessToken();
  return hasAccessToken ? null : getAnonymousId();
}

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
      const anonymousId = resolveAnonymousId();
      const sessions = await listChatSessions(anonymousId);
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
      const anonymousId = resolveAnonymousId();
      const sessions = await listChatSessions(anonymousId);
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
      const anonymousId = resolveAnonymousId();
      await deleteChatSession(id, anonymousId);
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

    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    const anonymousId = isAuthenticated ? resolveAnonymousId() : getAnonymousId();

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
        const session = await createChatSession(language, anonymousId);
        sid = session.id;
        set((s) => ({
          sessionId: sid,
          sessions: s.sessions.some((x) => x.id === sid) ? s.sessions : [session, ...s.sessions],
        }));
      }

      const data = await apiSendMessage(sid, trimmed, language, anonymousId);
      const msgData = data?.message && typeof data.message === 'object' ? data.message : null;
      const botMsg = {
        id: msgData?.id ? String(msgData.id) : `bot-${Date.now()}`,
        role: 'assistant',
        content: msgData?.content ?? extractBotReply(data) ?? '…',
        createdAt: msgData?.created_at ?? new Date().toISOString(),
        mapActions: extractMapActions(data),
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
    set({
      sessionId: null,
      sessions: [],
      messages: [],
      isSending: false,
      isLoading: false,
      error: null,
    });
  },
}));

export default useChatbotStore;
