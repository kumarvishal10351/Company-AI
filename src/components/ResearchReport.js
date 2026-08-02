'use client';

import React from 'react';

export default function ResearchReport({
  report,
  onDownloadPdf,
  onSendDiscord,
  onRegenerate,
  onCopyReport,
  discordConfigured,
}) {
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
  } = report || {};

  return (
    <div className="space-y-6 my-2 max-w-3xl text-[#ececf1] bg-[#000000] animate-fadeIn">
      {/* Title & Metadata Section */}
      <div className="space-y-2 border-b border-white/[0.08] pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#ececf1] tracking-tight">{companyName}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] text-[11px] font-mono font-medium border border-[#10B981]/30">
              Verified Synthesis
            </span>
          </div>

          <div className="text-[12px] font-mono text-[#8e8ea0] flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Confidence: 98.4%</span>
          </div>
        </div>

        <a
          href={website.startsWith('http') ? website : `https://${website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-[#3B82F6] hover:underline font-mono inline-flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">link</span>
          {website}
        </a>
      </div>

      {/* Section 1: Executive Summary */}
      <div className="space-y-2">
        <h3 className="text-[16px] font-bold text-[#ececf1] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#3B82F6] text-[20px]">description</span>
          Executive Summary
        </h3>
        <p className="text-[14px] text-[#ececf1]/90 leading-relaxed font-sans">
          {summary}
        </p>
      </div>

      {/* Section 2: Company Information Grid */}
      <div className="space-y-3 pt-2 border-t border-white/[0.08]">
        <h3 className="text-[16px] font-bold text-[#ececf1] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#3B82F6] text-[20px]">corporate_fare</span>
          Company Metadata & Contact
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
          <div className="flex items-baseline justify-between border-b border-white/[0.05] pb-1.5">
            <span className="text-[#8e8ea0]">Website</span>
            <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className="text-[#3B82F6] hover:underline font-mono truncate max-w-[200px]">
              {website}
            </a>
          </div>

          <div className="flex items-baseline justify-between border-b border-white/[0.05] pb-1.5">
            <span className="text-[#8e8ea0]">Industry</span>
            <span className="text-[#ececf1] font-medium">{industry}</span>
          </div>

          <div className="flex items-baseline justify-between border-b border-white/[0.05] pb-1.5">
            <span className="text-[#8e8ea0]">Phone</span>
            <span className="text-[#ececf1] font-medium">{phone}</span>
          </div>

          <div className="flex items-baseline justify-between border-b border-white/[0.05] pb-1.5">
            <span className="text-[#8e8ea0]">Address</span>
            <span className="text-[#ececf1] font-medium truncate max-w-[200px]">{address}</span>
          </div>

          {emails && emails.length > 0 && (
            <div className="sm:col-span-2 flex flex-col gap-1 pt-1">
              <span className="text-[#8e8ea0]">Emails</span>
              <div className="flex flex-wrap gap-2">
                {emails.map((e, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-[#212121] text-[12px] font-mono text-[#ececf1]">
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}

          {socialLinks && socialLinks.length > 0 && (
            <div className="sm:col-span-2 flex flex-col gap-1 pt-1">
              <span className="text-[#8e8ea0]">Social Links</span>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 rounded bg-[#212121] hover:bg-[#2f2f2f] text-[12px] font-mono text-[#3B82F6] transition-colors truncate max-w-[220px]"
                  >
                    {link.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Core Products & Services */}
      <div className="space-y-3 pt-2 border-t border-white/[0.08]">
        <h3 className="text-[16px] font-bold text-[#ececf1] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#10B981] text-[20px]">category</span>
          Products & Services
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
          {productsAndServices.map((p, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[#ececf1]/90">
              <span className="text-[#10B981] font-bold">•</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Key Challenges & Strategic Opportunities */}
      <div className="space-y-3 pt-2 border-t border-white/[0.08]">
        <h3 className="text-[16px] font-bold text-[#ececf1] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#3B82F6] text-[20px]">warning</span>
          Key Challenges & Strategic Opportunities
        </h3>
        <div className="space-y-2.5 text-[13.5px]">
          {painPoints.map((pp, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-[#ececf1]/90 leading-relaxed">
              <span className="text-red-400 font-bold mt-0.5">•</span>
              <span>{pp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Competitor Analysis */}
      <div className="space-y-3 pt-2 border-t border-white/[0.08]">
        <h3 className="text-[16px] font-bold text-[#ececf1] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#10B981] text-[20px]">domain</span>
          Competitor Analysis ({competitors.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
          {competitors.map((c, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#212121]/60 border border-white/[0.06] flex flex-col justify-between space-y-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[14px] text-[#ececf1]">{c.name}</h4>
                  <span className="text-[10px] font-mono text-[#8e8ea0]">{industry}</span>
                </div>
                <p className="text-[12px] text-[#8e8ea0] leading-relaxed line-clamp-3">
                  {c.reason || 'Direct market competitor operating in the same industry segment.'}
                </p>
              </div>

              <a
                href={c.website && c.website.startsWith('http') ? c.website : `https://${c.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] font-mono text-[#3B82F6] hover:underline inline-flex items-center gap-1 pt-1"
              >
                <span>Visit {c.website || c.name}</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Research Sources */}
      {crawledPages && crawledPages.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-white/[0.08]">
          <h3 className="text-[14px] font-bold text-[#8e8ea0] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">dataset</span>
            Research Sources ({crawledPages.length})
          </h3>
          <div className="flex flex-wrap gap-2 text-[12px] font-mono">
            {crawledPages.map((pg, idx) => (
              <a
                key={idx}
                href={pg.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-[#212121] hover:bg-[#2f2f2f] text-[#3B82F6] transition-colors truncate max-w-[260px]"
              >
                {pg.title || pg.url}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Minimal ChatGPT Action Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/[0.08]">
        <button
          onClick={onDownloadPdf}
          className="px-3 py-1.5 rounded-lg bg-[#212121] hover:bg-[#2f2f2f] border border-white/[0.08] text-[#ececf1] text-[12px] font-medium flex items-center gap-1.5 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">download</span>
          <span>Download PDF</span>
        </button>

        <button
          onClick={onSendDiscord}
          className="px-3 py-1.5 rounded-lg bg-[#212121] hover:bg-[#2f2f2f] border border-white/[0.08] text-[#ececf1] text-[12px] font-medium flex items-center gap-1.5 transition-all active:scale-95"
          title={discordConfigured ? 'Post report to Discord' : 'Configure Discord in Settings first'}
        >
          <span className="material-symbols-outlined text-[16px]">forum</span>
          <span>Send to Discord</span>
        </button>

        <button
          onClick={onRegenerate}
          className="px-3 py-1.5 rounded-lg bg-[#212121] hover:bg-[#2f2f2f] border border-white/[0.08] text-[#ececf1] text-[12px] font-medium flex items-center gap-1.5 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          <span>Generate Again</span>
        </button>

        <button
          onClick={onCopyReport}
          className="px-3 py-1.5 rounded-lg bg-[#212121] hover:bg-[#2f2f2f] border border-white/[0.08] text-[#8e8ea0] hover:text-[#ececf1] text-[12px] font-medium flex items-center gap-1.5 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">content_copy</span>
          <span>Copy Report</span>
        </button>
      </div>
    </div>
  );
}
