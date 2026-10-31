import React, { useState } from 'react';
import { Copy, Check, Smartphone, ShieldCheck, ArrowRight, Wallet } from 'lucide-react';
import { Language, PaymentMethod, SiteConfig } from '../types';
import { translations } from '../data/translations';
import { BkashLogo, NagadLogo } from './BrandLogos';

interface PaymentBannerProps {
  lang: Language;
  config: SiteConfig;
  onSelectPaymentMethodForOrder?: (method: PaymentMethod) => void;
}

export const PaymentBanner: React.FC<PaymentBannerProps> = ({
  lang,
  config,
  onSelectPaymentMethodForOrder,
}) => {
  const [copiedMethod, setCopiedMethod] = useState<string | null>(null);
  const t = translations[lang];

  const handleCopy = (number: string, method: string) => {
    navigator.clipboard.writeText(number);
    setCopiedMethod(method);
    setTimeout(() => {
      setCopiedMethod(null);
    }, 2500);
  };

  return (
    <section id="payment-methods" className="py-12 bg-[#0c071d]/60 border-y border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="text-xs uppercase tracking-wider font-semibold text-purple-400 mb-1 flex items-center justify-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-purple-400" />
            <span>Mobile Financial Services (MFS)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {lang === 'bn' ? 'আমাদের অফিসিয়াল পেমেন্ট মাধ্যম' : 'Official Payment Methods'}
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            {lang === 'bn'
              ? 'বিকাশ অথবা নগদ পার্সোনাল নম্বরে Send Money করে প্রাপ্ত Transaction ID (TrxID) দিয়ে অর্ডার কনফার্ম করুন।'
              : 'Send Money to our official bKash or Nagad personal numbers and confirm your order with your TrxID.'}
          </p>
        </div>

        {/* 2 Official Payment Cards: bKash Personal & Nagad Personal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* 1. bKash Personal Card */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#21091b] via-[#160613] to-[#0c030b] border-2 border-pink-600/50 p-6 shadow-2xl shadow-pink-950/60 hover:border-pink-500 transition-all flex flex-col justify-between group overflow-hidden">
            {/* Top highlight ribbon */}
            <div className="absolute top-0 right-0 bg-[#E2136E] text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl shadow flex items-center gap-1 tracking-wider">
              <span>Send Money</span>
            </div>

            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <BkashLogo className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-black text-white text-lg flex items-center gap-2">
                    <span>বিকাশ পার্সোনাল</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-950 text-pink-300 border border-pink-700/60 font-mono font-bold">
                      Personal MFS
                    </span>
                  </h3>
                  <p className="text-xs text-pink-300 font-medium">
                    বিকাশ অ্যাপ বা *247# ডায়াল করে Send Money করুন
                  </p>
                </div>
              </div>

              {/* Number display with copy */}
              <div className="p-3.5 rounded-2xl bg-[#0a030c] border border-pink-900/60 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-pink-300 uppercase tracking-wider font-bold">
                    Personal Number
                  </div>
                  <div className="text-base font-bold font-mono text-white mt-0.5">
                    {config.bkashNumber}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(config.bkashNumber, 'bkash')}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    copiedMethod === 'bkash'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#E2136E] hover:bg-[#c90f61] text-white shadow-md shadow-pink-950'
                  }`}
                  title="Copy bKash Number"
                >
                  {copiedMethod === 'bkash' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedMethod === 'bkash' ? (lang === 'bn' ? 'কপি হয়েছে' : 'Copied') : (lang === 'bn' ? 'কপি' : 'Copy')}</span>
                </button>
              </div>

              {/* Quick instructions */}
              <div className="mt-4 p-3 rounded-xl bg-pink-950/40 border border-pink-900/40 text-xs text-pink-200/90 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-pink-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'bn' ? 'কীভাবে পেমেন্ট করবেন:' : 'How to Pay:'}</span>
                </div>
                <div>১. বিকাশ অ্যাপে গিয়ে <strong>Send Money</strong> সিলেক্ট করুন।</div>
                <div>২. ওপরে থাকা নম্বরে মোট মূল্য পাঠান এবং <strong>TrxID</strong> কপি করে রাখুন।</div>
              </div>
            </div>

            {/* Quick action button */}
            <div className="mt-5 pt-4 border-t border-pink-950 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {lang === 'bn' ? 'যেকোনো সার্ভিসে প্রযোজ্য' : 'Applicable for all services'}
              </span>
              {onSelectPaymentMethodForOrder && (
                <button
                  type="button"
                  onClick={() => onSelectPaymentMethodForOrder('bkash')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#E2136E] hover:bg-[#c90f61] shadow-lg shadow-pink-950 flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>{lang === 'bn' ? 'বিকাশে অর্ডার করুন' : 'Order with bKash'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 2. Nagad Personal Card */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#241209] via-[#170a04] to-[#0c0502] border-2 border-orange-600/50 p-6 shadow-2xl shadow-orange-950/60 hover:border-orange-500 transition-all flex flex-col justify-between group overflow-hidden">
            {/* Top highlight ribbon */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-[#f7941d] to-[#ee4036] text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl shadow flex items-center gap-1 tracking-wider">
              <span>Send Money</span>
            </div>

            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f7941d] to-[#ee4036] p-1.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <NagadLogo className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-black text-white text-lg flex items-center gap-2">
                    <span>নগদ পার্সোনাল</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-950 text-amber-300 border border-orange-700/60 font-mono font-bold">
                      Personal MFS
                    </span>
                  </h3>
                  <p className="text-xs text-amber-300 font-medium">
                    নগদ অ্যাপ বা *167# ডায়াল করে Send Money করুন
                  </p>
                </div>
              </div>

              {/* Number display with copy */}
              <div className="p-3.5 rounded-2xl bg-[#0d0502] border border-orange-900/60 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-amber-300 uppercase tracking-wider font-bold">
                    Personal Number
                  </div>
                  <div className="text-base font-bold font-mono text-white mt-0.5">
                    {config.nagadNumber}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(config.nagadNumber, 'nagad')}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    copiedMethod === 'nagad'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-[#f7941d] to-[#ee4036] hover:opacity-95 text-white shadow-md shadow-orange-950'
                  }`}
                  title="Copy Nagad Number"
                >
                  {copiedMethod === 'nagad' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedMethod === 'nagad' ? (lang === 'bn' ? 'কপি হয়েছে' : 'Copied') : (lang === 'bn' ? 'কপি' : 'Copy')}</span>
                </button>
              </div>

              {/* Quick instructions */}
              <div className="mt-4 p-3 rounded-xl bg-amber-950/40 border border-orange-900/40 text-xs text-amber-200/90 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'bn' ? 'কীভাবে পেমেন্ট করবেন:' : 'How to Pay:'}</span>
                </div>
                <div>১. নগদ অ্যাপ বা *167# ডায়াল করে <strong>Send Money</strong> সিলেক্ট করুন।</div>
                <div>২. ওপরের নম্বরে টাকা পাঠানোর পর প্রাপ্ত <strong>TrxID</strong> চেকআউটে দিন।</div>
              </div>
            </div>

            {/* Quick action button */}
            <div className="mt-5 pt-4 border-t border-orange-950 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {lang === 'bn' ? 'যেকোনো সার্ভিসে প্রযোজ্য' : 'Applicable for all services'}
              </span>
              {onSelectPaymentMethodForOrder && (
                <button
                  type="button"
                  onClick={() => onSelectPaymentMethodForOrder('nagad')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#f7941d] to-[#ee4036] hover:opacity-95 shadow-lg shadow-orange-950 flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>{lang === 'bn' ? 'নগদে অর্ডার করুন' : 'Order with Nagad'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
