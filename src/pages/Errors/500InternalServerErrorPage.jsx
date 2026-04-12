import React from 'react';
import ErrorPage from './ErrorPage';
import { ServerCrash } from 'lucide-react';

export default function InternalServerErrorPage() {
  return (
    <ErrorPage
      code={500}
      color="text-[var(--error-500)]"
      icon={<ServerCrash size={80} strokeWidth={1.5} />}
      titleKey="error.500.title"
      messageKey="error.500.message"
      actionKey="error.back_home"
      actionPath="/"
    />
  );
}
