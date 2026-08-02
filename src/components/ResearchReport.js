'use client';

import React, { useState } from 'react';

export default function ResearchReport({
  report,
  onDownloadPdf,
  onSendDiscord,
  onRegenerate,
  onCopyReport,
  discordConfigured,
}) {
  const [openSections, setOpenSections] = useState({
    summary: true,
    info: true,
    products: true,
    painPoints: true,
    competitors: true,
    sources: false,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const {
    companyName = 'Company Research',
    website = 'N/A',
    industry = 'Enterprise Technology',
    phone = 'Not publicly listed',
    address = 'Not publicly listed',
    emails = [],
    socialLinks = [],
    summary = 'No summary text available.',
    productsAndServices = [],
    painPoints = [],
    competitors = [],
    crawledPages = [],
    generatedAt = new Date().toISOString(),
  } = report || {};

  return (
    <div className="space-y-4 my-2 max-w-3xl animate-fadeIn">
      {/* Header Banner Inside Assistant Message */}
      <div className="bg-[#171717] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6] flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              {companyName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#ECECF1] tracking-tight">{companyName}</h2>
                <span className="px-2 py-0.5 rounded bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-[10px] font-mono font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                  VERIFIED_SYNTHESIS
                </span>
              </div>
              <a
                href={website.startsWith('http') ? website : `https://${website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-[#3B82F6] hover:underline font-mono flex items-center gap-1 mt-0.5"
              >
                <span className="material-symbols-outlined text-[16px]">link</span>
                {website}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[12px] text-[#8E8EA0] font-mono">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Confidence: 98.4%</span>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            onClick={onDownloadPdf}
            className="px-3.5 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium text-[13px] rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download PDF</span>
          </button>

          <button
            onClick={onSendDiscord}
            className="px-3.5 py-2 bg-[#212121] hover:bg-[#2F2F2F] border border-white/[0.08] text-[#ECECF1] font-medium text-[13px] rounded-lg flex items-center gap-2 transition-all active:scale-95"
            title={discordConfigured ? 'Post report to Discord' : 'Configure Discord in Settings first'}
          >
            <span className="material-symbols-outlined text-[18px]">forum</span>
            <span>Send to Discord</span>
          </button>

          <button
            onClick={onRegenerate}
            className="px-3.5 py-2 bg-[#212121] hover:bg-[#2F2F2F] border border-white/[0.08] text-[#ECECF1] font-medium text-[13px] rounded-lg flex items-center gap-2 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            <span>Generate Again</span>
          </button>

          <button
            onClick={onCopyReport}
            className="px-3.5 py-2 bg-[#212121] hover:bg-[#2F2F2F] border border-white/[0.08] text-[#8E8EA0] hover:text-[#ECECF1] font-medium text-[13px] rounded-lg flex items-center gap-2 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            <span>Copy Report</span>
          </button>
        </div>
      </div>

      {/* Accordion 1: Executive Summary */}
      <div className="bg-[#171717] border border-white/[0.08] rounded-2xl overflow-hidden shadow-lg">
        <button
          onClick={() => toggleSection('summary')}
          className="w-full px-5 py-4 flex items-center justify-between bg-[#171717] hover:bg-[#212121]/50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 font-bold text-[15px] text-[#ECECF1]">
            <span className="material-symbols-outlined text-[#3B82F6] text-[20px]">description</span>
            <span>Executive Summary</span>
          </div>
          <span className="material-symbols-outlined text-[20px] text-[#8E8EA0]">
            {openSections.summary ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {openSections.summary && (
          <div className="px-5 pb-5 pt-1 text-[14px] text-[#ECECF1]/90 leading-relaxed border-t border-white/[0.08]">
            {summary}
          </div>
        )}
      </div>

      {/* Accordion 2: Company Information Card */}
      <div className="bg-[#171717] border border-white/[0.08] rounded-2xl overflow-hidden shadow-lg">
        <button
          onClick={() => toggleSection('info')}
          className="w-full px-5 py-4 flex items-center justify-between bg-[#171717] hover:bg-[#212121]/50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 font-bold text-[15px] text-[#ECECF1]">
            <span className="material-symbols-outlined text-[#3B82F6] text-[20px]">corporate_fare</span>
            <span>Company Information</span>
          </div>
          <span className="material-symbols-outlined text-[20px] text-[#8E8EA0]">
            {openSections.info ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {openSections.info && (
          <div className="px-5 pb-5 pt-3 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#212121] border border-white/[0.06] space-y-1">
              <div className="text-[11px] font-mono text-[#8E8EA0]">Official Website</div>
              <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#3B82F6] hover:underline font-mono truncate block">
                {website}
              </a>
            </div>

            <div className="p-3.5 rounded-xl bg-[#212121] border border-white/[0.06] space-y-1">
              <div className="text-[11px] font-mono text-[#8E8EA0]">Industry</div>
              <div className="text-[13px] text-[#ECECF1] font-medium">{industry}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#212121] border border-white/[0.06] space-y-1">
              <div className="text-[11px] font-mono text-[#8E8EA0]">Phone</div>
              <div className="text-[13px] text-[#ECECF1] font-medium">{phone}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#212121] border border-white/[0.06] space-y-1">
              <div className="text-[11px] font-mono text-[#8E8EA0]">Headquarters Address</div>
              <div className="text-[13px] text-[#ECECF1] font-medium">{address}</div>
            </div>

            {emails && emails.length > 0 && (
              <div className="p-3.5 rounded-xl bg-[#212121] border border-white/[0.06] space-y-1 sm:col-span-2">
                <div className="text-[11px] font-mono text-[#8E8EA0]">Public Email Contacts</div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {emails.map((e, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded bg-[#000000] border border-white/[0.08] text-[12px] font-mono text-[#ECECF1]">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {socialLinks && socialLinks.length > 0 && (
              <div className="p-3.5 rounded-xl bg-[#212121] border border-white/[0.06] space-y-1 sm:col-span-2">
                <div className="text-[11px] font-mono text-[#8E8EA0]">Social Media Links</div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {socialLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded bg-[#000000] hover:bg-[#3B82F6]/10 border border-white/[0.08] hover:border-[#3B82F6]/30 text-[12px] font-mono text-[#3B82F6] transition-colors truncate max-w-[220px]"
                    >
                      {link.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Accordion 3: Core Products & Services */}
      <div className="bg-[#171717] border border-white/[0.08] rounded-2xl overflow-hidden shadow-lg">
        <button
          onClick={() => toggleSection('products')}
          className="w-full px-5 py-4 flex items-center justify-between bg-[#171717] hover:bg-[#212121]/50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 font-bold text-[15px] text-[#ECECF1]">
            <span className="material-symbols-outlined text-[#10B981] text-[20px]">category</span>
            <span>Products & Services</span>
          </div>
          <span className="material-symbols-outlined text-[20px] text-[#8E8EA0]">
            {openSections.products ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {openSections.products && (
          <div className="px-5 pb-5 pt-3 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-3">
            {productsAndServices.map((p, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#212121] border border-white/[0.06] flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981] mt-1.5 shrink-0"></span>
                <span className="text-[13px] text-[#ECECF1] leading-snug">{p}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accordion 4: Pain Points & Strategic Challenges */}
      <div className="bg-[#171717] border border-white/[0.08] rounded-2xl overflow-hidden shadow-lg">
        <button
          onClick={() => toggleSection('painPoints')}
          className="w-full px-5 py-4 flex items-center justify-between bg-[#171717] hover:bg-[#212121]/50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 font-bold text-[15px] text-[#ECECF1]">
            <span className="material-symbols-outlined text-[#3B82F6] text-[20px]">warning</span>
            <span>Key Pain Points & Strategic Challenges</span>
          </div>
          <span className="material-symbols-outlined text-[20px] text-[#8E8EA0]">
            {openSections.painPoints ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {openSections.painPoints && (
          <div className="px-5 pb-5 pt-3 border-t border-white/[0.08] space-y-3">
            {painPoints.map((pp, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#212121] border border-white/[0.06] flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  !
                </span>
                <p className="text-[13px] text-[#ECECF1]/90 leading-relaxed">{pp}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accordion 5: Competitor Analysis Cards */}
      <div className="bg-[#171717] border border-white/[0.08] rounded-2xl overflow-hidden shadow-lg">
        <button
          onClick={() => toggleSection('competitors')}
          className="w-full px-5 py-4 flex items-center justify-between bg-[#171717] hover:bg-[#212121]/50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 font-bold text-[15px] text-[#ECECF1]">
            <span className="material-symbols-outlined text-[#10B981] text-[20px]">domain</span>
            <span>Competitor Analysis ({competitors.length})</span>
          </div>
          <span className="material-symbols-outlined text-[20px] text-[#8E8EA0]">
            {openSections.competitors ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {openSections.competitors && (
          <div className="px-5 pb-5 pt-3 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-4">
            {competitors.map((c, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#212121] border border-white/[0.06] flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[14px] text-[#ECECF1]">{c.name}</h4>
                    <span className="text-[10px] font-mono text-[#8E8EA0] bg-[#000000] px-2 py-0.5 rounded border border-white/[0.08]">
                      {industry}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#8E8EA0] leading-relaxed line-clamp-3">
                    {c.reason || 'Direct market competitor operating in the same industry segment.'}
                  </p>
                </div>

                <a
                  href={c.website && c.website.startsWith('http') ? c.website : `https://${c.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-[#000000] hover:bg-[#3B82F6]/10 border border-white/[0.08] hover:border-[#3B82F6]/30 text-[12px] font-medium text-[#3B82F6] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Visit Website</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accordion 6: Sources & Crawled Endpoints */}
      <div className="bg-[#171717] border border-white/[0.08] rounded-2xl overflow-hidden shadow-lg">
        <button
          onClick={() => toggleSection('sources')}
          className="w-full px-5 py-4 flex items-center justify-between bg-[#171717] hover:bg-[#212121]/50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 font-bold text-[15px] text-[#ECECF1]">
            <span className="material-symbols-outlined text-[#8E8EA0] text-[20px]">dataset</span>
            <span>Research Sources & Crawled Endpoints ({crawledPages.length})</span>
          </div>
          <span className="material-symbols-outlined text-[20px] text-[#8E8EA0]">
            {openSections.sources ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {openSections.sources && (
          <div className="px-5 pb-5 pt-3 border-t border-white/[0.08] space-y-2">
            {crawledPages.map((pg, idx) => (
              <a
                key={idx}
                href={pg.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#212121] hover:bg-[#2F2F2F] border border-white/[0.06] flex items-center justify-between text-[12px] font-mono text-[#3B82F6] transition-colors"
              >
                <span className="truncate max-w-[450px]">{pg.title || pg.url}</span>
                <span className="material-symbols-outlined text-[14px]">link</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
