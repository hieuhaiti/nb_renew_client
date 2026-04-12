import React from 'react';
import ErrorPage from './ErrorPage';
import { Lock } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <ErrorPage
      code={403}
      color="text-[var(--error-403)]"
      icon={<Lock size={80} strokeWidth={1.5} />}
      titleKey="error.403.title"
      messageKey="error.403.message"
      actionKey="error.back_home"
      actionPath="/"
    />
  );
}
