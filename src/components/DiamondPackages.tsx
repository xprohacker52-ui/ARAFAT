import React, { useState } from 'react';
import { ShoppingBag, Sparkles, HelpCircle, CheckCircle2, AlertCircle, ShieldCheck, Flame, Zap } from 'lucide-react';
import { DiamondPackage, Language } from '../types';
import { translations } from '../data/translations';

interface DiamondPackagesProps {
  packages: DiamondPackage[];
  lang: Language;
  onSelectPackage: (pkg: DiamondPackage, playerUid?: string) => void;
}

export const DiamondPackages: React.FC<DiamondPackagesProps> = ({
  packages,
  lang,
  onSelectPackage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playerUid, setPlayerUid] = useState<string>('');
  const [showUidGuide, setShowUidGuide] = useState<boolean>(false);
  const [uidTouched, setUidTouched] = useState<boolean>(false);
  const t = translations[lang];

  // Validate entered UID
  const isUidValid = /^\d{5,14}$/.test(playerUid.trim());

  const handleOrder = (pkg: DiamondPackage) => {
    setUidTouched(true);
    onSelectPackage(pkg, isUidValid ? playerUid.trim() : undefined);
  };

  const filteredPackages = packages.filter((pkg) => {
    if (!pkg.active) return false;
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'diamond') return pkg.category === 'diamond';
    if (selectedCategory === 'mega') {
      return (
        pkg.category === 'diamond' &&
        typeof pkg.diamonds === 'number' &&
        pkg.diamonds >= 2000
      );
    }
    if (selectedCategory === 'membership') {
      return pkg.category === 'membership' || pkg.category === 'special';
    }
    return true;
  });

  return (
    <section id="diamond-packages" className="py-12 md:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/50 text-cyan-300 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span>{lang === 'bn' ? 'অফিসিয়াল ও নিরাপদ ইউআইডি টপ-আপ' : 'Official Free Fire UID Top-Up'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {lang === 'bn' ? (
              <>
                ফ্রি ফায়ার ডায়মন্ড টপ-আপ <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">(UID Top-Up)</span>
              </>
            ) : (
              <>
                Free Fire Diamond Top-Up <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">(Player UID)</span>
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 mt-2">
            {lang === 'bn'
              ? 'আইডি পাসওয়ার্ড ছাড়া শুধুমাত্র Player UID দিয়ে তাৎক্ষণিক ডায়মন্ড নিন। ১০০ থেকে শুরু করে ১২,০০০ ডায়মন্ডের সর্বোচ্চ প্যাকেজ।'
              : 'Direct in-game delivery using only your Player UID. No login required. Packages ranging from 100 up to 12,000 Diamonds.'}
          </p>
        </div>

        {/* STEP 1: Dedicated Player UID Input Banner */}
        <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#140a2c] via-[#100726] to-[#140a2c] border border-purple-800/40 shadow-xl shadow-purple-950/40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center">
                  ১
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {lang === 'bn' ? 'প্রথমে আপনার Player UID দিন' : 'Enter Your Player UID First'}
                </h3>
              </div>
              <p className="text-xs text-purple-200/80">
                {lang === 'bn'
                  ? 'এখানে আপনার গেম ইউআইডি লিখে যেকোনো প্যাকেজে ক্লিক করলেই সরাসরি অর্ডার হয়ে যাবে।'
                  : 'Enter your 5-14 digit Free Fire UID below, then select any package.'}
              </p>
            </div>

            {/* Input & Guide trigger */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <div className="relative min-w-[260px] sm:min-w-[300px]">
                <input
                  type="text"
                  value={playerUid}
                  onChange={(e) => {
                    setPlayerUid(e.target.value.replace(/\D/g, ''));
                    setUidTouched(true);
                  }}
                  placeholder="e.g. 2847591024"
                  className={`w-full px-4 py-3 rounded-xl bg-[#080214] border font-mono text-sm sm:text-base text-white tracking-wider focus:outline-none transition-colors ${
                    isUidValid
                      ? 'border-emerald-500 ring-1 ring-emerald-500/50'
                      : uidTouched && playerUid.length > 0
                      ? 'border-amber-500'
                      : 'border-purple-800/60 focus:border-purple-400'
                  }`}
                />
                {isUidValid && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden sm:inline">{lang === 'bn' ? 'সঠিক UID' : 'Valid'}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowUidGuide(!showUidGuide)}
                className="px-3.5 py-3 rounded-xl bg-purple-950/70 hover:bg-purple-900/60 text-purple-300 text-xs font-semibold border border-purple-800/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'bn' ? 'UID কোথায় পাবো?' : 'UID Guide'}</span>
              </button>
            </div>
          </div>

          {/* UID Guide Dropdown info */}
          {showUidGuide && (
            <div className="mt-4 pt-4 border-t border-purple-900/40 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-purple-200">
              <div className="p-3 rounded-xl bg-[#090314] border border-purple-900/30 flex items-start gap-2.5">
                <span className="font-bold text-cyan-400">ধাপ ১:</span>
                <span>Free Fire গেম চালু করে স্ক্রিনের ওপরে বামদিকের প্রোফাইল ব্যানারে ক্লিক করুন।</span>
              </div>
              <div className="p-3 rounded-xl bg-[#090314] border border-purple-900/30 flex items-start gap-2.5">
                <span className="font-bold text-cyan-400">ধাপ ২:</span>
                <span>প্রোফাইল ইনফো ট্যাবে আপনার নামের নিচে ৮ থেকে ১০ সংখ্যার Player UID নম্বর দেখতে পাবেন এবং কপি করুন।</span>
              </div>
            </div>
          )}
        </div>

        {/* STEP 2: Category Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center">
              ২
            </span>
            <span className="text-sm sm:text-base font-bold text-white">
              {lang === 'bn' ? 'ডায়মন্ড প্যাকেজ নির্বাচন করুন' : 'Select Diamond Package'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#130a26] border border-purple-900/40 rounded-xl overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'bn' ? 'সকল প্যাকেজ (১০০ - ১২,০০০)' : 'All (100 - 12k)'}
            </button>
            <button
              onClick={() => setSelectedCategory('mega')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'mega'
                  ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'bn' ? 'মেগা বান্ডেল (২,০০০ - ১২,০০০)' : 'Mega Bundles (2k - 12k)'}
            </button>
            <button
              onClick={() => setSelectedCategory('diamond')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'diamond'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'bn' ? 'রেগুলার ডায়মন্ড' : 'Regular Diamonds'}
            </button>
            <button
              onClick={() => setSelectedCategory('membership')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'membership'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'bn' ? 'মেম্বারশিপ ও পাস' : 'Memberships & Passes'}
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredPackages.map((pkg) => {
            const isMembership = pkg.category === 'membership';
            const isSpecial = pkg.category === 'special';
            const isMega = typeof pkg.diamonds === 'number' && pkg.diamonds >= 2000;

            return (
              <div
                key={pkg.id}
                className={`group relative rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-2xl overflow-hidden ${
                  pkg.popular || isMega
                    ? 'bg-gradient-to-b from-[#180a33] to-[#0e061e] border-2 border-purple-500/60 shadow-purple-950/60'
                    : 'bg-[#110922] border border-purple-900/40 hover:border-purple-500/50 shadow-purple-950/30'
                }`}
              >
                {/* Badge if present */}
                {pkg.badge && (
                  <div className={`absolute top-3 right-3 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isMega
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                      : 'bg-purple-900/80 text-purple-200 border border-purple-700/50'
                  }`}>
                    {pkg.badge}
                  </div>
                )}

                {/* Top Diamond Graphics */}
                <div>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 rounded-2xl bg-[#090414] border border-purple-900/30 p-2 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
                    <img
                      src="/src/assets/images/diamonds_bundle_pile_1793189550061.jpg"
                      alt={`${pkg.nameBn} - Free Fire Diamond Top-Up Bangladesh`}
                      width={80}
                      height={80}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <Sparkles className="w-8 h-8 text-cyan-400 -z-10 absolute" />
                  </div>

                  {/* Title & Info */}
                  <div className="text-center">
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-purple-300 transition-colors">
                      {lang === 'bn' ? pkg.nameBn : pkg.name}
                    </h3>
                    <div className="text-[11px] text-purple-300/80 mt-0.5">
                      {isMembership
                        ? (lang === 'bn' ? 'সাপ্তাহিক/মাসিক ভিআইপি সুবিধা' : 'VIP Subscription')
                        : isSpecial
                        ? (lang === 'bn' ? 'লেভেল আপ স্পেশাল পাস' : 'Special In-Game Pass')
                        : (lang === 'bn' ? 'প্লেয়ার ইউআইডি টপ-আপ' : 'Direct UID Top-Up')}
                    </div>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="mt-5 pt-3 border-t border-purple-950/80">
                  <div className="flex items-baseline justify-center gap-1 mb-3">
                    <span className="text-xs font-bold text-purple-400">৳</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                      {pkg.priceBdt.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">BDT</span>
                  </div>

                  <button
                    onClick={() => handleOrder(pkg)}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm text-white active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
                      isMega
                        ? 'bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 hover:opacity-95 shadow-rose-950'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-950'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'টপ-আপ করুন' : 'Top-Up Now'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* UID Safety Guarantee Footer */}
        <div className="mt-10 p-4 rounded-xl bg-[#0c051a] border border-purple-900/30 flex flex-wrap items-center justify-between gap-4 text-xs text-purple-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              {lang === 'bn'
                ? '১০০% নিরাপদ অফিসিয়াল সার্ভার। কোনো পাসওয়ার্ড বা জিমেইল লগইনের প্রয়োজন নেই।'
                : '100% safe direct official server top-up. No login password required.'}
            </span>
          </div>
          <div className="text-cyan-400 font-semibold">
            {lang === 'bn' ? 'গড় ডেলিভারি সময়: ৫–১০ মিনিট' : 'Average Delivery: 5–10 Minutes'}
          </div>
        </div>
      </div>
    </section>
  );
};
