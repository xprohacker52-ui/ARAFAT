import React, { useState } from 'react';
import {
  Shield,
  Lock,
  LogOut,
  Package,
  ListOrdered,
  Settings,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Search,
  Plus,
  Trash2,
  Edit2,
  Save,
  Copy,
  Check,
  MessageCircle,
  AlertCircle,
  DollarSign,
} from 'lucide-react';
import { DiamondPackage, Language, Order, OrderStatus, SiteConfig } from '../types';
import { translations } from '../data/translations';

interface AdminPanelProps {
  orders: Order[];
  packages: DiamondPackage[];
  config: SiteConfig;
  lang: Language;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  onUpdatePackage: (pkg: DiamondPackage) => void;
  onAddPackage: (pkg: Omit<DiamondPackage, 'id'>) => void;
  onDeletePackage: (id: string) => void;
  onUpdateConfig: (newConfig: Partial<SiteConfig>) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  orders,
  packages,
  config,
  lang,
  onUpdateOrderStatus,
  onUpdatePackage,
  onAddPackage,
  onDeletePackage,
  onUpdateConfig,
  onClose,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'packages' | 'settings'>('orders');

  // Order filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingNote, setEditingNote] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Package editor state
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);
  const [pkgName, setPkgName] = useState('');
  const [pkgNameBn, setPkgNameBn] = useState('');
  const [pkgDiamonds, setPkgDiamonds] = useState<string | number>('');
  const [pkgPrice, setPkgPrice] = useState<number>(0);
  const [pkgCategory, setPkgCategory] = useState<'diamond' | 'membership' | 'special'>('diamond');
  const [pkgBadge, setPkgBadge] = useState('');
  const [showAddPkgModal, setShowAddPkgModal] = useState(false);

  // Settings state
  const [editBkash, setEditBkash] = useState(config.bkashNumber);
  const [editNagad, setEditNagad] = useState(config.nagadNumber);
  const [editWhatsapp, setEditWhatsapp] = useState(config.whatsappNumber);
  const [editNoticeBn, setEditNoticeBn] = useState(config.noticeBn);
  const [editNoticeEn, setEditNoticeEn] = useState(config.noticeEn);
  const [editAdminPin, setEditAdminPin] = useState(config.adminPin);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const t = translations[lang];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === config.adminPin) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // KPI Computations
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const processingOrders = orders.filter((o) => o.status === 'processing').length;
  const completedOrders = orders.filter((o) => o.status === 'completed').length;
  const totalRevenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + (o.amountBdt || 0), 0);

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.playerUid.toLowerCase().includes(q) ||
        order.trxId.toLowerCase().includes(q) ||
        (order.playerName && order.playerName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      bkashNumber: editBkash.trim(),
      nagadNumber: editNagad.trim(),
      whatsappNumber: editWhatsapp.trim(),
      noticeBn: editNoticeBn.trim(),
      noticeEn: editNoticeEn.trim(),
      adminPin: editAdminPin.trim() || config.adminPin,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const startEditPackage = (pkg: DiamondPackage) => {
    setEditingPkgId(pkg.id);
    setPkgName(pkg.name);
    setPkgNameBn(pkg.nameBn);
    setPkgDiamonds(pkg.diamonds);
    setPkgPrice(pkg.priceBdt);
    setPkgCategory(pkg.category);
    setPkgBadge(pkg.badge || '');
  };

  const handleSaveEditPackage = () => {
    if (!editingPkgId) return;
    const existing = packages.find((p) => p.id === editingPkgId);
    if (!existing) return;

    onUpdatePackage({
      ...existing,
      name: pkgName,
      nameBn: pkgNameBn,
      diamonds: pkgDiamonds,
      priceBdt: Number(pkgPrice),
      category: pkgCategory,
      badge: pkgBadge || undefined,
    });
    setEditingPkgId(null);
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPackage({
      name: pkgName || `${pkgDiamonds} Diamonds`,
      nameBn: pkgNameBn || `${pkgDiamonds} ডায়মন্ড`,
      diamonds: pkgDiamonds,
      priceBdt: Number(pkgPrice),
      category: pkgCategory,
      badge: pkgBadge || undefined,
      active: true,
    });
    setShowAddPkgModal(false);
    setPkgName('');
    setPkgNameBn('');
    setPkgDiamonds('');
    setPkgPrice(0);
    setPkgBadge('');
  };

  // If not logged in, show PIN login screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div className="relative w-full max-w-md rounded-2xl bg-[#0f0722] border border-purple-800/60 p-6 sm:p-8 shadow-2xl text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white"
          >
            ✕
          </button>

          <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-950/60 border border-purple-800 flex items-center justify-center text-purple-400 mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-extrabold text-white">
            অ্যাডমিন প্যানেল লগইন
          </h3>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            প্যাকেজের দাম, পেমেন্ট নম্বর ও নতুন অর্ডার দেখতে অ্যাডমিন পিন দিন।
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="পিন লিখুন (ডিফল্ট: arafat786)"
                className="w-full px-4 py-3 rounded-xl bg-[#080313] border border-purple-900 focus:border-purple-500 text-center font-mono-numbers text-lg text-white tracking-widest focus:outline-none"
                autoFocus
              />
              {pinError && (
                <div className="text-xs text-red-400 mt-2">
                  ভুল পিন দিয়েছেন! অনুগ্রহ করে সঠিক পিন দিন (ডিফল্ট: arafat786)।
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-sm text-white shadow-lg transition-all cursor-pointer"
            >
              প্রবেশ করুন (Login)
            </button>
          </form>

          <div className="mt-4 text-[11px] text-slate-500">
            ARAFAT GAMING · Security Protected Admin System
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-hidden">
      <div className="w-full max-w-6xl h-[92vh] rounded-2xl bg-[#0b0518] border border-purple-800/60 shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-purple-900/50 bg-[#120826]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white tracking-wide">
                ARAFAT GAMING — অ্যাডমিন প্যানেল
              </div>
              <div className="text-[11px] text-purple-300">
                প্যাকেজ, অর্ডার ও পেমেন্ট নম্বর কন্ট্রোল
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-purple-900/30 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-[#0e0720] border-b border-purple-900/40 text-xs">
          <div className="p-3 rounded-xl bg-[#140b2b] border border-purple-900/50">
            <div className="text-slate-400 font-medium">{t.adminStatsOrders}</div>
            <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-white mt-0.5">
              {totalOrders}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#140b2b] border border-purple-900/50">
            <div className="text-amber-400 font-medium">পেন্ডিং অর্ডার</div>
            <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-amber-300 mt-0.5">
              {pendingOrders}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#140b2b] border border-purple-900/50">
            <div className="text-emerald-400 font-medium">সম্পন্ন অর্ডার</div>
            <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-emerald-300 mt-0.5">
              {completedOrders}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#140b2b] border border-purple-900/50">
            <div className="text-cyan-400 font-medium">{t.adminStatsRevenue}</div>
            <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-cyan-300 mt-0.5">
              ৳ {totalRevenue} BDT
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-purple-900/40 px-4 bg-[#0d061e] gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'orders'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>অর্ডার তালিকা ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'packages'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>ডায়মন্ড প্যাকেজ ({packages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'settings'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>পেমেন্ট নম্বর ও সেটিংস</span>
          </button>
        </div>

        {/* Tab Contents Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a0416]">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Order ID, UID বা TrxID দিয়ে খুঁজুন..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#120827] border border-purple-900/50 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-1 bg-[#120827] p-1 rounded-xl border border-purple-900/40 overflow-x-auto">
                  {['all', 'pending', 'processing', 'completed', 'rejected'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap cursor-pointer ${
                        statusFilter === st
                          ? 'bg-purple-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st === 'all'
                        ? 'সকল'
                        : st === 'pending'
                        ? 'পেন্ডিং'
                        : st === 'processing'
                        ? 'প্রসেসিং'
                        : st === 'completed'
                        ? 'সম্পন্ন'
                        : 'বাতিল'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="rounded-2xl border border-purple-900/40 overflow-hidden bg-[#100722]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#150a2e] text-slate-400 uppercase tracking-wider border-b border-purple-900/40">
                      <tr>
                        <th className="py-3 px-4">Order ID & Date</th>
                        <th className="py-3 px-4">Player UID</th>
                        <th className="py-3 px-4">Package</th>
                        <th className="py-3 px-4">Amount & Method</th>
                        <th className="py-3 px-4">Transaction ID</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-900/30">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-slate-500">
                            কোনো অর্ডার পাওয়া যায়নি
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => {
                          return (
                            <tr key={order.id} className="hover:bg-purple-950/30 transition-colors">
                              <td className="py-3 px-4 whitespace-nowrap">
                                <div className="font-bold font-mono-numbers text-white flex items-center gap-1">
                                  <span>{order.id}</span>
                                  <button
                                    onClick={() => handleCopy(order.id, `order-${order.id}`)}
                                    className="text-slate-400 hover:text-white"
                                  >
                                    {copiedKey === `order-${order.id}` ? (
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                              </td>

                              <td className="py-3 px-4 whitespace-nowrap">
                                <div className="font-mono-numbers font-bold text-cyan-300 flex items-center gap-1">
                                  <span>{order.playerUid}</span>
                                  <button
                                    onClick={() => handleCopy(order.playerUid, `uid-${order.id}`)}
                                    className="text-slate-400 hover:text-white"
                                    title="Copy Player UID"
                                  >
                                    {copiedKey === `uid-${order.id}` ? (
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                                {order.playerName && (
                                  <div className="text-[10px] text-slate-400 truncate max-w-[100px]">
                                    {order.playerName}
                                  </div>
                                )}
                              </td>

                              <td className="py-3 px-4 whitespace-nowrap">
                                <div className="font-semibold text-white">{order.packageNameBn || order.packageName}</div>
                              </td>

                              <td className="py-3 px-4 whitespace-nowrap">
                                <div className="font-bold font-mono-numbers text-white">৳ {order.amountBdt}</div>
                                <span className={`text-[10px] uppercase font-bold ${order.paymentMethod === 'bkash' ? 'text-pink-400' : 'text-amber-400'}`}>
                                  {order.paymentMethod}
                                </span>
                              </td>

                              <td className="py-3 px-4 whitespace-nowrap">
                                <div className="font-mono-numbers font-bold text-amber-300 flex items-center gap-1">
                                  <span>{order.trxId}</span>
                                  <button
                                    onClick={() => handleCopy(order.trxId, `trx-${order.id}`)}
                                    className="text-slate-400 hover:text-white"
                                    title="Copy TrxID to verify"
                                  >
                                    {copiedKey === `trx-${order.id}` ? (
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              </td>

                              <td className="py-3 px-4 whitespace-nowrap">
                                <span
                                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold inline-flex items-center gap-1 ${
                                    order.status === 'completed'
                                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                      : order.status === 'processing'
                                      ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                                      : order.status === 'rejected'
                                      ? 'bg-red-950 text-red-400 border border-red-800'
                                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                                  }`}
                                >
                                  {order.status === 'completed'
                                    ? 'Completed'
                                    : order.status === 'processing'
                                    ? 'Processing'
                                    : order.status === 'rejected'
                                    ? 'Rejected'
                                    : 'Pending'}
                                </span>
                              </td>

                              <td className="py-3 px-4 text-right whitespace-nowrap">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setEditingNote(order.adminNote || '');
                                  }}
                                  className="px-3 py-1 rounded-lg bg-purple-900/50 hover:bg-purple-900 text-xs font-semibold text-purple-200 transition-colors cursor-pointer"
                                >
                                  যাচাই ও আপডেট
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Status Action Modal */}
              {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
                  <div className="w-full max-w-lg rounded-2xl bg-[#110826] border border-purple-800 p-6 space-y-4 text-slate-100">
                    <div className="flex justify-between items-start border-b border-purple-900/40 pb-3">
                      <div>
                        <h4 className="font-bold text-base text-white">
                          অর্ডার যাচাই ও স্ট্যাটাস আপডেট
                        </h4>
                        <div className="text-xs text-purple-300 font-mono-numbers">
                          Order ID: {selectedOrder.id}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="text-slate-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Order highlights */}
                    <div className="p-3 rounded-xl bg-[#080312] border border-purple-950 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400">Player UID:</span>
                        <div className="font-mono-numbers font-bold text-cyan-300 text-sm">
                          {selectedOrder.playerUid}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">প্যাকেজ:</span>
                        <div className="font-bold text-white">
                          {selectedOrder.packageNameBn || selectedOrder.packageName}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">টাকার পরিমাণ:</span>
                        <div className="font-bold font-mono-numbers text-white">
                          ৳ {selectedOrder.amountBdt} BDT ({selectedOrder.paymentMethod.toUpperCase()})
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Transaction ID (TrxID):</span>
                        <div className="font-mono-numbers font-bold text-amber-300 text-sm">
                          {selectedOrder.trxId}
                        </div>
                      </div>
                    </div>

                    {/* Quick WhatsApp Link to Customer if available */}
                    {selectedOrder.contact && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-950/40 border border-purple-900/40 text-xs">
                        <span className="text-slate-300">গ্রাহক নম্বর: {selectedOrder.contact}</span>
                        <a
                          href={`https://wa.me/88${selectedOrder.contact}?text=${encodeURIComponent(
                            `আসসালামু আলাইকুম, Arafat Gaming থেকে আপনার অর্ডার ${selectedOrder.id} নিয়ে যোগাযোগ করছি।`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Chat</span>
                        </a>
                      </div>
                    )}

                    {/* Status Changer Buttons */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2">
                        স্ট্যাটাস নির্ধারণ করুন:
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateOrderStatus(selectedOrder.id, 'pending', editingNote);
                            setSelectedOrder({ ...selectedOrder, status: 'pending' });
                          }}
                          className={`py-2 px-1 text-xs font-bold rounded-lg border cursor-pointer ${
                            selectedOrder.status === 'pending'
                              ? 'bg-amber-600 text-white border-amber-400'
                              : 'bg-[#180d2e] text-slate-400 border-purple-900'
                          }`}
                        >
                          Pending
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateOrderStatus(selectedOrder.id, 'processing', editingNote);
                            setSelectedOrder({ ...selectedOrder, status: 'processing' });
                          }}
                          className={`py-2 px-1 text-xs font-bold rounded-lg border cursor-pointer ${
                            selectedOrder.status === 'processing'
                              ? 'bg-cyan-600 text-white border-cyan-400'
                              : 'bg-[#180d2e] text-slate-400 border-purple-900'
                          }`}
                        >
                          Processing
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateOrderStatus(selectedOrder.id, 'completed', editingNote || 'TrxID verified. Diamonds sent.');
                            setSelectedOrder({ ...selectedOrder, status: 'completed' });
                          }}
                          className={`py-2 px-1 text-xs font-bold rounded-lg border cursor-pointer ${
                            selectedOrder.status === 'completed'
                              ? 'bg-emerald-600 text-white border-emerald-400'
                              : 'bg-[#180d2e] text-slate-400 border-purple-900'
                          }`}
                        >
                          Completed
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateOrderStatus(selectedOrder.id, 'rejected', editingNote || 'Invalid TrxID or mismatched amount.');
                            setSelectedOrder({ ...selectedOrder, status: 'rejected' });
                          }}
                          className={`py-2 px-1 text-xs font-bold rounded-lg border cursor-pointer ${
                            selectedOrder.status === 'rejected'
                              ? 'bg-red-600 text-white border-red-400'
                              : 'bg-[#180d2e] text-slate-400 border-purple-900'
                          }`}
                        >
                          Rejected
                        </button>
                      </div>
                    </div>

                    {/* Admin Message / Note */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        গ্রাহককে দেখানোর মেসেজ / অ্যাডমিন নোট:
                      </label>
                      <input
                        type="text"
                        value={editingNote}
                        onChange={(e) => setEditingNote(e.target.value)}
                        placeholder="যেমন: বিকাশ পেমেন্ট পাওয়া গেছে, ডায়মন্ড পাঠানো হয়েছে"
                        className="w-full px-3 py-2 rounded-xl bg-[#080312] border border-purple-900 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                      >
                        বন্ধ করুন
                      </button>
                      <button
                        onClick={() => {
                          onUpdateOrderStatus(selectedOrder.id, selectedOrder.status, editingNote);
                          setSelectedOrder(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow cursor-pointer"
                      >
                        সংরক্ষণ করুন
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PACKAGES */}
          {activeTab === 'packages' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-xs text-slate-300">
                  ওয়েবসাইটে প্রদর্শিত ডায়মন্ড প্যাকেজ ও টাকার পরিমাণ পরিবর্তন করুন
                </div>
                <button
                  onClick={() => setShowAddPkgModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন প্যাকেজ যোগ করুন</span>
                </button>
              </div>

              {/* Package cards list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages.map((pkg) => {
                  const isEditing = editingPkgId === pkg.id;

                  return (
                    <div
                      key={pkg.id}
                      className="p-4 rounded-2xl bg-[#110723] border border-purple-900/50 space-y-3"
                    >
                      {isEditing ? (
                        <div className="space-y-2 text-xs">
                          <div>
                            <label className="text-[10px] text-slate-400">নাম (English)</label>
                            <input
                              type="text"
                              value={pkgName}
                              onChange={(e) => setPkgName(e.target.value)}
                              className="w-full px-2 py-1 rounded bg-[#080313] border border-purple-900 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400">নাম (বাংলা)</label>
                            <input
                              type="text"
                              value={pkgNameBn}
                              onChange={(e) => setPkgNameBn(e.target.value)}
                              className="w-full px-2 py-1 rounded bg-[#080313] border border-purple-900 text-white"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-slate-400">ডায়মন্ড</label>
                              <input
                                type="text"
                                value={pkgDiamonds}
                                onChange={(e) => setPkgDiamonds(e.target.value)}
                                className="w-full px-2 py-1 rounded bg-[#080313] border border-purple-900 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400">দাম (BDT ৳)</label>
                              <input
                                type="number"
                                value={pkgPrice}
                                onChange={(e) => setPkgPrice(Number(e.target.value))}
                                className="w-full px-2 py-1 rounded bg-[#080313] border border-purple-900 text-white"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400">ক্যাটাগরি</label>
                            <select
                              value={pkgCategory}
                              onChange={(e) => setPkgCategory(e.target.value as any)}
                              className="w-full px-2 py-1 rounded bg-[#080313] border border-purple-900 text-white"
                            >
                              <option value="diamond">Regular Diamond</option>
                              <option value="membership">Membership</option>
                              <option value="special">Special</option>
                            </select>
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              onClick={() => setEditingPkgId(null)}
                              className="px-3 py-1 rounded bg-slate-800 text-slate-300"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveEditPackage}
                              className="px-3 py-1 rounded bg-purple-600 text-white font-bold"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-white text-sm">{pkg.nameBn}</h4>
                              <div className="text-xs text-slate-400">{pkg.name}</div>
                            </div>
                            <span className="text-xs font-bold text-cyan-300 font-mono-numbers">
                              ৳ {pkg.priceBdt} BDT
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-purple-950 pt-2">
                            <span>ক্যাটাগরি: {pkg.category}</span>
                            <span className={pkg.active ? 'text-emerald-400' : 'text-slate-500'}>
                              {pkg.active ? '● সক্রিয়' : '○ নিষ্ক্রিয়'}
                            </span>
                          </div>

                          <div className="flex justify-end gap-2 pt-1 border-t border-purple-950">
                            <button
                              onClick={() =>
                                onUpdatePackage({ ...pkg, active: !pkg.active })
                              }
                              className="px-2.5 py-1 rounded bg-slate-800 text-[11px] text-slate-300 hover:text-white"
                            >
                              {pkg.active ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                            </button>
                            <button
                              onClick={() => startEditPackage(pkg)}
                              className="px-2.5 py-1 rounded bg-purple-900/60 text-[11px] text-purple-200 hover:bg-purple-900 flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>এডিট</span>
                            </button>
                            <button
                              onClick={() => onDeletePackage(pkg.id)}
                              className="px-2.5 py-1 rounded bg-red-950/60 text-[11px] text-red-300 hover:bg-red-900 flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add Package Modal */}
              {showAddPkgModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
                  <div className="w-full max-w-md rounded-2xl bg-[#110826] border border-purple-800 p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-purple-900/40 pb-3">
                      <h4 className="font-bold text-white text-base">নতুন ডায়মন্ড প্যাকেজ যোগ</h4>
                      <button onClick={() => setShowAddPkgModal(false)} className="text-slate-400 hover:text-white">✕</button>
                    </div>

                    <form onSubmit={handleCreatePackage} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-300 mb-1">প্যাকেজ নাম (বাংলা) *</label>
                        <input
                          type="text"
                          required
                          value={pkgNameBn}
                          onChange={(e) => setPkgNameBn(e.target.value)}
                          placeholder="যেমন: ১০০ ডায়মন্ড"
                          className="w-full px-3 py-2 rounded-xl bg-[#080313] border border-purple-900 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-1">প্যাকেজ নাম (English)</label>
                        <input
                          type="text"
                          value={pkgName}
                          onChange={(e) => setPkgName(e.target.value)}
                          placeholder="e.g. 100 Diamonds"
                          className="w-full px-3 py-2 rounded-xl bg-[#080313] border border-purple-900 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-300 mb-1">ডায়মন্ড পরিমাণ *</label>
                          <input
                            type="text"
                            required
                            value={pkgDiamonds}
                            onChange={(e) => setPkgDiamonds(e.target.value)}
                            placeholder="100"
                            className="w-full px-3 py-2 rounded-xl bg-[#080313] border border-purple-900 text-white font-mono-numbers"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 mb-1">দাম (BDT ৳) *</label>
                          <input
                            type="number"
                            required
                            value={pkgPrice || ''}
                            onChange={(e) => setPkgPrice(Number(e.target.value))}
                            placeholder="75"
                            className="w-full px-3 py-2 rounded-xl bg-[#080313] border border-purple-900 text-white font-mono-numbers"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-1">ক্যাটাগরি</label>
                        <select
                          value={pkgCategory}
                          onChange={(e) => setPkgCategory(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-[#080313] border border-purple-900 text-white"
                        >
                          <option value="diamond">Regular Diamonds</option>
                          <option value="membership">Membership</option>
                          <option value="special">Special Pass</option>
                        </select>
                      </div>

                      <div className="flex justify-end gap-2 pt-3">
                        <button
                          type="button"
                          onClick={() => setShowAddPkgModal(false)}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                        >
                          বাতিল
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white cursor-pointer"
                        >
                          প্যাকেজ যুক্ত করুন
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div className="p-5 rounded-2xl bg-[#110723] border border-purple-900/50 space-y-4">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-pink-400" />
                    <span>পেমেন্ট নম্বর পরিবর্তন (bKash & Nagad)</span>
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-pink-400 mb-1">
                      বিকাশ পার্সোনাল নম্বর:
                    </label>
                    <input
                      type="text"
                      value={editBkash}
                      onChange={(e) => setEditBkash(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#080313] border border-purple-900 text-white font-mono-numbers text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-400 mb-1">
                      নগদ পার্সোনাল নম্বর:
                    </label>
                    <input
                      type="text"
                      value={editNagad}
                      onChange={(e) => setEditNagad(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#080313] border border-purple-900 text-white font-mono-numbers text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-emerald-400 mb-1">
                      সাপোর্ট হোয়াটসঅ্যাপ নম্বর (Country code ছাড়া):
                    </label>
                    <input
                      type="text"
                      value={editWhatsapp}
                      onChange={(e) => setEditWhatsapp(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#080313] border border-purple-900 text-white font-mono-numbers text-sm"
                    />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#110723] border border-purple-900/50 space-y-4">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-purple-400" />
                    <span>নোটিশ ও অ্যাডমিন সিকিউরিটি</span>
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      হেডার নোটিশ (বাংলা):
                    </label>
                    <input
                      type="text"
                      value={editNoticeBn}
                      onChange={(e) => setEditNoticeBn(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#080313] border border-purple-900 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      হেডার নোটিশ (English):
                    </label>
                    <input
                      type="text"
                      value={editNoticeEn}
                      onChange={(e) => setEditNoticeEn(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#080313] border border-purple-900 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-red-300 mb-1">
                      অ্যাডমিন প্যানেল PIN পরিবর্তন:
                    </label>
                    <input
                      type="text"
                      value={editAdminPin}
                      onChange={(e) => setEditAdminPin(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#080313] border border-purple-900 text-white font-mono-numbers text-sm tracking-wider"
                    />
                  </div>
                </div>

                {settingsSaved && (
                  <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>সেটিংস সফলভাবে সংরক্ষিত হয়েছে!</span>
                  </div>
                )}

                <div className="text-right">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-sm text-white shadow-lg transition-all flex items-center gap-2 ml-auto cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>সেটিংস সেভ করুন</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
