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
    <div className="space-y-4 my-2 max-w-2xl text-[#ececf1] bg-[#000000]">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2.5 text-[14px] font-semibold text-[#ececf1]">
          <span className="material-symbols-outlined text-[20px] text-[#3B82F6] animate-spin">
            sync
          </span>
          <span>Generating Intelligence Report...</span>
        </div>
        <span className="text-[12px] font-mono text-[#8e8ea0]">
          Step {Math.min(currentStep, 8)} / 8
        </span>
      </div>

      {/* Timeline Checkmarks */}
      <div className="space-y-2">
        {activeStages.map((st) => {
          const isDone = st.done || currentStep > st.step;
          const isActive = currentStep === st.step && !st.done;

          return (
            <div
              key={st.step}
              className={`flex items-center justify-between text-[13px] py-1.5 transition-colors ${
                isActive
                  ? 'text-[#ececf1] font-medium'
                  : isDone
                  ? 'text-[#ececf1]/90'
                  : 'text-[#8e8ea0]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <span className="w-4 h-4 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                ) : isActive ? (
                  <span className="w-4 h-4 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6] flex items-center justify-center text-[8px] text-[#3B82F6] font-bold animate-pulse">
                    ●
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full bg-white/[0.05] flex items-center justify-center text-[9px] text-[#8e8ea0]">
                    {st.step}
                  </span>
                )}
                <span>{st.label || st.message}</span>
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
          <div className="text-[11px] font-mono text-[#8e8ea0] mb-1.5 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">terminal</span>
            <span>Live Terminal Activity Log</span>
          </div>
          <div className="bg-[#212121]/60 border border-white/[0.06] rounded-xl p-3 font-mono text-[11px] text-[#8e8ea0] max-h-32 overflow-y-auto space-y-1">
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
