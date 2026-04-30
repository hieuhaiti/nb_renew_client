import { Bot, Send, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const mockMessages = [
  {
    role: 'bot',
    text: 'Xin chào, tôi có thể gợi ý điểm đến, thời tiết, tour và lịch trình phù hợp với bạn.',
  },
  {
    role: 'user',
    text: 'Tôi muốn đi 1 ngày, tránh nơi quá đông và ưu tiên thiên nhiên.',
  },
  {
    role: 'bot',
    text: 'B?n c? th? c?n nh?c Tr?ng An bu?i s?ng, sau ?? sang B?ch ??ng ho?c Hang M?a ?? di chuy?n nh? nh?ng h?n.',
  },
];

const quickPrompts = ['G?i ? tour 1 ng?y', '?i?m n?o ?t ??ng?', 'T? v?n th?i ti?t h?m nay'];

export default function ChatbotPanel() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-2xl border p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-2xl">
            <Bot className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {t('mapPage.chatbot.title', {
                defaultValue: t('home.chatbot_title', { defaultValue: 'Chatbot đồng hành' }),
              })}
            </p>
            <h3 className="text-foreground mt-1 text-base font-semibold">
              {t('home.chatbot_title', { defaultValue: 'Chatbot đồng hành' })}
            </h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {t('home.chatbot_desc', {
                defaultValue:
                  'Hỏi nhanh về tour, thời tiết, OCOP và nhận gợi ý lịch trình cá nhân hoá.',
              })}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <Badge key={prompt} variant="secondary" className="rounded-full px-3 py-1 text-xs">
              {prompt}
            </Badge>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl border p-4 shadow-sm">
        <div className="space-y-3">
          {mockMessages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
            >
              <div
                className={
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground max-w-[88%] rounded-2xl px-3 py-2 text-sm'
                    : 'bg-muted/40 text-foreground max-w-[88%] rounded-2xl border px-3 py-2 text-sm'
                }
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted/20 mt-4 rounded-2xl border p-3">
          <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
            <Sparkles className="size-3.5" />
            {t('home.chatbot_cta', { defaultValue: 'Trò chuyện cùng chatbot' })}
          </div>
          <div className="mt-3 flex gap-2">
            <Input
              type="text"
              placeholder={t('mapPage.chatbot.placeholder', {
                defaultValue: 'Nhập câu hỏi về điểm đến, tour hoặc thời tiết...',
              })}
              className="rounded-full"
            />
            <Button
              type="button"
              className="rounded-full"
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
