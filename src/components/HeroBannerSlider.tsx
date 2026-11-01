import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Zap, Gift, ShieldCheck, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface HeroBannerSliderProps {
  lang: Language;
  onExploreTopup: () => void;
  onExploreMystery: () => void;
  onExploreSubscriptions: () => void;
}

export const HeroBannerSlider: React.FC<HeroBannerSliderProps> = ({
  lang,
  onExploreTopup,
  onExploreMystery,
  onExploreSubscriptions,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'slide-topup',
      title: lang === 'bn' ? 'বিশ্বস্ত ও দ্রুততম গেমিং টপ-আপ প্ল্যাটফর্ম' : 'Trusted & Fastest Gaming Top-Up Platform',
      subtitle:
        lang === 'bn'
          ? 'ইউআইডি দিয়ে ডায়মন্ড টপ-আপ, উইকলি-মান্থলি এবং ওটিটি সাবস্ক্রিপশন কিনুন মুহূর্তেই। (১০০ থেকে ১২,০০০ ডায়মন্ড সরাসরি UID-তে ইনস্ট্যান্ট ডেলিভারি)'
          : 'Instant UID Diamond Top-Up (100 to 12,000 Diamonds), Weekly-Monthly Combos & OTT Subscriptions delivered instantly.',
      badge: lang === 'bn' ? 'অফিসিয়াল UID টপ-আপ · ১০০% নিরাপদ' : 'Official UID Top-Up · 100% Safe',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
      ctaText: lang === 'bn' ? 'ডায়মন্ড কিনুন' : 'Topup Diamonds',
      ctaAction: onExploreTopup,
      imageSrc: '/src/assets/images/hero_topup_banner_ff_1793518304690.jpg',
      accentGradient: 'from-blue-600 to-cyan-500',
    },
    {
      id: 'slide-mystery',
      title: lang === 'bn' ? 'মিস্ট্রি বক্স ও মেগা বোনাস অফার' : 'Mystery Box & Mega Bonus Offer',
      subtitle:
        lang === 'bn'
          ? 'মাত্র ৫০ টাকায় খুলে নিন লাকি মিস্ট্রি বক্স! জিতুন সর্বোচ্চ ৮,০০০ ডায়মন্ড ও ১০০% ডাবল ডায়মন্ড বোনাস পাস।'
          : 'Open Lucky Mystery Box from ৳50 only! Win up to 8,000 Diamonds and 100% Double Diamond bonus passes.',
      badge: lang === 'bn' ? 'লটারী ও মেগা রিওয়ার্ডস · জ্যাকপট' : 'Jackpot Rewards · Limited Time',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      ctaText: lang === 'bn' ? 'মিস্ট্রি বক্স দেখুন' : 'Explore Mystery Box',
      ctaAction: onExploreMystery,
      imageSrc: '/src/assets/images/hero_mystery_box_banner_1793518305171.jpg',
      accentGradient: 'from-amber-500 to-yellow-400',
    },
    {
      id: 'slide-subscriptions',
      title: lang === 'bn' ? 'নেটফ্লিক্স ও প্রিমিয়াম স্ট্রিমিং ওটিটি' : 'Netflix & Premium OTT Subscriptions',
      subtitle:
        lang === 'bn'
          ? 'Netflix, Crunchyroll Anime, Spotify ও YouTube Premium - ১ মাস থেকে ১ বছর মেয়াদে সবচেয়ে সাশ্রয়ী প্যাকেজ ও ফুল ওয়ারেন্টি!'
          : 'Netflix, Crunchyroll, Spotify & YouTube Premium - 1 Month to 1 Year subscriptions with 100% replacement warranty.',
      badge: lang === 'bn' ? 'বিনোদনের সাবস্ক্রিপশন · ইনস্ট্যান্ট পাস' : 'Entertainment Hub · Instant Access',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-400/40',
      ctaText: lang === 'bn' ? 'সাবস্ক্রিপশন নিন' : 'View Subscriptions',
      ctaAction: onExploreSubscriptions,
      imageSrc: '/src/assets/images/card_unipin_voucher_1793518305642.jpg',
      accentGradient: 'from-pink-600 to-purple-600',
    },
  ];

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const current = slides[currentSlide];

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      {/* Slider Container */}
      <div className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] lg:h-[460px] rounded-3xl overflow-hidden shadow-2xl border border-blue-900/50 group bg-slate-950">
        {/* Slides Images with Scrim */}
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.imageSrc}
              alt={slide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-1000"
            />
            {/* Deep Contrast Scrims */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060312] via-[#09051d]/75 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060312] via-[#09051d]/85 to-transparent w-full md:w-3/4" />
          </div>
        ))}

        {/* Slide Content Overlay */}
        <div className="relative z-20 h-full flex flex-col justify-end md:justify-center p-6 sm:p-10 md:p-14 max-w-2xl text-left space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md self-start w-fit">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className={current.badgeColor}>{current.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {current.title}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-200/90 font-medium line-clamp-2 sm:line-clamp-3 max-w-xl">
            {current.subtitle}
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={current.ctaAction}
              className={`flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-2xl bg-gradient-to-r ${current.accentGradient} text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-950/60 hover:opacity-95 transition-all transform hover:scale-105 active:scale-95 cursor-pointer`}
            >
              <span>{current.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-700/50 px-3.5 py-2.5 rounded-xl backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'bn' ? 'ইনস্ট্যান্ট অটো ডেলিভারি' : 'Instant Delivery'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 backdrop-blur-sm transition-all hover:scale-110 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 backdrop-blur-sm transition-all hover:scale-110 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 right-6 z-30 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                i === currentSlide ? 'w-6 bg-cyan-400 shadow-lg shadow-cyan-500' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
