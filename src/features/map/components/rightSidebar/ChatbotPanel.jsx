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
import cucPhuongImage from '@/assets/images/cucPhuong.png';

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
  const [showNdviResponse, setShowNdviResponse] = useState(false);
  const [isMockLoading, setIsMockLoading] = useState(false);
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

    // Check if it's the NDVI prompt
    const ndviPrompt = quickPrompts[2];
    if (msg === ndviPrompt) {
      // FIXME: This is a mock response, replace with actual API call when backend is ready
      sendMessage(msg, language);
      setIsMockLoading(true);
      // Simulate API response delay
      setTimeout(() => {
        setIsMockLoading(false);
        setShowNdviResponse(true);
      }, 4000);
    } else {
      setShowNdviResponse(false);
      sendMessage(msg, language);
    }
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
    setShowNdviResponse(false);
    setIsMockLoading(false);
  };

  const ndviContent =
    language === 'vi'
      ? `Kết quả biểu đồ cho thấy chỉ số thực vật **NDVI tại Cúc Phương duy trì ở mức cao và khá ổn định** trong toàn bộ giai đoạn quan sát.

### 1. NDVI duy trì ở mức cao

Giá trị NDVI chủ yếu dao động trong khoảng:

- **0.75 – 0.88**

Đây là mức NDVI cao, phản ánh khu vực có **lớp phủ thực vật dày, xanh và ổn định**. Điều này phù hợp với đặc điểm của **Vườn quốc gia Cúc Phương**, nơi có hệ sinh thái rừng tự nhiên phát triển tốt.

### 2. Không xuất hiện dấu hiệu suy giảm nghiêm trọng

Trên biểu đồ, ngưỡng cảnh báo được đặt tại:

- **NDVI = 0.5**

Toàn bộ giá trị NDVI thực tế và NDVI dự báo đều nằm **cao hơn đáng kể so với ngưỡng 0.5**.

Vì vậy, có thể nhận định rằng:

> Khu vực Cúc Phương chưa xuất hiện tín hiệu suy giảm thực vật nghiêm trọng theo ngưỡng cảnh báo NDVI 0.5.

### 3. Có dao động theo mùa

Chuỗi NDVI xuất hiện các nhịp tăng giảm lặp lại theo thời gian. Một số giai đoạn NDVI giảm xuống khoảng **0.70 – 0.78**, sau đó tăng trở lại mức **0.85 – 0.88**.

Các dao động này có thể liên quan đến:

- Sự thay đổi theo mùa;
- Lượng mưa và độ ẩm;
- Ảnh hưởng của mây hoặc điều kiện khí tượng;
- Chu kỳ sinh trưởng tự nhiên của thảm thực vật.

![Cúc Phương NDVI](${cucPhuongImage})`
      : `The graph shows that the **NDVI vegetation index at Cuc Phuong remains at a high and stable level** throughout the entire observation period.

### 1. NDVI remains at high level

NDVI values mainly fluctuate in the range:

- **0.75 – 0.88**

This is a high NDVI level, reflecting an area with **thick, green and stable vegetation cover**. This is consistent with the characteristics of **Cuc Phuong National Park**, which has a well-developed natural forest ecosystem.

### 2. No signs of severe degradation

On the graph, the warning threshold is set at:

- **NDVI = 0.5**

Both actual NDVI values and predicted NDVI values are **significantly higher than the 0.5 threshold**.

Therefore, it can be concluded that:

> The Cuc Phuong area has not shown signs of serious vegetation degradation according to the NDVI warning threshold of 0.5.

### 3. Seasonal fluctuations present

The NDVI series shows recurring cycles of increase and decrease over time. In some periods, NDVI decreases to around **0.70 – 0.78**, then increases back to the level of **0.85 – 0.88**.

These fluctuations may be related to:

- Seasonal changes;
- Rainfall and humidity;
- Cloud or weather condition effects;
- Natural growth cycles of vegetation.

![Cuc Phuong NDVI](${cucPhuongImage})`;

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
        <Button type="button" className="rounded-full" onClick={() => navigate('/login')}>
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
          <button
            type="button"
            onClick={handleOpenHistory}
            className="text-muted-foreground hover:text-foreground hover:bg-muted shrink-0 rounded-xl p-1.5 transition-colors"
            aria-label={t('mapPage.chatbot.historyTitle', { defaultValue: 'Lịch sử trò chuyện' })}
          >
            <Menu className="size-4.5" />
          </button>
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
                                src={src}
                                alt={alt}
                                className="mt-2 max-w-full cursor-pointer rounded-lg transition-opacity hover:opacity-80"
                                onClick={() => setZoomImage(src)}
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

              {isMockLoading && (
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

              {showNdviResponse && (
                <div className="flex justify-start">
                  <div className="max-w-[88%] space-y-1">
                    <div className="typo-caption text-muted-foreground">
                      {t('mapPage.chatbot.botLabel', { defaultValue: 'Trợ lý AI' })}
                    </div>
                    <div className="typo-body bg-card text-foreground rounded-2xl border px-3 py-2">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                          strong: ({ children }) => (
                            <strong className="font-semibold">{children}</strong>
                          ),
                          h3: ({ children }) => (
                            <h3 className="mt-2 mb-1 font-semibold">{children}</h3>
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
                              src={src}
                              alt={alt}
                              className="mt-2 max-w-full cursor-pointer rounded-lg transition-opacity hover:opacity-80"
                              onClick={() => setZoomImage(src)}
                            />
                          ),
                        }}
                      >
                        {ndviContent}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}

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
            <button
              type="button"
              onClick={() => setShowHistory(false)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl p-1.5 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* New chat button */}
          <div className="shrink-0 border-b px-3 py-2">
            <button
              type="button"
              onClick={handleNewChat}
              className="hover:bg-muted text-primary flex w-full items-center gap-2 rounded-xl px-3 py-2 transition-colors"
            >
              <Plus className="size-4" />
              <span className="typo-body">
                {t('mapPage.chatbot.newChat', { defaultValue: 'Cuộc trò chuyện mới' })}
              </span>
            </button>
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
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSession(e, session.id)}
                      className="text-muted-foreground hover:text-destructive shrink-0 rounded-lg p-1 opacity-0 transition-colors group-hover:opacity-100"
                      aria-label={t('mapPage.chatbot.deleteSession', { defaultValue: 'Xóa phiên' })}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
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
            <button
              type="button"
              onClick={() => setZoomImage(null)}
              className="bg-muted/90 text-muted-foreground hover:bg-muted hover:text-foreground absolute top-3 right-3 z-10 rounded-lg p-1.5 transition-colors"
            >
              <X className="size-5" />
            </button>

            {/* Open in new tab button */}
            <button
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
            </button>

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
