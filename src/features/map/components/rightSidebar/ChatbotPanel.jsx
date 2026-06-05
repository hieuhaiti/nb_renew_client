import { useEffect, useRef, useState } from 'react';
import { Bot, Menu, MessageSquare, Plus, Send, Sparkles, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useAuthStore from '@/stores/useAuthStore';
import useChatbotStore from '@/features/map/store/useChatbotStore';
import { useMapStore } from '@/features/map/store/useMapStore';
import {
  highlightPointOnMap,
  executeChatbotMapAction,
  clearAiMapOverlays,
} from '@/features/map/utils/MapHelper';
import { useDataLayerStore } from '@/features/map/store/useDataLayerStore';
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
  const [showQuickPromptMenu, setShowQuickPromptMenu] = useState(false);
  const bottomRef = useRef(null);
  const lastMapActionMsgRef = useRef(null);
  const quickPromptMenuRef = useRef(null);
  const quickPromptToggleRef = useRef(null);
  const [mapActionItems, setMapActionItems] = useState([]);
  const [highlightItems, setHighlightItems] = useState([]);

  useEffect(() => {
    const lastBotMsg = [...messages].reverse().find((m) => m.role === 'assistant' && m.mapActions);
    if (!lastBotMsg || lastBotMsg.id === lastMapActionMsgRef.current) return;
    lastMapActionMsgRef.current = lastBotMsg.id;

    const actions = lastBotMsg.mapActions;

    const attachAction = actions.find((a) => a.action === 'attach_items');
    setMapActionItems(attachAction?.items ?? []);

    const highlightAction = actions.find((a) => a.action === 'highlight');
    const firstSpotId = highlightAction?.spot_ids?.[0];
    setHighlightItems(firstSpotId ? [{ id: firstSpotId }] : []);

    if (!mapRef) return;

    actions.forEach((action) => executeChatbotMapAction(mapRef, action));

    // filter_layer for subcategory layers (OCOP handled inside executeChatbotMapAction)
    const filterActions = actions.filter((a) => a.action === 'filter_layer');
    if (filterActions.length > 0) {
      const { subcategories, selectedSubcategoryIds, toggleSubcategory } =
        useDataLayerStore.getState();
      filterActions.forEach(({ layers = [], visible = true }) => {
        layers.forEach((layerName) => {
          const lower = String(layerName).toLowerCase();
          if (lower === 'ocop') return; // already handled above
          const match = subcategories.find((sc) => {
            const vi = (sc.name_vi || '').toLowerCase();
            const en = (sc.name_en || '').toLowerCase();
            return (
              vi.includes(lower) || en.includes(lower) || lower.includes(vi) || lower.includes(en)
            );
          });
          if (match) {
            const isSelected = selectedSubcategoryIds.includes(match.id);
            if (Boolean(visible) !== isSelected) toggleSubcategory(match.id);
          }
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    if (!showQuickPromptMenu) return;

    const handleClickOutside = (event) => {
      if (
        quickPromptMenuRef.current?.contains(event.target) ||
        quickPromptToggleRef.current?.contains(event.target)
      ) {
        return;
      }
      setShowQuickPromptMenu(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showQuickPromptMenu]);

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
    if (mapRef) clearAiMapOverlays(mapRef);
    await switchSession(id);
    setShowHistory(false);
  };

  const handleDeleteSession = async (e, id) => {
    e.stopPropagation();
    await deleteSession(id);
  };

  const handleNewChat = () => {
    if (mapRef) clearAiMapOverlays(mapRef);
    startNewChat();
    setShowHistory(false);
  };

  const quickPrompts = [
    t('mapPage.chatbot.quickPrompts.randomSpot'),
    t('mapPage.chatbot.quickPrompts.tamChucIntro'),
    t('mapPage.chatbot.quickPrompts.ndviIndex'),
  ];

  const handleQuickPromptSelect = (prompt) => {
    setShowQuickPromptMenu(false);
    handleSend(prompt);
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col gap-3 overflow-hidden rounded-2xl border border-[var(--event-panel-border)] bg-[var(--event-panel-surface)] p-3 max-[900px]:gap-2 max-[900px]:p-2">
      {/* Header */}
      <div className="relative shrink-0 rounded-xl border border-[var(--event-panel-border)] bg-[var(--event-panel-header-bg)] px-3 py-2 max-[900px]:px-2.5 max-[900px]:py-1.5">
        <div className="flex items-start gap-3 max-[900px]:gap-2">
          <div className="bg-primary/10 text-primary ring-primary/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ring-1 max-[900px]:h-9 max-[900px]:w-9 max-[900px]:rounded-xl">
            <Bot className="size-5 max-[900px]:size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-foreground mt-1 text-lg font-bold max-[900px]:mt-0.5 max-[900px]:text-base">
              {t('mapPage.chatbot.heading')}
            </h3>
          </div>
          <div className="flex shrink-0 items-start gap-1.5">
            {messages.length === 0 && !isLoading && (
              <Button
                ref={quickPromptToggleRef}
                variant="ghost"
                type="button"
                disabled={isSending}
                onClick={() => setShowQuickPromptMenu((prev) => !prev)}
                className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex rounded-xl p-1.5 transition-colors"
                aria-label={t('mapPage.chatbot.quickPromptsLabel')}
              >
                <Sparkles className="size-4" />
              </Button>
            )}
            {isAuthenticated && (
              <Button
                variant="ghost"
                type="button"
                onClick={handleOpenHistory}
                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl p-1.5 transition-colors"
                aria-label={t('mapPage.chatbot.historyTitle')}
              >
                <Menu className="size-4.5" />
              </Button>
            )}
          </div>
        </div>

        {showQuickPromptMenu && messages.length === 0 && !isLoading && (
          <div
            ref={quickPromptMenuRef}
            className="bg-card border-border absolute top-[calc(100%+6px)] right-2 z-20 w-[min(320px,calc(100vw-72px))] rounded-xl border p-1.5 shadow-lg"
          >
            <div className="mb-1 px-2 py-1 text-xs font-medium text-[var(--event-panel-title)]">
              {t('mapPage.chatbot.quickPromptsLabel')}
            </div>
            <div className="max-h-52 space-y-1 overflow-y-auto">
              {quickPrompts.map((prompt, i) => (
                <Button
                  key={i}
                  type="button"
                  variant="ghost"
                  disabled={isSending}
                  onClick={() => handleQuickPromptSelect(prompt)}
                  className="text-foreground hover:bg-muted h-auto w-full justify-start rounded-lg px-2.5 py-2 text-left text-sm whitespace-normal"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="bg-card flex min-h-0 flex-1 flex-col rounded-2xl border p-3 shadow-sm max-[900px]:p-2">
        <div className="bg-muted/20 min-h-0 flex-1 overflow-y-auto rounded-xl border p-2 pr-1 max-[900px]:p-1.5 max-[900px]:pr-1">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <p className="typo-meta text-muted-foreground">{t('common.loading')}</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center px-4">
              <p className="typo-meta text-muted-foreground text-center">
                {t('mapPage.chatbot.emptyState')}
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-[900px]:space-y-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                >
                  <div className="max-w-[88%] space-y-1 max-[900px]:max-w-[92%] max-[900px]:space-y-0.5">
                    <div
                      className={
                        msg.role === 'user'
                          ? 'typo-caption text-primary text-right'
                          : 'typo-caption text-muted-foreground'
                      }
                    >
                      {msg.role === 'user'
                        ? t('mapPage.chatbot.youLabel')
                        : t('mapPage.chatbot.botLabel')}
                    </div>
                    <div
                      className={
                        msg.role === 'user'
                          ? 'typo-body bg-primary text-primary-foreground rounded-2xl px-3 py-2 break-words max-[900px]:px-2.5 max-[900px]:py-1.5'
                          : 'typo-body bg-card text-foreground rounded-2xl border px-3 py-2 break-words max-[900px]:px-2.5 max-[900px]:py-1.5'
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
                      {t('mapPage.chatbot.botLabel')}
                    </div>
                    <div className="typo-body bg-card text-muted-foreground rounded-2xl border px-3 py-2 break-words max-[900px]:px-2.5 max-[900px]:py-1.5">
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
          <p className="typo-meta text-destructive mt-1.5 px-1">{t('mapPage.chatbot.error')}</p>
        )}

        {/* Input bar */}
        <div className="bg-muted/20 mt-2 shrink-0 rounded-2xl border p-3 max-[900px]:mt-1.5 max-[900px]:p-2">
          <div className="typo-overline text-muted-foreground flex items-center gap-2">
            <Sparkles className="size-3.5" />
            {t('mapPage.chatbot.cta')}
          </div>
          <div className="mt-3 flex gap-2 max-[900px]:mt-2 max-[900px]:gap-1.5">
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
              placeholder={t('mapPage.chatbot.placeholder')}
              className="typo-search bg-card rounded-full"
              disabled={isSending}
            />
            <Button
              variant="default"
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
      {highlightItems.map((item) => (
        <MapActionTrigger key={`hl-${item.id}`} item={item} mapRef={mapRef} flyTo />
      ))}

      {/* History Overlay */}
      {isAuthenticated && showHistory && (
        <div className="bg-card absolute inset-0 z-10 flex flex-col overflow-hidden rounded-2xl border shadow-xl">
          {/* Overlay header */}
          <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
            <h4 className="typo-section-title text-foreground">
              {t('mapPage.chatbot.historyTitle')}
            </h4>
            <Button
              variant="ghost"
              type="button"
              onClick={() => setShowHistory(false)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl p-1.5 transition-colors"
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* New chat button */}
          <div className="shrink-0 border-b px-3 py-2">
            <Button
              variant="ghost"
              type="button"
              onClick={handleNewChat}
              className="hover:bg-muted text-primary flex w-full items-center gap-2 rounded-xl px-3 py-2 transition-colors"
            >
              <Plus className="size-4" />
              <span className="typo-body">{t('mapPage.chatbot.newChat')}</span>
            </Button>
          </div>

          {/* Sessions list */}
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {sessions.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="typo-meta text-muted-foreground text-center">
                  {t('mapPage.chatbot.noHistory')}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {sessions.map((session, index) => (
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
                          t('mapPage.chatbot.sessionLabel', { index: index + 1 })}
                      </p>
                      {session.created_at && (
                        <p className="typo-meta text-muted-foreground">
                          {new Date(session.created_at).toLocaleDateString('vi-VN')}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={(e) => handleDeleteSession(e, session.id)}
                      className="text-muted-foreground hover:text-destructive shrink-0 rounded-lg p-1 opacity-0 transition-colors group-hover:opacity-100"
                      aria-label={t('mapPage.chatbot.deleteSession')}
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
            <Button
              variant="ghost"
              type="button"
              onClick={() => setZoomImage(null)}
              className="bg-muted/90 text-muted-foreground hover:bg-muted hover:text-foreground absolute top-3 right-3 z-10 rounded-lg p-1.5 transition-colors"
            >
              <X className="size-5" />
            </Button>

            {/* Open in new tab button */}
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                window.open(zoomImage, '_blank');
              }}
              className="bg-muted/90 text-muted-foreground hover:bg-muted hover:text-foreground absolute top-3 right-14 z-10 rounded-lg p-1.5 transition-colors"
              title={t('common.open_in_new_tab')}
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
              alt={t('zoomed_image')}
              className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
