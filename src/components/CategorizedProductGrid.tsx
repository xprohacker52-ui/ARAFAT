import React, { useState } from 'react';
import {
  Sparkles,
  Gift,
  Gamepad2,
  Tv,
  Users,
  Flame,
  Check,
  ChevronRight,
  TrendingUp,
  Tag,
  Zap,
  Globe,
  ThumbsUp,
  CreditCard,
  Crown,
  Share2,
} from 'lucide-react';
import {
  DiamondPackage,
  Language,
  SiteConfig,
  StreamingServiceItem,
} from '../types';
import { FacebookLogo, InstagramLogo, NetflixLogo, CrunchyrollLogo } from './BrandLogos';

interface CategorizedProductGridProps {
  packages: DiamondPackage[];
  streamingServices: StreamingServiceItem[];
  lang: Language;
  config: SiteConfig;
  onSelectDiamondPackage: (pkg: DiamondPackage) => void;
  onSelectSubscription: (service: StreamingServiceItem, durationId?: string) => void;
  onSelectSocialService: (
    service: 'fb_followers' | 'fb_likes' | 'fb_views' | 'ig_followers' | 'ig_likes' | 'ig_views'
  ) => void;
}

export const CategorizedProductGrid: React.FC<CategorizedProductGridProps> = ({
  packages,
  streamingServices,
  lang,
  config,
  onSelectDiamondPackage,
  onSelectSubscription,
  onSelectSocialService,
}) => {
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'mystery' | 'uid' | 'membership' | 'subscriptions' | 'social' | 'games'
  >('mystery');

  // Mystery Box Details Modal state
  const [mysteryModalOpen, setMysteryModalOpen] = useState(false);
  const [modalBoxTitle, setModalBoxTitle] = useState('বক্সের তথ্য');
  const [modalBoxDesc, setModalBoxDesc] = useState('এখানে বিবরণ থাকবে...');
  const [selectedMysteryPkg, setSelectedMysteryPkg] = useState<DiamondPackage | null>(null);

  const openMysteryBox = (title: string, desc: string, pkg: DiamondPackage) => {
    setModalBoxTitle(title);
    setModalBoxDesc(desc);
    setSelectedMysteryPkg(pkg);
    setMysteryModalOpen(true);
  };

  const closeMysteryBox = () => {
    setMysteryModalOpen(false);
  };

  const proceedCheckout = () => {
    if (selectedMysteryPkg) {
      setMysteryModalOpen(false);
      onSelectDiamondPackage(selectedMysteryPkg);
    }
  };

  // Filter package subgroups
  const mysteryPackages = packages.filter((p) => p.category === 'mystery_box');
  const bonusPackages = packages.filter((p) => p.category === 'bonus_offer');
  const diamondPackages = packages.filter((p) => p.category === 'diamond');
  const membershipPackages = packages.filter((p) => p.category === 'membership' || p.category === 'special');
  const ffLikesPackages = packages.filter((p) => p.category === 'ff_likes');
  const unipinPackages = packages.filter((p) => p.category === 'unipin');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12" id="topup-products">
      {/* Category Navigation Buttons Bar (TopupPapa Style) */}
      <div className="sticky top-16 z-30 bg-[#090514]/95 backdrop-blur-md py-4 border-y border-purple-900/40">
        <div className="category-tabs flex items-center justify-center gap-2 sm:gap-3 flex-wrap max-w-5xl mx-auto px-2">
          {[
            { id: 'mystery', label: lang === 'bn' ? '🎁 মিষ্টি বক্স (Mystery Box)' : '🎁 Mystery Box' },
            { id: 'uid', label: lang === 'bn' ? '💎 ইউআইডি ডায়মন্ড টপ-আপ' : '💎 UID Diamond Topup' },
            { id: 'membership', label: lang === 'bn' ? '👑 উইকলি ও মান্থলি মেম্বারশিপ' : '👑 Weekly & Monthly' },
            { id: 'subscriptions', label: lang === 'bn' ? '🎬 ওটিটি সাবস্ক্রিপশন' : '🎬 OTT Subscriptions' },
            { id: 'social', label: lang === 'bn' ? '🚀 সোশ্যাল বুস্ট' : '🚀 Social Boost' },
            { id: 'all', label: lang === 'bn' ? '⚡ সকল সার্ভিস' : '⚡ All Services' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`tab-btn px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-black whitespace-nowrap transition-all duration-300 cursor-pointer ${
                activeCategory === cat.id
                  ? 'active bg-[#2563eb] text-white border-2 border-[#2563eb] shadow-lg shadow-blue-600/40 scale-105 ring-2 ring-blue-400/40'
                  : 'bg-[#150a2e] text-slate-300 border-2 border-purple-900/50 hover:border-[#2563eb] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CATEGORY 1: MYSTERY BOX & BONUS OFFER */}
      {/* ========================================================================= */}
      {(activeCategory === 'all' || activeCategory === 'mystery') && (
        <section className="mystery-box-section product-section-animate space-y-6" id="category-mystery">
          <div id="mystery" className="scroll-mt-24"></div>
          <div className="border-b border-purple-900/40 pb-4">
            <h2 className="section-title text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 tracking-wide flex items-center gap-2">
              <span>✨ Mystery Box Offers ✨</span>
              <span className="box-badge text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Lucky Chests
              </span>
            </h2>
            <p className="section-subtitle text-xs sm:text-sm text-purple-200/80 mt-1 font-medium">
              আপনার ভাগ্য পরীক্ষা করুন! যেকোনো মিষ্টি বক্স কিনুন এবং দারুণ সব রিওয়ার্ড জিতে নিন।
            </p>
          </div>

          {/* Mystery Grid (8 Mystery Boxes) */}
          <div className="mystery-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {mysteryPackages.map((pkg) => {
              const icon =
                pkg.priceBdt === 999
                  ? '🏆'
                  : pkg.priceBdt === 734
                  ? '👑'
                  : pkg.priceBdt === 500
                  ? '💎'
                  : pkg.priceBdt === 350
                  ? '⭐'
                  : '🎁';

              const badge =
                pkg.badge ||
                (pkg.priceBdt === 99 ? 'Hot 🔥' : pkg.priceBdt === 999 ? 'Mega 🚀' : undefined);

              const boxDesc =
                pkg.bonusBn ||
                (pkg.priceBdt === 99
                  ? 'এই বক্সে থাকতে পারে: ১০০ থেকে ৩০০ ডায়মন্ড অথবা র্যান্ডম স্পেশাল রিওয়ার্ড!'
                  : pkg.priceBdt === 100
                  ? 'এই বক্সে থাকতে পারে: উইকলি লাইট মেম্বারশিপ অথবা ৩৫০ ডায়মন্ড!'
                  : pkg.priceBdt === 120
                  ? 'এই বক্সে থাকতে পারে: ১টি অফিসিয়াল উইকলি মেম্বারশিপ বা ৫০০ ডায়মন্ড!'
                  : pkg.priceBdt === 200
                  ? 'এই বক্সে থাকতে পারে: লেভেল আপ পাস অথবা ১০০০ ডায়মন্ড!'
                  : pkg.priceBdt === 350
                  ? 'এই বক্সে থাকতে পারে: ১টি মান্থলি মেম্বারশিপ অথবা ২০০০ ডায়মন্ড!'
                  : pkg.priceBdt === 500
                  ? 'এই বক্সে থাকতে পারে: উইকলি + মান্থলি কম্বো অথবা ৩০০০ ডায়মন্ড!'
                  : pkg.priceBdt === 734
                  ? 'এই বক্সে থাকতে পারে: ৫০০০ ডায়মন্ড অথবা এক্সক্লুসিভ গেম বান্ডেল!'
                  : pkg.priceBdt === 999
                  ? 'মেগা মিস্ট্রি বক্স! এতে থাকতে পারে বিশাল ১২,০০০ ডায়মন্ড বা একাধিক মান্থলি মেম্বারশিপ!'
                  : String(pkg.diamonds));

              return (
                <div
                  key={pkg.id}
                  className="mystery-card relative bg-gradient-to-b from-[#1c0f3c] via-[#120829] to-[#0a0418] border-2 border-amber-500/30 hover:border-amber-400 rounded-3xl p-5 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer group flex flex-col justify-between overflow-hidden"
                  onClick={() => openMysteryBox(pkg.nameBn || pkg.name, boxDesc, pkg)}
                >
                  {/* Top Badge */}
                  {badge && (
                    <div className="box-badge absolute top-3 right-3 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-md uppercase tracking-wider">
                      {badge}
                    </div>
                  )}

                  <div>
                    {/* Box Icon */}
                    <div className="box-icon w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-400/10 border border-amber-500/30 flex items-center justify-center text-3xl mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">
                      {icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                      {pkg.nameBn || pkg.name}
                    </h3>

                    {/* Rich Multi-item previews (3-4 items) */}
                    <div className="mt-2.5 space-y-1.5">
                      {pkg.rewardsList && pkg.rewardsList.length > 0 ? (
                        pkg.rewardsList.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 text-[11px] text-slate-200 bg-[#120826]/80 px-2 py-1 rounded-lg border border-purple-900/40"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                            <span className="truncate">{item}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-slate-300/80 line-clamp-2 mt-1 leading-snug">
                          {boxDesc}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price & Action Button */}
                  <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between mt-4">
                    <p className="box-price text-xl font-black font-mono text-emerald-400 tracking-tight">
                      ৳ {pkg.priceBdt}
                    </p>
                    <button
                      type="button"
                      className="buy-box-btn px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs shadow-md shadow-amber-950/50 hover:shadow-amber-400/30 transition-all cursor-pointer transform active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        openMysteryBox(pkg.nameBn || pkg.name, boxDesc, pkg);
                      }}
                    >
                      বক্স খুলুন
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bonus Offers (VIP Combo & Double Diamond) */}
          {bonusPackages.length > 0 && (
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-pink-400" />
                <h4 className="text-sm font-bold text-pink-300 uppercase tracking-wider">
                  {lang === 'bn' ? '⚡ মেগা বোনাস অফারসমূহ' : '⚡ Mega Bonus Offers'}
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {bonusPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => onSelectDiamondPackage(pkg)}
                    className="relative bg-gradient-to-b from-[#210c36] to-[#0e051d] border border-pink-500/30 hover:border-pink-400 rounded-3xl p-5 shadow-xl hover:shadow-pink-500/10 transition-all transform hover:-translate-y-1 group cursor-pointer overflow-hidden flex flex-col justify-between"
                  >
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-pink-500 text-white shadow-sm">
                        {pkg.badge || 'BONUS'}
                      </span>
                    </div>
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6 text-pink-400" />
                      </div>
                      <h4 className="text-base font-black text-white group-hover:text-pink-300 transition-colors">
                        {lang === 'bn' ? pkg.nameBn : pkg.name}
                      </h4>
                      <div className="text-xs text-purple-200/80 font-mono font-bold mt-1">
                        {pkg.diamonds}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between mt-4">
                      <div className="text-lg font-black font-mono text-emerald-400">
                        ৳{pkg.priceBdt} <span className="text-xs font-sans text-slate-400">BDT</span>
                      </div>
                      <button className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 text-white font-black text-xs transition-colors shadow-md">
                        {lang === 'bn' ? 'অফার নিন' : 'Claim Offer'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Modal Popup for Box Details with Rich 3-4 Multi-Item Rewards List */}
      {mysteryModalOpen && (
        <div
          id="mysteryModal"
          className="mystery-modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={closeMysteryBox}
        >
          <div
            className="modal-content relative w-full max-w-lg bg-[#110729] border-2 border-amber-500/70 rounded-3xl p-5 sm:p-6 text-slate-100 shadow-2xl shadow-amber-500/25 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <span
              className="close-btn absolute top-4 right-4 text-2xl text-slate-400 hover:text-white font-bold cursor-pointer transition-colors w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10"
              onClick={closeMysteryBox}
            >
              &times;
            </span>

            {/* Glowing Box Header */}
            <div className="flex items-center gap-3.5 mb-4 pr-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/25 to-yellow-400/10 border-2 border-amber-400/50 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20 shrink-0">
                {selectedMysteryPkg?.priceBdt === 999
                  ? '🏆'
                  : selectedMysteryPkg?.priceBdt === 734
                  ? '👑'
                  : selectedMysteryPkg?.priceBdt === 500
                  ? '💎'
                  : selectedMysteryPkg?.priceBdt === 350
                  ? '⭐'
                  : '🎁'}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h3 id="modalBoxTitle" className="text-lg sm:text-xl font-black text-amber-300">
                    {modalBoxTitle}
                  </h3>
                  {selectedMysteryPkg?.badge && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-black">
                      {selectedMysteryPkg.badge}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-purple-200">মূল্য:</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    ৳ {selectedMysteryPkg?.priceBdt} BDT
                  </span>
                </div>
              </div>
            </div>

            {/* Reward Offerings List */}
            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  এই বক্সে যেসব রিওয়ার্ড জেতার সুযোগ রয়েছে:
                </span>
                <span className="text-[10px] text-slate-400 font-mono">3-4 Lucky Items</span>
              </div>

              {/* Multi-Item Reward Cards */}
              <div className="space-y-2">
                {selectedMysteryPkg?.rewardsList && selectedMysteryPkg.rewardsList.length > 0 ? (
                  selectedMysteryPkg.rewardsList.map((reward, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-2xl bg-[#1b0d3d]/90 hover:bg-[#251252] border border-amber-500/30 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-110 transition-transform">
                          #{i + 1}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-amber-200 transition-colors">
                          {reward}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-purple-900/60 text-purple-200 border border-purple-700/40 shrink-0 ml-2">
                        {i === 0 ? 'High Chance' : i === 1 ? 'Special' : 'Bonus'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3.5 rounded-2xl bg-[#1b0d3d] border border-amber-500/30">
                    <p id="modalBoxDesc" className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {modalBoxDesc}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-600/30 text-amber-200/90 text-[11px] text-left flex items-start gap-2">
                <span className="text-base shrink-0">⚡</span>
                <span>
                  অর্ডার সম্পন্ন হওয়ার পর যেকোনো ১টি বা একাধিক রিওয়ার্ড সরাসরি আপনার ফ্রি ফায়ার Player UID-তে ৫-১৫ মিনিটের মধ্যে ডেলিভারি দেওয়া হবে।
                </span>
              </div>
            </div>

            {/* Actions: Cancel & Confirm Buy Button */}
            <div className="flex gap-3">
              <button
                type="button"
                className="w-1/3 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                onClick={closeMysteryBox}
              >
                বাতিল
              </button>
              <button
                type="button"
                className="confirm-buy-btn flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm shadow-xl shadow-amber-950/70 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                onClick={proceedCheckout}
              >
                <span>এই বক্সটি কিনুন (Buy Now / Checkout)</span>
                <span>›</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY 2: GAMES TOPUP (UID Top-up, Memberships, Likes, Indonesia UniPin) */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* CATEGORY 2: UID DIAMOND TOPUP (Pure Diamonds, Likes & UniPin) */}
      {/* ========================================================================= */}
      {(activeCategory === 'all' || activeCategory === 'uid' || activeCategory === 'games') && (
        <section id="category-games" className="product-section-animate space-y-6">
          <div id="uid" className="scroll-mt-24"></div>
          <div id="topup" className="scroll-mt-24"></div>
          <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 text-white flex items-center justify-center font-black shadow-lg">
                <Sparkles className="w-5 h-5 text-cyan-200" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
                  <span>{lang === 'bn' ? '💎 ইউআইডি ডায়মন্ড টপ-আপ (UID Topup)' : '💎 UID Diamond Topup'}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    UID Instant Topup
                  </span>
                </h3>
                <p className="text-xs text-purple-200/70">
                  {lang === 'bn'
                    ? 'সরাসরি Player UID দিয়ে ২৫ থেকে ১২,০০০ ডায়মন্ড পর্যন্ত ইনস্ট্যান্ট টপ-আপ (৫-১৫ মিনিটে সরাসরি ডেলিভারি)'
                    : 'Instant Topup from 25 up to 12,000 Diamonds directly to Player UID.'}
                </p>
              </div>
            </div>
          </div>

          {/* UID Diamonds Grid (25 up to 12,000 Diamonds) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {diamondPackages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => onSelectDiamondPackage(pkg)}
                className={`relative bg-[#110725] border rounded-2xl p-3.5 sm:p-4 text-center transition-all transform hover:-translate-y-1 group cursor-pointer flex flex-col justify-between ${
                  pkg.popular
                    ? 'border-cyan-400/80 shadow-lg shadow-cyan-950/40 bg-gradient-to-b from-[#131135] to-[#0c0822]'
                    : 'border-purple-900/50 hover:border-cyan-400/50'
                }`}
              >
                {pkg.badge && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500 text-black shadow-sm whitespace-nowrap">
                    {pkg.badge}
                  </span>
                )}

                <div className="pt-2">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h5 className="font-extrabold text-sm sm:text-base text-white">
                    {pkg.diamonds} 💎
                  </h5>
                  <div className="text-[10px] text-purple-300/80 mt-0.5">
                    {lang === 'bn' ? pkg.nameBn : pkg.name}
                  </div>
                </div>

                <div className="pt-3 border-t border-purple-900/30 mt-3">
                  <div className="text-sm sm:text-base font-black font-mono text-emerald-400">
                    ৳{pkg.priceBdt}
                  </div>
                  <button className="w-full mt-2 py-1 rounded-lg bg-cyan-600/30 hover:bg-cyan-500 text-cyan-200 hover:text-black font-bold text-[10px] transition-colors">
                    {lang === 'bn' ? 'টপ-আপ' : 'Top-Up'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sub-section: Free Fire Likes & Indonesia Server (UniPin) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-3">
            {/* Free Fire Likes Card Showcase */}
            <div className="bg-[#0e0722] border border-amber-500/30 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <ThumbsUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-white">
                      {lang === 'bn' ? 'ফ্রি ফায়ার প্লেয়ার প্রোফাইল লাইক' : 'Free Fire Profile Likes'}
                    </h4>
                    <p className="text-xs text-purple-200/70">
                      {lang === 'bn' ? 'গেমে নিজের প্রোফাইল রিচ ও লাইক বুস্ট করুন' : 'Boost your game profile likes instantly'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Instant Likes
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ffLikesPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => onSelectDiamondPackage(pkg)}
                    className="p-3 rounded-2xl bg-[#170c35] border border-purple-900/40 hover:border-amber-400 text-center cursor-pointer transition-all hover:scale-105"
                  >
                    <div className="text-xs font-bold text-white">{pkg.diamonds}</div>
                    <div className="text-sm font-black text-emerald-400 font-mono mt-1">৳{pkg.priceBdt}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Indonesia Server UniPin Voucher */}
            <div className="bg-[#0e0722] border border-blue-500/30 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-white">
                      {lang === 'bn' ? 'ইন্দোনেশিয়া সার্ভার (UniPin ভাউচার)' : 'Indonesia Server UniPin'}
                    </h4>
                    <p className="text-xs text-purple-200/70">
                      {lang === 'bn' ? 'ইন্দোনেশিয়া সার্ভারে খেলার জন্য অফিসিয়াল ক্রেডিট' : 'Official UniPin credits for Indo server'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Indo Server
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {unipinPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => onSelectDiamondPackage(pkg)}
                    className="p-3 rounded-2xl bg-[#170c35] border border-purple-900/40 hover:border-blue-400 text-center cursor-pointer transition-all hover:scale-105"
                  >
                    <div className="text-xs font-bold text-white">{pkg.diamonds}</div>
                    <div className="text-sm font-black text-emerald-400 font-mono mt-1">৳{pkg.priceBdt}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY 3: WEEKLY & MONTHLY MEMBERSHIP (SUBSCRIPTIONS) */}
      {/* ========================================================================= */}
      {(activeCategory === 'all' || activeCategory === 'membership') && (
        <section id="category-membership" className="product-section-animate space-y-6">
          <div id="membership" className="scroll-mt-24"></div>
          <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center font-black shadow-lg">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
                  <span>{lang === 'bn' ? '👑 উইকলি ও মান্থলি মেম্বারশিপ (Subscriptions)' : '👑 Weekly & Monthly Memberships'}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    VIP Passes
                  </span>
                </h3>
                <p className="text-xs text-purple-200/70">
                  {lang === 'bn'
                    ? 'উইকলি লাইট, অফিসিয়াল উইকলি, মান্থলি ও লেভেল আপ পাস (স্বল্পমূল্যে ইন-গেম সাবস্ক্রিপশন)'
                    : 'Weekly Lite, Official Weekly, Monthly Membership, Level Up Pass & VIP Combos.'}
                </p>
              </div>
            </div>
          </div>

          {/* Memberships & Combo Passes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {membershipPackages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => onSelectDiamondPackage(pkg)}
                className="bg-gradient-to-b from-[#180a3a] to-[#0f0724] border border-indigo-500/40 hover:border-indigo-400 rounded-3xl p-5 shadow-lg flex flex-col justify-between group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-indigo-500/20 relative"
              >
                {pkg.badge && (
                  <span className="absolute top-3 right-3 text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-indigo-500 text-white shadow-sm">
                    {pkg.badge}
                  </span>
                )}
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors">
                      {lang === 'bn' ? pkg.nameBn : pkg.name}
                    </h4>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">{pkg.diamonds}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-purple-900/40 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-black font-mono text-emerald-400">
                      ৳{pkg.priceBdt}
                    </div>
                  </div>
                  <button className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs transition-colors shadow-md">
                    {lang === 'bn' ? 'কিনুন' : 'Buy'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bonus Combos in Membership */}
          {bonusPackages.length > 0 && (
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bonusPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => onSelectDiamondPackage(pkg)}
                  className="bg-gradient-to-r from-[#210c36] to-[#0e051d] border border-pink-500/40 hover:border-pink-400 rounded-3xl p-5 shadow-lg flex items-center justify-between group cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-pink-300 tracking-wider">
                        {pkg.badge || 'COMBO'}
                      </span>
                      <h4 className="text-base font-black text-white group-hover:text-pink-300 transition-colors">
                        {lang === 'bn' ? pkg.nameBn : pkg.name}
                      </h4>
                      <p className="text-xs text-slate-300 font-mono">{pkg.diamonds}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black font-mono text-emerald-400">
                      ৳{pkg.priceBdt}
                    </div>
                    <button className="mt-1 px-3 py-1 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition-colors shadow-md">
                      {lang === 'bn' ? 'অফার নিন' : 'Claim'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY 3: ENTERTAINMENT & OTT SUBSCRIPTIONS */}
      {/* ========================================================================= */}
      {(activeCategory === 'all' || activeCategory === 'subscriptions') && (
        <section id="category-subscriptions" className="product-section-animate space-y-6">
          <div id="subscription" className="scroll-mt-24"></div>
          <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 text-white flex items-center justify-center font-black shadow-lg">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
                  <span>{lang === 'bn' ? 'বিনোদনের সাবস্ক্রিপশন (Entertainment OTT)' : 'Entertainment Subscriptions'}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40">
                    Official OTT
                  </span>
                </h3>
                <p className="text-xs text-purple-200/70">
                  {lang === 'bn'
                    ? 'Netflix, Crunchyroll, Spotify, YouTube Premium এর ১ মাস, ২ মাস, ৬ মাস ও ১ বছর সাবস্ক্রিপশন'
                    : '1 Month, 2 Months, 6 Months & 1 Year plans with full warranty.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {streamingServices.map((service) => (
              <div
                key={service.id}
                className="bg-[#0f0720] border border-purple-900/40 hover:border-pink-500/60 rounded-3xl p-5 shadow-xl transition-all space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-md shrink-0">
                        {service.serviceKey === 'netflix' ? (
                          <NetflixLogo className="w-full h-full" />
                        ) : service.serviceKey === 'crunchyroll' ? (
                          <CrunchyrollLogo className="w-full h-full" />
                        ) : (
                          <span className="text-xs font-black text-slate-900">{service.name.slice(0, 3)}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white">
                          {lang === 'bn' ? service.nameBn : service.name}
                        </h4>
                        <span className="text-[10px] text-pink-300 font-semibold">{service.badge}</span>
                      </div>
                    </div>
                  </div>

                  {/* Duration Options Selector */}
                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {lang === 'bn' ? 'মেয়াদ সিলেক্ট করুন:' : 'Select Duration:'}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {service.durations.map((dur) => (
                        <button
                          key={dur.id}
                          onClick={() => onSelectSubscription(service, dur.id)}
                          className="p-2.5 rounded-xl bg-[#170a30] hover:bg-pink-950/70 border border-purple-850 hover:border-pink-500 text-left transition-colors cursor-pointer group"
                        >
                          <div className="text-[11px] font-bold text-white group-hover:text-pink-300 truncate">
                            {lang === 'bn' ? dur.durationLabelBn : dur.durationLabel}
                          </div>
                          <div className="text-xs font-black text-emerald-400 font-mono mt-0.5">
                            ৳{dur.priceBdt} BDT
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-purple-900/30 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">১০০% রিপ্লেসমেন্ট গ্যারান্টি</span>
                  <button
                    onClick={() => onSelectSubscription(service)}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs transition-colors"
                  >
                    {lang === 'bn' ? 'অর্ডার করুন' : 'Order Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY 4: SOCIAL MEDIA BOOST SERVICES (FB/IG Followers, Likes, Views) */}
      {/* ========================================================================= */}
      {(activeCategory === 'all' || activeCategory === 'social') && (
        <section id="category-social" className="product-section-animate space-y-6">
          <div id="social" className="scroll-mt-24"></div>
          <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
                  <span>{lang === 'bn' ? 'সোশ্যাল মিডিয়া বুস্ট সার্ভিসেস' : 'Social Media Boost Services'}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    1 to 1M Calculator
                  </span>
                </h3>
                <p className="text-xs text-purple-200/70">
                  {lang === 'bn'
                    ? 'ফেসবুক ও ইনস্টাগ্রাম ফলোয়ার্স, লাইক ও ভিডিও ভিউজ - লাইভ রেট ক্যালকুলেটর সহ ১ থেকে ১০ লাখ পর্যন্ত'
                    : 'Facebook & Instagram Followers, Likes & Views with real-time dynamic calculator.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* FB Followers */}
            <div className="bg-[#0f0720] border border-blue-600/40 rounded-3xl p-5 sm:p-6 space-y-4 hover:border-blue-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-white p-2 flex items-center justify-center shadow-md">
                    <FacebookLogo className="w-full h-full" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">Facebook Followers</h4>
                    <span className="text-xs text-blue-300 font-bold">৳{config.followerRatePer1k || 120} / 1,000</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300">
                  {lang === 'bn'
                    ? 'যেকোনো ফেসবুক আইডি ও পেইজে ১ থেকে ১০ লাখ ফলোয়ার্স নিন।'
                    : '1 to 1,000,000 real followers for Facebook profiles and pages.'}
                </p>
              </div>
              <button
                onClick={() => onSelectSocialService('fb_followers')}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'ফলোয়ার্স ক্যালকুলেটর' : 'Followers Calculator'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* FB Likes */}
            <div className="bg-[#0f0720] border border-blue-600/40 rounded-3xl p-5 sm:p-6 space-y-4 hover:border-blue-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-white p-2 flex items-center justify-center shadow-md">
                    <FacebookLogo className="w-full h-full" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">Facebook Likes & Reacts</h4>
                    <span className="text-xs text-blue-300 font-bold">৳{config.fbLikesRatePer1k || 80} / 1,000</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300">
                  {lang === 'bn'
                    ? 'যেকোনো পোস্ট, ফটো ও পেইজে ১ থেকে ১০ লাখ লাইক ও রিয়্যাক্ট বুস্ট।'
                    : 'Boost post, photo and page likes from 1 to 1,000,000.'}
                </p>
              </div>
              <button
                onClick={() => onSelectSocialService('fb_likes')}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'লাইক ক্যালকুলেটর' : 'Likes Calculator'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* IG Followers */}
            <div className="bg-[#0f0720] border border-pink-600/40 rounded-3xl p-5 sm:p-6 space-y-4 hover:border-pink-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-white p-2 flex items-center justify-center shadow-md">
                    <InstagramLogo className="w-full h-full" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">Instagram Followers</h4>
                    <span className="text-xs text-pink-300 font-bold">৳{config.instagramFollowerRatePer1k || 150} / 1,000</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300">
                  {lang === 'bn'
                    ? 'ইনস্টাগ্রাম পার্সোনাল ও বিজনেস প্রোফাইলে ১ থেকে ১০ লাখ ফলোয়ার্স।'
                    : '1 to 1,000,000 followers for Instagram accounts.'}
                </p>
              </div>
              <button
                onClick={() => onSelectSocialService('ig_followers')}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'ফলোয়ার্স ক্যালকুলেটর' : 'Followers Calculator'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* IG Likes */}
            <div className="bg-[#0f0720] border border-pink-600/40 rounded-3xl p-5 sm:p-6 space-y-4 hover:border-pink-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-white p-2 flex items-center justify-center shadow-md">
                    <InstagramLogo className="w-full h-full" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">Instagram Likes & Reels</h4>
                    <span className="text-xs text-pink-300 font-bold">৳{config.igLikesRatePer1k || 90} / 1,000</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300">
                  {lang === 'bn'
                    ? 'ইনস্টাগ্রাম রিলস, ফটো ও পোস্ট লাইক ইনস্ট্যান্ট বাড়িয়ে নিন।'
                    : 'Instant likes for Instagram reels and photos.'}
                </p>
              </div>
              <button
                onClick={() => onSelectSocialService('ig_likes')}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'লাইক ক্যালকুলেটর' : 'Likes Calculator'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* FB & IG Views */}
            <div className="bg-[#0f0720] border border-indigo-600/40 rounded-3xl p-5 sm:p-6 space-y-4 hover:border-indigo-400 transition-all flex flex-col justify-between sm:col-span-2 lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-black text-white">
                    {lang === 'bn' ? 'ভিডিও ও রিলস ভিউজ বুস্টিং (FB & IG)' : 'Video & Reels Views Boosting'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    {lang === 'bn'
                      ? 'প্রতি ১,০০০ ভিউজ মাত্র ৫০-৬০ টাকায়! ইনস্ট্যান্ট ওয়াচ-টাইম ও ভিউ গ্রোথ।'
                      : 'High retention video views starting from ৳50 per 1,000.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectSocialService('fb_views')}
                    className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs transition-colors"
                  >
                    FB Views
                  </button>
                  <button
                    onClick={() => onSelectSocialService('ig_views')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs transition-colors"
                  >
                    IG Views
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
