import React, { useState } from 'react';
import { Copy, Check, Smartphone, AlertCircle, Zap, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
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

  const merchantNum = config.bkashMerchantNumber || config.bkashNumber;

  return (
    <section id="payment-methods" className="py-12 bg-[#0c071d]/60 border-y border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="text-xs uppercase tracking-wider font-semibold text-pink-400 mb-1 flex items-center justify-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>Automated PGW & Mobile Financial Services</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {lang === 'bn' ? 'আমাদের অফিসিয়াল পেমেন্ট মাধ্যম' : 'Official Payment Methods'}
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            {lang === 'bn'
              ? 'বিকাশ অটোমেটেড চেকআউট গেটওয়ে অথবা নগদ পার্সোনাল নম্বরে দ্রুত ও নিরাপদে পেমেন্ট সম্পন্ন করুন।'
              : 'Pay securely using the bKash Automated Checkout Gateway or Nagad personal Send Money.'}
          </p>
        </div>

        {/* 2 Focused Official Payment Cards: bKash PGW & Nagad Personal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* 1. bKash Automated Checkout Gateway Card */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#21091b] via-[#160613] to-[#0c030b] border-2 border-pink-600/50 p-6 shadow-2xl shadow-pink-950/60 hover:border-pink-500 transition-all flex flex-col justify-between group overflow-hidden">
            {/* Top highlight ribbon */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-[#E2136E] to-pink-700 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl shadow flex items-center gap-1 tracking-wider">
              <Zap className="w-3 h-3 fill-white" />
              <span>1-Click Auto Gateway</span>
            </div>

            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-13 h-13 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <BkashLogo className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-black text-white text-lg flex items-center gap-2">
                    <span>bKash Checkout</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-900 text-pink-200 border border-pink-700 font-mono font-bold">
                      {config.bkashMode === 'sandbox' ? 'Sandbox' : 'Direct API'}
                    </span>
                  </h3>
                  <p className="text-xs text-pink-300 font-medium">
                    অটোমেটেড গেটওয়ে · কোনো TrxID টাইপ করতে হবে না
                  </p>
                </div>
              </div>

              {/* Number display with copy */}
              <div className="p-3.5 rounded-2xl bg-[#0a030c] border border-pink-900/60 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-pink-300 uppercase tracking-wider font-bold">
                    Merchant Wallet
                  </div>
                  <div className="text-base font-bold font-mono text-white mt-0.5">
                    {merchantNum}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(merchantNum, 'bkash')}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    copiedMethod === 'bkash' ? 'bg-emerald-600 text-white' : 'bg-[#E2136E] hover:bg-[#c90f61] text-white shadow-md shadow-pink-950'
                  }`}
                  title="Copy bKash Number"
                >
                  {copiedMethod === 'bkash' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedMethod === 'bkash' ? 'কপি হয়েছে' : 'কপি'}</span>
                </button>
              </div>

              <div className="mt-3 space-y-1 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 text-pink-200">
                  <ShieldCheck className="w-4 h-4 text-pink-400 shrink-0" />
                  <span>অফিসিয়াল bKash PGW পপআপে পিন দিয়ে ১-ক্লিকে নিশ্চিত করুন</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-pink-900/50 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 font-mono text-pink-300">
                <Smartphone className="w-3.5 h-3.5 text-pink-400" />
                <span>USSD: *247#</span>
              </span>
              {onSelectPaymentMethodForOrder && (
                <button
                  type="button"
                  onClick={() => onSelectPaymentMethodForOrder('bkash')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E2136E] to-pink-700 hover:from-[#c90f61] hover:to-pink-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-pink-950 cursor-pointer transition-transform hover:scale-105"
                >
                  <span>Pay with bKash</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 2. Nagad Personal Card */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#211108] via-[#140a05] to-[#0a0502] border-2 border-orange-600/40 p-6 shadow-2xl shadow-orange-950/60 hover:border-orange-500 transition-all flex flex-col justify-between group overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-[#f7941d] to-[#ee4036] text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl shadow flex items-center gap-1 tracking-wider">
              <span>Personal Send Money</span>
            </div>

            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#f7941d] to-[#ee4036] p-1.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <NagadLogo className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-black text-white text-lg">
                    {lang === 'bn' ? 'নগদ পার্সোনাল' : 'Nagad Personal'}
                  </h3>
                  <p className="text-xs text-amber-300 font-medium">
                    Send Money · অ্যাপ বা *167# ডায়াল কোড
                  </p>
                </div>
              </div>

              {/* Number display with copy */}
              <div className="p-3.5 rounded-2xl bg-[#0c0502] border border-amber-900/60 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-amber-300 uppercase tracking-wider font-bold">
                    Nagad Number
                  </div>
                  <div className="text-base font-bold font-mono text-white mt-0.5">
                    {config.nagadNumber}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(config.nagadNumber, 'nagad')}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    copiedMethod === 'nagad' ? 'bg-emerald-600 text-white' : 'bg-gradient-to-r from-[#f7941d] to-[#ee4036] hover:opacity-95 text-white shadow-md shadow-orange-950'
                  }`}
                  title="Copy Nagad Number"
                >
                  {copiedMethod === 'nagad' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedMethod === 'nagad' ? 'কপি হয়েছে' : 'কপি'}</span>
                </button>
              </div>

              <div className="mt-3 space-y-1 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 text-amber-200">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Send Money সম্পন্ন করার পর SMS থেকে TrxID দিন</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-amber-900/50 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 font-mono text-amber-300">
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>USSD: *167#</span>
              </span>
              {onSelectPaymentMethodForOrder && (
                <button
                  type="button"
                  onClick={() => onSelectPaymentMethodForOrder('nagad')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#f7941d] to-[#ee4036] hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-950 cursor-pointer transition-transform hover:scale-105"
                >
                  <span>{lang === 'bn' ? 'অর্ডার করুন' : 'Order Now'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="max-w-4xl mx-auto mt-6 px-4 py-3 rounded-2xl bg-purple-950/30 border border-purple-900/40 text-xs text-slate-300 text-center flex flex-col sm:flex-row items-center justify-center gap-2">
          <div className="flex items-center gap-1.5 text-pink-400 font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted:</span>
          </div>
          <span>বিকাশ অটোমেটেড পেমেন্টে কোনো TrxID বা SMS সংরক্ষণের ঝামেলা নেই। অর্ডার স্বয়ংক্রিয়ভাবে নিশ্চিত হয়।</span>
        </div>
      </div>
    </section>
  );
};
