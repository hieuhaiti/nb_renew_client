import { Bot, Send, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function ChatbotPanel() {
  const { t } = useTranslation();

  const quickPrompts = [
    t('mapPage.chatbot.quickPrompts.dayTour', { defaultValue: 'Gợi ý tour 1 ngày' }),
    t('mapPage.chatbot.quickPrompts.lessCrowded', { defaultValue: 'Điểm nào ít đông?' }),
  ];

  const mockMessages = [
    {
      role: 'bot',
      text: t('mapPage.chatbot.sampleMessages.welcome', {
        defaultValue:
          'Xin chào, tôi có thể gợi ý điểm đến, thời tiết, tour và lịch trình phù hợp với bạn.',
      }),
    },
    {
      role: 'user',
      text: t('mapPage.chatbot.sampleMessages.userPreference', {
        defaultValue: 'Tôi muốn đi 1 ngày, tránh nơi quá đông và ưu tiên thiên nhiên.',
      }),
    },
    {
      role: 'bot',
      text: t('mapPage.chatbot.sampleMessages.botSuggestion', {
        defaultValue:
          'Bạn có thể cân nhắc Tràng An buổi sáng, sau đó sang Bích Động hoặc Hang Múa để di chuyển nhẹ nhàng hơn.',
      }),
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <div className="bg-card shrink-0 rounded-2xl border p-3 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary ring-primary/20 flex h-11 w-11 items-center justify-center rounded-2xl ring-1">
            <Bot className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="typo-overline text-muted-foreground">
              {t('mapPage.chatbot.title', { defaultValue: 'Trợ lý bản đồ' })}
            </p>
            <h3 className="typo-section-title text-foreground mt-1">
              {t('mapPage.chatbot.heading', {
                defaultValue: t('home.chatbot_title', { defaultValue: 'Chatbot đồng hành' }),
              })}
            </h3>
            <p className="typo-body text-muted-foreground mt-1">
              {t('mapPage.chatbot.description', {
                defaultValue: t('home.chatbot_desc', {
                  defaultValue:
                    'Hỏi nhanh về tour, thời tiết, OCOP và nhận gợi ý lịch trình cá nhân hoá.',
                }),
              })}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {quickPrompts.map((prompt, index) => (
            <Badge
              key={`${prompt}-${index}`}
              variant="secondary"
              className="typo-badge border-border/70 bg-muted/40 text-foreground rounded-full border px-2.5 py-1"
            >
              {prompt}
            </Badge>
          ))}
        </div>
      </div>

      <div className="bg-card flex min-h-0 flex-1 flex-col rounded-2xl border p-3 shadow-sm">
        <div className="bg-muted/20 min-h-0 flex-1 space-y-2 overflow-y-auto rounded-xl border p-2 pr-1">
          {mockMessages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
            >
              <div className="max-w-[88%] space-y-1">
                <div
                  className={
                    message.role === 'user'
                      ? 'typo-caption text-right text-primary'
                      : 'typo-caption text-muted-foreground'
                  }
                >
                  {message.role === 'user'
                    ? t('mapPage.chatbot.youLabel', { defaultValue: 'Bạn' })
                    : t('mapPage.chatbot.botLabel', { defaultValue: 'Trợ lý AI' })}
                </div>
                <div
                  className={
                    message.role === 'user'
                      ? 'typo-body bg-primary text-primary-foreground rounded-2xl px-3 py-2'
                      : 'typo-body bg-card text-foreground rounded-2xl border px-3 py-2'
                  }
                >
                  {message.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted/20 mt-2 shrink-0 rounded-2xl border p-3">
          <div className="typo-overline text-muted-foreground flex items-center gap-2">
            <Sparkles className="size-3.5" />
            {t('mapPage.chatbot.cta', {
              defaultValue: t('home.chatbot_cta', { defaultValue: 'Trò chuyện cùng chatbot' }),
            })}
          </div>
          <div className="mt-3 flex gap-2">
            <Input
              type="text"
              placeholder={t('mapPage.chatbot.placeholder', {
                defaultValue: 'Nhập câu hỏi về điểm đến, tour hoặc thời tiết...',
              })}
              className="typo-search bg-card rounded-full"
            />
            <Button
              type="button"
              className="bg-primary hover:bg-primary/90 rounded-full px-3"
              onClick={() => {
                // TODO: nối API chatbot / streaming response khi backend sẵn sàng.
              }}
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
