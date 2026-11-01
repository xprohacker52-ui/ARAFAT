import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  MessageCircle,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Ban,
  Wallet,
  History,
  AlertCircle,
} from 'lucide-react';
import { Language, Order, OrderStatus, SiteConfig } from '../types';
import { translations } from '../data/translations';

interface OrderTrackerProps {
  orders: Order[];
  lang: Language;
  config: SiteConfig;
  initialSearchId?: string;
  onCancelOrder?: (orderId: string) => Promise<boolean> | boolean;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  orders,
  lang,
  config,
  initialSearchId = '',
  onCancelOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'track' | 'history'>('track');
  const [searchTerm, setSearchTerm] = useState(initialSearchId);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    if (initialSearchId) {
      setSearchTerm(initialSearchId);
      handleSearch(initialSearchId);
    }
  }, [initialSearchId]);

  // Keep searchedOrder updated if orders state changes
  useEffect(() => {
    if (searchedOrder) {
      const updated = orders.find((o) => o.id === searchedOrder.id);
      if (updated && updated.status !== searchedOrder.status) {
        setSearchedOrder(updated);
      }
    }
  }, [orders, searchedOrder]);

  const handleSearch = (termToSearch?: string) => {
    const query = (termToSearch !== undefined ? termToSearch : searchTerm).trim().toLowerCase();
    if (!query) {
      setSearchedOrder(null);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    // Search by Order ID or Player UID or TrxID
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === query ||
        o.playerUid.toLowerCase() === query ||
        o.trxId.toLowerCase() === query
    );

    setSearchedOrder(found || null);
    setActiveTab('track');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleConfirmCancel = async () => {
    if (!orderToCancel || !onCancelOrder) return;
    try {
      setCancelling(true);
      const success = await onCancelOrder(orderToCancel.id);
      if (success && searchedOrder?.id === orderToCancel.id) {
        setSearchedOrder((prev) => (prev ? { ...prev, status: 'cancelled' } : null));
      }
      setOrderToCancel(null);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: lang === 'bn' ? 'যাচাইকরণ বাকি (Pending)' : 'Pending Verification',
          color: 'text-amber-400 bg-amber-950/50 border-amber-800/60',
          icon: <Clock className="w-4 h-4 text-amber-400" />,
          desc: t.statusPendingDesc,
        };
      case 'processing':
        return {
          label: lang === 'bn' ? 'প্রসেসিং চলছে (Processing)' : 'Processing',
          color: 'text-cyan-400 bg-cyan-950/50 border-cyan-800/60',
          icon: <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />,
          desc: t.statusProcessingDesc,
        };
      case 'completed':
        return {
          label: lang === 'bn' ? 'সম্পন্ন হয়েছে (Completed)' : 'Completed',
          color: 'text-emerald-400 bg-emerald-950/50 border-emerald-800/60',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          desc: t.statusCompletedDesc,
        };
      case 'cancelled':
        return {
          label: lang === 'bn' ? 'অর্ডার বাতিল (Cancelled)' : 'Cancelled',
          color: 'text-orange-400 bg-orange-950/50 border-orange-800/60',
          icon: <XCircle className="w-4 h-4 text-orange-400" />,
          desc: t.statusCancelledDesc || (lang === 'bn' ? 'অর্ডারটি বাতিল করা হয়েছে। ওয়ালেটের টাকা স্বয়ংক্রিয়ভাবে রিফান্ড হয়েছে।' : 'Order was cancelled and refunded if paid via site balance.'),
        };
      case 'rejected':
      default:
        return {
          label: lang === 'bn' ? 'বাতিল হয়েছে (Rejected)' : 'Rejected',
          color: 'text-red-400 bg-red-950/50 border-red-800/60',
          icon: <XCircle className="w-4 h-4 text-red-400" />,
          desc: t.statusRejectedDesc,
        };
    }
  };

  return (
    <section id="track-order" className="py-12 md:py-16 bg-[#0a0517]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <div className="text-xs uppercase tracking-wider font-semibold text-purple-400 mb-1">
            Real-Time Tracking & History
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.trackSectionTitle}
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-xl mx-auto">
            {t.trackSectionSub}
          </p>
        </div>

        {/* View Toggle Bar (Live Search vs Order History) */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 rounded-xl bg-[#120826] border border-purple-900/50">
            <button
              type="button"
              onClick={() => setActiveTab('track')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'track'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Track Order'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>
                {lang === 'bn' ? 'অর্ডার হিস্ট্রি' : 'Order History'} ({orders.length})
              </span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* VIEW 1: SEARCH & TRACK */}
        {/* ============================================================== */}
        {activeTab === 'track' && (
          <div>
            {/* Search Bar */}
            <div className="p-2 sm:p-3 rounded-2xl bg-[#110924] border border-purple-800/40 shadow-xl flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={t.trackInputPlaceholder}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#080312] border border-purple-900/50 text-white text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>
              <button
                onClick={() => handleSearch()}
                className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-purple-600 hover:bg-purple-500 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.btnTrack}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Search Results Display */}
            {hasSearched && !searchedOrder && (
              <div className="mt-8 p-6 rounded-2xl bg-[#130a27] border border-purple-900/40 text-center">
                <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                <h3 className="text-base font-bold text-white">{t.trackNotFound}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'bn'
                    ? 'অনুগ্রহ করে নিশ্চিত করুন আপনি সঠিক Order ID বা Player UID লিখেছেন।'
                    : 'Please make sure you entered the correct Order ID or Player UID.'}
                </p>
              </div>
            )}

            <AnimatePresence mode="wait">
              {searchedOrder && (
                <motion.div
                  key={`${searchedOrder.id}-${searchedOrder.status}`}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={`mt-8 rounded-2xl bg-[#130a27] border p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden ${
                    searchedOrder.status === 'completed'
                      ? 'border-emerald-500/50 shadow-emerald-950/40'
                      : searchedOrder.status === 'processing'
                      ? 'border-cyan-500/40 shadow-cyan-950/30'
                      : searchedOrder.status === 'cancelled'
                      ? 'border-orange-500/40 shadow-orange-950/30'
                      : searchedOrder.status === 'rejected'
                      ? 'border-red-500/40 shadow-red-950/30'
                      : 'border-purple-800/40'
                  }`}
                >
                  {/* Subtle dynamic glow shimmer for completed orders */}
                  {searchedOrder.status === 'completed' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"
                    />
                  )}

                  {/* Top Row: Order ID, Status & Cancellation Trigger */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-900/40">
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Order Reference</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-2xl font-extrabold font-mono text-white">
                          {searchedOrder.id}
                        </span>
                        <button
                          onClick={() => handleCopy(searchedOrder.id)}
                          className="p-1 rounded bg-purple-900/40 text-purple-300 hover:text-white transition-colors cursor-pointer"
                          title="Copy Order ID"
                        >
                          {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {new Date(searchedOrder.createdAt).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                      {/* Status Pill */}
                      {(() => {
                        const s = getStatusBadge(searchedOrder.status);
                        return (
                          <motion.div
                            key={searchedOrder.status}
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          >
                            <div className={`px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 ${s.color}`}>
                              {s.icon}
                              <span>{s.label}</span>
                            </div>
                          </motion.div>
                        );
                      })()}

                      {/* Cancel Order Button for Pending Orders */}
                      {searchedOrder.status === 'pending' && onCancelOrder && (
                        <button
                          type="button"
                          onClick={() => setOrderToCancel(searchedOrder)}
                          className="px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5 text-rose-400" />
                          <span>{lang === 'bn' ? 'অর্ডার বাতিল করুন' : 'Cancel Order'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Stepper Pipeline Visual */}
                  {searchedOrder.status !== 'rejected' && searchedOrder.status !== 'cancelled' ? (
                    <div className="py-2">
                      <div className="grid grid-cols-3 gap-2 relative text-center">
                        {/* Step 1: Pending */}
                        <div className="space-y-1.5">
                          <div className="w-8 h-8 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center text-xs font-bold">
                            ✓
                          </div>
                          <div className="text-xs font-semibold text-white">১. অর্ডার গ্রহণ</div>
                          <div className="text-[10px] text-slate-400 hidden sm:block">পেমেন্ট রিসিভড</div>
                        </div>

                        {/* Step 2: Processing */}
                        <div className="space-y-1.5">
                          <div
                            className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                              searchedOrder.status === 'processing' || searchedOrder.status === 'completed'
                                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                                : 'bg-slate-800 border-slate-700 text-slate-500'
                            }`}
                          >
                            {searchedOrder.status === 'completed' ? '✓' : '২'}
                          </div>
                          <div className="text-xs font-semibold text-white">২. ভেরিফিকেশন ও ডেলিভারি</div>
                          <div className="text-[10px] text-slate-400 hidden sm:block">ইন-গেম টপ-আপ</div>
                        </div>

                        {/* Step 3: Completed */}
                        <div className="space-y-1.5">
                          {searchedOrder.status === 'completed' ? (
                            <motion.div
                              initial={{ scale: 0.6, rotate: -20 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                              className="w-8 h-8 mx-auto rounded-full bg-emerald-500/25 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center text-xs font-bold shadow-lg shadow-emerald-500/20"
                            >
                              ✓
                            </motion.div>
                          ) : (
                            <div className="w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold border-2 bg-slate-800 border-slate-700 text-slate-500">
                              ৩
                            </div>
                          )}
                          <div className="text-xs font-semibold text-white">৩. সফল ডেলিভারি</div>
                          <div className="text-[10px] text-slate-400 hidden sm:block">ডায়মন্ড ক্রেডিট</div>
                        </div>
                      </div>
                    </div>
                  ) : searchedOrder.status === 'cancelled' ? (
                    <div className="p-4 rounded-xl bg-orange-950/40 border border-orange-800/50 text-xs text-orange-200 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-orange-300">
                        <XCircle className="w-4 h-4 text-orange-400" />
                        <span>অর্ডারটি বাতিল (Cancelled) করা হয়েছে।</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">
                        {searchedOrder.paymentMethod === 'wallet'
                          ? `💰 AG Coins ব্যালেন্সের মাধ্যমে পেমেন্ট করায় ৳${searchedOrder.amountBdt} BDT সরাসরি আপনার ওয়ালেটে রিফান্ড করা হয়েছে।`
                          : 'অর্ডারটি সফলভাবে বাতিল তালিকায় রয়েছে।'}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-xs text-red-200">
                      <strong>অর্ডার স্ট্যাটাস:</strong> এই অর্ডারটি অ্যাডমিন বাতিল করেছেন। সাধারণত ভুল Transaction ID অথবা অমিল পরিমাণের কারণে এমন হয়।
                    </div>
                  )}

                  {/* Status Detailed Explanation */}
                  {searchedOrder.status === 'completed' ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.3 }}
                      className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs sm:text-sm text-emerald-200"
                    >
                      <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm mb-1">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>ডেলিভারি সফল হয়েছে!</span>
                      </div>
                      <div>{getStatusBadge(searchedOrder.status).desc}</div>
                      {searchedOrder.adminNote && (
                        <div className="mt-2.5 pt-2 border-t border-emerald-900/60 text-emerald-300">
                          <strong>অ্যাডমিন নোট:</strong> {searchedOrder.adminNote}
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="p-4 rounded-xl bg-[#090414] border border-purple-900/30 text-xs sm:text-sm text-slate-300">
                      <span className="font-semibold text-purple-300">বর্তমান অবস্থা: </span>
                      {getStatusBadge(searchedOrder.status).desc}
                      {searchedOrder.adminNote && (
                        <div className="mt-2.5 pt-2 border-t border-purple-950 text-cyan-300">
                          <strong>অ্যাডমিন নোট:</strong> {searchedOrder.adminNote}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Receipt Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs">
                    <div className="p-3 rounded-xl bg-[#0b0518] border border-purple-950">
                      <span className="text-slate-400">
                        {searchedOrder.serviceType === 'facebook_followers'
                          ? (lang === 'bn' ? 'ফেসবুক লিংক' : 'Facebook Link')
                          : searchedOrder.serviceType === 'streaming_subscription'
                          ? (lang === 'bn' ? 'ডেলিভারি ইমেইল' : 'Delivery Email')
                          : 'Player UID'}
                      </span>
                      <div className="font-bold text-white font-mono mt-0.5 truncate" title={searchedOrder.playerUid}>
                        {searchedOrder.playerUid}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0b0518] border border-purple-950">
                      <span className="text-slate-400">{lang === 'bn' ? 'প্যাকেজ / সার্ভিস' : 'Package / Service'}</span>
                      <div className="font-bold text-purple-300 mt-0.5 truncate">{searchedOrder.packageNameBn || searchedOrder.packageName}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0b0518] border border-purple-950">
                      <span className="text-slate-400">{lang === 'bn' ? 'টাকা ও মাধ্যম' : 'Amount & Method'}</span>
                      <div className="font-bold text-white mt-0.5 uppercase">
                        ৳{searchedOrder.amountBdt} ({searchedOrder.paymentMethod})
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0b0518] border border-purple-950">
                      <span className="text-slate-400">Transaction ID</span>
                      <div className="font-bold text-cyan-300 font-mono mt-0.5 truncate" title={searchedOrder.trxId}>
                        {searchedOrder.trxId}
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Support CTA & Cancel Option */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0d071f] p-4 rounded-xl border border-purple-900/30">
                    <div className="text-xs text-slate-300 text-center sm:text-left">
                      {searchedOrder.status === 'pending'
                        ? (lang === 'bn' ? 'ভুল অর্ডারের ক্ষেত্রে আপনি সরাসরি বাতিল করতে পারেন অথবা হোয়াটসঅ্যাপে যোগাযোগ করতে পারেন।' : 'You can cancel a pending order or contact WhatsApp support.')
                        : (lang === 'bn' ? 'অর্ডার নিয়ে কোনো জিজ্ঞাসা বা বিলম্ব হচ্ছে? সরাসরি আমাদের হোয়াটসঅ্যাপে জানান।' : 'Any query or delay regarding your order? Contact our WhatsApp team.')}
                    </div>

                    <div className="flex items-center gap-2">
                      {searchedOrder.status === 'pending' && onCancelOrder && (
                        <button
                          type="button"
                          onClick={() => setOrderToCancel(searchedOrder)}
                          className="px-3.5 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5 text-rose-400" />
                          <span>{lang === 'bn' ? 'অর্ডার বাতিল' : 'Cancel'}</span>
                        </button>
                      )}

                      <a
                        href={`https://wa.me/88${config.whatsappNumber}?text=${encodeURIComponent(
                          `Hello Arafat Gaming, my Order ID is ${searchedOrder.id} (${searchedOrder.packageName}). Please check my order status.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>হোয়াটসঅ্যাপে যোগাযোগ</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: RECENT ORDERS & HISTORY (WITH CANCEL ACTION) */}
        {/* ============================================================== */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs bg-[#0f0720] rounded-2xl border border-purple-900/40 p-6 space-y-2">
                <History className="w-10 h-10 mx-auto text-purple-400 opacity-60" />
                <p>{lang === 'bn' ? 'এখনো কোনো অর্ডার সম্পন্ন বা প্রক্রিয়াধীন নেই।' : 'No orders found in history.'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => {
                  const s = getStatusBadge(ord.status);
                  const isPending = ord.status === 'pending';
                  const isCancelled = ord.status === 'cancelled';
                  const isWallet = ord.paymentMethod === 'wallet';

                  return (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl bg-[#110924] border border-purple-900/40 hover:border-purple-800/80 transition-all space-y-3 shadow-lg"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white text-base">
                              {ord.id}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-md border text-[11px] font-bold flex items-center gap-1.5 ${s.color}`}>
                              {s.icon}
                              <span>{s.label}</span>
                            </span>
                            {isWallet && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-950/70 text-amber-300 border border-amber-800/40 text-[10px] font-bold flex items-center gap-1">
                                <Wallet className="w-3 h-3 text-amber-400" />
                                <span>AG Coins</span>
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {new Date(ord.createdAt).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {isPending && onCancelOrder && (
                            <button
                              type="button"
                              onClick={() => setOrderToCancel(ord)}
                              className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Ban className="w-3.5 h-3.5 text-rose-400" />
                              <span>{lang === 'bn' ? 'অর্ডার বাতিল করুন' : 'Cancel Order'}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setSearchTerm(ord.id);
                              handleSearch(ord.id);
                              setActiveTab('track');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-800 text-purple-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Search className="w-3.5 h-3.5 text-purple-400" />
                            <span>{lang === 'bn' ? 'ট্র্যাক করুন' : 'Track'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Summary details */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-purple-950 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">প্যাকেজ</span>
                          <span className="font-bold text-purple-300">{ord.packageNameBn || ord.packageName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">টার্গেট / UID</span>
                          <span className="font-mono text-white truncate block">{ord.playerUid}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">মূল্য ও মাধ্যম</span>
                          <span className="font-bold text-emerald-400 font-mono">
                            ৳{ord.amountBdt} ({ord.paymentMethod})
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">TrxID</span>
                          <span className="font-mono text-cyan-300 truncate block">{ord.trxId}</span>
                        </div>
                      </div>

                      {/* Refund notice for cancelled wallet order */}
                      {isCancelled && isWallet && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>
                            {lang === 'bn'
                              ? `৳${ord.amountBdt} BDT সরাসরি আপনার সাইট ব্যালেন্সে রিফান্ড হয়েছে।`
                              : `৳${ord.amountBdt} BDT was refunded to your AG balance.`}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* QUICK CONFIRMATION CANCELLATION MODAL */}
      {/* ============================================================== */}
      {orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in font-sans">
          <div className="w-full max-w-md bg-[#13082a] border-2 border-rose-800/70 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400 shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {lang === 'bn' ? 'অর্ডার বাতিল নিশ্চিতকরণ' : 'Confirm Order Cancellation'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'bn' ? 'আপনি কি সত্যিই এই অর্ডারটি বাতিল করতে চান?' : 'Are you sure you want to cancel this order?'}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090314] border border-purple-900/50 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-mono font-bold text-cyan-300">{orderToCancel.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">প্যাকেজ:</span>
                <span className="font-bold text-white">{orderToCancel.packageNameBn || orderToCancel.packageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">মূল্য:</span>
                <span className="font-mono font-bold text-emerald-400">৳{orderToCancel.amountBdt} BDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">পেমেন্ট মেথড:</span>
                <span className="font-bold uppercase text-purple-300">{orderToCancel.paymentMethod}</span>
              </div>
            </div>

            {orderToCancel.paymentMethod === 'wallet' ? (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-700/60 text-xs text-emerald-200 flex items-start gap-2">
                <Wallet className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>অটোমেটিক ওয়ালেট রিফান্ড:</strong>
                  <div className="text-[11px] text-emerald-300 mt-0.5">
                    যেহেতু এই অর্ডারটি AG Coins অ্যাকাউন্ট ব্যালেন্স দিয়ে দেওয়া হয়েছিল, তাই বাতিল করার সাথে সাথে পুরো <strong>৳{orderToCancel.amountBdt}</strong> আপনার ব্যালেন্সে স্বয়ংক্রিয়ভাবে যোগ হয়ে যাবে।
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300">
                অর্ডারটি বাতিল করলে অ্যাডমিন আর প্রসেস করবেন না।
              </div>
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                disabled={cancelling}
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-rose-950 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {cancelling ? (
                  <span>বাতিল হচ্ছে...</span>
                ) : (
                  <>
                    <Ban className="w-4 h-4" />
                    <span>হ্যাঁ, বাতিল নিশ্চিত করুন</span>
                  </>
                )}
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={() => setOrderToCancel(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
              >
                না, পিছনে যান
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
