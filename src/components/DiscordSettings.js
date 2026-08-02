'use client';

import React, { useState, useEffect } from 'react';

export default function DiscordSettings({ config, onSave }) {
  const [form, setForm] = useState(config);
  const [saved, setSaved] = useState(false);
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    setForm(config);
  }, [config]);

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
            <h3 className="text-lg font-bold text-[#ECECF1] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#3B82F6]">forum</span>
              Discord Integration & Webhook Settings
            </h3>
            <p className="text-[13px] text-[#8E8EA0] mt-1">
              Auto-post generated research reports and PDF assets directly to your team Discord channel.
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
            <span>{saved ? 'Saved!' : 'Save Discord Config'}</span>
          </button>
        </div>

        <div className="space-y-4">
          {/* Bot Token */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-[#ECECF1]">
              Discord Bot Token
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                placeholder="MTAxMjM0NTY3ODkwMTIzNDU2Nw..."
                value={form.botToken || ''}
                onChange={(e) => update('botToken', e.target.value)}
                className="w-full bg-[#000000] border border-white/[0.08] rounded-xl py-2.5 pl-4 pr-10 text-[13px] font-mono text-[#ECECF1] placeholder-[#8E8EA0]/60 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8EA0] hover:text-[#ECECF1]"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showToken ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Channel ID */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-[#ECECF1]">
              Target Discord Channel ID
            </label>
            <input
              type="text"
              placeholder="1234567890123456789"
              value={form.channelId || ''}
              onChange={(e) => update('channelId', e.target.value)}
              className="w-full bg-[#000000] border border-white/[0.08] rounded-xl py-2.5 px-4 text-[13px] font-mono text-[#ECECF1] placeholder-[#8E8EA0]/60 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
            />
          </div>

          {/* Applicant Information */}
          <div className="pt-3 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#ECECF1]">
                Applicant Name
              </label>
              <input
                type="text"
                placeholder="Your full name"
                value={form.applicantName || ''}
                onChange={(e) => update('applicantName', e.target.value)}
                className="w-full bg-[#000000] border border-white/[0.08] rounded-xl py-2.5 px-4 text-[13px] text-[#ECECF1] placeholder-[#8E8EA0]/60 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#ECECF1]">
                Applicant Email Address
              </label>
              <input
                type="email"
                placeholder="email@domain.com"
                value={form.applicantEmail || ''}
                onChange={(e) => update('applicantEmail', e.target.value)}
                className="w-full bg-[#000000] border border-white/[0.08] rounded-xl py-2.5 px-4 text-[13px] text-[#ECECF1] placeholder-[#8E8EA0]/60 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
