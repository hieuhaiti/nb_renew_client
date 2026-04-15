import React, { memo, useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';

// Component for capturing user reviews without Quill
export const ReviewTextarea = memo(({ onCommentChange, t }) => {
  const [displayValue, setDisplayValue] = useState('');
  const [newComment, setNewComment] = useState('');
  const timeoutRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setDisplayValue(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setNewComment(value);
      onCommentChange?.(value);
    }, 300);
  };

  return (
    <div>
      <Textarea
        id="review"
        placeholder={t(
          'tourism.leave_comment_placeholder',
          'Chia sẻ trải nghiệm, cảm nhận của bạn về địa điểm này...'
        )}
        value={displayValue}
        onChange={handleChange}
        className={`min-h-[100px] resize-none
                    focus:!outline-none focus:!ring-0
                    ${
                      newComment.length > 0 && newComment.length < 10
                        ? 'border-red-300 focus:border-red-500'
                        : newComment.length >= 10
                        ? 'border-green-300 focus:border-green-500'
                        : 'border-[var(--border-primary)]'
                    } bg-[var(--bg-primary)] text-[var(--text-primary)]`}
        maxLength={500}
      />
      <div className="flex mt-1 justify-between text-xs">
        <span
          className={`${
            newComment.length < 10 ? 'text-red-500' : 'text-green-600'
          }`}
        >
          {t('tourism.min_characters', 'Tối thiểu 10 ký tự')}{' '}
          {newComment.length >= 10
            ? '✓'
            : `(${t('tourism.characters_left', 'còn')} ${
                10 - newComment.length
              })`}
        </span>
        <span className="text-[var(--text-tertiary)]">{newComment.length}/500</span>
      </div>
    </div>
  );
});

ReviewTextarea.displayName = 'ReviewTextarea';
