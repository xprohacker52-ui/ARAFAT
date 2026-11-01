import React from 'react';
import { Megaphone, Bell } from 'lucide-react';
import { Language, SiteConfig } from '../types';

interface TopNoticeTickerProps {
  lang: Language;
  config: SiteConfig;
}

export const TopNoticeTicker: React.FC<TopNoticeTickerProps> = ({ lang, config }) => {
  const noticeText =
    (lang === 'bn' ? config.topNoticeBn || config.noticeBn : config.topNoticeEn || config.noticeEn) ||
    '📢 বিশেষ নোটিশ: আমাদের সাইটে ২৪/৭ ইনস্ট্যান্ট অটো ডায়মন্ড টপ-আপ, সাবস্ক্রিপশন ও সোশ্যাল মিডিয়া বুস্টিং সেবা চালু আছে!';

  return (
    <div className="w-full bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white text-xs sm:text-sm py-2 px-4 border-b border-blue-500/30 overflow-hidden relative shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left Notice Badge */}
        <div className="flex items-center gap-1.5 shrink-0 bg-blue-600/40 text-blue-200 px-2.5 py-0.5 rounded-full border border-blue-400/40 font-bold text-[11px] sm:text-xs">
          <Megaphone className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
          <span>{lang === 'bn' ? 'জরুরি নোটিশ' : 'Notice'}</span>
        </div>

        {/* Marquee / Dynamic Announcement Text */}
        <div className="flex-1 overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee pl-4 font-medium text-blue-100 hover:text-white transition-colors">
            {noticeText} &nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp; {noticeText}
          </div>
        </div>

        {/* Right Info Pill */}
        <div className="hidden md:flex items-center gap-2 shrink-0 text-[11px] text-blue-200/90 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{config.supportHoursBn || config.supportHours}</span>
        </div>
      </div>
    </div>
  );
};
