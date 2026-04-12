import React from 'react';
import ErrorPage from './ErrorPage';
import { WifiOff } from 'lucide-react';

export default function ServiceUnavailablePage() {
  return (
    <ErrorPage
      code={503}
      color="text-[var(--error-503)]"
      icon={<WifiOff size={80} strokeWidth={1.5} />}
      titleKey="error.503.title"
      messageKey="error.503.message"
      actionKey="error.back_home"
      actionPath="/"
    />
  );
}
