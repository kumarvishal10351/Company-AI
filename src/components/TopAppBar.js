'use client';

import React from 'react';

export default function TopAppBar({
  activeTab,
  setActiveTab,
  model,
  setModel,
  sidebarCollapsed,
  onOpenMobileSidebar,
}) {
  return (
    <header
      className={`fixed top-0 right-0 z-30 h-14 bg-[#000000] border-b border-transparent flex items-center justify-between px-4 transition-all duration-200 ${
        sidebarCollapsed ? 'left-0 lg:left-[68px]' : 'left-0 lg:left-[260px]'
      }`}
    >
      {/* Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-1.5 rounded-lg text-[#8e8ea0] hover:text-[#ececf1] hover:bg-[#212121]"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        <div className="flex items-center gap-1.5 cursor-pointer">
          <span className="text-[16px] font-semibold text-[#ececf1] tracking-tight flex items-center gap-1">
            Company AI
            <span className="material-symbols-outlined text-[18px] text-[#8e8ea0]">expand_more</span>
          </span>
        </div>
      </div>

      {/* Right Controls: OpenRouter Model Selector */}
      <div className="flex items-center gap-2">
        <div className="relative flex items-center">
          <select
            value={model || 'mistralai/mistral-large'}
            onChange={(e) => setModel(e.target.value)}
            className="bg-[#212121] border border-white/[0.08] rounded-lg py-1.5 pl-3 pr-7 text-[12px] font-medium text-[#ececf1] hover:bg-[#2f2f2f] focus:outline-none transition-all cursor-pointer appearance-none"
          >
            <option value="mistralai/mistral-large">Mistral Large (OpenRouter)</option>
            <option value="google/gemini-2.0-flash-001">Gemini 2.0 Flash</option>
            <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
            <option value="openai/gpt-4o">GPT-4o</option>
            <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
            <option value="deepseek/deepseek-chat">DeepSeek V3 Chat</option>
          </select>
          <span className="material-symbols-outlined text-[16px] text-[#8e8ea0] absolute right-2 pointer-events-none">
            expand_more
          </span>
        </div>

        {/* Quick Settings Icon */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`p-1.5 rounded-lg text-[#8e8ea0] hover:text-[#ececf1] hover:bg-[#212121] transition-colors ${
            activeTab === 'settings' ? 'bg-[#212121] text-[#ececf1]' : ''
          }`}
          title="Open Settings"
        >
          <span className="material-symbols-outlined text-[20px]">tune</span>
        </button>

        {/* User Avatar */}
        <div className="w-7 h-7 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center">
          AI
        </div>
      </div>
    </header>
  );
}
