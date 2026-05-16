import { useEffect, useRef, useState } from 'react';
import { Bot, LogIn, Menu, MessageSquare, Plus, Send, Sparkles, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useAuthStore from '@/stores/useAuthStore';
import useChatbotStore from '@/features/map/store/useChatbotStore';
import { useMapStore } from '@/features/map/store/useMapStore';
import { highlightPointOnMap } from '@/features/map/utils/MapHelper';
import { useGetDataPointById } from '@/services/api/tourism-points/tourismPointsApi';
import { withBaseUrl } from '@/lib/utils';

function MapActionTrigger({ item, mapRef, flyTo }) {
  const { data, isSuccess } = useGetDataPointById({ point_id: item.id });

  useEffect(() => {
    if (!isSuccess || !mapRef || !flyTo) return;
    const point = data?.data ?? data ?? {};
    const lat = point.lat ?? item.lat;
    const lng = point.lng ?? item.lng;
    if (lat == null || lng == null) return;
    highlightPointOnMap(mapRef, {
      id: item.id,
      coordinates: [lng, lat],
      properties: { ...item, ...point },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return null;
}

export default function ChatbotPanel() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const language = i18n.language?.startsWith('vi') ? 'vi' : 'en';

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const mapRef = useMapStore((s) => s.mapRef);
  const {
    sessions,
    messages,
    isSending,
    isLoading,
    error,
    sendMessage,
    loadRecentSession,
    loadAllSessions,
    switchSession,
    deleteSession,
    startNewChat,
    clearSession,
  } = useChatbotStore();

  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);
  const bottomRef = useRef(null);
  const lastMapActionMsgRef = useRef(null);
  const [mapActionItems, setMapActionItems] = useState([]);

  useEffect(() => {
    const lastBotMsg = [...messages].reverse().find((m) => m.role === 'assistant' && m.mapActions);
    if (!lastBotMsg || lastBotMsg.id === lastMapActionMsgRef.current) return;
    lastMapActionMsgRef.current = lastBotMsg.id;
    const attachAction = lastBotMsg.mapActions.find((a) => a.action === 'attach_items');
    setMapActionItems(attachAction?.items ?? []);
  }, [messages]);

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

  const handleOpenHistory = () => {
    loadAllSessions();
    setShowHistory(true);
  };

  const handleSelectSession = async (id) => {
    await switchSession(id);
    setShowHistory(false);
  };

  const handleDeleteSession = async (e, id) => {
    e.stopPropagation();
    await deleteSession(id);
  };

  const handleNewChat = () => {
    startNewChat();
    setShowHistory(false);
  };

  const quickPrompts = [
    t('mapPage.chatbot.quickPrompts.randomSpot', {
      defaultValue:
        language === 'vi' ? 'Gợi ý 1 điểm du lịch ngẫu nhiên' : 'Suggest one random tourist spot',
    }),
    t('mapPage.chatbot.quickPrompts.tamChucIntro', {
      defaultValue: language === 'vi' ? 'Giới thiệu về chùa Tam Chúc' : 'Introduce Tam Chuc Temple',
    }),
    t('mapPage.chatbot.quickPrompts.ndviIndex', {
      defaultValue:
        language === 'vi'
          ? 'Chỉ số thực vật ở Cúc Phương ra sao?'
          : 'How is vegetation index at Cuc Phuong?',
    }),
  ];

  if (!isAuthenticated) {
    return (
      <div className="flex h-full min-h-0 flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--event-panel-border)] bg-[var(--event-panel-surface)] p-4 text-center">
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
        <Button variant="ghost" type="button" className="rounded-full" onClick={() => navigate('/login')}>
          <LogIn className="size-4" />
          {t('common.login', { defaultValue: 'Đăng nhập' })}
        </Button>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col gap-3 overflow-hidden rounded-2xl border border-[var(--event-panel-border)] bg-[var(--event-panel-surface)] p-3">
      {/* Header */}
      <div className="shrink-0 rounded-xl border border-[var(--event-panel-border)] bg-[var(--event-panel-header-bg)] px-3 py-2">
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
          <Button variant="ghost"
            type="button"
            onClick={handleOpenHistory}
            className="text-muted-foreground hover:text-foreground hover:bg-muted shrink-0 rounded-xl p-1.5 transition-colors"
            aria-label={t('mapPage.chatbot.historyTitle', { defaultValue: 'Lịch sử trò chuyện' })}
          >
            <Menu className="size-4.5" />
          </Button>
        </div>

        {messages.length === 0 && !isLoading && (
          <div className="mt-3 flex flex-wrap gap-2">
            {quickPrompts.map((prompt, i) => (
              <Button variant="ghost"
                key={i}
                type="button"
                disabled={isSending}
                onClick={() => handleSend(prompt)}
                className="typo-badge border-border/70 bg-muted/40 hover:bg-muted text-foreground rounded-full border px-2.5 py-1 transition-colors disabled:opacity-50"
              >
                {prompt}
              </Button>
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
                  defaultValue: 'Hãy bắt đầu cuộc trò chuyện hoặc chọn gợi ý phía trên.',
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
                          ? 'typo-caption text-primary text-right'
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
                      {msg.role === 'user' ? (
                        msg.content
                      ) : (
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                            strong: ({ children }) => (
                              <strong className="font-semibold">{children}</strong>
                            ),
                            ul: ({ children }) => (
                              <ul className="my-1 ml-4 list-disc space-y-0.5">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="my-1 ml-4 list-decimal space-y-0.5">{children}</ol>
                            ),
                            li: ({ children }) => <li>{children}</li>,
                            img: ({ src, alt }) => (
                              <img
                                src={withBaseUrl(src)}
                                alt={alt}
                                className="mt-2 max-w-full cursor-pointer rounded-lg transition-opacity hover:opacity-80"
                                onClick={() => setZoomImage(withBaseUrl(src))}
                              />
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      )}
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
                        <span className="animate-bounce" style={{ animationDelay: '0ms' }}>
                          •
                        </span>
                        <span className="animate-bounce" style={{ animationDelay: '150ms' }}>
                          •
                        </span>
                        <span className="animate-bounce" style={{ animationDelay: '300ms' }}>
                          •
                        </span>
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
            <Button variant="default"
              type="button"
              className="rounded-full px-3"
              onClick={() => handleSend()}
              disabled={isSending || !input.trim()}
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {mapActionItems.map((item, i) => (
        <MapActionTrigger key={item.id} item={item} mapRef={mapRef} flyTo={i === 0} />
      ))}

      {/* History Overlay */}
      {showHistory && (
        <div className="bg-card absolute inset-0 z-10 flex flex-col overflow-hidden rounded-2xl border shadow-xl">
          {/* Overlay header */}
          <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
            <h4 className="typo-section-title text-foreground">
              {t('mapPage.chatbot.historyTitle', { defaultValue: 'Lịch sử trò chuyện' })}
            </h4>
            <Button variant="ghost"
              type="button"
              onClick={() => setShowHistory(false)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl p-1.5 transition-colors"
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* New chat button */}
          <div className="shrink-0 border-b px-3 py-2">
            <Button variant="ghost"
              type="button"
              onClick={handleNewChat}
              className="hover:bg-muted text-primary flex w-full items-center gap-2 rounded-xl px-3 py-2 transition-colors"
            >
              <Plus className="size-4" />
              <span className="typo-body">
                {t('mapPage.chatbot.newChat', { defaultValue: 'Cuộc trò chuyện mới' })}
              </span>
            </Button>
          </div>

          {/* Sessions list */}
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {sessions.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="typo-meta text-muted-foreground text-center">
                  {t('mapPage.chatbot.noHistory', {
                    defaultValue: 'Chưa có cuộc trò chuyện nào.',
                  })}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectSession(session.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSelectSession(session.id)}
                    className="hover:bg-muted group flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 transition-colors"
                  >
                    <MessageSquare className="text-muted-foreground size-4 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="typo-body text-foreground truncate">
                        {session.title ??
                          session.name ??
                          t('mapPage.chatbot.sessionLabel', {
                            defaultValue: 'Phiên {{id}}',
                            id: String(session.id).slice(0, 8),
                          })}
                      </p>
                      {session.created_at && (
                        <p className="typo-meta text-muted-foreground">
                          {new Date(session.created_at).toLocaleDateString('vi-VN')}
                        </p>
                      )}
                    </div>
                    <Button variant="ghost"
                      type="button"
                      onClick={(e) => handleDeleteSession(e, session.id)}
                      className="text-muted-foreground hover:text-destructive shrink-0 rounded-lg p-1 opacity-0 transition-colors group-hover:opacity-100"
                      aria-label={t('mapPage.chatbot.deleteSession', { defaultValue: 'Xóa phiên' })}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setZoomImage(null)}
        >
          <div
            className="bg-card relative max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <Button variant="ghost"
              type="button"
              onClick={() => setZoomImage(null)}
              className="bg-muted/90 text-muted-foreground hover:bg-muted hover:text-foreground absolute top-3 right-3 z-10 rounded-lg p-1.5 transition-colors"
            >
              <X className="size-5" />
            </Button>

            {/* Open in new tab button */}
            <Button variant="ghost"
              type="button"
              onClick={() => {
                window.open(zoomImage, '_blank');
              }}
              className="bg-muted/90 text-muted-foreground hover:bg-muted hover:text-foreground absolute top-3 right-14 z-10 rounded-lg p-1.5 transition-colors"
              title="Open in new tab"
            >
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </Button>

            {/* Image */}
            <img
              src={zoomImage}
              alt="Zoomed"
              className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}


