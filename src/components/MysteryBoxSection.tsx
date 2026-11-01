import React, { useState } from 'react';
import { DiamondPackage, Language } from '../types';

interface MysteryBoxSectionProps {
  packages: DiamondPackage[];
  lang: Language;
  onSelectMysteryPackage: (pkg: DiamondPackage) => void;
}

interface MysteryBoxItem {
  id: string;
  packageId: string;
  title: string;
  desc: string;
  rewardsList: string[];
  priceBdt: number;
  icon: string;
  badge?: string;
}

export const MysteryBoxSection: React.FC<MysteryBoxSectionProps> = ({
  packages,
  lang,
  onSelectMysteryPackage,
}) => {
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('বক্সের তথ্য');
  const [modalDesc, setModalDesc] = useState('এখানে বিবরণ থাকবে...');
  const [selectedBox, setSelectedBox] = useState<MysteryBoxItem | null>(null);

  // Definition of the 8 Mystery Boxes with rich multi-item offerings (3-4 items)
  const MYSTERY_BOXES: MysteryBoxItem[] = [
    {
      id: 'box-99',
      packageId: 'pack-mystery-99',
      title: '৯৯ টাকা মিষ্টি বক্স',
      desc: 'থাকতে পারে: ১০০-২০০ ডায়মন্ড, র্যান্ডম স্পেশাল ইমোট, বা ছোট ক্যাশব্যাক অফার',
      rewardsList: [
        '১০০ থেকে ২০০ ডায়মন্ড (Direct Diamonds)',
        'র্যান্ডম স্পেশাল ইমোট (Exclusive Emote)',
        'ছোট ক্যাশব্যাক অফার (AG Coins Cashback)',
      ],
      priceBdt: 99,
      icon: '🎁',
      badge: 'Hot 🔥',
    },
    {
      id: 'box-100',
      packageId: 'pack-mystery-100',
      title: '১০০ টাকা মিষ্টি বক্স',
      desc: 'থাকতে পারে: উইকলি লাইট মেম্বারশিপ, ২৫০ ডায়মন্ড, বা ফ্রি ফায়ার এক্সক্লুসিভ ব্যানার',
      rewardsList: [
        'উইকলি লাইট মেম্বারশিপ (Weekly Lite Pass)',
        '২৫০ ডায়মন্ড ইনস্ট্যান্ট টপ-আপ',
        'ফ্রি ফায়ার এক্সক্লুসিভ ব্যানার ও অবতার',
      ],
      priceBdt: 100,
      icon: '🎁',
    },
    {
      id: 'box-120',
      packageId: 'pack-mystery-120',
      title: '১২০ টাকা মিষ্টি বক্স',
      desc: 'থাকতে পারে: অফিসিয়াল উইকলি মেম্বারশিপ, ৩০০ ডায়মন্ড, এবং উইকলি রিওয়ার্ড বক্স',
      rewardsList: [
        'অফিসিয়াল উইকলি মেম্বারশিপ (Weekly VIP Pass)',
        '৩০০ ডায়মন্ড ইনস্ট্যান্ট টপ-আপ',
        'স্পেশাল উইকলি রিওয়ার্ড বক্স (Reward Box)',
      ],
      priceBdt: 120,
      icon: '🎁',
    },
    {
      id: 'box-200',
      packageId: 'pack-mystery-200',
      title: '২০০ টাকা মিষ্টি বক্স',
      desc: 'থাকতে পারে: লেভেল আপ পাস, ৫০০ ডায়মন্ড, এবং স্পেশাল গান স্কিন ট্রায়াল',
      rewardsList: [
        'লেভেল আপ পাস (Level Up Pass 802+ 💎)',
        '৫০০ ডায়মন্ড ইনস্ট্যান্ট ক্রেডিট',
        'স্পেশাল গান স্কিন ট্রায়াল (Legendary Gun Skin)',
      ],
      priceBdt: 200,
      icon: '🎁',
    },
    {
      id: 'box-350',
      packageId: 'pack-mystery-350',
      title: '৩৫০ টাকা মিষ্টি বক্স',
      desc: 'থাকতে পারে: মান্থলি মেম্বারশিপ, ১০০০ ডায়মন্ড, এবং উইকলি মেম্বারশিপ কম্বো',
      rewardsList: [
        '১টি অফিসিয়াল মান্থলি মেম্বারশিপ (2600 💎 Value)',
        '১,০০০ ডায়মন্ড ইনস্ট্যান্ট টপ-আপ',
        'উইকলি মেম্বারশিপ কম্বো পাস',
      ],
      priceBdt: 350,
      icon: '⭐',
      badge: 'Popular',
    },
    {
      id: 'box-500',
      packageId: 'pack-mystery-500',
      title: '৫০০ টাকা মিষ্টি বক্স',
      desc: 'থাকতে পারে: উইকলি + মান্থলি মেম্বারশিপ কম্বো, ২০০০ ডায়মন্ড, এবং স্পেশাল গোল্ডেন রয়্যাল ভাউচার',
      rewardsList: [
        'উইকলি + মান্থলি মেম্বারশিপ কম্বো',
        '২,০০০ ডায়মন্ড ইনস্ট্যান্ট ব্যালেন্স',
        'স্পেশাল গোল্ডেন রয়্যাল ভাউচার প্যাক',
      ],
      priceBdt: 500,
      icon: '💎',
      badge: 'Epic Value',
    },
    {
      id: 'box-734',
      packageId: 'pack-mystery-734',
      title: '৭৩৪ টাকা মিষ্টি বক্স',
      desc: 'থাকতে পারে: ৩০০০ ডায়মন্ড, মান্থলি মেম্বারশিপ, এবং ইউনিক গেম বান্ডেল',
      rewardsList: [
        '৩,০০০ ডায়মন্ড সুপার প্যাক (3000 Diamonds)',
        'মান্থলি মেম্বারশিপ কার্ড',
        'ইউনিক গেম ক্যারেক্টার ও ড্রেস বান্ডেল',
      ],
      priceBdt: 734,
      icon: '👑',
      badge: 'Super Rare',
    },
    {
      id: 'box-999',
      packageId: 'pack-mystery-999',
      title: '৯৯৯ টাকা মিষ্টি বক্স',
      desc: 'মেগা মিস্ট্রি বক্স! এতে থাকতে পারে বিশাল ১২,০০০ ডায়মন্ড, ডাবল মান্থলি মেম্বারশিপ, এক্সক্লুসিভ এলিট পাস বা বান্ডেল, এবং স্পেশাল ক্যাশব্যাক',
      rewardsList: [
        'বিশাল ১২,০০০ ডায়মন্ড মেগা জ্যাকপট (12,000 Diamonds)',
        'ডাবল মান্থলি মেম্বারশিপ (২ মাসের ফুল ভিআইপি)',
        'এক্সক্লুসিভ এলিট পাস বা ইউনিক বান্ডেল',
        'স্পেশাল ক্যাশব্যাক রিওয়ার্ড (AG Coins Cashback)',
      ],
      priceBdt: 999,
      icon: '🏆',
      badge: 'Mega 🚀',
    },
  ];

  // Open Mystery Box Details Modal
  const openMysteryBox = (box: MysteryBoxItem) => {
    setSelectedBox(box);
    setModalTitle(box.title);
    setModalDesc(box.desc);
    setModalOpen(true);
  };

  // Close Modal
  const closeMysteryBox = () => {
    setModalOpen(false);
  };

  // Proceed directly to Checkout Order Modal
  const proceedCheckout = () => {
    if (!selectedBox) return;
    setModalOpen(false);

    // Look for matching package in dynamic packages list (allows admin price control to take effect)
    const matchingPkg = packages.find((p) => p.id === selectedBox.packageId);
    if (matchingPkg) {
      onSelectMysteryPackage(matchingPkg);
    } else {
      // Fallback package object
      onSelectMysteryPackage({
        id: selectedBox.packageId,
        name: `${selectedBox.priceBdt} Taka Mystery Box`,
        nameBn: selectedBox.title,
        diamonds: selectedBox.desc,
        priceBdt: selectedBox.priceBdt,
        category: 'mystery_box',
        badge: selectedBox.badge,
        active: true,
      });
    }
  };

  return (
    <>
      {/* Mystery Box Section Start */}
      <section className="mystery-box-section py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="category-mystery">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 tracking-wide inline-block">
              ✨ Mystery Box Offers ✨
            </h2>
            <p className="section-subtitle text-xs sm:text-sm text-purple-200/80 max-w-2xl mx-auto mt-2 font-medium">
              আপনার ভাগ্য পরীক্ষা করুন! যেকোনো মিষ্টি বক্স কিনুন এবং দারুণ সব রিওয়ার্ড জিতে নিন।
            </p>
          </div>

          <div className="mystery-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {MYSTERY_BOXES.map((box) => {
              // Sync price with dynamic packages (admin price override if updated)
              const livePkg = packages.find((p) => p.id === box.packageId);
              const displayPrice = livePkg ? livePkg.priceBdt : box.priceBdt;

              return (
                <div
                  key={box.id}
                  className="mystery-card relative bg-gradient-to-b from-[#1c0f3c] via-[#120829] to-[#0a0418] border-2 border-amber-500/30 hover:border-amber-400 rounded-3xl p-5 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer group flex flex-col justify-between overflow-hidden"
                  onClick={() => openMysteryBox(box)}
                >
                  {/* Glowing background ambient badge */}
                  <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/25 transition-colors pointer-events-none" />

                  {/* Top Badge if any */}
                  {box.badge && (
                    <div className="box-badge absolute top-3 right-3 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-md uppercase tracking-wider">
                      {box.badge}
                    </div>
                  )}

                  <div>
                    {/* Box Icon */}
                    <div className="box-icon w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-yellow-400/10 to-transparent border border-amber-500/30 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">
                      {box.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                      {box.title}
                    </h3>

                    {/* Rich Multi-item previews (3-4 items) */}
                    <div className="mt-2.5 space-y-1.5">
                      {box.rewardsList && box.rewardsList.length > 0 ? (
                        box.rewardsList.map((item, idx) => (
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
                          {box.desc}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price & Action Button */}
                  <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between mt-4">
                    <p className="box-price text-xl font-black font-mono text-emerald-400 tracking-tight">
                      ৳ {displayPrice.toLocaleString()}
                    </p>
                    <button
                      type="button"
                      className="buy-box-btn px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs shadow-md shadow-amber-950/50 hover:shadow-amber-400/30 transition-all cursor-pointer transform active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        openMysteryBox(box);
                      }}
                    >
                      বক্স খুলুন
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Mystery Box Section End */}

      {/* Modal Popup for Box Details */}
      {modalOpen && (
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
                {selectedBox ? selectedBox.icon : '🎁'}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h3 id="modalBoxTitle" className="text-lg sm:text-xl font-black text-amber-300">
                    {modalTitle}
                  </h3>
                  {selectedBox?.badge && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-black">
                      {selectedBox.badge}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-purple-200">মূল্য:</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    ৳ {selectedBox?.priceBdt} BDT
                  </span>
                </div>
              </div>
            </div>

            {/* Reward Offerings List */}
            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-amber-400">✨</span>
                  এই বক্সে যেসব রিওয়ার্ড জেতার সুযোগ রয়েছে:
                </span>
                <span className="text-[10px] text-slate-400 font-mono">3-4 Lucky Items</span>
              </div>

              {/* Multi-Item Reward Cards */}
              <div className="space-y-2">
                {selectedBox?.rewardsList && selectedBox.rewardsList.length > 0 ? (
                  selectedBox.rewardsList.map((reward, i) => (
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
                      {modalDesc}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-600/30 text-amber-200/90 text-[11px] text-left flex items-start gap-2">
                <span className="text-base shrink-0">⚡</span>
                <span>
                  অর্ডার সাবমিটের পর যেকোনো ১টি বা একাধিক রিওয়ার্ড সরাসরি আপনার ফ্রি ফায়ার Player UID-তে ৫-১৫ মিনিটের মধ্যে পৌঁছে দেওয়া হবে।
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
    </>
  );
};
