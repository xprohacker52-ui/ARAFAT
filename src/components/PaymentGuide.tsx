import React, { useState } from 'react';
import { Smartphone, Check, Copy, AlertTriangle, ArrowRight } from 'lucide-react';
import { Language, SiteConfig } from '../types';
import { translations } from '../data/translations';

interface PaymentGuideProps {
  lang: Language;
  config: SiteConfig;
  onOpenOrderModal: () => void;
}

export const PaymentGuide: React.FC<PaymentGuideProps> = ({
  lang,
  config,
  onOpenOrderModal,
}) => {
  const [activeTab, setActiveTab] = useState<'bkash' | 'nagad'>('bkash');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const t = translations[lang];

  const handleCopy = (number: string, method: string) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(method);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <section id="payment-guide" className="py-12 md:py-16 bg-[#0c061e]/40 border-t border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-wider font-semibold text-purple-400 mb-1">
            Payment Tutorial
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.paymentGuideTitle}
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            {t.paymentGuideSub}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Left: Tabbed instructions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tabs for bKash / Nagad */}
            <div className="flex p-1 bg-[#130926] border border-purple-900/40 rounded-xl">
              <button
                onClick={() => setActiveTab('bkash')}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'bkash'
                    ? 'bg-[#e2136e] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.bkashGuideTab}
              </button>
              <button
                onClick={() => setActiveTab('nagad')}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'nagad'
                    ? 'bg-gradient-to-r from-[#f7941d] to-[#ee4036] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.nagadGuideTab}
              </button>
            </div>

            {/* Crucial Send Money alert */}
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/40 flex items-start gap-3 text-xs text-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>{t.sendMoneyWarning}</div>
            </div>

            {/* bKash Instructions */}
            {activeTab === 'bkash' ? (
              <div className="rounded-2xl bg-[#120724] border border-pink-900/40 p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-base text-pink-400">
                    বিকাশ পার্সোনাল নম্বর
                  </div>
                  <button
                    onClick={() => handleCopy(config.bkashNumber, 'bkash')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e2136e] text-white text-xs font-bold cursor-pointer"
                  >
                    {copiedNumber === 'bkash' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNumber === 'bkash' ? 'কপি হয়েছে' : config.bkashNumber}</span>
                  </button>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <p className="font-semibold text-white">📱 বিকাশ অ্যাপের মাধ্যমে:</p>
                  <ol className="list-decimal pl-5 space-y-1 text-slate-300">
                    <li>বিকাশ অ্যাপ ওপেন করে <strong>"Send Money"</strong> (সেন্ড মানি) অপশনে যান।</li>
                    <li>প্রাপক নম্বরে <strong>{config.bkashNumber}</strong> দিন।</li>
                    <li>প্যাকেজের সঠিক টাকা (যেমন: ১১৫ ডায়মন্ডের জন্য ৳৬০) লিখুন।</li>
                    <li>আপনার বিকাশ পিন দিয়ে ট্যাপ করে সেন্ড মানি নিশ্চিত করুন।</li>
                    <li>সফল হওয়ার পর স্ক্রিন বা SMS থেকে <strong>Transaction ID (TrxID)</strong> কপি করুন।</li>
                  </ol>

                  <p className="font-semibold text-white pt-2">📞 বাটন ফোনে ডায়াল কোডের মাধ্যমে:</p>
                  <div className="p-2.5 rounded-lg bg-[#080210] font-mono-numbers text-xs text-purple-300">
                    *247# ➔ 1. Send Money ➔ Enter Number: {config.bkashNumber} ➔ Enter Amount ➔ Enter PIN
                  </div>
                </div>
              </div>
            ) : (
              /* Nagad Instructions */
              <div className="rounded-2xl bg-[#14081c] border border-amber-900/40 p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-base text-amber-400">
                    নগদ পার্সোনাল নম্বর
                  </div>
                  <button
                    onClick={() => handleCopy(config.nagadNumber, 'nagad')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f7941d] text-white text-xs font-bold cursor-pointer"
                  >
                    {copiedNumber === 'nagad' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNumber === 'nagad' ? 'কপি হয়েছে' : config.nagadNumber}</span>
                  </button>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <p className="font-semibold text-white">📱 নগদ অ্যাপের মাধ্যমে:</p>
                  <ol className="list-decimal pl-5 space-y-1 text-slate-300">
                    <li>নগদ অ্যাপে লগইন করে <strong>"Send Money"</strong> (সেন্ড মানি) সিলেক্ট করুন।</li>
                    <li>নম্বর বক্সে <strong>{config.nagadNumber}</strong> পেস্ট করুন।</li>
                    <li>প্যাকেজের নির্ধারিত টাকার পরিমাণ লিখুন।</li>
                    <li>পিন নম্বর দিয়ে ট্যাপ করে চেপে ধরে টাকা পাঠানো সম্পন্ন করুন।</li>
                    <li>ইনবক্স বা SMS থেকে <strong>Transaction ID (TrxID)</strong> কপি করুন।</li>
                  </ol>

                  <p className="font-semibold text-white pt-2">📞 বাটন ফোনে ডায়াল কোডের মাধ্যমে:</p>
                  <div className="p-2.5 rounded-lg bg-[#080210] font-mono-numbers text-xs text-amber-300">
                    *167# ➔ 1. Send Money ➔ Enter Number: {config.nagadNumber} ➔ Enter Amount ➔ Enter PIN
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Payment Visual */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-purple-800/40 shadow-xl bg-[#120826]">
              <div className="aspect-[4/3] w-full relative">
                <img
                  src="/src/assets/images/mobile_payment_guide_1793189551191.jpg"
                  alt="bKash & Nagad Send Money Guide - ARAFAT GAMING Free Fire Top-Up"
                  width={600}
                  height={450}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090414] via-transparent to-transparent flex items-end p-5">
                  <div className="text-xs text-slate-200">
                    <div className="font-bold text-white text-sm">TrxID পাওয়ার পর:</div>
                    <div>অর্ডার ফর্মে এসে UID এবং TrxID দিয়ে সাবমিট করুন।</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
