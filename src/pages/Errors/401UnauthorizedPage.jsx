import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ErrorPage from './ErrorPage';
import { ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export default function UnauthorizedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <ErrorPage
      code={401}
      color="text-[var(--error-401)]"
      icon={<ShieldOff size={80} strokeWidth={1.5} />}
      titleKey="error.401.title"
      messageKey="error.401.message"
      actionKey="error.back_home"
      actionPath="/"
      secondaryAction={
        <Button
          id="error-401-login-btn"
          variant="outline"
          onClick={() => navigate('/login')}
          className="rounded-full px-6"
        >
          <LogIn size={16} className="mr-2" />
          {t('error.login')}
        </Button>
      }
    />
  );
}
