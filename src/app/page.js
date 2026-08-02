'use client';

import { useState, useCallback, useRef } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Sidebar from '@/components/Sidebar';
import TopAppBar from '@/components/TopAppBar';
import HeroSection from '@/components/HeroSection';
import ProgressIndicator from '@/components/ProgressIndicator';
import ResearchReport from '@/components/ResearchReport';
import ApiSettings from '@/components/ApiSettings';
import DiscordSettings from '@/components/DiscordSettings';
import { downloadPDF, getPDFBase64 } from '@/lib/pdf';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'settings' | 'discord'
  const [targetCompany, setTargetCompany] = useState('');
  const [report, setReport] = useState(null);
  const [isResearching, setIsResearching] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stages, setStages] = useState([]);
  const [logs, setLogs] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [chatPrompt, setChatPrompt] = useState('');

  const chatBottomRef = useRef(null);

  const [settings, setSettings] = useLocalStorage('research-api-settings', {
    openrouterKey: 'fuuTdLfcqvoPp5vsEIdj4wo0uF0SOTux',
    serperKey: 'ab51bc10-8e59-11f1-b66b-1527aaf279ed',
    model: 'mistral-large-latest',
  });

  const [discordConfig, setDiscordConfig] = useLocalStorage('research-discord-config', {
    botToken: '',
    channelId: '',
    applicantName: '',
    applicantEmail: '',
  });

  const [history, setHistory] = useLocalStorage('research-history-list', []);

  const discordConfigured = !!(discordConfig.botToken && discordConfig.channelId);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleStartResearch = useCallback(
    async (input) => {
      if (!input || !input.trim()) return;

      const trimmed = input.trim();
      setTargetCompany(trimmed);
      setIsResearching(true);
      setCurrentStep(1);
      setStages([]);
      setLogs([]);
      setReport(null);
      setActiveTab('chat');
      setChatPrompt('');

      scrollToBottom();

      try {
        const response = await fetch('/api/research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: trimmed,
            openrouterKey: settings.openrouterKey,
            serperKey: settings.serperKey,
            model: settings.model,
          }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({ error: 'Request failed' }));
          throw new Error(err.error || `HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const lineTrim = line.trim();
            if (!lineTrim.startsWith('data: ')) continue;
            try {
              const data = JSON.parse(lineTrim.slice(6));

              if (data.type === 'progress') {
                setCurrentStep(data.step);
                setStages((prev) => {
                  const filtered = prev.filter((s) => s.step !== data.step);
                  return [...filtered, { step: data.step, label: data.message, done: !!data.done }];
                });
                setLogs((prev) => [...prev.slice(-15), `[Step ${data.step}] ${data.message}`]);
                scrollToBottom();
              } else if (data.type === 'result') {
                setReport(data.data);
                showToast('Research synthesis completed successfully! ✓');
                setHistory((prev) => {
                  const exists = prev.some((h) => h.companyName?.toLowerCase() === data.data.companyName?.toLowerCase());
                  if (exists) return prev;
                  return [{ companyName: data.data.companyName, data: data.data, date: new Date().toISOString() }, ...prev.slice(0, 15)];
                });
                scrollToBottom();
              } else if (data.type === 'error') {
                showToast('Research Error: ' + data.message, 'error');
              }
            } catch {}
          }
        }
      } catch (error) {
        showToast(error.message, 'error');
      } finally {
        setIsResearching(false);
      }
    },
    [settings, showToast, setHistory]
  );

  const handleNewResearch = () => {
    setReport(null);
    setTargetCompany('');
    setIsResearching(false);
    setCurrentStep(0);
    setStages([]);
    setActiveTab('chat');
  };

  const handleSelectHistoryItem = (item) => {
    if (item && item.data) {
      setReport(item.data);
      setTargetCompany(item.companyName);
      setIsResearching(false);
      setActiveTab('chat');
      scrollToBottom();
    }
  };

  const handleDownloadPdf = useCallback(async () => {
    if (!report) return;
    try {
      await downloadPDF(report);
      showToast('PDF downloaded successfully');
    } catch (error) {
      showToast('Failed to generate PDF: ' + error.message, 'error');
    }
  }, [report, showToast]);

  const handleSendDiscord = useCallback(async () => {
    if (!report) return;
    if (!discordConfigured) {
      showToast('Please configure your Discord Bot Token & Channel ID in Settings', 'error');
      setActiveTab('discord');
      return;
    }
    try {
      showToast('Sending report to Discord...');
      const pdfBase64 = await getPDFBase64(report);
      const res = await fetch('/api/discord', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...discordConfig,
          companyName: report.companyName,
          companyWebsite: report.website,
          pdfBase64,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`);
      showToast('Report sent to Discord successfully! ✓');
    } catch (error) {
      showToast('Discord error: ' + error.message, 'error');
    }
  }, [report, discordConfig, discordConfigured, showToast]);

  const handleCopyReport = useCallback(() => {
    if (!report) return;
    const text = `COMPANY RESEARCH REPORT: ${report.companyName}\nWebsite: ${report.website}\nIndustry: ${report.industry}\n\nEXECUTIVE SUMMARY:\n${report.summary}\n\nPRODUCTS:\n${(report.productsAndServices || []).join('\n')}\n\nPAIN POINTS:\n${(report.painPoints || []).join('\n')}`;
    navigator.clipboard.writeText(text);
    showToast('Report copied to clipboard ✓');
  }, [report, showToast]);

  return (
    <div className="chat-layout bg-[#000000]">
      {/* Top Application Bar */}
      <TopAppBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        model={settings.model}
        setModel={(m) => setSettings((prev) => ({ ...prev, model: m }))}
        sidebarCollapsed={sidebarCollapsed}
        onOpenMobileSidebar={() => setMobileOpen(true)}
      />

      {/* Collapsible Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewResearch={handleNewResearch}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
      />

      {/* Main Content Area */}
      <main className={`chat-main bg-[#000000] ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Settings View */}
        {activeTab === 'settings' && (
          <div className="p-4 md:p-8 bg-[#000000] min-h-screen">
            <ApiSettings settings={settings} onSave={setSettings} />
          </div>
        )}

        {/* Discord Integration View */}
        {activeTab === 'discord' && (
          <div className="p-4 md:p-8 bg-[#000000] min-h-screen">
            <DiscordSettings config={discordConfig} onSave={setDiscordConfig} />
          </div>
        )}

        {/* Chat / Conversational View */}
        {activeTab === 'chat' && (
          <div className="flex flex-col min-h-[calc(100vh-56px)] justify-between bg-[#000000]">
            {/* If no active research exists, show Home Experience */}
            {!targetCompany && !report && !isResearching ? (
              <HeroSection onSearch={handleStartResearch} isSearching={isResearching} />
            ) : (
              /* Conversational Thread Container */
              <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-6 flex-1">
                {/* User Prompt Message (Right Aligned) */}
                {targetCompany && (
                  <div className="flex justify-end animate-fadeIn">
                    <div className="bg-[#212121] border border-white/[0.08] text-[#ececf1] rounded-2xl px-5 py-3 max-w-xl shadow-md space-y-0.5">
                      <div className="text-[11px] font-mono text-[#3B82F6] font-semibold">User Prompt</div>
                      <div className="text-[14px] font-medium">Research {targetCompany}</div>
                    </div>
                  </div>
                )}

                {/* Assistant Response Container (Left Aligned) */}
                <div className="flex items-start gap-3.5 animate-fadeIn">
                  {/* AI Avatar Icon */}
                  <div className="w-7 h-7 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    AI
                  </div>

                  <div className="flex-1 space-y-4">
                    {/* Live Progress Pipeline Indicator */}
                    {isResearching && (
                      <ProgressIndicator
                        stages={stages}
                        currentStep={currentStep}
                        logs={logs}
                      />
                    )}

                    {/* Completed Synthesis Report Card */}
                    {report && (
                      <ResearchReport
                        report={report}
                        onDownloadPdf={handleDownloadPdf}
                        onSendDiscord={handleSendDiscord}
                        onRegenerate={() => handleStartResearch(targetCompany)}
                        onCopyReport={handleCopyReport}
                        discordConfigured={discordConfigured}
                      />
                    )}
                  </div>
                </div>

                <div ref={chatBottomRef} />
              </div>
            )}

            {/* Bottom Sticky Prompt Input Bar */}
            {(targetCompany || report || isResearching) && (
              <div className="sticky bottom-0 left-0 right-0 bg-[#000000]/95 backdrop-blur-md border-t border-transparent p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (chatPrompt.trim()) handleStartResearch(chatPrompt.trim());
                  }}
                  className="max-w-3xl mx-auto"
                >
                  <div className="relative flex items-center bg-[#212121] border border-white/[0.1] rounded-full p-1.5 pl-4 pr-1.5 shadow-2xl focus-within:border-white/[0.25] transition-all">
                    <span className="material-symbols-outlined text-[18px] text-[#8e8ea0] shrink-0 pointer-events-none">
                      add
                    </span>
                    <input
                      type="text"
                      value={chatPrompt}
                      onChange={(e) => setChatPrompt(e.target.value)}
                      disabled={isResearching}
                      placeholder="Research another company or website..."
                      className="w-full bg-transparent border-none outline-none px-3 py-2 text-[14px] text-[#ececf1] placeholder-[#8e8ea0]/70"
                    />
                    <button
                      type="submit"
                      disabled={!chatPrompt.trim() || isResearching}
                      className="w-8 h-8 rounded-full bg-[#ececf1] hover:bg-white disabled:opacity-30 disabled:hover:bg-[#ececf1] text-black transition-all shadow-sm flex items-center justify-center shrink-0 ml-1"
                    >
                      <span className="material-symbols-outlined text-[18px] font-bold">arrow_upward</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl border text-[13px] font-semibold shadow-2xl transition-all flex items-center gap-2 ${
            toast.type === 'error'
              ? 'bg-red-900/90 text-red-100 border-red-500/40'
              : 'bg-[#10B981] text-white border-[#10B981]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {toast.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
