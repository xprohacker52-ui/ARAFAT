import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Zap,
  Calculator,
  Flame,
  Clock,
  Heart,
  TrendingUp,
  Award,
} from 'lucide-react';
import { Language, SiteConfig } from '../types';
import { FacebookLogo, InstagramLogo } from './BrandLogos';

interface SocialFollowersSectionProps {
  lang: Language;
  config: SiteConfig;
  onOrderFacebookFollowers: (followersCount: number, priceBdt: number, profileLink: string) => void;
  onOrderInstagramFollowers: (followersCount: number, priceBdt: number, profileLink: string) => void;
}

export const SocialFollowersSection: React.FC<SocialFollowersSectionProps> = ({
  lang,
  config,
  onOrderFacebookFollowers,
  onOrderInstagramFollowers,
}) => {
  // Facebook state
  const [fbCount, setFbCount] = useState<number>(5000);
  const [fbCustomInput, setFbCustomInput] = useState<string>('5000');
  const [fbLink, setFbLink] = useState<string>('');
  const [fbError, setFbError] = useState<string | null>(null);

  // Instagram state
  const [igCount, setIgCount] = useState<number>(5000);
  const [igCustomInput, setIgCustomInput] = useState<string>('5000');
  const [igLink, setIgLink] = useState<string>('');
  const [igError, setIgError] = useState<string | null>(null);

  // Rates
  const fbRatePer1k = config.followerRatePer1k || 120; // 120 BDT per 1k
  const igRatePer1k = config.instagramFollowerRatePer1k || 150; // 150 BDT per 1k

  // Dynamic Price Calculation (supports 1 up to 1,000,000 followers)
  const calcFbPrice = (count: number) => {
    if (count <= 0) return 0;
    const raw = (count / 1000) * fbRatePer1k;
    return Math.max(1, Math.round(raw));
  };

  const calcIgPrice = (count: number) => {
    if (count <= 0) return 0;
    const raw = (count / 1000) * igRatePer1k;
    return Math.max(1, Math.round(raw));
  };

  const fbTotalPrice = calcFbPrice(fbCount);
  const igTotalPrice = calcIgPrice(igCount);

  // Presets from 100 up to 1,000,000
  const presets = [100, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];

  const formatPresetLabel = (val: number) => {
    if (val >= 1000000) return `${val / 1000000}M`;
    if (val >= 1000) return `${val / 1000}k`;
    return `${val}`;
  };

  // Facebook handlers
  const handleFbPreset = (val: number) => {
    setFbCount(val);
    setFbCustomInput(val.toString());
    setFbError(null);
  };

  const handleFbInputChange = (val: string) => {
    setFbCustomInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      if (num < 1) {
        setFbError(lang === 'bn' ? 'নূন্যতম ১টি ফলোয়ার্স অর্ডার করতে হবে।' : 'Minimum order is 1 follower.');
      } else if (num > 1000000) {
        setFbError(lang === 'bn' ? 'সর্বোচ্চ ১০,০০,০০০ (১ মিলিয়ন) ফলোয়ার্স অর্ডার করা যাবে।' : 'Maximum order is 1,000,000 (1 Million) followers.');
      } else {
        setFbError(null);
      }
      setFbCount(Math.min(Math.max(num, 1), 1000000));
    }
  };

  const handleFbOrder = () => {
    if (fbCount < 1 || fbCount > 1000000) {
      setFbError(lang === 'bn' ? 'দয়া করে ১ থেকে ১০,০০,০০০ (১ মিলিয়ন) এর মধ্যে ফলোয়ার্স নির্বাচন করুন।' : 'Please choose between 1 and 1,000,000 followers.');
      return;
    }
    onOrderFacebookFollowers(fbCount, fbTotalPrice, fbLink.trim());
  };

  // Instagram handlers
  const handleIgPreset = (val: number) => {
    setIgCount(val);
    setIgCustomInput(val.toString());
    setIgError(null);
  };

  const handleIgInputChange = (val: string) => {
    setIgCustomInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      if (num < 1) {
        setIgError(lang === 'bn' ? 'নূন্যতম ১টি ফলোয়ার্স অর্ডার করতে হবে।' : 'Minimum order is 1 follower.');
      } else if (num > 1000000) {
        setIgError(lang === 'bn' ? 'সর্বোচ্চ ১০,০০,০০০ (১ মিলিয়ন) ফলোয়ার্স অর্ডার করা যাবে।' : 'Maximum order is 1,000,000 (1 Million) followers.');
      } else {
        setIgError(null);
      }
      setIgCount(Math.min(Math.max(num, 1), 1000000));
    }
  };

  const handleIgOrder = () => {
    if (igCount < 1 || igCount > 1000000) {
      setIgError(lang === 'bn' ? 'দয়া করে ১ থেকে ১০,০০,০০০ (১ মিলিয়ন) এর মধ্যে ফলোয়ার্স নির্বাচন করুন।' : 'Please choose between 1 and 1,000,000 followers.');
      return;
    }
    onOrderInstagramFollowers(igCount, igTotalPrice, igLink.trim());
  };

  return (
    <section id="social-followers" className="py-12 md:py-16 bg-[#0c071d]/80 border-t border-purple-900/40 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/50 text-xs font-semibold text-blue-300 mb-3 shadow-sm">
            <FacebookLogo className="w-4 h-4 shrink-0" />
            <span className="text-slate-400">·</span>
            <InstagramLogo className="w-4 h-4 shrink-0" />
            <span className="ml-1 font-bold">Social Media Growth Services</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {lang === 'bn' ? 'সোশ্যাল মিডিয়া ফলোয়ার্স সার্ভিস ও লাইভ ক্যালকুলেটর' : 'Social Media Followers & Price Calculator'}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2.5">
            {lang === 'bn'
              ? 'ফেসবুক ও ইনস্টাগ্রামের জন্য ১০০% নিরাপদ নন-ড্রপ ফলোয়ার্স (১ ফলোয়ার থেকে ১০,০০,০০০ / ১ মিলিয়ন পর্যন্ত)। লাইভ ক্যালকুলেটরে সরাসরি হিসাব ও অর্ডার করুন।'
              : 'Official high-retention Facebook and Instagram followers from 1 up to 1,000,000 (1 Million). Real-time price calculation with instant processing.'}
          </p>
        </div>

        {/* 2-Column Side-by-Side Cards: Facebook & Instagram */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-6xl mx-auto">
          {/* ========================================================= */}
          {/* 1. FACEBOOK FOLLOWERS CARD (Prominent Official Facebook Logo) */}
          {/* ========================================================= */}
          <div className="bg-[#110825] border-2 border-blue-900/50 hover:border-blue-700/70 rounded-3xl p-6 sm:p-7 shadow-xl shadow-blue-950/30 flex flex-col justify-between transition-all relative overflow-hidden group">
            {/* Ambient subtle glow */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Prominent Header Banner with Official Facebook Logo */}
              <div className="flex items-center justify-between pb-5 border-b border-blue-900/50 bg-gradient-to-r from-blue-950/40 via-blue-900/20 to-transparent p-4 rounded-2xl mb-5 border border-blue-800/30">
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#1877F2]/15 border-2 border-[#1877F2]/50 p-2 sm:p-2.5 flex items-center justify-center shrink-0 shadow-lg shadow-blue-950/50 group-hover:scale-105 transition-all">
                    <FacebookLogo className="w-full h-full drop-shadow" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        Facebook Followers
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/40">
                        <CheckCircle2 className="w-3 h-3 text-blue-400" />
                        Official
                      </span>
                    </div>
                    <p className="text-xs text-blue-300/90 font-medium mt-0.5">
                      {lang === 'bn' ? 'ফেসবুক পেজ ও প্রোফাইল ফলোয়ার্স' : 'Facebook Page & Profile Followers'}
                    </p>
                    <div className="text-[11px] text-slate-400 font-mono mt-1">
                      {lang === 'bn' ? 'রেঞ্জ: ১ থেকে ১০,০০,০০০ (১M) ফলোয়ার' : 'Range: 1 to 1,000,000 (1M) Followers'}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'bn' ? 'নো পাসওয়ার্ড' : 'No Password'}</span>
                  </span>
                  <div className="text-[11px] text-blue-300 font-medium mt-1.5 font-mono">
                    ৳{fbRatePer1k} / 1k {lang === 'bn' ? 'ফলোয়ার' : 'followers'}
                  </div>
                </div>
              </div>

              {/* Presets Grid (100 to 1M) */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>{lang === 'bn' ? 'জনপ্রিয় পরিমাণ সিলেক্ট করুন:' : 'Select Quantity:'}</span>
                  <span className="text-[11px] text-blue-400 font-mono font-medium">১ - ১০,০০,০০০ (১M)</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {presets.map((p) => {
                    const isSelected = fbCount === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleFbPreset(p)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50 scale-[1.03]'
                            : 'bg-[#090417] border border-blue-900/30 text-slate-300 hover:text-white hover:border-blue-600/50'
                        }`}
                      >
                        {formatPresetLabel(p)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Range Slider & Manual Input (1 to 1,000,000) */}
              <div className="mt-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">
                    {lang === 'bn' ? 'অথবা কাস্টম পরিমাণ লিখুন (১ - ১০,০০,০০০):' : 'Or Enter Custom Quantity (1 - 1,000,000):'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={1}
                      max={1000000}
                      step={1}
                      value={fbCustomInput}
                      onChange={(e) => handleFbInputChange(e.target.value)}
                      className="w-28 px-2.5 py-1.5 rounded-lg bg-[#080314] border border-blue-700/80 text-center font-mono font-black text-blue-300 text-sm focus:outline-none focus:border-blue-400 shadow-inner"
                    />
                    <span className="text-xs text-slate-400 font-medium">Followers</span>
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min={1}
                  max={1000000}
                  step={100}
                  value={fbCount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFbCount(val);
                    setFbCustomInput(val.toString());
                    setFbError(null);
                  }}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono px-0.5">
                  <span>1</span>
                  <span>10k</span>
                  <span>100k</span>
                  <span>500k</span>
                  <span>1,000,000 (1M)</span>
                </div>
              </div>

              {/* Profile / Page Link Input */}
              <div className="mt-5">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {lang === 'bn' ? 'ফেসবুক পেজ / প্রোফাইল লিংক:' : 'Facebook Profile / Page Link:'}
                </label>
                <input
                  type="text"
                  placeholder="https://facebook.com/yourprofile or page"
                  value={fbLink}
                  onChange={(e) => setFbLink(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080314] border border-blue-900/50 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {fbError && (
                <div className="mt-3 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/50 rounded-lg px-3 py-1.5">
                  {fbError}
                </div>
              )}

              {/* Features list */}
              <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{lang === 'bn' ? '১০০% নন-ড্রপ ফলোয়ার' : 'Non-Drop Followers'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{lang === 'bn' ? 'নো পাসওয়ার্ড রিকোয়ার্ড' : 'No Password Needed'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{lang === 'bn' ? 'অর্গানিক কোয়ালিটি লুক' : 'Organic Profile Quality'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{lang === 'bn' ? 'দ্রুত ডেলিভারি শুরু' : 'Fast Delivery Start'}</span>
                </div>
              </div>
            </div>

            {/* Price Box & Order Button */}
            <div className="mt-6 pt-5 border-t border-blue-900/40">
              <div className="flex items-center justify-between mb-3.5 bg-blue-950/30 p-3 rounded-2xl border border-blue-900/30">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                    {lang === 'bn' ? 'মোট মূল্য (Dynamic Price):' : 'Total Dynamic Price:'}
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                      ৳{fbTotalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-blue-300 font-semibold">BDT</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-300 font-medium block">
                    {fbCount.toLocaleString()} {lang === 'bn' ? 'ফলোয়ার' : 'Followers'}
                  </span>
                  <span className="text-[10px] text-blue-400 font-medium">
                    (৳{fbCount > 0 ? (fbTotalPrice / fbCount).toFixed(3) : '0'}/each)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFbOrder}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-950 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'ফেসবুক ফলোয়ার্স অর্ডার করুন' : 'Order Facebook Followers'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. INSTAGRAM FOLLOWERS CARD (Official Instagram Logo) */}
          {/* ========================================================= */}
          <div className="bg-[#120723] border-2 border-pink-900/50 hover:border-pink-600/70 rounded-3xl p-6 sm:p-7 shadow-xl shadow-pink-950/30 flex flex-col justify-between transition-all relative overflow-hidden group">
            {/* Ambient subtle glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Header: Official Logo + Label */}
              <div className="flex items-center justify-between pb-5 border-b border-pink-900/50 bg-gradient-to-r from-pink-950/40 via-purple-900/20 to-transparent p-4 rounded-2xl mb-5 border border-pink-800/30">
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-pink-600/20 to-purple-600/20 border-2 border-pink-500/40 p-2 sm:p-2.5 flex items-center justify-center shrink-0 shadow-lg shadow-pink-950/50 group-hover:scale-105 transition-all">
                    <InstagramLogo className="w-full h-full drop-shadow" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        Instagram Followers
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-pink-600/30 text-pink-300 border border-pink-500/40">
                        <CheckCircle2 className="w-3 h-3 text-pink-400" />
                        Official
                      </span>
                    </div>
                    <p className="text-xs text-pink-300/90 font-medium mt-0.5">
                      {lang === 'bn' ? 'ইনস্টাগ্রাম প্রোফাইল ফলোয়ার্স' : 'Instagram Real & Active Followers'}
                    </p>
                    <div className="text-[11px] text-slate-400 font-mono mt-1">
                      {lang === 'bn' ? 'রেঞ্জ: ১ থেকে ১০,০০,০০০ (১M) ফলোয়ার' : 'Range: 1 to 1,000,000 (1M) Followers'}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'bn' ? '১০০% নিরাপদ' : '100% Safe'}</span>
                  </span>
                  <div className="text-[11px] text-pink-300 font-medium mt-1.5 font-mono">
                    ৳{igRatePer1k} / 1k {lang === 'bn' ? 'ফলোয়ার' : 'followers'}
                  </div>
                </div>
              </div>

              {/* Presets Grid (100 to 1M) */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>{lang === 'bn' ? 'জনপ্রিয় পরিমাণ সিলেক্ট করুন:' : 'Select Quantity:'}</span>
                  <span className="text-[11px] text-pink-400 font-mono font-medium">১ - ১০,০০,০০০ (১M)</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {presets.map((p) => {
                    const isSelected = igCount === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleIgPreset(p)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                          isSelected
                            ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-900/50 scale-[1.03]'
                            : 'bg-[#090417] border border-pink-900/30 text-slate-300 hover:text-white hover:border-pink-600/50'
                        }`}
                      >
                        {formatPresetLabel(p)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Range Slider & Manual Input (1 to 1,000,000) */}
              <div className="mt-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">
                    {lang === 'bn' ? 'অথবা কাস্টম পরিমাণ লিখুন (১ - ১০,০০,০০০):' : 'Or Enter Custom Quantity (1 - 1,000,000):'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={1}
                      max={1000000}
                      step={1}
                      value={igCustomInput}
                      onChange={(e) => handleIgInputChange(e.target.value)}
                      className="w-28 px-2.5 py-1.5 rounded-lg bg-[#080314] border border-pink-700/80 text-center font-mono font-black text-pink-300 text-sm focus:outline-none focus:border-pink-400 shadow-inner"
                    />
                    <span className="text-xs text-slate-400 font-medium">Followers</span>
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min={1}
                  max={1000000}
                  step={100}
                  value={igCount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setIgCount(val);
                    setIgCustomInput(val.toString());
                    setIgError(null);
                  }}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono px-0.5">
                  <span>1</span>
                  <span>10k</span>
                  <span>100k</span>
                  <span>500k</span>
                  <span>1,000,000 (1M)</span>
                </div>
              </div>

              {/* Username / Profile Link Input */}
              <div className="mt-5">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {lang === 'bn' ? 'ইনস্টাগ্রাম ইউজারনেম / প্রোফাইল লিংক:' : 'Instagram Username / Profile Link:'}
                </label>
                <input
                  type="text"
                  placeholder="@yourusername or instagram.com/username"
                  value={igLink}
                  onChange={(e) => setIgLink(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080314] border border-pink-900/50 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              {igError && (
                <div className="mt-3 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/50 rounded-lg px-3 py-1.5">
                  {igError}
                </div>
              )}

              {/* Features list */}
              <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span>{lang === 'bn' ? 'হাই রিটেনশন ও রিয়েল লুক' : 'High Retention Look'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span>{lang === 'bn' ? 'শুধুমাত্র পাবলিক ইউজারনেম' : 'Public Handle Only'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span>{lang === 'bn' ? '৩০ দিনের রিফিল ব্যাকআপ' : '30-Day Refill Backup'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span>{lang === 'bn' ? 'অ্যালগরিদম সেফ বুস্ট' : 'Algorithm Safe Boost'}</span>
                </div>
              </div>
            </div>

            {/* Price Box & Order Button */}
            <div className="mt-6 pt-5 border-t border-pink-900/40">
              <div className="flex items-center justify-between mb-3.5 bg-pink-950/30 p-3 rounded-2xl border border-pink-900/30">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                    {lang === 'bn' ? 'মোট মূল্য (Dynamic Price):' : 'Total Dynamic Price:'}
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                      ৳{igTotalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-pink-300 font-semibold">BDT</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-300 font-medium block">
                    {igCount.toLocaleString()} {lang === 'bn' ? 'ফলোয়ার' : 'Followers'}
                  </span>
                  <span className="text-[10px] text-pink-400 font-medium">
                    (৳{igCount > 0 ? (igTotalPrice / igCount).toFixed(3) : '0'}/each)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleIgOrder}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-lg shadow-pink-950 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'ইনস্টাগ্রাম ফলোয়ার্স অর্ডার করুন' : 'Order Instagram Followers'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-8 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-[#110825]/60 border border-purple-900/30 flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs text-slate-300 font-medium">
              {lang === 'bn' ? '১-২ ঘণ্টার মধ্যে ডেলিভারি শুরু' : 'Starts within 1-2 Hours'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#110825]/60 border border-purple-900/30 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-slate-300 font-medium">
              {lang === 'bn' ? '১০০% নো-পাসওয়ার্ড নিরাপদ' : '100% Safe (No Password)'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#110825]/60 border border-purple-900/30 flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-xs text-slate-300 font-medium">
              {lang === 'bn' ? 'রিয়েল প্রোফাইল লুক' : 'High Quality Retention'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#110825]/60 border border-purple-900/30 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="text-xs text-slate-300 font-medium">
              {lang === 'bn' ? '২৪/৭ হোয়াটসঅ্যাপ সাপোর্ট' : '24/7 WhatsApp Support'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
