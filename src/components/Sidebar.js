'use client';

import React from 'react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  onNewResearch,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  history = [],
  onSelectHistoryItem,
}) {
  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 bg-[#000000] border-r border-white/[0.06] flex flex-col justify-between transition-all duration-200 ${
          collapsed ? 'w-[68px]' : 'w-[260px]'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & New Research */}
        <div className="p-3 space-y-3">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between px-2 pt-1 pb-1">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-black font-bold text-xs shadow-sm">
                  <span className="material-symbols-outlined text-[16px] text-black">smart_toy</span>
                </div>
                <span className="font-semibold text-[14px] text-[#ececf1] tracking-tight flex items-center gap-1">
                  Company AI
                  <span className="material-symbols-outlined text-[16px] text-[#8e8ea0]">expand_more</span>
                </span>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              className="p-1.5 rounded-lg text-[#8e8ea0] hover:text-[#ececf1] hover:bg-[#212121] transition-colors ml-auto"
            >
              <span className="material-symbols-outlined text-[20px]">
                {collapsed ? 'dock_to_left' : 'dock_to_right'}
              </span>
            </button>
          </div>

          {/* New Research Action Button */}
          <button
            onClick={() => {
              onNewResearch();
              setMobileOpen(false);
            }}
            className={`w-full py-2 px-3 rounded-lg font-medium text-[13px] bg-[#212121] hover:bg-[#2f2f2f] text-[#ececf1] border border-white/[0.08] flex items-center gap-2.5 transition-all active:scale-95 ${
              collapsed ? 'justify-center' : 'justify-start'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-[#ececf1]">edit_square</span>
            {!collapsed && <span>New research</span>}
          </button>
        </div>

        {/* History / Recent Searches */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          <div>
            {!collapsed && (
              <div className="px-2 pb-1.5 text-[11px] font-semibold text-[#8e8ea0] uppercase tracking-wider">
                Research History
              </div>
            )}
            <div className="space-y-0.5">
              {history.length === 0 ? (
                !collapsed && (
                  <p className="px-2 text-[12px] text-[#8e8ea0]/50 italic">
                    No recent chats
                  </p>
                )
              ) : (
                history.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectHistoryItem(item);
                      setMobileOpen(false);
                    }}
                    className={`w-full text-left py-2 px-2.5 rounded-lg text-[13px] flex items-center gap-2.5 transition-colors ${
                      collapsed ? 'justify-center' : 'justify-start'
                    } text-[#8e8ea0] hover:text-[#ececf1] hover:bg-[#212121]`}
                    title={item.companyName}
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#8e8ea0]">
                      chat_bubble_outline
                    </span>
                    {!collapsed && (
                      <span className="truncate flex-1">{item.companyName}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* System Links */}
          <div className="border-t border-white/[0.06] pt-3">
            {!collapsed && (
              <div className="px-2 pb-1.5 text-[11px] font-semibold text-[#8e8ea0] uppercase tracking-wider">
                Settings & Tools
              </div>
            )}
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  setActiveTab('settings');
                  setMobileOpen(false);
                }}
                className={`w-full text-left py-2 px-2.5 rounded-lg text-[13px] flex items-center gap-2.5 transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-[#212121] text-[#ececf1] font-medium'
                    : 'text-[#8e8ea0] hover:text-[#ececf1] hover:bg-[#212121]'
                } ${collapsed ? 'justify-center' : 'justify-start'}`}
                title="Settings"
              >
                <span className="material-symbols-outlined text-[18px]">
                  settings
                </span>
                {!collapsed && <span>Settings</span>}
              </button>

              <button
                onClick={() => {
                  setActiveTab('discord');
                  setMobileOpen(false);
                }}
                className={`w-full text-left py-2 px-2.5 rounded-lg text-[13px] flex items-center gap-2.5 transition-colors ${
                  activeTab === 'discord'
                    ? 'bg-[#212121] text-[#ececf1] font-medium'
                    : 'text-[#8e8ea0] hover:text-[#ececf1] hover:bg-[#212121]'
                } ${collapsed ? 'justify-center' : 'justify-start'}`}
                title="Discord Integration"
              >
                <span className="material-symbols-outlined text-[18px]">
                  forum
                </span>
                {!collapsed && <span>Discord Integration</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Profile / Account Section */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className={`flex items-center gap-2.5 p-2 rounded-xl bg-[#212121] border border-white/[0.06] ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-7 h-7 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center">
              AI
            </div>
            {!collapsed && (
              <div className="flex-1 truncate">
                <div className="text-[12px] font-semibold text-[#ececf1] truncate">
                  Enterprise User
                </div>
                <div className="text-[10px] text-[#8e8ea0] truncate">
                  Company AI Enterprise
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
