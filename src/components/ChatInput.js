'use client';
import { useState } from 'react';

export default function ChatInput({ onSubmit, disabled }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue('');
  };

  return (
    <div className="chat-input-wrapper">
      <form className="chat-input-container" onSubmit={handleSubmit}>
        <input
          className="chat-input"
          type="text"
          placeholder="Enter a company name (e.g., Stripe) or website URL (e.g., https://vercel.com)..."
          value={value}
          onChange={e => setValue(e.target.value)}
          disabled={disabled}
          autoFocus
        />
        <button className="btn-research" type="submit" disabled={disabled || !value.trim()}>
          {disabled ? (
            <>
              <span className="spinner" />
              Researching
            </>
          ) : (
            'Research →'
          )}
        </button>
      </form>
    </div>
  );
}
