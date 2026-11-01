import React from 'react';
import { Send, Users2, MessageCircle, Facebook, Sparkles } from 'lucide-react';
import { Language, SiteConfig } from '../types';

interface QuickSocialActionsProps {
  lang: Language;
  config: SiteConfig;
}

export const QuickSocialActions: React.FC<QuickSocialActionsProps> = ({ lang, config }) => {
  const telegramSupportUrl = config.telegramLink || 'https://t.me/ArafatGamingSupport';
  const telegramGroupUrl = config.telegramGroupLink || 'https://t.me/ArafatGamingGroup';
  const whatsappUrl = `https://wa.me/88${config.whatsappNumber}?text=${encodeURIComponent(
    'আসসালামু আলাইকুম, আরাফাত গেমিং থেকে সেবা নিতে চাই।'
  )}`;
  const facebookGroupUrl = config.facebookGroupLink || 'https://facebook.com/groups/arafatgaming';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        {/* 1. Telegram Support */}
        <a
          href={telegramSupportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-3.5 py-3 rounded-2xl bg-gradient-to-r from-[#229ED9]/20 to-[#0088cc]/30 hover:from-[#229ED9] hover:to-[#0088cc] border border-[#229ED9]/50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#0088cc]/10 hover:shadow-[#0088cc]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
        >
          <div className="w-6 h-6 rounded-lg bg-[#0088cc] text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Send className="w-3.5 h-3.5 -rotate-12 fill-white" />
          </div>
          <span className="whitespace-nowrap">
            {lang === 'bn' ? 'টেলিগ্রাম সাপোর্ট' : 'Telegram Support'}
          </span>
        </a>

        {/* 2. Join Community Group */}
        <a
          href={telegramGroupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-3.5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600/20 to-purple-600/30 hover:from-indigo-600 hover:to-purple-600 border border-indigo-500/50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-900/20 hover:shadow-indigo-600/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
        >
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Users2 className="w-3.5 h-3.5" />
          </div>
          <span className="whitespace-nowrap">
            {lang === 'bn' ? 'গ্রুপে যুক্ত হোন' : 'Join Group'}
          </span>
        </a>

        {/* 3. WhatsApp Support */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-3.5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600/20 to-teal-600/30 hover:from-emerald-600 hover:to-teal-600 border border-emerald-500/50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/20 hover:shadow-emerald-600/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
        >
          <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
          </div>
          <span className="whitespace-nowrap">
            {lang === 'bn' ? 'WhatsApp সাপোর্ট' : 'WhatsApp Helpline'}
          </span>
        </a>

        {/* 4. Facebook Community */}
        <a
          href={facebookGroupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-3.5 py-3 rounded-2xl bg-gradient-to-r from-blue-700/20 to-indigo-700/30 hover:from-blue-700 hover:to-indigo-700 border border-blue-600/50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-900/20 hover:shadow-blue-600/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
        >
          <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Facebook className="w-3.5 h-3.5 fill-white" />
          </div>
          <span className="whitespace-nowrap">
            {lang === 'bn' ? 'ফেসবুক গ্রুপ' : 'Facebook Group'}
          </span>
        </a>
      </div>
    </div>
  );
};
