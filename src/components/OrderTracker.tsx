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
} from 'lucide-react';
import { Language, Order, OrderStatus, SiteConfig } from '../types';
import { translations } from '../data/translations';

interface OrderTrackerProps {
  orders: Order[];
  lang: Language;
  config: SiteConfig;
  initialSearchId?: string;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  orders,
  lang,
  config,
  initialSearchId = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchId);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    if (initialSearchId) {
      setSearchTerm(initialSearchId);
      handleSearch(initialSearchId);
    }
  }, [initialSearchId]);

  const handleSearch = (termToSearch?: string) => {
    const query = (termToSearch !== undefined ? termToSearch : searchTerm).trim().toLowerCase();
    if (!query) {
      setSearchedOrder(null);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    // Search by Order ID or Player UID
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === query ||
        o.playerUid.toLowerCase() === query ||
        o.trxId.toLowerCase() === query
    );

    setSearchedOrder(found || null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
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
      case 'rejected':
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
        <div className="text-center mb-8">
          <div className="text-xs uppercase tracking-wider font-semibold text-purple-400 mb-1">
            Real-Time Tracking
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.trackSectionTitle}
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-xl mx-auto">
            {t.trackSectionSub}
          </p>
        </div>

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

              {/* Top Row: Order ID & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-900/40">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Order Reference</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-2xl font-extrabold font-mono-numbers text-white">
                      {searchedOrder.id}
                    </span>
                    <button
                      onClick={() => handleCopy(searchedOrder.id)}
                      className="p-1 rounded bg-purple-900/40 text-purple-300 hover:text-white transition-colors"
                      title="Copy Order ID"
                    >
                      {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {new Date(searchedOrder.createdAt).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}
                  </div>
                </div>

                {/* Status Pill with motion bounce when status changes */}
                {(() => {
                  const s = getStatusBadge(searchedOrder.status);
                  return (
                    <motion.div
                      key={searchedOrder.status}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="self-start sm:self-auto"
                    >
                      <div className={`px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 ${s.color}`}>
                        {s.icon}
                        <span>{s.label}</span>
                      </div>
                    </motion.div>
                  );
                })()}
              </div>

              {/* Stepper Pipeline Visual */}
              {searchedOrder.status !== 'rejected' ? (
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

                    {/* Step 3: Completed with motion pulse when completed */}
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
              ) : (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-xs text-red-200">
                  <strong>অর্ডার স্ট্যাটাস:</strong> এই অর্ডারটি অ্যাডমিন বাতিল করেছেন। সাধারণত ভুল Transaction ID অথবা অমিল পরিমাণের কারণে এমন হয়।
                </div>
              )}

              {/* Status Detailed Explanation - Special energetic celebration banner when completed */}
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
                  <div className="font-bold text-white font-mono-numbers mt-0.5 truncate" title={searchedOrder.playerUid}>
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
                  <div className="font-bold text-cyan-300 font-mono-numbers mt-0.5 truncate" title={searchedOrder.trxId}>
                    {searchedOrder.trxId}
                  </div>
                </div>
              </div>

              {/* WhatsApp Support CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0d071f] p-4 rounded-xl border border-purple-900/30">
                <div className="text-xs text-slate-300 text-center sm:text-left">
                  {lang === 'bn'
                    ? 'অর্ডার নিয়ে কোনো জিজ্ঞাসা বা বিলম্ব হচ্ছে? সরাসরি আমাদের হোয়াটসঅ্যাপে জানান।'
                    : 'Any query or delay regarding your order? Contact our WhatsApp support team.'}
                </div>
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
