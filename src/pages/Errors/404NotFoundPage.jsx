import React from 'react';
import ErrorPage from './ErrorPage';
import { FileQuestion } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <ErrorPage
      code={404}
      color="text-[var(--error-404)]"
      icon={<FileQuestion size={80} strokeWidth={1.5} />}
      titleKey="error.404.title"
      messageKey="error.404.message"
      actionKey="error.back_home"
      actionPath="/"
    />
  );
}
