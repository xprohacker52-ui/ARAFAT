import React, { useState } from 'react';
import {
  X,
  Wallet,
  Coins,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { AddMoneyRequest, Language, SiteConfig, UserWallet } from '../types';
import { BkashLogo, NagadLogo } from './BrandLogos';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  config: SiteConfig;
  wallet: UserWallet;
  requests: AddMoneyRequest[];
  onSubmitAddMoney: (request: Omit<AddMoneyRequest, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'adminNote'>) => Promise<string>;
}

export const AddMoneyModal: React.FC<AddMoneyModalProps> = ({
  isOpen,
  onClose,
  lang,
  config,
  wallet,
  requests,
  onSubmitAddMoney,
}) => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'history'>('deposit');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [amountBdt, setAmountBdt] = useState<number>(500);
  const [customAmountInput, setCustomAmountInput] = useState<string>('500');
  const [userPhone, setUserPhone] = useState<string>(wallet.phone || '');
  const [userName, setUserName] = useState<string>(wallet.name || '');
  const [senderNumber, setSenderNumber] = useState<string>('');
  const [trxId, setTrxId] = useState<string>('');
  const [copiedNumber, setCopiedNumber] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successSubmittedId, setSuccessSubmittedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickAmounts = [50, 100, 300, 500, 1000, 2000, 5000, 10000];

  const receiverNumber = paymentMethod === 'bkash' ? config.bkashNumber : config.nagadNumber;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(receiverNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleAmountQuickSelect = (amt: number) => {
    setAmountBdt(amt);
    setCustomAmountInput(amt.toString());
  };

  const handleCustomAmountChange = (val: string) => {
    setCustomAmountInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setAmountBdt(parsed);
    } else {
      setAmountBdt(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (amountBdt < 10) {
      setErrorMessage(lang === 'bn' ? 'সর্বনিম্ন ১০ টাকা অ্যাড মানি করা যাবে।' : 'Minimum deposit amount is 10 BDT.');
      return;
    }

    const cleanUserPhone = userPhone.trim();
    if (!cleanUserPhone || cleanUserPhone.length < 10) {
      setErrorMessage(lang === 'bn' ? 'সঠিক একাউন্ট মোবাইল নম্বর দিন।' : 'Please enter a valid user phone number.');
      return;
    }

    const cleanSender = senderNumber.trim() || cleanUserPhone;
    if (!cleanSender) {
      setErrorMessage(lang === 'bn' ? 'যে নম্বর থেকে টাকা পাঠিয়েছেন তা দিন।' : 'Please enter sender mobile number.');
      return;
    }

    const cleanTrx = trxId.trim();
    if (!cleanTrx || cleanTrx.length < 4) {
      setErrorMessage(lang === 'bn' ? 'সঠিক Transaction ID (TrxID) দিন।' : 'Please enter a valid Transaction ID.');
      return;
    }

    try {
      setSubmitting(true);
      const newReqId = await onSubmitAddMoney({
        userPhone: cleanUserPhone,
        userName: userName.trim() || undefined,
        amountBdt,
        paymentMethod,
        senderNumber: cleanSender,
        trxId: cleanTrx.toUpperCase(),
      });

      setSuccessSubmittedId(newReqId);
      setTrxId('');
      setSenderNumber('');
    } catch (err: any) {
      setErrorMessage(err?.message || (lang === 'bn' ? 'রিকোয়েস্ট জমা করতে সমস্যা হয়েছে।' : 'Failed to submit request.'));
    } finally {
      setSubmitting(false);
    }
  };

  const userRequests = requests.filter(
    (r) => !userPhone || r.userPhone.includes(userPhone.trim()) || userPhone.includes(r.userPhone)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 rounded-3xl bg-[#0e071f] border-2 border-purple-800/60 shadow-2xl shadow-purple-950/80 overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-purple-900/40 bg-gradient-to-r from-[#180a33] to-[#120726]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-purple-600 p-0.5 shadow-lg shadow-amber-950/50">
              <div className="w-full h-full bg-[#0d071f] rounded-[14px] flex items-center justify-center">
                <Coins className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{lang === 'bn' ? 'ব্যক্তিগত অ্যাড মানি ও সাইট ব্যালেন্স' : 'Personal Add Money & Site Balance'}</span>
              </h3>
              <p className="text-xs text-purple-300/80">
                {lang === 'bn' ? '১ টাকা = ১ AG Coin · অ্যাকাউন্ট ব্যালেন্সে তাৎক্ষণিক জমা' : '1 BDT = 1 AG Coin · Fund your account'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSuccessSubmittedId(null);
              setErrorMessage(null);
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-purple-900/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Bar */}
        <div className="p-4 bg-[#140b2a] border-b border-purple-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">
                {lang === 'bn' ? 'বর্তমান অ্যাকাউন্ট ব্যালেন্স:' : 'Current Account Balance:'}
              </span>
              <span className="text-xs text-purple-300 font-mono">
                {wallet.phone ? `${wallet.phone} (${wallet.name || 'User'})` : 'Guest Wallet'}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono flex items-baseline justify-end gap-1">
              <span>৳{wallet.balance.toLocaleString()}</span>
              <span className="text-xs text-amber-300 font-sans font-bold">AG Coins</span>
            </div>
          </div>
        </div>

        {/* Tab switch: Deposit vs History */}
        <div className="flex p-1.5 bg-[#090314] border-b border-purple-900/30 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer text-center ${
              activeTab === 'deposit'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'bn' ? 'টাকা অ্যাড করুন (Add Money Form)' : 'Deposit Funds'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'ডিপোজিট হিস্ট্রি' : 'Deposit History'}</span>
            {userRequests.filter((r) => r.status === 'pending').length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-black">
                {userRequests.filter((r) => r.status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        {activeTab === 'deposit' ? (
          <div>
            {successSubmittedId ? (
              // Success notice after submitting request
              <div className="p-6 sm:p-8 space-y-5 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60 mx-auto flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <h4 className="text-xl font-extrabold text-white">
                    {lang === 'bn' ? 'অ্যাড মানি রিকোয়েস্ট সফলভাবে জমা হয়েছে!' : 'Deposit Request Submitted!'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
                    {lang === 'bn'
                      ? 'অ্যাডমিন আপনার TrxID যাচাই করে কিছুক্ষণের মধ্যে আপনার ব্যালেন্সে টাকা যুক্ত করে দেবেন।'
                      : 'Admin will verify the TrxID and credit your site balance shortly.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#140b2a] border border-purple-800/40 text-left text-xs font-mono space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Request ID:</span>
                    <span className="text-purple-300 font-bold">{successSubmittedId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Deposit Amount:</span>
                    <span className="text-emerald-400 font-bold">৳{amountBdt} BDT ({amountBdt} AG Coins)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Method:</span>
                    <span className="text-amber-300 uppercase font-bold">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                      Pending Review
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSuccessSubmittedId(null);
                      setActiveTab('history');
                    }}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg cursor-pointer"
                  >
                    {lang === 'bn' ? 'স্ট্যাটাস চেক করুন' : 'View in History'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSuccessSubmittedId(null)}
                    className="py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-purple-950/60 text-slate-300 border border-purple-800/40 cursor-pointer"
                  >
                    {lang === 'bn' ? 'নতুন রিকোয়েস্ট' : 'New Deposit'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
                {/* 1. Payment Method Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-purple-300">
                    {lang === 'bn' ? '১. পেমেন্ট মেথড নির্বাচন করুন (Send Money)' : '1. Select Payment Method (Send Money)'}
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bkash')}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer relative overflow-hidden ${
                        paymentMethod === 'bkash'
                          ? 'bg-pink-950/80 border-pink-500 shadow-lg shadow-pink-950/60 ring-2 ring-pink-500/50'
                          : 'bg-[#120826] border-purple-900/40 hover:border-pink-800'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center shadow-sm">
                          <BkashLogo className="w-7 h-7" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-black text-white">bKash</div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E2136E] text-white">
                            Personal
                          </span>
                        </div>
                      </div>
                      <div className="text-[11px] text-pink-300 font-medium">বিকাশ সেন্ড মানি</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('nagad')}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer relative overflow-hidden ${
                        paymentMethod === 'nagad'
                          ? 'bg-amber-950/80 border-orange-500 shadow-lg shadow-amber-950/60 ring-2 ring-orange-500/50'
                          : 'bg-[#120826] border-purple-900/40 hover:border-orange-800'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f7941d] to-[#ee4036] p-0.5 flex items-center justify-center shadow-sm">
                          <NagadLogo className="w-7 h-7" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-black text-white">Nagad</div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-600 text-white">
                            Personal
                          </span>
                        </div>
                      </div>
                      <div className="text-[11px] text-amber-300 font-medium">নগদ সেন্ড মানি</div>
                    </button>
                  </div>
                </div>

                {/* Receiver Number & Copy Box */}
                <div className="p-3.5 rounded-2xl bg-[#140a28] border border-purple-800/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">
                      {paymentMethod === 'bkash' ? 'বিকাশ পার্সোনাল নম্বর:' : 'নগদ পার্সোনাল নম্বর:'}
                    </span>
                    <span className="text-[10px] text-purple-300 bg-purple-950 px-2 py-0.5 rounded-full border border-purple-800/50">
                      Send Money Only
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090314] border border-purple-900/50">
                    <span className="font-mono font-bold text-base sm:text-lg text-white tracking-wider">
                      {receiverNumber}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyNumber}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNumber ? (lang === 'bn' ? 'কপি হয়েছে' : 'Copied') : (lang === 'bn' ? 'কপি' : 'Copy')}</span>
                    </button>
                  </div>
                </div>

                {/* 2. Amount Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-purple-300">
                      {lang === 'bn' ? '২. জমার পরিমাণ নির্বাচন বা টাইপ করুন (BDT)' : '2. Deposit Amount (BDT)'}
                    </label>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      = {amountBdt.toLocaleString()} AG Coins
                    </span>
                  </div>

                  {/* Quick amount chips */}
                  <div className="grid grid-cols-4 gap-2">
                    {quickAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleAmountQuickSelect(amt)}
                        className={`py-2 px-1 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                          amountBdt === amt
                            ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                            : 'bg-[#120826] border-purple-900/40 text-slate-300 hover:border-purple-700'
                        }`}
                      >
                        ৳{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount Input */}
                  <div className="pt-1">
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-purple-400 text-sm">
                        ৳
                      </span>
                      <input
                        type="number"
                        min={10}
                        max={100000}
                        value={customAmountInput}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        placeholder="কাস্টম টাকার পরিমাণ লিখুন..."
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#090312] border border-purple-900/60 font-mono font-bold text-white text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. User Phone & Sender Details */}
                <div className="space-y-3 pt-2 border-t border-purple-900/30">
                  <label className="block text-xs font-bold uppercase tracking-wider text-purple-300">
                    {lang === 'bn' ? '৩. আপনার তথ্য ও পেমেন্ট TrxID' : '3. Account & Payment Details'}
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        {lang === 'bn' ? 'আপনার মোবাইল নম্বর (যে অ্যাকাউন্টে ব্যালেন্স যোগ হবে) *' : 'Account Phone Number *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        placeholder="017xxxxxxxx"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#090312] border border-purple-900/60 font-mono text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        {lang === 'bn' ? 'আপনার নাম (ঐচ্ছিক)' : 'Your Name (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="e.g. Tanvir Hossain"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#090312] border border-purple-900/60 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        {lang === 'bn' ? 'যে নম্বর থেকে টাকা পাঠিয়েছেন (Sender Number) *' : 'Sender Mobile Number *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        placeholder={userPhone || '017xxxxxxxx'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#090312] border border-purple-900/60 font-mono text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        {lang === 'bn' ? 'Transaction ID (TrxID) *' : 'Transaction ID (TrxID) *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder={paymentMethod === 'bkash' ? 'BKH89C712X' : '72KSL9284'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#090312] border border-purple-900/60 font-mono text-white text-xs sm:text-sm uppercase tracking-wider placeholder-slate-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Error */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-emerald-600 to-purple-600 hover:opacity-95 text-white shadow-xl shadow-purple-950 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{lang === 'bn' ? 'রিকোয়েস্ট জমা হচ্ছে...' : 'Submitting Request...'}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-white" />
                      <span>
                        {lang === 'bn'
                          ? `অ্যাড মানি রিকোয়েস্ট জমা দিন (৳${amountBdt.toLocaleString()} BDT)`
                          : `Submit Add Money Request (৳${amountBdt.toLocaleString()} BDT)`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        ) : (
          // ================= HISTORY TAB =================
          <div className="p-5 sm:p-6 space-y-4 max-h-[460px] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-purple-900/30">
              <span className="text-xs font-bold text-purple-300 uppercase">
                {lang === 'bn' ? 'আমার ডিপোজিট রিকোয়েস্ট তালিকা' : 'My Deposit Requests'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {userRequests.length} {lang === 'bn' ? 'টি রিকোয়েস্ট' : 'records'}
              </span>
            </div>

            {userRequests.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                <Coins className="w-10 h-10 mx-auto text-purple-400 opacity-60" />
                <p>{lang === 'bn' ? 'কোনো অ্যাড মানি রিকোয়েস্ট পাওয়া যায়নি।' : 'No deposit requests found yet.'}</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('deposit')}
                  className="px-4 py-2 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  {lang === 'bn' ? 'প্রথম ডিপোজিট করুন' : 'Make First Deposit'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {userRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-2xl bg-[#120826] border border-purple-900/40 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-purple-300">{req.id}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(req.createdAt).toLocaleDateString()} · {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          req.status === 'approved'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                            : req.status === 'rejected'
                            ? 'bg-rose-950 text-rose-300 border border-rose-700/60'
                            : 'bg-amber-950 text-amber-300 border border-amber-700/60 animate-pulse'
                        }`}
                      >
                        {req.status === 'approved' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        {req.status === 'rejected' && <XCircle className="w-3 h-3 text-rose-400" />}
                        {req.status === 'pending' && <Clock className="w-3 h-3 text-amber-400" />}
                        <span>
                          {req.status === 'approved'
                            ? (lang === 'bn' ? 'অনুমোদিত' : 'Approved')
                            : req.status === 'rejected'
                            ? (lang === 'bn' ? 'বাতিল' : 'Rejected')
                            : (lang === 'bn' ? 'পেন্ডিং' : 'Pending')}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-purple-900/30">
                      <div>
                        <span className="text-slate-400 text-[11px] block">{req.paymentMethod.toUpperCase()} TrxID:</span>
                        <span className="font-mono font-bold text-white">{req.trxId}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-slate-400 text-[11px] block">{lang === 'bn' ? 'টাকার পরিমাণ:' : 'Amount:'}</span>
                        <span className="text-sm font-extrabold text-emerald-400 font-mono">
                          ৳{req.amountBdt.toLocaleString()} BDT
                        </span>
                      </div>
                    </div>

                    {req.adminNote && (
                      <div className="p-2 rounded-lg bg-black/40 text-[11px] text-purple-200 border border-purple-900/30">
                        <span className="text-slate-400 font-semibold">{lang === 'bn' ? 'অ্যাডমিন নোট: ' : 'Admin Note: '}</span>
                        {req.adminNote}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
