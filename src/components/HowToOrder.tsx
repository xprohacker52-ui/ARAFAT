import React from 'react';
import { ShoppingCart, Send, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface HowToOrderProps {
  lang: Language;
  onGoToPackages: () => void;
  onOpenOrderModal: () => void;
}

export const HowToOrder: React.FC<HowToOrderProps> = ({
  lang,
  onGoToPackages,
  onOpenOrderModal,
}) => {
  const t = translations[lang];

  const steps = [
    {
      num: '১',
      enNum: '1',
      title: t.step1GuideTitle,
      desc: t.step1GuideDesc,
      icon: <ShoppingCart className="w-6 h-6 text-purple-400" />,
      tag: 'Step 1',
    },
    {
      num: '২',
      enNum: '2',
      title: t.step2GuideTitle,
      desc: t.step2GuideDesc,
      icon: <Send className="w-6 h-6 text-pink-400" />,
      tag: 'Step 2',
    },
    {
      num: '৩',
      enNum: '3',
      title: t.step3GuideTitle,
      desc: t.step3GuideDesc,
      icon: <FileText className="w-6 h-6 text-cyan-400" />,
      tag: 'Step 3',
    },
    {
      num: '৪',
      enNum: '4',
      title: t.step4GuideTitle,
      desc: t.step4GuideDesc,
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
      tag: 'Step 4',
    },
  ];

  return (
    <section id="how-to-order" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-wider font-semibold text-purple-400 mb-1">
            Easy Steps
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.howToTitle}
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            {t.howToSub}
          </p>
        </div>

        {/* 4 Step Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl bg-[#110822] border border-purple-900/40 p-6 flex flex-col justify-between hover:border-purple-500/40 transition-all hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#090414] border border-purple-900/40 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-xs font-bold font-mono-numbers text-purple-400">
                    {lang === 'bn' ? `ধাপ ${step.num}` : step.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-purple-950 flex items-center text-xs text-purple-400 font-semibold">
                <span>{idx === 0 ? 'প্যাকেজ দেখুন' : idx === 1 ? 'বিকাশ/নগদ' : idx === 2 ? 'ফর্ম পূরণ' : '৫–১৫ মিনিট'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick CTA */}
        <div className="mt-10 text-center">
          <button
            onClick={onOpenOrderModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-950 cursor-pointer transition-all active:scale-95"
          >
            <span>এখনই ডায়মন্ড অর্ডার করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
