import React, { useState } from 'react';
import { ShoppingBag, Zap, Award, Sparkles } from 'lucide-react';
import { DiamondPackage, Language, PackageCategory } from '../types';
import { translations } from '../data/translations';

interface DiamondPackagesProps {
  packages: DiamondPackage[];
  lang: Language;
  onSelectPackage: (pkg: DiamondPackage) => void;
}

export const DiamondPackages: React.FC<DiamondPackagesProps> = ({
  packages,
  lang,
  onSelectPackage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const t = translations[lang];

  const filteredPackages = packages.filter((pkg) => {
    if (!pkg.active) return false;
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'diamond') return pkg.category === 'diamond';
    if (selectedCategory === 'membership') return pkg.category === 'membership' || pkg.category === 'special';
    return true;
  });

  return (
    <section id="diamond-packages" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-purple-400 mb-1">
              Top-Up Store
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.packagesTitle}
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              {t.packagesSub}
            </p>
          </div>

          {/* Category Filter Tabs (functional buttons with click handlers) */}
          <div className="flex items-center gap-1.5 p-1 bg-[#130a26] border border-purple-900/40 rounded-xl overflow-x-auto self-start md:self-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.tabAll}
            </button>
            <button
              onClick={() => setSelectedCategory('diamond')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'diamond'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.tabDiamonds}
            </button>
            <button
              onClick={() => setSelectedCategory('membership')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'membership'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.tabMemberships}
            </button>
          </div>
        </div>

        {/* 3-column / 4-column Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredPackages.map((pkg) => {
            const isMembership = pkg.category === 'membership';
            const isSpecial = pkg.category === 'special';

            return (
              <div
                key={pkg.id}
                className="group relative rounded-2xl bg-[#110922] border border-purple-900/40 hover:border-purple-500/50 p-4 sm:p-5 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/50"
              >
                {/* Badge if present */}
                {pkg.badge && (
                  <div className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-purple-300">
                    {pkg.badge}
                  </div>
                )}

                {/* Top Image / Diamond graphic */}
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
                    {/* Fallback diamond icon */}
                    <Sparkles className="w-8 h-8 text-cyan-400 -z-10 absolute" />
                  </div>

                  {/* Title & Category info */}
                  <div className="text-center">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                      {lang === 'bn' ? pkg.nameBn : pkg.name}
                    </h3>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {isMembership
                        ? (lang === 'bn' ? 'সাপ্তাহিক/মাসিক সুবিধা' : 'Subscription Perks')
                        : isSpecial
                        ? (lang === 'bn' ? 'স্পেশাল রিওয়ার্ড' : 'Special In-Game Pack')
                        : (lang === 'bn' ? 'ইনস্ট্যান্ট ইউআইডি টপ-আপ' : 'Direct UID Top-Up')}
                    </div>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="mt-5 pt-3 border-t border-purple-950/80">
                  <div className="flex items-baseline justify-center gap-1 mb-3">
                    <span className="text-xs font-bold text-purple-400">{t.priceCurrency}</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono-numbers">
                      {pkg.priceBdt}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">BDT</span>
                  </div>

                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className="w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 transition-all shadow-md shadow-purple-950 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{t.packageOrderBtn}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
