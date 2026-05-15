import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Shared Error Page layout.
 * @param {{ code: string|number, color: string, icon: React.ReactNode, titleKey: string, messageKey: string, actionKey: string, actionPath: string, secondaryAction?: React.ReactNode }} props
 */
export default function ErrorPage({
  code,
  color = 'text-primary',
  icon,
  titleKey,
  messageKey,
  actionKey = 'error.back_home',
  actionPath = '/',
  secondaryAction,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <main className="bg-background grid min-h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        {/* Icon */}
        <div className={`mb-4 flex justify-center ${color}`}>
          {icon || <TriangleAlert size={80} strokeWidth={1.5} />}
        </div>

        {/* Error code */}
        <p
          className={`mb-4 text-7xl font-black tracking-tighter drop-shadow-sm sm:text-9xl ${color}`}
        >
          {code}
        </p>

        {/* Title */}
        <h1 className="text-foreground mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          {t(titleKey)}
        </h1>

        {/* Message */}
        <p className="text-muted-foreground mt-4 text-sm leading-relaxed sm:text-lg 2xl:text-base">
          {t(messageKey)}
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button
            id={`error-${code}-action-btn`}
            onClick={() => navigate(actionPath)}
            className="rounded-full px-6"
          >
            <Home size={16} className="mr-2" />
            {t(actionKey)}
          </Button>
          {secondaryAction}
        </div>
      </div>
    </main>
  );
}
