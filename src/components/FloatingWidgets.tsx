import React, { useState } from 'react';
import { MessageCircle, Send, X, Gift, Sparkles, ChevronRight } from 'lucide-react';
import { Language, SiteConfig } from '../types';

interface FloatingWidgetsProps {
  lang: Language;
  config: SiteConfig;
  onOpenOrderModal: () => void;
}

export const FloatingWidgets: React.FC<FloatingWidgetsProps> = ({
  lang,
  config,
  onOpenOrderModal,
}) => {
  const [promoBannerVisible, setPromoBannerVisible] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  const telegramUrl = config.telegramLink || 'https://t.me/ArafatGamingSupport';
  const whatsappUrl = `https://wa.me/88${config.whatsappNumber}?text=${encodeURIComponent(
    'আসসালামু আলাইকুম, আমি সরাসরি সাহায্য চাই।'
  )}`;

  return (
    <>
      {/* 1. Bottom Promo Banner (Giveaways & Telegram App Installs) */}
      {promoBannerVisible && (
        <aside
          aria-label="Promotional announcement"
          className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-950 via-indigo-950 to-purple-950 border-t border-cyan-500/40 text-white py-2.5 px-4 shadow-2xl backdrop-blur-md"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-black flex items-center justify-center font-black shrink-0 shadow-md">
                <Gift className="w-4 h-4 text-black" />
              </div>
              <div className="truncate">
                <span className="font-extrabold text-amber-300">
                  {lang === 'bn' ? '🔥 মেগা গিভঅ্যাওয়ে ও টেলিগ্রাম অফার!' : '🔥 Mega Giveaway & Telegram Offer!'}
                </span>
                <span className="hidden sm:inline text-slate-200 ml-2">
                  {lang === 'bn'
                    ? 'আমাদের টেলিগ্রাম চ্যানেলে যুক্ত হয়ে জিতে নিন ফ্রি উইকলি পাস ও ডায়মন্ড ভাউচার।'
                    : 'Join Telegram group to win free Weekly pass and diamond vouchers.'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={config.telegramGroupLink || 'https://t.me/ArafatGamingGroup'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-[#229ED9] to-[#0088cc] text-white font-bold text-xs hover:opacity-90 transition-opacity shadow-sm"
              >
                <Send className="w-3 h-3 -rotate-12 fill-white" />
                <span>{lang === 'bn' ? 'ক্লেম করুন' : 'Join Now'}</span>
              </a>

              <button
                onClick={() => setPromoBannerVisible(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 2. Floating Support / Live Chat Button ("সাহায্য লাগবে?") */}
      <div className={`fixed right-4 z-40 flex flex-col items-end gap-2.5 ${promoBannerVisible ? 'bottom-14 sm:bottom-16' : 'bottom-5'}`}>
        {/* Support Flyout Options when opened */}
        {chatOpen && (
          <div className="bg-[#0f0724] border border-cyan-500/50 rounded-2xl p-3 shadow-2xl space-y-2 mb-1 w-56 animate-fade-in text-xs font-bold backdrop-blur-lg">
            <div className="text-[11px] text-cyan-300 font-bold border-b border-purple-900/40 pb-1.5 flex items-center justify-between">
              <span>{lang === 'bn' ? '২৪/৭ লাইভ কাস্টমার সাপোর্ট' : '24/7 Live Support'}</span>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>WhatsApp চ্যাট</span>
            </a>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 text-cyan-300 transition-colors"
            >
              <Send className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Telegram হেল্পলাইন</span>
            </a>
          </div>
        )}

        {/* The Main Floating Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-black text-xs sm:text-sm shadow-xl shadow-cyan-950/80 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-cyan-400/50"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <MessageCircle className="w-4 h-4" />
          <span>{lang === 'bn' ? 'সাহায্য লাগবে?' : 'Need Help?'}</span>
        </button>
      </div>
    </>
  );
};
