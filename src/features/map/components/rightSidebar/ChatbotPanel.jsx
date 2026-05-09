import { useEffect, useRef, useState } from 'react';
import { Bot, LogIn, Send, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useAuthStore from '@/stores/useAuthStore';
import useChatbotStore from '@/features/map/store/useChatbotStore';

export default function ChatbotPanel() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const language = i18n.language?.startsWith('vi') ? 'vi' : 'en';

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { messages, isSending, isLoading, error, sendMessage, loadRecentSession, clearSession } =
    useChatbotStore();

  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadRecentSession();
    } else {
      clearSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = (text) => {
    const msg = typeof text === 'string' ? text : input;
    if (!msg.trim() || isSending) return;
    if (typeof text !== 'string') setInput('');
    sendMessage(msg, language);
  };

  const quickPrompts = [
    t('mapPage.chatbot.quickPrompts.dayTour', { defaultValue: 'Gợi ý tour 1 ngày' }),
    t('mapPage.chatbot.quickPrompts.lessCrowded', { defaultValue: 'Điểm nào ít đông?' }),
  ];

  if (!isAuthenticated) {
    return (
      <div className="flex h-full min-h-0 flex-col items-center justify-center gap-4 p-4 text-center">
        <div className="bg-primary/10 text-primary ring-primary/20 flex h-14 w-14 items-center justify-center rounded-2xl ring-1">
          <Bot className="size-7" />
        </div>
        <div>
          <p className="typo-section-title text-foreground">
            {t('mapPage.chatbot.heading', { defaultValue: 'Chatbot đồng hành' })}
          </p>
          <p className="typo-body text-muted-foreground mt-1">
            {t('mapPage.chatbot.loginRequired', {
              defaultValue: 'Đăng nhập để sử dụng trợ lý AI cá nhân hoá.',
            })}
          </p>
        </div>
        <Button
          type="button"
          className="rounded-full"
          onClick={() => navigate('/login')}
        >
          <LogIn className="size-4" />
          {t('common.login', { defaultValue: 'Đăng nhập' })}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      {/* Header */}
      <div className="bg-card shrink-0 rounded-2xl border p-3 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary ring-primary/20 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1">
            <Bot className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="typo-overline text-muted-foreground">
              {t('mapPage.chatbot.title', { defaultValue: 'Trợ lý bản đồ' })}
            </p>
            <h3 className="typo-section-title text-foreground mt-1">
              {t('mapPage.chatbot.heading', { defaultValue: 'Chatbot đồng hành' })}
            </h3>
            <p className="typo-body text-muted-foreground mt-1">
              {t('mapPage.chatbot.description', {
                defaultValue:
                  'Hỏi nhanh về tour, thời tiết, OCOP và nhận gợi ý lịch trình cá nhân hoá.',
              })}
            </p>
          </div>
        </div>

        {messages.length === 0 && !isLoading && (
          <div className="mt-3 flex flex-wrap gap-2">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                disabled={isSending}
                onClick={() => handleSend(prompt)}
                className="typo-badge border-border/70 bg-muted/40 hover:bg-muted text-foreground rounded-full border px-2.5 py-1 transition-colors disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="bg-card flex min-h-0 flex-1 flex-col rounded-2xl border p-3 shadow-sm">
        <div className="bg-muted/20 min-h-0 flex-1 overflow-y-auto rounded-xl border p-2 pr-1">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <p className="typo-meta text-muted-foreground">
                {t('common.loading', { defaultValue: 'Đang tải...' })}
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center px-4">
              <p className="typo-meta text-muted-foreground text-center">
                {t('mapPage.chatbot.emptyState', {
                  defaultValue:
                    'Hãy bắt đầu cuộc trò chuyện hoặc chọn gợi ý phía trên.',
                })}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                >
                  <div className="max-w-[88%] space-y-1">
                    <div
                      className={
                        msg.role === 'user'
                          ? 'typo-caption text-right text-primary'
                          : 'typo-caption text-muted-foreground'
                      }
                    >
                      {msg.role === 'user'
                        ? t('mapPage.chatbot.youLabel', { defaultValue: 'Bạn' })
                        : t('mapPage.chatbot.botLabel', { defaultValue: 'Trợ lý AI' })}
                    </div>
                    <div
                      className={
                        msg.role === 'user'
                          ? 'typo-body bg-primary text-primary-foreground rounded-2xl px-3 py-2'
                          : 'typo-body bg-card text-foreground rounded-2xl border px-3 py-2'
                      }
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start">
                  <div className="max-w-[88%] space-y-1">
                    <div className="typo-caption text-muted-foreground">
                      {t('mapPage.chatbot.botLabel', { defaultValue: 'Trợ lý AI' })}
                    </div>
                    <div className="typo-body bg-card text-muted-foreground rounded-2xl border px-3 py-2">
                      <span className="inline-flex items-center gap-0.5">
                        <span className="animate-bounce" style={{ animationDelay: '0ms' }}>•</span>
                        <span className="animate-bounce" style={{ animationDelay: '150ms' }}>•</span>
                        <span className="animate-bounce" style={{ animationDelay: '300ms' }}>•</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {error === 'send_failed' && (
          <p className="typo-meta text-destructive mt-1.5 px-1">
            {t('mapPage.chatbot.error', { defaultValue: 'Gửi thất bại. Vui lòng thử lại.' })}
          </p>
        )}

        {/* Input bar */}
        <div className="bg-muted/20 mt-2 shrink-0 rounded-2xl border p-3">
          <div className="typo-overline text-muted-foreground flex items-center gap-2">
            <Sparkles className="size-3.5" />
            {t('mapPage.chatbot.cta', { defaultValue: 'Trò chuyện cùng chatbot' })}
          </div>
          <div className="mt-3 flex gap-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={t('mapPage.chatbot.placeholder', {
                defaultValue: 'Nhập câu hỏi về điểm đến, tour hoặc thời tiết...',
              })}
              className="typo-search bg-card rounded-full"
              disabled={isSending}
            />
            <Button
              type="button"
              className="bg-primary hover:bg-primary/90 rounded-full px-3"
              onClick={() => handleSend()}
              disabled={isSending || !input.trim()}
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
