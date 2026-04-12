import React from 'react';

/**
 * renderValidationErrors — renders backend validation error array as a React element.
 * Used inside toast.error() for 400 responses with `errors: [{ field, message }]`.
 *
 * TODO: When i18n is fully integrated, translate field names via t() if needed.
 *
 * @param {{ field?: string, message?: string, type?: string }[]} errors
 * @returns {React.ReactNode|null}
 */
export function renderValidationErrors(errors) {
  if (!errors?.length) return null;

  return (
    <div className="text-sm">
      <p className="font-semibold mb-1">Có lỗi xảy ra:</p>
      <ul className="list-disc pl-4 space-y-0.5">
        {errors.map((e, i) => (
          <li key={i}>
            {e.field && (
              <span className="font-medium capitalize">{e.field}: </span>
            )}
            <span>{e.message || JSON.stringify(e)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * validationErrorsToString — plain string version for non-JSX contexts (e.g. console, RHF setError).
 *
 * @param {{ field?: string, message?: string }[]} errors
 * @returns {string}
 */
export function validationErrorsToString(errors) {
  if (!errors?.length) return '';
  return errors
    .map((e) => (e.field ? `${e.field}: ${e.message}` : e.message || JSON.stringify(e)))
    .join('\n');
}
