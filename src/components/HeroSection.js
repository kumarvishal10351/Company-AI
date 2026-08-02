'use client';

import React, { useState } from 'react';

export default function HeroSection({ onSearch, isSearching }) {
  const [input, setInput] = useState('');

  const popularCompanies = [
    'Microsoft',
    'Tesla',
    'Stripe',
    'NVIDIA',
    'Amazon',
    'Apple',
    'OpenAI',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isSearching) return;
    onSearch(input.trim());
  };

  const handleChipClick = (company) => {
    setInput(company);
    onSearch(company);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[78vh] px-4 max-w-3xl mx-auto text-center py-6 space-y-7 animate-fadeIn bg-[#000000]">
      {/* Welcome Heading */}
      <h1 className="text-3xl sm:text-4xl font-semibold text-[#ececf1] tracking-tight">
        What's on the agenda today?
      </h1>

      {/* Primary Input Bar */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <div className="relative flex items-center bg-[#212121] border border-white/[0.1] rounded-full p-2 pl-4 pr-2 shadow-2xl focus-within:border-white/[0.25] transition-all">
          {/* Plus Icon on Left */}
          <span className="material-symbols-outlined text-[20px] text-[#8e8ea0] shrink-0 pointer-events-none">
            add
          </span>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSearching}
            placeholder="Research Microsoft or https://microsoft.com"
            className="w-full bg-transparent border-none outline-none px-3 py-2.5 text-[15px] text-[#ececf1] placeholder-[#8e8ea0]/70 font-sans"
          />

          {/* Up Arrow Send Button inside White/Dark Circle on Right */}
          <button
            type="submit"
            disabled={!input.trim() || isSearching}
            className="w-8 h-8 rounded-full bg-[#ececf1] hover:bg-white disabled:opacity-30 disabled:hover:bg-[#ececf1] text-black transition-all flex items-center justify-center shrink-0 ml-1 shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px] font-bold">arrow_upward</span>
          </button>
        </div>
      </form>

      {/* Popular Example Chips */}
      <div className="space-y-2.5 w-full max-w-2xl pt-2">
        <div className="text-[12px] font-medium text-[#8e8ea0]">
          Popular company research examples
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {popularCompanies.map((c) => (
            <button
              key={c}
              onClick={() => handleChipClick(c)}
              disabled={isSearching}
              className="px-3.5 py-1.5 rounded-full bg-[#212121] hover:bg-[#2f2f2f] border border-white/[0.08] hover:border-white/[0.15] text-[13px] text-[#ececf1] font-medium transition-all shadow-sm active:scale-95"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Minimal Footer Disclaimer */}
      <div className="text-[11px] text-[#8e8ea0]/70 pt-6">
        Company AI is powered by real-time web synthesis. Terms & Privacy Policy apply.
      </div>
    </div>
  );
}
