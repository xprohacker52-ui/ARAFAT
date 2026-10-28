import React, { useState } from 'react';
import { Copy, Check, Send, AlertCircle, Smartphone } from 'lucide-react';
import { Language, PaymentMethod, SiteConfig } from '../types';
import { translations } from '../data/translations';

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
    <section id="payment-methods" className="py-8 bg-[#0c071d]/60 border-y border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="text-xs uppercase tracking-wider font-semibold text-purple-400 mb-1">
            Official Accounts
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.paymentSectionTitle}
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            {t.paymentSectionSub}
          </p>
        </div>

        {/* Two distinct payment cards side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* bKash Card */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#180a22] to-[#110619] border border-pink-900/40 p-6 shadow-xl hover:border-pink-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#e2136e] flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-pink-900/40">
                    ৳
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {t.bkashTitle}
                    </h3>
                    <span className="text-xs text-pink-300 font-medium">Personal Account</span>
                  </div>
                </div>
                <div className="text-xs px-2.5 py-1 rounded-md bg-pink-950/60 text-pink-300 border border-pink-800/40">
                  {t.sendMoneyNotice}
                </div>
              </div>

              {/* Number display with copy */}
              <div className="mt-4 p-3.5 rounded-xl bg-[#09030f] border border-pink-950 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                    {lang === 'bn' ? 'বিকাশ নম্বর (Personal)' : 'bKash Number (Personal)'}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-white tracking-wider mt-0.5">
                    {config.bkashNumber}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(config.bkashNumber, 'bkash')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    copiedMethod === 'bkash'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#e2136e] hover:bg-[#c90f61] text-white'
                  }`}
                >
                  {copiedMethod === 'bkash' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t.copiedText}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{t.btnCopyNumber}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-pink-950/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-pink-400" />
                <span>USSD: *247#</span>
              </span>
              {onSelectPaymentMethodForOrder && (
                <button
                  onClick={() => onSelectPaymentMethodForOrder('bkash')}
                  className="text-pink-300 hover:text-pink-200 font-semibold underline underline-offset-2 cursor-pointer"
                >
                  {lang === 'bn' ? 'বিকাশে অর্ডার করুন →' : 'Order with bKash →'}
                </button>
              )}
            </div>
          </div>

          {/* Nagad Card */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#1e1009] to-[#140a05] border border-amber-900/40 p-6 shadow-xl hover:border-amber-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#f7941d] to-[#ee4036] flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-orange-950/40">
                    ৳
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {t.nagadTitle}
                    </h3>
                    <span className="text-xs text-amber-300 font-medium">Personal Account</span>
                  </div>
                </div>
                <div className="text-xs px-2.5 py-1 rounded-md bg-amber-950/60 text-amber-300 border border-amber-800/40">
                  {t.sendMoneyNotice}
                </div>
              </div>

              {/* Number display with copy */}
              <div className="mt-4 p-3.5 rounded-xl bg-[#0b0502] border border-amber-950 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                    {lang === 'bn' ? 'নগদ নম্বর (Personal)' : 'Nagad Number (Personal)'}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-white tracking-wider mt-0.5">
                    {config.nagadNumber}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(config.nagadNumber, 'nagad')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    copiedMethod === 'nagad'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-[#f7941d] to-[#ee4036] hover:opacity-90 text-white'
                  }`}
                >
                  {copiedMethod === 'nagad' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t.copiedText}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{t.btnCopyNumber}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-amber-950/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>USSD: *167#</span>
              </span>
              {onSelectPaymentMethodForOrder && (
                <button
                  onClick={() => onSelectPaymentMethodForOrder('nagad')}
                  className="text-amber-300 hover:text-amber-200 font-semibold underline underline-offset-2 cursor-pointer"
                >
                  {lang === 'bn' ? 'নগদে অর্ডার করুন →' : 'Order with Nagad →'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tip strip */}
        <div className="max-w-4xl mx-auto mt-4 px-4 py-2.5 rounded-xl bg-purple-950/20 border border-purple-900/20 text-xs text-slate-400 text-center flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{t.paymentStepReminder}</span>
        </div>
      </div>
    </section>
  );
};
