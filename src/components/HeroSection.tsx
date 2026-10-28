import React from 'react';
import { ArrowRight, CheckCircle2, ShieldAlert, Zap, Clock, Headphones } from 'lucide-react';
import { Language, SiteConfig } from '../types';
import { translations } from '../data/translations';

interface HeroSectionProps {
  lang: Language;
  config: SiteConfig;
  onExplorePackages: () => void;
  onTrackOrder: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  config,
  onExplorePackages,
  onTrackOrder,
}) => {
  const t = translations[lang];

  return (
    <section className="relative overflow-hidden pt-6 pb-12 md:py-16">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-700/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-cyan-600/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Notice Marquee / Top Alert */}
        <div className="mb-6 px-4 py-2.5 rounded-xl bg-purple-950/40 border border-purple-800/30 text-purple-200 text-xs sm:text-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="truncate">
              {lang === 'bn' ? config.noticeBn : config.noticeEn}
            </p>
          </div>
          <button
            onClick={onTrackOrder}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-2 shrink-0 cursor-pointer"
          >
            {t.btnTrackNow}
          </button>
        </div>

        {/* 2-Column Split Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Trust Kicker (clean unboxed text) */}
            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-purple-400">
              {t.heroBadge}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              {t.heroTitle} <br />
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                {t.heroHighlight}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* Mandatory Security Banner: NEVER ASK FOR PASSWORD */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-purple-950/40 to-slate-900/60 border border-red-800/40 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-slate-200 leading-snug">
                <strong className="text-red-300 mr-1">{t.securityWarningTitle}</strong>
                {t.securityWarningText}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExplorePackages}
                className="px-6 py-3 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/40 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{t.btnViewPackages}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onTrackOrder}
                className="px-6 py-3 rounded-xl font-semibold text-sm sm:text-base text-slate-200 bg-[#160d2b] border border-purple-800/50 hover:bg-[#1f133d] hover:text-white transition-all cursor-pointer"
              >
                {t.btnTrackNow}
              </button>
            </div>

            {/* Quick Proof Strip */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-purple-900/30 text-center sm:text-left">
              <div>
                <div className="text-lg sm:text-xl font-bold text-white font-mono-numbers">
                  {t.statDelivery}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{t.statDeliveryLabel}</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-purple-300">
                  {t.statSafety}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{t.statSafetyLabel}</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-cyan-300">
                  {t.statSupport}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{t.statSupportLabel}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Artwork */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-purple-800/40 shadow-2xl shadow-purple-950/70 bg-[#130b24]">
              {/* Fallback container with image */}
              <div className="aspect-[16/10] sm:aspect-[4/3] w-full relative">
                <img
                  src="/src/assets/images/hero_arafat_gaming_1793189550906.jpg"
                  alt="Arafat Gaming Free Fire Diamond Top-Up Bangladesh"
                  width={800}
                  height={500}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    // Fallback to stylized gradient if image fails
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {/* Fallback element underneath */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-[#0e0722] to-slate-950 -z-10 flex flex-col items-center justify-center p-6 text-center">
                  <Zap className="w-12 h-12 text-purple-400 mb-2" />
                  <span className="font-extrabold text-xl text-white">ARAFAT GAMING</span>
                  <span className="text-xs text-slate-400 mt-1">Free Fire Diamond Store</span>
                </div>

                {/* Subtle bottom glass overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#090514] via-[#090514]/80 to-transparent flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>UID Topup · 100% Guaranteed</span>
                  </div>
                  <span className="font-mono-numbers text-cyan-300 font-bold">bKash & Nagad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
