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
        className={`min-h-25 resize-none focus:ring-0! focus:outline-none! ${
          newComment.length > 0 && newComment.length < 10
            ? 'border-destructive/40 focus:border-destructive'
            : newComment.length >= 10
              ? 'border-primary/40 focus:border-primary'
              : 'border-border'
        }`}
        maxLength={500}
      />
      <div className="mt-1 flex justify-between text-xs">
        <span className={`${newComment.length < 10 ? 'text-destructive' : 'text-primary'}`}>
          {t('tourism.min_characters', 'Tối thiểu 10 ký tự')}{' '}
          {newComment.length >= 10
            ? '✓'
            : `(${t('tourism.characters_left', 'còn')} ${10 - newComment.length})`}
        </span>
        <span className="text-muted-foreground">{newComment.length}/500</span>
      </div>
    </div>
  );
});

ReviewTextarea.displayName = 'ReviewTextarea';
