'use client';

import React, { useState, useEffect } from 'react';

export default function ApiSettings({ settings, onSave }) {
  const [form, setForm] = useState(settings);
  const [models, setModels] = useState([]);
  const [saved, setSaved] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [showOpenRouterKey, setShowOpenRouterKey] = useState(false);
  const [showSerperKey, setShowSerperKey] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  useEffect(() => {
    if (!form.openrouterKey) return;
    let cancelled = false;
    setLoadingModels(true);
    fetch('/api/models', { headers: { 'x-api-key': form.openrouterKey } })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.models) setModels(data.models);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingModels(false);
      });
    return () => {
      cancelled = true;
    };
  }, [form.openrouterKey]);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4 animate-fadeIn bg-[#000000]">
      <form onSubmit={handleSave} className="bg-[#171717] border border-white/[0.08] rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#ECECF1] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#3B82F6]">settings</span>
              API & OpenRouter Model Configuration
            </h2>
            <p className="text-[13px] text-[#8E8EA0] mt-1">
              Select any AI model available on OpenRouter to power your company research synthesis.
            </p>
          </div>

          <button
            type="submit"
            className={`px-4 py-2.5 rounded-xl font-medium text-[13px] flex items-center gap-2 transition-all shadow-md active:scale-95 whitespace-nowrap ${
              saved
                ? 'bg-[#10B981] text-white'
                : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {saved ? 'check_circle' : 'save'}
            </span>
            <span>{saved ? 'Saved!' : 'Save Settings'}</span>
          </button>
        </div>

        {/* API Credentials Section */}
        <div className="space-y-5 border-t border-white/[0.08] pt-5">
          <h3 className="text-[14px] font-bold text-[#ECECF1] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3B82F6]">key</span>
            API Keys & Authentication
          </h3>

          {/* OpenRouter Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-[#ECECF1]">
                OpenRouter AI Provider Key
              </label>
              <span className="text-[10px] text-[#10B981] font-mono bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                {form.openrouterKey ? 'KEY_CONFIGURED' : 'NOT_SET'}
              </span>
            </div>
            <div className="relative">
              <input
                type={showOpenRouterKey ? 'text' : 'password'}
                placeholder="sk-or-v1-..."
                value={form.openrouterKey || ''}
                onChange={(e) => update('openrouterKey', e.target.value)}
                className="w-full bg-[#000000] border border-white/[0.08] rounded-xl py-2.5 pl-4 pr-10 text-[13px] font-mono text-[#ECECF1] placeholder-[#8E8EA0]/60 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowOpenRouterKey(!showOpenRouterKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8EA0] hover:text-[#ECECF1]"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showOpenRouterKey ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            <p className="text-[11px] text-[#8E8EA0]">
              Powers multi-step company synthesis using any LLM on OpenRouter.
            </p>
          </div>

          {/* Serper API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-[#ECECF1]">
                Serper.dev Web Search Key
              </label>
              <span className="text-[10px] text-[#10B981] font-mono bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                {form.serperKey ? 'KEY_CONFIGURED' : 'NOT_SET'}
              </span>
            </div>
            <div className="relative">
              <input
                type={showSerperKey ? 'text' : 'password'}
                placeholder="Enter Serper search key..."
                value={form.serperKey || ''}
                onChange={(e) => update('serperKey', e.target.value)}
                className="w-full bg-[#000000] border border-white/[0.08] rounded-xl py-2.5 pl-4 pr-10 text-[13px] font-mono text-[#ECECF1] placeholder-[#8E8EA0]/60 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowSerperKey(!showSerperKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8EA0] hover:text-[#ECECF1]"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showSerperKey ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            <p className="text-[11px] text-[#8E8EA0]">
              Enables real-time Google search crawling for live company websites and metrics.
            </p>
          </div>
        </div>

        {/* Model Selection Section */}
        <div className="space-y-4 border-t border-white/[0.08] pt-5">
          <h3 className="text-[14px] font-bold text-[#ECECF1] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3B82F6]">psychology</span>
            OpenRouter Synthesis Model Engine
          </h3>

          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-[#ECECF1]">
              Active LLM Model Choice
            </label>
            <select
              value={form.model || 'mistralai/mistral-large'}
              onChange={(e) => update('model', e.target.value)}
              className="w-full bg-[#000000] border border-white/[0.08] rounded-xl py-2.5 px-4 text-[13px] text-[#ECECF1] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all cursor-pointer"
            >
              <option value="mistralai/mistral-large">Mistral Large (OpenRouter)</option>
              <option value="google/gemini-2.0-flash-001">Google Gemini 2.0 Flash</option>
              <option value="openai/gpt-4o-mini">OpenAI GPT-4o Mini</option>
              <option value="openai/gpt-4o">OpenAI GPT-4o</option>
              <option value="anthropic/claude-3.5-sonnet">Anthropic Claude 3.5 Sonnet</option>
              <option value="deepseek/deepseek-chat">DeepSeek V3 Chat</option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.isPopular ? '★ ' : ''}
                  {m.name} ({m.id})
                </option>
              ))}
            </select>
            {loadingModels && (
              <p className="text-[11px] text-[#3B82F6]">Fetching live available models from OpenRouter...</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
