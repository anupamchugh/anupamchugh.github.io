'use client';

import { useEffect, useState } from 'react';

const EDIT_EVENT = 'home-edit-mode-change';

export function EditModeToggle() {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.homeEditing = isEditing ? 'true' : 'false';
    window.dispatchEvent(new CustomEvent(EDIT_EVENT, { detail: isEditing }));
  }, [isEditing]);

  return (
    <button
      type="button"
      onClick={() => setIsEditing((value) => !value)}
      className="text-sm text-secondary hover:text-primary"
    >
      {isEditing ? 'done editing' : 'edit copy'}
    </button>
  );
}

interface EditableCopyProps {
  storageKey: string;
  placeholder: string;
  className?: string;
  textareaClassName?: string;
  multiline?: boolean;
}

export function EditableCopy({
  storageKey,
  placeholder,
  className = '',
  textareaClassName = '',
  multiline = false,
}: EditableCopyProps) {
  const [value, setValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setValue(localStorage.getItem(storageKey) || '');

    const handler = (event: Event) => {
      setIsEditing(Boolean((event as CustomEvent).detail));
    };

    window.addEventListener(EDIT_EVENT, handler);
    return () => window.removeEventListener(EDIT_EVENT, handler);
  }, [storageKey]);

  const save = (nextValue: string) => {
    setValue(nextValue);
    localStorage.setItem(storageKey, nextValue);
  };

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          value={value}
          onChange={(event) => save(event.target.value)}
          placeholder={placeholder}
          rows={4}
          className={`w-full resize-y border border-border bg-secondary p-3 text-primary outline-none ${textareaClassName}`}
        />
      );
    }

    return (
      <input
        value={value}
        onChange={(event) => save(event.target.value)}
        placeholder={placeholder}
        className={`w-full border border-border bg-secondary p-3 text-primary outline-none ${textareaClassName}`}
      />
    );
  }

  return (
    <span className={value ? className : `${className} text-tertiary`}>
      {value || placeholder}
    </span>
  );
}
