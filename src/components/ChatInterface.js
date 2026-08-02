'use client';
import { useRef, useEffect } from 'react';
import HeroSection from './HeroSection';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import ProgressIndicator from './ProgressIndicator';
import ResearchReport from './ResearchReport';

export default function ChatInterface({
  messages, report, isResearching, currentStep, stepMessages,
  onSubmit, onDownloadPdf, onSendDiscord, discordConfigured,
  hasApiKeys, onToggleSidebar,
}) {
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, currentStep, report]);

  const showHero = messages.length === 0 && !isResearching;

  return (
    <div className="main-content">
      <div className="main-header">
        <button className="hamburger" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <span />
        </button>
        <div className="main-header-title">
          Company Research
          <span className={`status-badge ${isResearching ? 'researching' : 'live'}`}>
            {isResearching ? '● Researching' : '● Live'}
          </span>
        </div>
        <div />
      </div>

      <div className="chat-area" ref={chatRef}>
        {showHero ? (
          <HeroSection onQuickStart={onSubmit} />
        ) : (
          <>
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
            {isResearching && (
              <ProgressIndicator currentStep={currentStep} stepMessages={stepMessages} />
            )}
            {report && (
              <ResearchReport
                report={report}
                onDownloadPdf={onDownloadPdf}
                onSendDiscord={onSendDiscord}
                discordConfigured={discordConfigured}
              />
            )}
          </>
        )}
      </div>

      <ChatInput
        onSubmit={onSubmit}
        disabled={isResearching || !hasApiKeys}
      />
    </div>
  );
}
