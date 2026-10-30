import React, { useState } from 'react';
import {
  Tv,
  Film,
  Music,
  Play,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  Flame,
  ArrowRight,
  MonitorPlay,
  Crown,
  Check,
  Laptop,
  Smartphone,
  Info,
} from 'lucide-react';
import { DurationOption, Language, StreamingServiceItem, StreamingSubscription } from '../types';
import { NetflixLogo, CrunchyrollLogo } from './BrandLogos';

interface StreamingSubscriptionsProps {
  lang: Language;
  streamingServices: StreamingServiceItem[];
  onOrderSubscription: (subscription: StreamingSubscription) => void;
}

export const StreamingSubscriptions: React.FC<StreamingSubscriptionsProps> = ({
  lang,
  streamingServices,
  onOrderSubscription,
}) => {
  // Find Netflix and Crunchyroll from dynamic catalog
  const netflixService =
    streamingServices.find((s) => s.serviceKey === 'netflix' || s.id === 'netflix') ||
    streamingServices[0];

  const crunchyrollService =
    streamingServices.find((s) => s.serviceKey === 'crunchyroll' || s.id === 'crunchyroll') ||
    streamingServices[1];

  // Selected duration indices for Netflix & Crunchyroll
  const [selectedNetflixDuration, setSelectedNetflixDuration] = useState<number>(0);
  const [selectedCrunchyDuration, setSelectedCrunchyDuration] = useState<number>(0);

  // Selected durations map for other services (serviceId -> duration index)
  const [otherDurationSelection, setOtherDurationSelection] = useState<Record<string, number>>({});

  // Active duration objects
  const netflixDurations = netflixService?.durations || [];
  const crunchyDurations = crunchyrollService?.durations || [];

  const netflixOpt =
    netflixDurations[selectedNetflixDuration] || netflixDurations[0] || {
      id: 'netflix-1m',
      durationLabel: '1 Month Subscription',
      durationLabelBn: '১ মাস সাবস্ক্রিপশন',
      priceBdt: 180,
    };

  const crunchyOpt =
    crunchyDurations[selectedCrunchyDuration] || crunchyDurations[0] || {
      id: 'crunchy-1m',
      durationLabel: '1 Month Subscription',
      durationLabelBn: '১ মাস সাবস্ক্রিপশন',
      priceBdt: 120,
    };

  // Other services (Spotify, YouTube Premium, HIDIVE, plus any custom admin-added services)
  const otherServices = streamingServices.filter(
    (s) =>
      s.id !== 'netflix' &&
      s.serviceKey !== 'netflix' &&
      s.id !== 'crunchyroll' &&
      s.serviceKey !== 'crunchyroll' &&
      s.active
  );

  // Handle Netflix Order
  const handleOrderNetflix = () => {
    const sub: StreamingSubscription = {
      id: `netflix-${netflixOpt.id}`,
      service: 'netflix',
      title: `Netflix Ultra HD 4K (${netflixOpt.durationLabel})`,
      titleBn: `নেটফ্লিক্স ৪K আল্ট্রা এইচডি (${netflixOpt.durationLabelBn})`,
      duration: netflixOpt.durationLabel,
      durationBn: netflixOpt.durationLabelBn,
      typeBadge: 'Ultra HD 4K · Pin Locked Profile',
      priceBdt: netflixOpt.priceBdt,
      features: netflixService?.features || [
        'Ultra HD 4K + HDR Video Quality',
        'Dedicated Private Pin-Protected Profile',
        'Works on Smart TV, Phone, PC & Laptop',
        'Instant Delivery & Full Replacement Warranty',
      ],
      featuresBn: netflixService?.featuresBn || [
        'আল্ট্রা এইচডি ৪K ও HDR ভিডিও কোয়ালিটি',
        'ব্যক্তিগত পিন-লকড ডেডিকেটেড প্রোফাইল',
        'স্মার্ট টিভি, মোবাইল ও ল্যাপটপে সাপোর্ট',
        'ইনস্ট্যান্ট ডেলিভারি ও ফুল রিপ্লেসমেন্ট ওয়ারেন্টি',
      ],
      popular: netflixOpt.popular,
      active: true,
    };
    onOrderSubscription(sub);
  };

  // Handle Crunchyroll Order
  const handleOrderCrunchyroll = () => {
    const sub: StreamingSubscription = {
      id: `crunchyroll-${crunchyOpt.id}`,
      service: 'crunchyroll',
      title: `Crunchyroll Mega Fan Anime (${crunchyOpt.durationLabel})`,
      titleBn: `ক্রাঞ্চিরোল মেগা ফ্যান অ্যানিমে (${crunchyOpt.durationLabelBn})`,
      duration: crunchyOpt.durationLabel,
      durationBn: crunchyOpt.durationLabelBn,
      typeBadge: 'Ad-Free Anime VIP Pass',
      priceBdt: crunchyOpt.priceBdt,
      features: crunchyrollService?.features || [
        'Simulcast Directly from Japan (1 hr after air)',
        'Completely Ad-Free in 1080p Full HD',
        'Offline Viewing & Episodes Download',
        'Private Account Access with Full Warranty',
      ],
      featuresBn: crunchyrollService?.featuresBn || [
        'জাপানে সম্প্রচারের ১ ঘণ্টার মধ্যে নতুন পর্ব',
        'সম্পূর্ণ বিজ্ঞাপনমুক্ত ১০৮০p এইচডি অ্যানিমে',
        'অফলাইনে এপিসোড ডাউনলোড ও দেখার সুবিধা',
        'প্রাইভেট অ্যাকাউন্ট এক্সেস ও পূর্ণ ওয়ারেন্টি',
      ],
      popular: crunchyOpt.popular,
      active: true,
    };
    onOrderSubscription(sub);
  };

  // Handle other service order
  const handleOrderOther = (service: StreamingServiceItem) => {
    const selectedIdx = otherDurationSelection[service.id] || 0;
    const durOpt = service.durations[selectedIdx] || service.durations[0] || {
      id: `${service.id}-1m`,
      durationLabel: '1 Month',
      durationLabelBn: '১ মাস',
      priceBdt: 120,
    };

    const sub: StreamingSubscription = {
      id: `${service.id}-${durOpt.id}`,
      service: service.serviceKey,
      title: `${service.name} (${durOpt.durationLabel})`,
      titleBn: `${service.nameBn} (${durOpt.durationLabelBn})`,
      duration: durOpt.durationLabel,
      durationBn: durOpt.durationLabelBn,
      typeBadge: service.badge,
      priceBdt: durOpt.priceBdt,
      features: service.features,
      featuresBn: service.featuresBn,
      active: true,
    };
    onOrderSubscription(sub);
  };

  return (
    <section id="streaming-subscriptions" className="py-12 md:py-16 bg-[#080314] border-t border-purple-900/40 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/70 border border-red-800/40 text-xs font-semibold text-red-400 mb-3">
            <MonitorPlay className="w-3.5 h-3.5" />
            <span>Official OTT & Streaming Subscriptions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {lang === 'bn' ? 'নেটফ্লিক্স ও ক্রাঞ্চিরোল সাবস্ক্রিপশন প্যাকেজ' : 'Netflix & Crunchyroll Official Subscriptions'}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2.5">
            {lang === 'bn'
              ? 'অফিসিয়াল নেটফ্লিক্স ৪K এবং ক্রাঞ্চিরোল অ্যানিমে মেগা ফ্যান সাবস্ক্রিপশন নিন ১ মাস, ২ মাস, ৬ মাস ও ১ বছরের মেয়াদে ফুল রিপ্লেসমেন্ট ওয়ারেন্টি সহ।'
              : 'Official Netflix 4K UHD and Crunchyroll Mega Fan anime subscriptions with flexible 1 Month, 2 Months, 6 Months, and 1 Year duration options.'}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 2 MAIN FEATURED CARDS: NETFLIX & CRUNCHYROLL (Anime) with Official Logos */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-6xl mx-auto mb-14">
          {/* ========================================================= */}
          {/* 1. NETFLIX DEDICATED CARD with Official Netflix Logo */}
          {/* ========================================================= */}
          {netflixService && netflixService.active && (
            <div className="bg-[#11050d] border-2 border-red-900/50 hover:border-red-600/70 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-red-950/40 flex flex-col justify-between transition-all relative overflow-hidden group">
              {/* Ambient Background Red Glow */}
              <div className="absolute -top-28 -right-28 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                {/* Header: Official Logo + Name + Brand Badges */}
                <div className="flex items-start justify-between pb-6 border-b border-red-900/40">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#1b0811] border border-red-600/40 p-2.5 flex items-center justify-center shrink-0 shadow-lg shadow-black group-hover:scale-105 transition-transform">
                      <NetflixLogo className="w-full h-full drop-shadow-md" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wider">
                          NETFLIX
                        </h3>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800/40">
                          4K UHD
                        </span>
                      </div>
                      <p className="text-xs text-red-300 font-medium mt-0.5">
                        {lang === 'bn' ? 'আল্ট্রা এইচডি ৪K প্রিমিয়াম ওটিটি' : 'Ultra HD 4K + HDR Streaming'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-950/70 text-emerald-300 border border-emerald-800/40 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{lang === 'bn' ? 'ফুল ওয়ারেন্টি' : 'Full Warranty'}</span>
                    </span>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {lang === 'bn' ? 'পিন লকড প্রোফাইল' : 'Pin-Locked Profile'}
                    </div>
                  </div>
                </div>

                {/* DURATION OPTIONS SELECTOR: 1 Month, 2 Months, 6 Months, 1 Year */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-red-400" />
                      <span>{lang === 'bn' ? 'সাবস্ক্রিপশন মেয়াদ নির্বাচন করুন:' : 'Select Duration Option:'}</span>
                    </label>
                    <span className="text-[11px] text-red-400 font-semibold">
                      {lang === 'bn'
                        ? `${netflixDurations.length}টি অপশন উপলব্ধ`
                        : `${netflixDurations.length} Duration Options`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {netflixDurations.map((opt, idx) => {
                      const isSelected = selectedNetflixDuration === idx;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedNetflixDuration(idx)}
                          className={`p-3 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                            isSelected
                              ? 'bg-red-950/60 border-red-500 shadow-md shadow-red-950 scale-[1.02] ring-1 ring-red-500'
                              : 'bg-[#0d040a] border-red-950/80 text-slate-300 hover:border-red-800/60 hover:text-white'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}

                          <div className="text-xs font-bold text-white mb-0.5">
                            {lang === 'bn' ? opt.durationLabelBn : opt.durationLabel}
                          </div>
                          <div className="text-sm sm:text-base font-black text-red-400 font-mono">
                            ৳{opt.priceBdt} <span className="text-[10px] font-normal text-slate-400">BDT</span>
                          </div>
                          {opt.savingsBadge && (
                            <span
                              className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-1 ${
                                opt.popular
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-red-900/30 text-red-300'
                              }`}
                            >
                              {lang === 'bn' ? opt.savingsBadgeBn : opt.savingsBadge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Features List */}
                <div className="mt-6 bg-[#160611] rounded-2xl p-4 border border-red-900/30 space-y-2">
                  <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-red-400" />
                    <span>{lang === 'bn' ? 'এই প্যাকেজের বিশেষ সুবিধাসমূহ:' : 'Package Features Included:'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    {(lang === 'bn' ? netflixService.featuresBn : netflixService.features).map((feat, fidx) => (
                      <div key={fidx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Box & Buy Now Button */}
              <div className="mt-6 pt-5 border-t border-red-900/40">
                <div className="flex items-center justify-between mb-4 bg-red-950/40 p-3.5 rounded-2xl border border-red-900/40">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                      {lang === 'bn' ? 'নির্বাচিত মেয়াদের মূল্য:' : 'Selected Plan Price:'}
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                        ৳{netflixOpt.priceBdt}
                      </span>
                      <span className="text-xs text-red-300 font-semibold">BDT</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-white font-bold block">
                      {lang === 'bn' ? netflixOpt.durationLabelBn : netflixOpt.durationLabel}
                    </span>
                    <span className="text-[11px] text-red-400 font-medium">
                      {lang === 'bn' ? 'ইনস্ট্যান্ট ডেলিভারি' : 'Instant 5-15 min Delivery'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOrderNetflix}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-950 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <span>
                    {lang === 'bn'
                      ? `নেটফ্লিক্স অর্ডার করুন (${netflixOpt.durationLabelBn})`
                      : `Order Netflix (${netflixOpt.durationLabel})`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. CRUNCHYROLL (Anime) CARD with Official Logo */}
          {/* ========================================================= */}
          {crunchyrollService && crunchyrollService.active && (
            <div className="bg-[#120904] border-2 border-orange-900/50 hover:border-orange-500/70 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-orange-950/40 flex flex-col justify-between transition-all relative overflow-hidden group">
              {/* Ambient Background Orange Glow */}
              <div className="absolute -top-28 -right-28 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                {/* Header: Official Logo + Name + Brand Badges */}
                <div className="flex items-start justify-between pb-6 border-b border-orange-900/40">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#1f1008] border border-orange-500/40 p-2.5 flex items-center justify-center shrink-0 shadow-lg shadow-black group-hover:scale-105 transition-transform">
                      <CrunchyrollLogo className="w-full h-full drop-shadow-md" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                          Crunchyroll
                        </h3>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-950 text-orange-400 border border-orange-800/40">
                          Anime Pass
                        </span>
                      </div>
                      <p className="text-xs text-orange-300 font-medium mt-0.5">
                        {lang === 'bn' ? 'মেগা ফ্যান অ্যানিমে ভিআইপি পাস' : 'Mega Fan Ad-Free Anime VIP'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-950/70 text-emerald-300 border border-emerald-800/40 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{lang === 'bn' ? 'অফিসিয়াল' : 'Official VIP'}</span>
                    </span>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {lang === 'bn' ? 'অফলাইন ডাউনলোড' : 'Offline Download'}
                    </div>
                  </div>
                </div>

                {/* DURATION OPTIONS SELECTOR: 1 Month, 2 Months, 6 Months, 1 Year */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-orange-400" />
                      <span>{lang === 'bn' ? 'সাবস্ক্রিপশন মেয়াদ নির্বাচন করুন:' : 'Select Duration Option:'}</span>
                    </label>
                    <span className="text-[11px] text-orange-400 font-semibold">
                      {lang === 'bn'
                        ? `${crunchyDurations.length}টি অপশন উপলব্ধ`
                        : `${crunchyDurations.length} Duration Options`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {crunchyDurations.map((opt, idx) => {
                      const isSelected = selectedCrunchyDuration === idx;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedCrunchyDuration(idx)}
                          className={`p-3 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                            isSelected
                              ? 'bg-orange-950/60 border-orange-500 shadow-md shadow-orange-950 scale-[1.02] ring-1 ring-orange-500'
                              : 'bg-[#0d0703] border-orange-950/80 text-slate-300 hover:border-orange-800/60 hover:text-white'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}

                          <div className="text-xs font-bold text-white mb-0.5">
                            {lang === 'bn' ? opt.durationLabelBn : opt.durationLabel}
                          </div>
                          <div className="text-sm sm:text-base font-black text-orange-400 font-mono">
                            ৳{opt.priceBdt} <span className="text-[10px] font-normal text-slate-400">BDT</span>
                          </div>
                          {opt.savingsBadge && (
                            <span
                              className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-1 ${
                                opt.popular
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-orange-900/30 text-orange-300'
                              }`}
                            >
                              {lang === 'bn' ? opt.savingsBadgeBn : opt.savingsBadge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Features List */}
                <div className="mt-6 bg-[#1b0d06] rounded-2xl p-4 border border-orange-900/30 space-y-2">
                  <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    <span>{lang === 'bn' ? 'মেগা ফ্যান অ্যানিমে সুবিধাসমূহ:' : 'Mega Fan VIP Features:'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    {(lang === 'bn' ? crunchyrollService.featuresBn : crunchyrollService.features).map((feat, fidx) => (
                      <div key={fidx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Box & Buy Now Button */}
              <div className="mt-6 pt-5 border-t border-orange-900/40">
                <div className="flex items-center justify-between mb-4 bg-orange-950/40 p-3.5 rounded-2xl border border-orange-900/40">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                      {lang === 'bn' ? 'নির্বাচিত মেয়াদের মূল্য:' : 'Selected Plan Price:'}
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                        ৳{crunchyOpt.priceBdt}
                      </span>
                      <span className="text-xs text-orange-300 font-semibold">BDT</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-white font-bold block">
                      {lang === 'bn' ? crunchyOpt.durationLabelBn : crunchyOpt.durationLabel}
                    </span>
                    <span className="text-[11px] text-orange-400 font-medium">
                      {lang === 'bn' ? 'ইনস্ট্যান্ট অ্যাক্টিভেশন' : 'Instant 5-15 min Delivery'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOrderCrunchyroll}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-orange-500 via-amber-600 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white shadow-lg shadow-orange-950 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <span>
                    {lang === 'bn'
                      ? `ক্রাঞ্চিরোল অর্ডার করুন (${crunchyOpt.durationLabelBn})`
                      : `Order Crunchyroll (${crunchyOpt.durationLabel})`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* OTHER POPULAR SERVICES: SPOTIFY, YOUTUBE PREMIUM, HIDIVE & CUSTOM ONES */}
        {/* ========================================================================= */}
        {otherServices.length > 0 && (
          <div className="mt-8 pt-8 border-t border-purple-900/30">
            <div className="text-center mb-6">
              <h4 className="text-lg sm:text-xl font-bold text-white">
                {lang === 'bn' ? 'অন্যান্য ওটিটি ও প্রিমিয়াম মিউজিক সার্ভিস' : 'Other Popular Music & Anime Passes'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'bn'
                  ? 'স্পটিফাই, ইউটিউব প্রিমিয়াম ও হাইডাইভ অ্যানিমে সাশ্রয়ী মূল্যে সরাসরি নিজস্ব অ্যাকাউন্টে নিন।'
                  : 'Spotify Premium, YouTube Premium, and HIDIVE passes activated directly.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {otherServices.map((item) => {
                const currentDurationIdx = otherDurationSelection[item.id] || 0;
                const activeDur = item.durations[currentDurationIdx] || item.durations[0];

                return (
                  <div
                    key={item.id}
                    className="bg-[#0f0720] border border-purple-900/40 hover:border-purple-600/50 rounded-2xl p-5 flex flex-col justify-between transition-all hover:-translate-y-1"
                  >
                    <div>
                      {/* Service Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-xl ${
                              item.logoBg || 'bg-purple-600 text-white font-black'
                            } flex items-center justify-center text-xs shadow-md shrink-0`}
                          >
                            {item.logoText || item.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-white">
                              {lang === 'bn' ? item.nameBn : item.name}
                            </h5>
                            <span className="text-[11px] text-purple-300/80">{item.badge}</span>
                          </div>
                        </div>
                      </div>

                      {/* Duration selector buttons if multiple durations exist */}
                      {item.durations.length > 1 && (
                        <div className="my-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                          {item.durations.map((dur, didx) => (
                            <button
                              key={dur.id}
                              type="button"
                              onClick={() =>
                                setOtherDurationSelection((prev) => ({
                                  ...prev,
                                  [item.id]: didx,
                                }))
                              }
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                                currentDurationIdx === didx
                                  ? 'bg-purple-600 text-white shadow'
                                  : 'bg-purple-950/60 text-slate-300 hover:text-white'
                              }`}
                            >
                              {lang === 'bn' ? dur.durationLabelBn : dur.durationLabel}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Features */}
                      <div className="space-y-1.5 my-3 text-xs text-slate-300">
                        {(lang === 'bn' ? item.featuresBn : item.features).slice(0, 3).map((feat, fidx) => (
                          <div key={fidx} className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-purple-900/40 flex items-center justify-between mt-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block">
                          {lang === 'bn' ? activeDur?.durationLabelBn : activeDur?.durationLabel}
                        </span>
                        <span className="text-base font-black text-white font-mono">
                          ৳{activeDur?.priceBdt} BDT
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOrderOther(item)}
                        className="py-2 px-3.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer"
                      >
                        {lang === 'bn' ? 'অর্ডার করুন' : 'Buy Now'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
