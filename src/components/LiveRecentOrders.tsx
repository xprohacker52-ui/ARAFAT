import React from 'react';
import { ShoppingBag, CheckCircle, Clock, XCircle, ShieldCheck } from 'lucide-react';
import { Language, Order } from '../types';

interface LiveRecentOrdersProps {
  orders: Order[];
  lang: Language;
}

export const LiveRecentOrders: React.FC<LiveRecentOrdersProps> = ({ orders, lang }) => {
  // Sort latest orders
  const displayOrders = orders.slice(0, 8);

  const maskString = (str: string) => {
    if (!str || str.length <= 4) return str;
    const start = str.slice(0, 3);
    const end = str.slice(-2);
    return `${start}****${end}`;
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-600/50">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>{lang === 'bn' ? 'ডেলিভার্ড (Done)' : 'Done'}</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-950/80 text-blue-300 border border-blue-600/50">
            <Clock className="w-3 h-3 text-blue-400 animate-spin" />
            <span>{lang === 'bn' ? 'প্রসেসিং' : 'Processing'}</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-orange-950/80 text-orange-300 border border-orange-600/50">
            <XCircle className="w-3 h-3 text-orange-400" />
            <span>{lang === 'bn' ? 'বাতিল' : 'Cancelled'}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-950/80 text-amber-300 border border-amber-600/50">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{lang === 'bn' ? 'পেন্ডিং' : 'Pending'}</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="recent-orders">
      <div className="bg-[#0b061c] border border-blue-900/40 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-purple-900/40 gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>{lang === 'bn' ? 'লাইভ সাম্প্রতিক অর্ডার হিস্ট্রি' : 'Live Recent Order History'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h3>
              <p className="text-xs text-purple-200/70">
                {lang === 'bn'
                  ? 'আমাদের ওয়েবসাইটে গ্রাহকদের সাম্প্রতিক অর্ডার ও ইনস্ট্যান্ট ডেলিভারি স্ট্যাটাস'
                  : 'Real-time order transactions and instant delivery updates'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 bg-[#160b33] px-3 py-1.5 rounded-xl border border-purple-800/40 w-fit">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{orders.length} {lang === 'bn' ? 'টি সফল লেনদেন' : 'Transactions'}</span>
          </div>
        </div>

        {/* TopupPapa Style Recent Orders Feed */}
        <div className="bg-[#12082b] border border-blue-900/40 rounded-2xl p-3 sm:p-4 mb-5 space-y-2">
          <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>⚡ লাইভ ট্রানজ্যাকশন ফিড (TopupPapa Style)</span>
            <span className="text-[10px] text-emerald-400 font-mono">● Auto Updated</span>
          </div>
          {displayOrders.slice(0, 3).map((ord) => (
            <div
              key={ord.id}
              className="flex justify-between items-center py-2.5 px-3.5 bg-[#170a35]/70 hover:bg-[#1e0d44] rounded-xl border border-purple-900/30 text-xs sm:text-sm transition-colors"
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                <span className="text-slate-200 truncate">
                  <b className="text-white font-extrabold">{ord.playerName || 'Customer'}</b> -{' '}
                  <span className="text-cyan-200">{ord.packageNameBn || ord.packageName}</span>{' '}
                  {ord.playerUid ? (
                    <span className="text-slate-400 text-xs font-mono">(UID: {ord.playerUid})</span>
                  ) : (
                    ''
                  )}
                </span>
              </div>
              <span className="shrink-0 bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 px-3 py-0.5 rounded-full text-xs font-black shadow-sm">
                Done
              </span>
            </div>
          ))}
        </div>

        {/* Detailed Table of Recent Orders */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#12082b] text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3 rounded-l-xl">Order ID</th>
                <th className="py-2.5 px-3">সার্ভিস / প্যাকেজ</th>
                <th className="py-2.5 px-3">UID / Contact</th>
                <th className="py-2.5 px-3">মূল্য</th>
                <th className="py-2.5 px-3">পেমেন্ট</th>
                <th className="py-2.5 px-3">সময়</th>
                <th className="py-2.5 px-3 text-right rounded-r-xl">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/20">
              {displayOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-purple-950/20 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-cyan-300">
                    {ord.id}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-white block">
                      {ord.packageNameBn || ord.packageName}
                    </span>
                    <span className="text-[10px] text-purple-300 font-mono">
                      {ord.diamonds}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {maskString(ord.playerUid || ord.contact || 'N/A')}
                  </td>
                  <td className="py-3 px-3 font-mono font-black text-emerald-400">
                    ৳{ord.amountBdt} BDT
                  </td>
                  <td className="py-3 px-3">
                    <span className="uppercase text-[9px] font-black px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40">
                      {ord.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[10px]">
                    {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {getStatusBadge(ord.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
