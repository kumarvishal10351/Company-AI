'use client';

import React from 'react';

export default function ProgressIndicator({ stages, currentStep, logs }) {
  const defaultStages = [
    { step: 1, label: 'Finding official website...' },
    { step: 2, label: 'Searching Serper...' },
    { step: 3, label: 'Discovering important pages...' },
    { step: 4, label: 'Crawling website...' },
    { step: 5, label: 'Running AI analysis...' },
    { step: 6, label: 'Finding competitors...' },
    { step: 7, label: 'Generating PDF...' },
    { step: 8, label: 'Completed' },
  ];

  const activeStages = stages && stages.length > 0 ? stages : defaultStages;

  return (
    <div className="bg-[#171717] border border-white/[0.08] rounded-2xl p-5 space-y-4 shadow-xl my-4 max-w-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2.5 text-[14px] font-semibold text-[#ECECF1]">
          <span className="material-symbols-outlined text-[20px] text-[#3B82F6] animate-spin">
            sync
          </span>
          <span>Generating Intelligence Report...</span>
        </div>
        <span className="text-[12px] font-mono text-[#8E8EA0]">
          Step {Math.min(currentStep, 8)} / 8
        </span>
      </div>

      {/* Timeline Checkmarks */}
      <div className="space-y-2.5">
        {activeStages.map((st) => {
          const isDone = st.done || currentStep > st.step;
          const isActive = currentStep === st.step && !st.done;

          return (
            <div
              key={st.step}
              className={`flex items-center justify-between text-[13px] px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#212121] text-[#ECECF1] border border-[#3B82F6]/30'
                  : isDone
                  ? 'text-[#ECECF1]'
                  : 'text-[#8E8EA0]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <span className="w-5 h-5 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center text-[12px] font-bold">
                    ✓
                  </span>
                ) : isActive ? (
                  <span className="w-5 h-5 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6] flex items-center justify-center text-[10px] text-[#3B82F6] font-bold animate-pulse">
                    ●
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-[10px] text-[#8E8EA0]">
                    {st.step}
                  </span>
                )}
                <span className="font-medium">{st.label || st.message}</span>
              </div>

              {isDone && (
                <span className="text-[11px] font-mono text-[#10B981]">
                  Complete
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Terminal Output Log Stream */}
      {logs && logs.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/[0.08]">
          <div className="text-[11px] font-mono text-[#8E8EA0] mb-1.5 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">terminal</span>
            <span>Live Terminal Activity Log</span>
          </div>
          <div className="bg-[#000000] border border-white/[0.08] rounded-lg p-3 font-mono text-[11px] text-[#8E8EA0] max-h-32 overflow-y-auto space-y-1">
            {logs.map((log, idx) => (
              <div key={idx} className="leading-tight">
                <span className="text-[#3B82F6]">{'>'}</span> {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
