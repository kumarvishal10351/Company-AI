'use client';

export default function ChatMessage({ message }) {
  if (message.role === 'user') {
    return (
      <div className="message message-user">
        <div className="message-user-bubble">{message.content}</div>
      </div>
    );
  }

  if (message.role === 'error') {
    return (
      <div className="message message-error">
        <div className="message-avatar">!</div>
        <div className="message-body">⚠️ {message.content}</div>
      </div>
    );
  }

  return null;
}
