import React from 'react';
import { useLanguageStore } from '@/stores/useLanguageStore';

function getValidationHeading() {
  const lang = useLanguageStore.getState().lang || 'vi';
  return lang === 'en' ? 'An error occurred:' : 'Có lỗi xảy ra:';
}

export function renderValidationErrors(errors) {
  if (!errors?.length) return null;

  return (
    <div className="text-sm">
      <p className="mb-1 font-semibold">{getValidationHeading()}</p>
      <ul className="list-disc space-y-0.5 pl-4">
        {errors.map((error, index) => (
          <li key={index}>
            {error.field && <span className="font-medium capitalize">{error.field}: </span>}
            <span>{error.message || JSON.stringify(error)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function validationErrorsToString(errors) {
  if (!errors?.length) return '';
  return errors
    .map((error) =>
      error.field ? `${error.field}: ${error.message}` : error.message || JSON.stringify(error)
    )
    .join('\n');
}
