import React from 'react';
import ErrorPage from './ErrorPage';
import { AlertCircle } from 'lucide-react';

export default function BadRequestPage() {
  return (
    <ErrorPage
      code={400}
      color="text-[var(--error-400)]"
      icon={<AlertCircle size={80} strokeWidth={1.5} />}
      titleKey="error.400.title"
      messageKey="error.400.message"
      actionKey="error.back_home"
      actionPath="/"
    />
  );
}
