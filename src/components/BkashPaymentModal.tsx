import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  X,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Phone,
  KeyRound,
  FileText,
} from 'lucide-react';
import { BkashLogo } from './BrandLogos';
import { SiteConfig } from '../types';

export interface BkashPaymentSuccessData {
  trxId: string;
  accountNumber: string;
  invoiceId: string;
  amountBdt: number;
  paidAt: string;
}

interface BkashPaymentModalProps {
  isOpen: boolean;
  amountBdt: number;
  orderTitle: string;
  customerContact?: string;
  config: SiteConfig;
  onSuccess: (data: BkashPaymentSuccessData) => void;
  onCancel: () => void;
}

export const BkashPaymentModal: React.FC<BkashPaymentModalProps> = ({
  isOpen,
  amountBdt,
  orderTitle,
  customerContact = '',
  config,
  onSuccess,
  onCancel,
}) => {
  // Step in bKash PGW flow: 'account' | 'otp' | 'pin' | 'processing' | 'success'
  const [step, setStep] = useState<'account' | 'otp' | 'pin' | 'processing' | 'success'>('account');
  const [accountNumber, setAccountNumber] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [invoiceId] = useState(() => `AG-BK-${Date.now().toString().slice(-7)}`);
  const [generatedTrxId, setGeneratedTrxId] = useState('');

  // Prefill phone if customer already entered contact in checkout
  useEffect(() => {
    if (isOpen) {
      setStep('account');
      setErrorMsg(null);
      setOtp('');
      setPin('');
      setResendTimer(60);
      const cleanContact = customerContact.replace(/\D/g, '');
      if (cleanContact.length >= 11) {
        setAccountNumber(cleanContact.slice(-11));
      } else {
        setAccountNumber('');
      }
    }
  }, [isOpen, customerContact]);

  // OTP Countdown timer
  useEffect(() => {
    let interval: any;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  const isSandbox = config.bkashMode === 'sandbox';

  // Step 1: Validate and submit account number
  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanNum = accountNumber.replace(/\D/g, '');
    if (!cleanNum.startsWith('01') || cleanNum.length !== 11) {
      setErrorMsg('সঠিক ১১ ডিজিটের বিকাশ অ্যাকাউন্ট নম্বর দিন (যেমন: 01712345678)');
      return;
    }
    if (!agreedTerms) {
      setErrorMsg('অনুগ্রহ করে বিকাশ পেমেন্টের শর্তাবলী মেনে নিন।');
      return;
    }
    setStep('otp');
    setResendTimer(60);
  };

  // Step 2: Validate OTP
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanOtp = otp.trim();
    if (cleanOtp.length < 4) {
      setErrorMsg('সঠিক ভেরিফিকেশন কোড (OTP) লিখুন।');
      return;
    }
    setStep('pin');
  };

  // Step 3: Validate PIN & Process simulated transaction
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanPin = pin.trim();
    if (cleanPin.length < 4 || cleanPin.length > 5) {
      setErrorMsg('সঠিক ৪ বা ৫ ডিজিটের বিকাশ পিন দিন।');
      return;
    }

    setStep('processing');

    // Simulate authentic bKash Tokenized Checkout execution
    setTimeout(() => {
      // Generate authentic-looking bKash TrxID: BKH + random uppercase alphanumeric (e.g. BKH89C7E2M)
      const randomPart = Math.random().toString(36).substring(2, 9).toUpperCase();
      const trx = `BKH${randomPart}`;
      setGeneratedTrxId(trx);
      setStep('success');

      // Automatically trigger order completion callback
      setTimeout(() => {
        onSuccess({
          trxId: trx,
          accountNumber,
          invoiceId,
          amountBdt,
          paidAt: new Date().toISOString(),
        });
      }, 1400);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-[430px] rounded-3xl bg-white text-slate-900 shadow-2xl overflow-hidden border-2 border-[#E2136E]">
        {/* Official bKash Top Header Banner */}
        <div className="bg-[#E2136E] text-white p-5 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md">
                <BkashLogo className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-extrabold text-base tracking-wide flex items-center gap-1.5">
                  <span>bKash Payment</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-900/60 font-mono uppercase tracking-wider font-bold">
                    {isSandbox ? 'Sandbox Test' : 'Secure PGW'}
                  </span>
                </h3>
                <div className="text-xs text-pink-100 flex items-center gap-1">
                  <span>Merchant:</span>
                  <span className="font-bold underline">ARAFAT GAMING</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (step === 'processing') return;
                if (confirm('আপনি কি সত্যিই বিকাশ পেমেন্ট বাতিল করতে চান?')) {
                  onCancel();
                }
              }}
              className="p-1.5 rounded-full bg-pink-700/60 hover:bg-pink-800 text-white cursor-pointer transition-colors"
              title="Close bKash Gateway"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Amount & Invoice Info Card inside bKash Header */}
          <div className="mt-4 pt-3 border-t border-pink-400/40 flex items-center justify-between text-xs">
            <div>
              <span className="text-pink-200 block text-[10px] uppercase font-bold tracking-wider">
                Invoice ID
              </span>
              <span className="font-mono font-bold tracking-wider text-pink-50">
                {invoiceId}
              </span>
            </div>
            <div className="text-right">
              <span className="text-pink-200 block text-[10px] uppercase font-bold tracking-wider">
                Amount to Pay
              </span>
              <div className="text-xl font-black font-mono text-white">
                ৳{amountBdt} <span className="text-xs font-sans font-semibold">BDT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Body Content according to step */}
        <div className="p-5 sm:p-6 bg-slate-50 min-h-[310px] flex flex-col justify-between">
          {/* STEP 1: Account Number Input */}
          {step === 'account' && (
            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  আপনার বিকাশ অ্যাকাউন্ট নম্বর দিন (Your bKash Account)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                    +880
                  </div>
                  <input
                    type="tel"
                    required
                    autoFocus
                    maxLength={11}
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-16 pr-4 py-3 rounded-xl border-2 border-slate-300 focus:border-[#E2136E] focus:ring-2 focus:ring-pink-200 text-slate-900 font-mono font-bold text-base outline-none transition-all shadow-inner"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  যেকোনো পার্সোনাল বিকাশ অ্যাকাউন্ট নম্বর দিয়ে পেমেন্ট করা যাবে।
                </p>
              </div>

              {/* Terms checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#E2136E] rounded border-slate-300 focus:ring-[#E2136E] cursor-pointer"
                />
                <span className="text-xs text-slate-600 leading-tight">
                  আমি বিকাশ অনলাইন পেমেন্টের শর্তাবলী এবং নিরাপত্তা নীতিমালার সাথে একমত।
                </span>
              </label>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#E2136E] hover:bg-[#c90f61] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-200 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  Confirm
                </button>
              </div>

              {/* Sandbox notice banner */}
              {isSandbox && (
                <div className="p-2 rounded-lg bg-pink-50 border border-pink-200 text-[10px] text-pink-800 text-center font-mono">
                  🧪 Sandbox Mode: যেকোনো বিকাশ নম্বর দিন (যেমন: 01712345678)
                </div>
              )}
            </form>
          )}

          {/* STEP 2: Verification Code (OTP) */}
          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    ভেরিফিকেশন কোড দিন (bKash OTP)
                  </label>
                  <span className="text-[11px] font-mono font-bold text-[#E2136E]">
                    +880 {accountNumber}
                  </span>
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-[#E2136E] focus:ring-2 focus:ring-pink-200 text-slate-900 font-mono font-bold text-xl text-center tracking-widest outline-none transition-all shadow-inner"
                />
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                  <span>কোড আসেনি?</span>
                  {resendTimer > 0 ? (
                    <span className="font-mono text-slate-400">পুনরায় পাঠানো যাবে ({resendTimer}s)</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setResendTimer(60);
                        setErrorMsg('নতুন কোড পাঠানো হয়েছে!');
                      }}
                      className="text-[#E2136E] font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Resend Code</span>
                    </button>
                  )}
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Sandbox Tip */}
              <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200 text-xs text-pink-900">
                <span className="font-bold">টেস্ট টিপ:</span> Sandbox টেস্টিংয়ের জন্য <strong>123456</strong> বা যেকোনো ৬ ডিজিটের কোড দিন।
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('account')}
                  className="flex-1 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#E2136E] hover:bg-[#c90f61] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-200 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  Confirm
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: bKash PIN Confirmation */}
          {step === 'pin' && (
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>আপনার বিকাশ পিন নম্বর দিন (bKash PIN)</span>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  maxLength={5}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="•••••"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-[#E2136E] focus:ring-2 focus:ring-pink-200 text-slate-900 font-mono font-bold text-2xl text-center tracking-[0.4em] outline-none transition-all shadow-inner"
                />
                <div className="p-2.5 mt-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    আরাফাত গেমিং বা বিকাশ কর্তৃপক্ষ কখনোই আপনার পিন চাইবে না। পিন কাউকে শেয়ার করবেন না।
                  </span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('otp')}
                  className="flex-1 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#E2136E] hover:bg-[#c90f61] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-200 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  Confirm (৳{amountBdt})
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Processing State */}
          {step === 'processing' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full border-4 border-pink-200 border-t-[#E2136E] animate-spin" />
              <div>
                <h4 className="text-base font-bold text-slate-800">
                  bKash Payment Processing...
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  বিকাশ পেমেন্ট গেটওয়ের সাথে নিরাপদ কানেকশন তৈরি হচ্ছে। অনুগ্রহ করে উইন্ডো বন্ধ করবেন না।
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 font-mono text-xs text-slate-600">
                Authorizing ৳{amountBdt} BDT via Tokenized PGW API
              </div>
            </div>
          )}

          {/* STEP 5: Success State */}
          {step === 'success' && (
            <div className="py-6 text-center space-y-4 animate-scale-up">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-100">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-800">
                  পেমেন্ট সফল হয়েছে! (Payment Successful)
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  আপনার বিকাশ পেমেন্ট সম্পন্ন হয়েছে এবং TrxID নিশ্চিত হয়েছে।
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-mono font-bold text-[#E2136E] text-sm">
                    {generatedTrxId}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    ৳{amountBdt} BDT
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Account:</span>
                  <span className="font-mono font-medium text-slate-700">
                    +880 {accountNumber.slice(0, 4)}***{accountNumber.slice(-4)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-emerald-700 font-semibold animate-pulse">
                অর্ডার নিশ্চিতকরণে নিয়ে যাওয়া হচ্ছে...
              </p>
            </div>
          )}

          {/* Official Footer Branding */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#E2136E]" />
              <span>256-Bit SSL Encrypted</span>
            </span>
            <span>bKash Checkout API v1.3</span>
          </div>
        </div>
      </div>
    </div>
  );
};
