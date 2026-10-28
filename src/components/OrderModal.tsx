import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  Smartphone,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { DiamondPackage, Language, Order, PaymentMethod, SiteConfig } from '../types';
import { translations } from '../data/translations';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  packages: DiamondPackage[];
  selectedPackage?: DiamondPackage | null;
  initialPaymentMethod?: PaymentMethod;
  config: SiteConfig;
  onSubmitOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'adminNote'>) => Promise<string>;
  onNavigateToTracking: (orderId: string) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  packages,
  selectedPackage,
  initialPaymentMethod = 'bkash',
  config,
  onSubmitOrder,
  onNavigateToTracking,
}) => {
  const [playerUid, setPlayerUid] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [pkgId, setPkgId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialPaymentMethod);
  const [trxId, setTrxId] = useState('');
  const [contact, setContact] = useState('');
  
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUidGuide, setShowUidGuide] = useState(false);

  // Synchronize initial selections
  useEffect(() => {
    if (selectedPackage) {
      setPkgId(selectedPackage.id);
    } else if (packages.length > 0 && !pkgId) {
      setPkgId(packages[0].id);
    }
  }, [selectedPackage, packages]);

  useEffect(() => {
    if (initialPaymentMethod) {
      setPaymentMethod(initialPaymentMethod);
    }
  }, [initialPaymentMethod]);

  if (!isOpen) return null;

  const currentPkg = packages.find((p) => p.id === pkgId) || packages[0];
  const targetNumber = paymentMethod === 'bkash' ? config.bkashNumber : config.nagadNumber;
  const isBkash = paymentMethod === 'bkash';

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(targetNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form Validations
    const cleanUid = playerUid.trim();
    if (!cleanUid) {
      setErrorMessage('অনুগ্রহ করে আপনার Free Fire Player UID দিন (Player UID is required)');
      return;
    }
    if (!/^\d{5,14}$/.test(cleanUid)) {
      setErrorMessage('সঠিক Player UID দিন (শুধুমাত্র সংখ্যা, ৮–১০ ডিজিট সাধারণত)');
      return;
    }
    if (!currentPkg) {
      setErrorMessage('একটি ডায়মন্ড প্যাকেজ নির্বাচন করুন');
      return;
    }
    const cleanTrx = trxId.trim();
    if (!cleanTrx) {
      setErrorMessage('টাকা পাঠানোর পর প্রাপ্ত Transaction ID (TrxID) দিন');
      return;
    }
    if (cleanTrx.length < 5) {
      setErrorMessage('সঠিক Transaction ID দিন (কমপক্ষে ৫ বা ততোধিক অক্ষর/সংখ্যা)');
      return;
    }

    try {
      setSubmitting(true);
      const newOrderId = await onSubmitOrder({
        playerUid: cleanUid,
        playerName: playerName.trim() || undefined,
        packageId: currentPkg.id,
        packageName: currentPkg.name,
        packageNameBn: currentPkg.nameBn,
        diamonds: currentPkg.diamonds,
        amountBdt: currentPkg.priceBdt,
        paymentMethod,
        paymentNumber: targetNumber,
        trxId: cleanTrx.toUpperCase(),
        contact: contact.trim() || undefined,
      });

      setSubmittedOrderId(newOrderId);
    } catch (err: any) {
      setErrorMessage(err?.message || 'অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setSubmittedOrderId(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 rounded-2xl bg-[#0e071f] border border-purple-800/50 shadow-2xl shadow-purple-950 overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-purple-900/40 bg-[#140b2b]">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              {submittedOrderId ? 'অর্ডার কনফার্মেশন' : 'টপ-আপ অর্ডার ফর্ম — ARAFAT GAMING'}
            </h3>
            <div className="text-xs text-purple-300/80">
              {submittedOrderId ? 'আপনার অর্ডার সফলভাবে গৃহীত হয়েছে' : 'শুধুমাত্র Player UID ও TrxID প্রদান করুন'}
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-purple-900/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6">
          {submittedOrderId ? (
            /* Success State */
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-white">
                  অর্ডার সফলভাবে জমা হয়েছে!
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
                  আপনার পেমেন্ট ভেরিফাই করার পর ৫–১৫ মিনিটের মধ্যে ডায়মন্ড আপনার একাউন্টে পৌঁছে যাবে।
                </p>
              </div>

              {/* Order ID Box */}
              <div className="p-4 rounded-xl bg-[#080312] border border-purple-800/40 max-w-sm mx-auto">
                <div className="text-[11px] text-purple-300 uppercase font-semibold">
                  আপনার অর্ডার আইডি (Order ID)
                </div>
                <div className="text-2xl font-bold font-mono-numbers text-cyan-300 mt-1 tracking-wider">
                  {submittedOrderId}
                </div>
                <button
                  onClick={() => handleCopyOrderId(submittedOrderId)}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/50 hover:bg-purple-900 text-xs font-semibold text-purple-200 transition-colors cursor-pointer"
                >
                  {copiedOrderId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Order ID কপি করুন</span>
                    </>
                  )}
                </button>
              </div>

              {/* Summary Details */}
              <div className="text-left text-xs text-slate-300 bg-[#130a27] p-3.5 rounded-xl border border-purple-900/30 space-y-1.5 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-400">Player UID:</span>
                  <span className="font-mono-numbers font-semibold text-white">{playerUid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Package:</span>
                  <span className="font-semibold text-purple-300">{currentPkg?.nameBn} ({currentPkg?.name})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount:</span>
                  <span className="font-mono-numbers font-semibold text-white">৳ {currentPkg?.priceBdt} BDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">TrxID:</span>
                  <span className="font-mono-numbers font-semibold text-cyan-300">{trxId.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-amber-400 font-semibold">Pending (যাচাইকরণ বাকি)</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={() => {
                    handleModalClose();
                    onNavigateToTracking(submittedOrderId);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>অর্ডারের অবস্থা ট্র্যাক করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleModalClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-medium text-sm text-slate-300 transition-colors"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          ) : (
            /* Order Entry Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Security Alert Header */}
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-start gap-2.5 text-xs text-purple-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>১০০% নিরাপদ ডেলিভারি:</strong> শুধুমাত্র আপনার Player UID লাগবে। পাসওয়ার্ড বা ওটিপি কখনোই কাউকে দেবেন না।
                </div>
              </div>

              {/* 1. Free Fire Player UID & Name */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                    ১. Free Fire Player UID <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowUidGuide(!showUidGuide)}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>UID কিভাবে পাব?</span>
                  </button>
                </div>

                <input
                  type="text"
                  required
                  value={playerUid}
                  onChange={(e) => setPlayerUid(e.target.value.replace(/\s+/g, ''))}
                  placeholder="যেমন: 2847591024"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070311] border border-purple-900/60 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white font-mono-numbers text-sm placeholder:text-slate-600 focus:outline-none"
                />

                {showUidGuide && (
                  <div className="p-3 rounded-lg bg-[#140b2b] border border-purple-800/40 text-xs text-slate-300 space-y-1">
                    <p className="font-semibold text-purple-300">UID খোঁজার নিয়ম:</p>
                    <p>১. ফ্রি ফায়ার গেম ওপেন করুন।</p>
                    <p>২. উপরে বাম কোণে আপনার প্রোফাইল ব্যানারে ট্যাপ করুন।</p>
                    <p>৩. গ্যালারিতে আপনার নামের নিচে ৮–১০ সংখ্যার UID দেখতে পাবেন। পাশে কপি আইকনে ক্লিক করুন।</p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    প্লেয়ারের নাম (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="যেমন: Arafat_Boss"
                    className="w-full px-4 py-2 rounded-xl bg-[#070311] border border-purple-900/60 focus:border-purple-500 text-white text-sm placeholder:text-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* 2. Diamond Package Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                  ২. ডায়মন্ড প্যাকেজ নির্বাচন <span className="text-red-400">*</span>
                </label>
                <select
                  value={pkgId}
                  onChange={(e) => setPkgId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070311] border border-purple-900/60 focus:border-purple-500 text-white text-sm focus:outline-none"
                >
                  {packages
                    .filter((p) => p.active)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nameBn} ({p.name}) — ৳ {p.priceBdt} BDT
                      </option>
                    ))}
                </select>
              </div>

              {/* 3. Payment Method Selection (bKash / Nagad) */}
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  ৩. পেমেন্ট মেথড (সেন্ড মানি করুন) <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* bKash Radio */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isBkash
                        ? 'bg-[#1e071c] border-pink-500 shadow-md shadow-pink-950'
                        : 'bg-[#100617] border-pink-950/60 hover:border-pink-900 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-pink-400">bKash Personal</span>
                      <span className={`w-3.5 h-3.5 rounded-full border ${isBkash ? 'border-pink-500 bg-pink-500' : 'border-slate-600'}`} />
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">সেন্ড মানি অপশন</div>
                  </button>

                  {/* Nagad Radio */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nagad')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      !isBkash
                        ? 'bg-[#200d05] border-amber-500 shadow-md shadow-orange-950'
                        : 'bg-[#120803] border-amber-950/60 hover:border-amber-900 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-amber-400">Nagad Personal</span>
                      <span className={`w-3.5 h-3.5 rounded-full border ${!isBkash ? 'border-amber-500 bg-amber-500' : 'border-slate-600'}`} />
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">সেন্ড মানি অপশন</div>
                  </button>
                </div>

                {/* Selected Payment Target Account Box */}
                <div className={`mt-3 p-3 rounded-xl border flex items-center justify-between ${
                  isBkash ? 'bg-[#18081a] border-pink-900/50' : 'bg-[#1a0c05] border-amber-900/50'
                }`}>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      টাকা পাঠানোর {isBkash ? 'বিকাশ' : 'নগদ'} পার্সোনাল নম্বর:
                    </div>
                    <div className="text-base sm:text-lg font-bold font-mono-numbers text-white tracking-wider">
                      {targetNumber}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                      isBkash
                        ? 'bg-[#e2136e] hover:bg-[#c40e5d] text-white'
                        : 'bg-[#f7941d] hover:bg-[#d87c12] text-white'
                    }`}
                  >
                    {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNumber ? 'কপি হয়েছে!' : 'নম্বর কপি'}</span>
                  </button>
                </div>
              </div>

              {/* 4. Payment Amount & Transaction ID (TrxID) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                    পেমেন্ট পরিমাণ (BDT)
                  </label>
                  <div className="px-4 py-2.5 rounded-xl bg-[#070311] border border-purple-900/60 font-mono-numbers text-base font-bold text-purple-300">
                    ৳ {currentPkg ? currentPkg.priceBdt : 0} BDT
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                    Transaction ID (TrxID) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value.replace(/\s+/g, ''))}
                    placeholder="যেমন: BKA8947219"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#070311] border border-purple-900/60 focus:border-purple-500 text-white font-mono-numbers text-sm uppercase placeholder:normal-case placeholder:text-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* 5. Contact Information (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  যোগাযোগের তথ্য / হোয়াটসঅ্যাপ নম্বর (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="যেমন: 017xxxxxxxx (প্রয়োজনে আপনাকে দ্রুত মেসেজ দেওয়ার জন্য)"
                  className="w-full px-4 py-2 rounded-xl bg-[#070311] border border-purple-900/60 focus:border-purple-500 text-white text-sm placeholder:text-slate-600 focus:outline-none"
                />
              </div>

              {/* Error Message if any */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 transition-all shadow-lg shadow-purple-950 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <span>অর্ডার সাবমিট হচ্ছে...</span>
                  ) : (
                    <>
                      <span>অর্ডার সাবমিট করুন (৳ {currentPkg?.priceBdt} BDT)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
