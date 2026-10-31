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
  Users,
  Tv,
  Film,
  Music,
  Eye,
  EyeOff,
  Sparkles,
  TrendingUp,
  CreditCard,
  Key,
  X,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  Smartphone,
  Coins,
  Wallet,
} from 'lucide-react';
import {
  AddMoneyRequest,
  DiamondPackage,
  DurationOption,
  Language,
  Order,
  OrderStatus,
  SiteConfig,
  StreamingServiceItem,
  UserWallet,
} from '../types';
import { translations } from '../data/translations';
import { BkashLogo, NagadLogo, FacebookLogo, InstagramLogo, NetflixLogo, CrunchyrollLogo } from './BrandLogos';
import {
  ADMIN_CUSTOM_PASSWORD_STORAGE_KEY,
  ADMIN_PRIMARY_PASSWORD_BN,
  ADMIN_PRIMARY_PASSWORD_EN,
  isValidAdminPassword,
} from '../data/initialData';

const ADMIN_SESSION_KEY = 'ag_admin_auth_session_active';

interface AdminPanelProps {
  orders: Order[];
  packages: DiamondPackage[];
  streamingServices: StreamingServiceItem[];
  addMoneyRequests: AddMoneyRequest[];
  userWallet: UserWallet;
  config: SiteConfig;
  lang: Language;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  onDeleteOrder?: (orderId: string) => void;
  onApproveAddMoney: (requestId: string) => void;
  onRejectAddMoney: (requestId: string, note?: string) => void;
  onDeleteAddMoney?: (requestId: string) => void;
  onUpdatePackage: (pkg: DiamondPackage) => void;
  onAddPackage: (pkg: Omit<DiamondPackage, 'id'>) => void;
  onDeletePackage: (id: string) => void;
  onUpdateStreamingService: (service: StreamingServiceItem) => void;
  onAddStreamingService: (service: StreamingServiceItem) => void;
  onDeleteStreamingService: (id: string) => void;
  onUpdateConfig: (newConfig: Partial<SiteConfig>) => void;
  onResetToDefaults: () => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  orders,
  packages,
  streamingServices,
  addMoneyRequests = [],
  userWallet,
  config,
  lang,
  onUpdateOrderStatus,
  onDeleteOrder,
  onApproveAddMoney,
  onRejectAddMoney,
  onDeleteAddMoney,
  onUpdatePackage,
  onAddPackage,
  onDeletePackage,
  onUpdateStreamingService,
  onAddStreamingService,
  onDeleteStreamingService,
  onUpdateConfig,
  onResetToDefaults,
  onClose,
}) => {
  // Authentication with persistent session
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // Custom admin password persistence
  const [customAdminPassword, setCustomAdminPassword] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ADMIN_CUSTOM_PASSWORD_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  // Password reset/change states
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'social' | 'streaming' | 'diamonds' | 'addmoney' | 'orders' | 'payments' | 'settings'
  >('overview');

  // Add Money search & filter state
  const [addMoneyFilter, setAddMoneyFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [addMoneySearch, setAddMoneySearch] = useState('');
  const [copiedTrxId, setCopiedTrxId] = useState<string | null>(null);
  const [rejectingReqId, setRejectingReqId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  // Notification Toast in Admin
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const triggerSaveToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // -------------------------------------------------------------
  // TAB 1: SOCIAL FOLLOWERS STATE
  // -------------------------------------------------------------
  const [fbRateInput, setFbRateInput] = useState(config.followerRatePer1k || 120);
  const [igRateInput, setIgRateInput] = useState(config.instagramFollowerRatePer1k || 150);
  const [fbMinFollowers, setFbMinFollowers] = useState(config.fbMinFollowers || 1);
  const [fbMaxFollowers, setFbMaxFollowers] = useState(config.fbMaxFollowers || 1000000);
  const [igMinFollowers, setIgMinFollowers] = useState(config.igMinFollowers || 1);
  const [igMaxFollowers, setIgMaxFollowers] = useState(config.igMaxFollowers || 1000000);
  // Live test calculators
  const [testFbQty, setTestFbQty] = useState<number>(5000);
  const [testIgQty, setTestIgQty] = useState<number>(5000);

  const handleSaveSocialRates = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      followerRatePer1k: Number(fbRateInput),
      instagramFollowerRatePer1k: Number(igRateInput),
      fbMinFollowers: Number(fbMinFollowers),
      fbMaxFollowers: Number(fbMaxFollowers),
      igMinFollowers: Number(igMinFollowers),
      igMaxFollowers: Number(igMaxFollowers),
    });
    triggerSaveToast('সোশ্যাল ফলোয়ার্স মূল্য সফলভাবে আপডেট করা হয়েছে!');
  };

  // -------------------------------------------------------------
  // TAB 2: STREAMING & OTT SERVICES STATE
  // -------------------------------------------------------------
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [streamingCategoryFilter, setStreamingCategoryFilter] = useState<'all' | 'streaming' | 'anime' | 'music'>('all');

  // Form state for adding a new streaming service
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceNameBn, setNewServiceNameBn] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<'streaming' | 'anime' | 'music'>('streaming');
  const [newServiceBadge, setNewServiceBadge] = useState('');
  const [newServiceDurations, setNewServiceDurations] = useState<DurationOption[]>([
    { id: '1m', durationLabel: '1 Month Subscription', durationLabelBn: '১ মাস সাবস্ক্রিপশন', priceBdt: 150 },
    { id: '3m', durationLabel: '3 Months Subscription', durationLabelBn: '৩ মাস সাবস্ক্রিপশন', priceBdt: 420 },
    { id: '1y', durationLabel: '1 Year Subscription', durationLabelBn: '১ বছর সাবস্ক্রিপশন', priceBdt: 1200 },
  ]);

  // Handle duration price changes inside existing services
  const handleDurationPriceChange = (serviceId: string, durationId: string, newPrice: number) => {
    const service = streamingServices.find((s) => s.id === serviceId);
    if (!service) return;
    const updatedDurations = service.durations.map((d) =>
      d.id === durationId ? { ...d, priceBdt: newPrice } : d
    );
    onUpdateStreamingService({ ...service, durations: updatedDurations });
    triggerSaveToast(`৳${newPrice} BDT মূল্য আপডেট হয়েছে!`);
  };

  // Add new duration tier to an existing service
  const handleAddDurationToService = (serviceId: string) => {
    const service = streamingServices.find((s) => s.id === serviceId);
    if (!service) return;
    const newDurId = `dur-${Date.now()}`;
    const newDur: DurationOption = {
      id: newDurId,
      durationLabel: 'New Duration Plan',
      durationLabelBn: 'নতুন মেয়াদ প্ল্যান',
      priceBdt: 200,
    };
    onUpdateStreamingService({ ...service, durations: [...service.durations, newDur] });
    triggerSaveToast('নতুন মেয়াদ যোগ করা হয়েছে!');
  };

  // Remove duration tier from an existing service
  const handleRemoveDurationFromService = (serviceId: string, durationId: string) => {
    const service = streamingServices.find((s) => s.id === serviceId);
    if (!service || service.durations.length <= 1) {
      alert('একটি সার্ভিসে অন্তত ১টি মেয়াদ প্ল্যান থাকতে হবে।');
      return;
    }
    const updatedDurations = service.durations.filter((d) => d.id !== durationId);
    onUpdateStreamingService({ ...service, durations: updatedDurations });
    triggerSaveToast('মেয়াদ অপশন ডিলিট করা হয়েছে!');
  };

  // Toggle active status of streaming service
  const handleToggleStreamingActive = (serviceId: string) => {
    const service = streamingServices.find((s) => s.id === serviceId);
    if (!service) return;
    onUpdateStreamingService({ ...service, active: !service.active });
    triggerSaveToast(`${service.name} স্ট্যাটাস পরিবর্তিত হয়েছে!`);
  };

  // Save new custom service
  const handleCreateNewService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;
    const newId = `custom-service-${Date.now()}`;
    const newService: StreamingServiceItem = {
      id: newId,
      serviceKey: newId,
      name: newServiceName.trim(),
      nameBn: newServiceNameBn.trim() || newServiceName.trim(),
      category: newServiceCategory,
      badge: newServiceBadge.trim() || 'Premium',
      badgeBn: newServiceBadge.trim() || 'প্রিমিয়াম',
      logoText: newServiceName.substring(0, 2).toUpperCase(),
      logoBg: 'bg-purple-600 text-white font-bold',
      durations: newServiceDurations,
      features: ['High Quality Streaming', 'Multi-device Support', 'Replacement Warranty'],
      featuresBn: ['হাই কোয়ালিটি স্ট্রিমিং', 'মাল্টি-ডিভাইস সাপোর্ট', 'ফুল রিপ্লেসমেন্ট ওয়ারেন্টি'],
      active: true,
    };
    onAddStreamingService(newService);
    setShowAddServiceModal(false);
    setNewServiceName('');
    setNewServiceNameBn('');
    setNewServiceBadge('');
    triggerSaveToast('নতুন সাবস্ক্রিপশন সার্ভিস যুক্ত হয়েছে!');
  };

  // -------------------------------------------------------------
  // TAB 3: DIAMOND PACKAGES STATE
  // -------------------------------------------------------------
  const [pkgSearch, setPkgSearch] = useState('');
  const [pkgCategoryFilter, setPkgCategoryFilter] = useState<'all' | 'diamond' | 'membership' | 'special'>('all');
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);
  const [pkgName, setPkgName] = useState('');
  const [pkgNameBn, setPkgNameBn] = useState('');
  const [pkgDiamonds, setPkgDiamonds] = useState<string | number>('');
  const [pkgPrice, setPkgPrice] = useState<number>(0);
  const [pkgCategory, setPkgCategory] = useState<'diamond' | 'membership' | 'special'>('diamond');
  const [pkgBadge, setPkgBadge] = useState('');
  const [showAddPkgModal, setShowAddPkgModal] = useState(false);

  const startEditPackage = (pkg: DiamondPackage) => {
    setEditingPkgId(pkg.id);
    setPkgName(pkg.name);
    setPkgNameBn(pkg.nameBn);
    setPkgDiamonds(pkg.diamonds);
    setPkgPrice(pkg.priceBdt);
    setPkgCategory(pkg.category);
    setPkgBadge(pkg.badge || '');
  };

  const handleSaveEditedPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkgId) return;
    const existing = packages.find((p) => p.id === editingPkgId);
    if (!existing) return;
    onUpdatePackage({
      ...existing,
      name: pkgName.trim() || existing.name,
      nameBn: pkgNameBn.trim() || existing.nameBn,
      diamonds: pkgDiamonds,
      priceBdt: Number(pkgPrice) || existing.priceBdt,
      category: pkgCategory,
      badge: pkgBadge.trim() || undefined,
    });
    setEditingPkgId(null);
    triggerSaveToast('ডায়মন্ড প্যাকেজ সফলভাবে আপডেট হয়েছে!');
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgName.trim() || !pkgPrice) return;
    onAddPackage({
      name: pkgName.trim(),
      nameBn: pkgNameBn.trim() || pkgName.trim(),
      diamonds: pkgDiamonds || pkgName.trim(),
      priceBdt: Number(pkgPrice),
      category: pkgCategory,
      badge: pkgBadge.trim() || undefined,
      active: true,
    });
    setShowAddPkgModal(false);
    setPkgName('');
    setPkgNameBn('');
    setPkgDiamonds('');
    setPkgPrice(0);
    setPkgBadge('');
    triggerSaveToast('নতুন ডায়মন্ড প্যাকেজ তৈরি করা হয়েছে!');
  };

  // -------------------------------------------------------------
  // TAB 4: MFS PAYMENTS & CONTACT SETTINGS
  // -------------------------------------------------------------
  const [editBkash, setEditBkash] = useState(config.bkashNumber);
  const [editNagad, setEditNagad] = useState(config.nagadNumber);
  const [editWhatsapp, setEditWhatsapp] = useState(config.whatsappNumber);
  const [editNoticeBn, setEditNoticeBn] = useState(config.noticeBn);
  const [editNoticeEn, setEditNoticeEn] = useState(config.noticeEn);
  const [editSupportHours, setEditSupportHours] = useState(config.supportHours);
  const [editSupportHoursBn, setEditSupportHoursBn] = useState(config.supportHoursBn);

  const handleSavePaymentsAndSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      bkashNumber: editBkash.trim(),
      nagadNumber: editNagad.trim(),
      whatsappNumber: editWhatsapp.trim(),
      noticeBn: editNoticeBn.trim(),
      noticeEn: editNoticeEn.trim(),
      supportHours: editSupportHours.trim(),
      supportHoursBn: editSupportHoursBn.trim(),
    });
    triggerSaveToast('বিকাশ, নগদ ও হেল্পলাইন সেটিংস সফলভাবে সেভ হয়েছে!');
  };


  // -------------------------------------------------------------
  // TAB 5: ORDERS MANAGEMENT
  // -------------------------------------------------------------
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderServiceFilter, setOrderServiceFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingNote, setEditingNote] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredOrders = orders.filter((order) => {
    if (orderStatusFilter !== 'all' && order.status !== orderStatusFilter) return false;
    if (orderServiceFilter !== 'all') {
      if (orderServiceFilter === 'free_fire' && order.serviceType && order.serviceType !== 'free_fire') return false;
      if (orderServiceFilter !== 'free_fire' && order.serviceType !== orderServiceFilter) return false;
    }
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.playerUid.toLowerCase().includes(q) ||
        order.trxId.toLowerCase().includes(q) ||
        (order.playerName && order.playerName.toLowerCase().includes(q)) ||
        (order.contact && order.contact.toLowerCase().includes(q)) ||
        (order.customerEmail && order.customerEmail.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // -------------------------------------------------------------
  // TAB 6: SECURITY & PASSWORD MANAGEMENT
  // -------------------------------------------------------------
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleChangeAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError(null);
    setPasswordChangeSuccess(null);

    // 1. Verify current password
    if (!isValidAdminPassword(currentPassInput, customAdminPassword)) {
      setPasswordChangeError('বর্তমান পাসওয়ার্ড ভুল হয়েছে! অনুগ্রহ করে সঠিক বর্তমান পাসওয়ার্ড দিন।');
      return;
    }

    // 2. Validate new password length
    const trimmedNew = newPassInput.trim();
    if (!trimmedNew || trimmedNew.length < 4) {
      setPasswordChangeError('নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে!');
      return;
    }

    // 3. Confirm matching
    if (trimmedNew !== confirmPassInput.trim()) {
      setPasswordChangeError('নতুন পাসওয়ার্ড এবং নিশ্চিত পাসওয়ার্ড দুটি মিলছে না!');
      return;
    }

    // 4. Save to localStorage
    try {
      localStorage.setItem(ADMIN_CUSTOM_PASSWORD_STORAGE_KEY, trimmedNew);
    } catch {}

    setCustomAdminPassword(trimmedNew);
    onUpdateConfig({ adminPin: trimmedNew });

    setCurrentPassInput('');
    setNewPassInput('');
    setConfirmPassInput('');
    setPasswordChangeSuccess('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! পরবর্তী লগইনের জন্য এই নতুন পাসওয়ার্ডটি ব্যবহার করুন।');
    triggerSaveToast('অ্যাডমিন পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!');
  };

  const handleResetToDefaultPassword = () => {
    if (window.confirm('আপনি কি ডিফল্ট পাসওয়ার্ডে (আরাফাত সনি এক এক দুই দুই / Arafat Sony 1122) ফিরে যেতে চান?')) {
      try {
        localStorage.removeItem(ADMIN_CUSTOM_PASSWORD_STORAGE_KEY);
      } catch {}
      setCustomAdminPassword(null);
      onUpdateConfig({ adminPin: ADMIN_PRIMARY_PASSWORD_BN });
      setPasswordChangeSuccess('পাসওয়ার্ড রিসেট সম্পন্ন হয়েছে! ডিফল্ট পাসওয়ার্ড (আরাফাত সনি এক এক দুই দুই) সক্রিয় করা হয়েছে।');
      triggerSaveToast('ডিফল্ট পাসওয়ার্ড সফলভাবে সক্রিয় হয়েছে!');
    }
  };

  const handleExecuteReset = () => {
    onResetToDefaults();
    setShowResetConfirm(false);
    triggerSaveToast('সকল প্রোডাক্ট ও মূল্য ফ্যাক্টরি ডিফল্ট এ রিসেট করা হয়েছে!');
  };

  // KPI Computations
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const processingOrders = orders.filter((o) => o.status === 'processing').length;
  const completedOrders = orders.filter((o) => o.status === 'completed').length;
  const totalRevenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + (o.amountBdt || 0), 0);

  const pendingAddMoneyCount = addMoneyRequests.filter((r) => r.status === 'pending').length;
  const approvedAddMoneyAmount = addMoneyRequests
    .filter((r) => r.status === 'approved')
    .reduce((sum, r) => sum + (r.amountBdt || 0), 0);

  // Authentication check handler with strict password validation (custom or initial)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidAdminPassword(pinInput, customAdminPassword)) {
      try {
        localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } catch {}
      setIsAuthenticated(true);
      setPinError(false);
      triggerSaveToast('অ্যাডমিন প্যানেলে স্বাগতম! লগইন সফল হয়েছে।');
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {}
    setIsAuthenticated(false);
    setPinInput('');
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN (Strict Protected Barrier)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in font-sans">
        <div className="w-full max-w-md bg-[#0f0720] border-2 border-purple-800/70 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950 relative overflow-hidden text-slate-100">
          {/* Subtle Ambient Background Light */}
          <div className="absolute -top-24 -left-24 w-52 h-52 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-purple-900/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-cyan-500 p-0.5 mx-auto mb-4 shadow-lg shadow-purple-900/50">
              <div className="w-full h-full bg-[#0d071f] rounded-[14px] flex items-center justify-center">
                <Shield className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-white tracking-wide">
              ADMIN CONTROL CENTER
            </h3>
            <p className="text-xs text-purple-300/80 mt-1">
              সম্পূর্ণ সার্ভিস, মূল্য ও অর্ডার কন্ট্রোল ড্যাশবোর্ড
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                অ্যাডমিন সিকিউরিটি পাসওয়ার্ড (Fixed Password) *
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="পাসওয়ার্ড দিন..."
                  autoFocus
                  required
                  className="w-full pl-4 pr-11 py-3.5 rounded-xl bg-[#160a2c] border border-purple-800/60 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors text-sm font-mono tracking-wide"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {pinError && (
                <div className="mt-3 p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>ভুল পাসওয়ার্ড! অ্যাক্সেস সম্পূর্ণভাবে প্রত্যাখ্যাত।</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-purple-950 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>ড্যাশবোর্ডে লগইন করুন</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-purple-900/40 text-center">
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>ফিক্সড সিকিউরিটি পাসওয়ার্ড দ্বারা সুরক্ষিত</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#070312] text-slate-100 overflow-hidden animate-fade-in font-sans">
      {/* Toast Notification Bar */}
      {saveToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce text-xs sm:text-sm">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="h-16 px-4 sm:px-6 bg-[#0d061f] border-b border-purple-900/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5">
            <div className="w-full h-full bg-[#0d071f] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-wider uppercase">
                {config.siteName} · MASTER CONTROL
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[10px] font-bold">
                LIVE SYNC ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-purple-300/70 hidden sm:block">
              সকল সার্ভিসের দাম ও অপশন পরিবর্তন সাথে সাথে ওয়েবসাইটে আপডেট হয়
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setPinInput('');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-950/50 hover:bg-purple-900/60 border border-purple-800/40 text-purple-200 transition-colors cursor-pointer"
            title="Lock Panel"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">লক আউট</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-purple-900/40 transition-colors cursor-pointer"
            title="Close Dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div className="bg-[#0b051a] border-b border-purple-900/40 px-4 sm:px-6 overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-1 sm:gap-2 min-w-max py-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-purple-950/40'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>📊 ওভারভিউ</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'social'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-blue-950/30'
            }`}
          >
            <Users className="w-4 h-4 text-blue-300" />
            <span>👥 সোশ্যাল ফলোয়ার্স (FB & IG)</span>
          </button>

          <button
            onClick={() => setActiveTab('streaming')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'streaming'
                ? 'bg-red-600 text-white shadow-md shadow-red-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-red-950/30'
            }`}
          >
            <Tv className="w-4 h-4 text-red-300" />
            <span>🎬 নেটফ্লিক্স ও স্ট্রিমিং OTT</span>
          </button>

          <button
            onClick={() => setActiveTab('diamonds')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'diamonds'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-indigo-950/30'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>💎 ফ্রি ফায়ার ডায়মন্ড</span>
          </button>

          <button
            onClick={() => setActiveTab('addmoney')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer relative ${
              activeTab === 'addmoney'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-amber-950/30'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-300" />
            <span>💰 অ্যাড মানি রিকোয়েস্ট</span>
            {pendingAddMoneyCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-black flex items-center justify-center animate-pulse">
                {pendingAddMoneyCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer relative ${
              activeTab === 'orders'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-cyan-950/30'
            }`}
          >
            <ListOrdered className="w-4 h-4 text-cyan-300" />
            <span>📦 অর্ডার ম্যানেজমেন্ট</span>
            {pendingOrders > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                {pendingOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-pink-950/30'
            }`}
          >
            <CreditCard className="w-4 h-4 text-pink-300" />
            <span>💳 পেমেন্ট ও সাপোর্ট নম্বর</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Key className="w-4 h-4 text-cyan-300" />
            <span>🔒 পাসওয়ার্ড ও সিকিউরিটি</span>
          </button>
        </div>
      </div>

      {/* Main Body - Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & FAST STATS */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="bg-[#110724] border border-purple-800/40 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between text-xs text-purple-300 font-medium mb-1">
                  <span>মোট বিক্রয় আয়</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                  ৳{totalRevenue.toLocaleString()} <span className="text-xs font-sans text-slate-400">BDT</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">কমপ্লিটেড অর্ডার থেকে</div>
              </div>

              <div className="bg-[#110724] border border-purple-800/40 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between text-xs text-purple-300 font-medium mb-1">
                  <span>মোট অর্ডার</span>
                  <ListOrdered className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-white">
                  {totalOrders}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">সকল ডিজিটাল সার্ভিস</div>
              </div>

              <div className="bg-[#110724] border border-amber-800/40 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between text-xs text-amber-300 font-medium mb-1">
                  <span>পেন্ডিং অর্ডার</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-amber-400">
                  {pendingOrders}
                </div>
                <div className="text-[10px] text-amber-300/80 mt-1">যাচাইয়ের অপেক্ষায়</div>
              </div>

              <div className="bg-[#110724] border border-blue-800/40 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between text-xs text-blue-300 font-medium mb-1">
                  <span>প্রসেসিং অর্ডার</span>
                  <RefreshCw className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-blue-400">
                  {processingOrders}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">ডেলিভারি কাজ চলছে</div>
              </div>

              <div className="bg-[#110724] border border-emerald-800/40 rounded-2xl p-4 shadow-lg col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between text-xs text-emerald-300 font-medium mb-1">
                  <span>কমপ্লিটেড অর্ডার</span>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                  {completedOrders}
                </div>
                <div className="text-[10px] text-emerald-300/80 mt-1">সফলভাবে ডেলিভার্ড</div>
              </div>
            </div>

            {/* Quick Control Navigation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('social')}
                className="p-5 rounded-2xl bg-gradient-to-br from-[#0e1630] to-[#0a0d24] border border-blue-700/40 hover:border-blue-500 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">সোশ্যাল ফলোয়ার্স কন্ট্রোল</h4>
                <p className="text-xs text-slate-400 mb-3">
                  ফেসবুক ও ইনস্টাগ্রামের প্রতি ১,০০০ এবং প্রতি ইউনিট রেট সরাসরি নিয়ন্ত্রণ করুন।
                </p>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400">
                  <span>FB: ৳{config.followerRatePer1k}/1k</span>
                  <span>·</span>
                  <span>IG: ৳{config.instagramFollowerRatePer1k || 150}/1k</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('streaming')}
                className="p-5 rounded-2xl bg-gradient-to-br from-[#290d16] to-[#17060c] border border-red-700/40 hover:border-red-500 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400">
                    <Tv className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">নেটফ্লিক্স ও OTT সাবস্ক্রিপশন</h4>
                <p className="text-xs text-slate-400 mb-3">
                  Netflix, Crunchyroll, Spotify, YT Premium ইত্যাদির ১M, ২M, ৬M, ১Y দাম আপডেট করুন।
                </p>
                <div className="text-xs font-bold text-red-400">
                  {streamingServices.length} টি অ্যাক্টিভ সার্ভিস ম্যানেজমেন্ট
                </div>
              </button>

              <button
                onClick={() => setActiveTab('diamonds')}
                className="p-5 rounded-2xl bg-gradient-to-br from-[#1c1236] to-[#0f0724] border border-purple-700/40 hover:border-purple-500 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">ফ্রি ফায়ার ডায়মন্ড প্যাক্স</h4>
                <p className="text-xs text-slate-400 mb-3">
                  ১ ডায়মন্ড থেকে ২১৮০ ডায়মন্ড, উইকলি ও মান্থলি মেম্বারশিপের দাম ও অফার এড/এডিট করুন।
                </p>
                <div className="text-xs font-bold text-purple-400">
                  {packages.length} টি প্যাকেজ সক্রিয়
                </div>
              </button>
            </div>

            {/* Recent Orders Overview Table */}
            <div className="bg-[#0f0720] border border-purple-900/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">সর্বশেষ অর্ডারসমূহ</h3>
                  <p className="text-xs text-slate-400">কাস্টমারদের সর্বশেষ ৫টি অর্ডার এবং তাৎক্ষণিক স্ট্যাটাস চেঞ্জ</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>সকল অর্ডার দেখুন ({orders.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#140a2c] text-slate-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3 rounded-l-lg">Order ID</th>
                      <th className="py-2.5 px-3">সার্ভিস</th>
                      <th className="py-2.5 px-3">UID / একাউন্ট</th>
                      <th className="py-2.5 px-3">মূল্য</th>
                      <th className="py-2.5 px-3">পেমেন্ট & TrxID</th>
                      <th className="py-2.5 px-3">স্ট্যাটাস</th>
                      <th className="py-2.5 px-3 rounded-r-lg">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-900/30">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-purple-950/20">
                        <td className="py-3 px-3 font-mono font-bold text-cyan-300">{ord.id}</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-white">{ord.packageNameBn || ord.packageName}</div>
                          <div className="text-[10px] text-slate-400">{ord.diamonds}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-300 max-w-[150px] truncate" title={ord.playerUid}>
                          {ord.playerUid}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-400">৳{ord.amountBdt}</td>
                        <td className="py-3 px-3">
                          <span className="uppercase font-bold text-[10px] text-purple-300">{ord.paymentMethod}: </span>
                          <span className="font-mono text-slate-300">{ord.trxId}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              ord.status === 'completed'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                                : ord.status === 'processing'
                                ? 'bg-blue-950 text-blue-400 border border-blue-800/40'
                                : ord.status === 'rejected'
                                ? 'bg-rose-950 text-rose-400 border border-rose-800/40'
                                : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={ord.status}
                            onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="bg-[#160a2c] border border-purple-800/50 text-xs text-white rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-400"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SOCIAL MEDIA FOLLOWERS (FACEBOOK & INSTAGRAM RATE CONTROL) */}
        {/* ========================================================================= */}
        {activeTab === 'social' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-blue-800/40 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-7 h-7 text-blue-400" />
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  সোশ্যাল ফলোয়ার্স প্যাকেজ ও মূল্য নিয়ন্ত্রণ কেন্দ্র
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                এখানে ফেসবুক ও ইনস্টাগ্রামের ফলোয়ার রেট (প্রতি ১,০০০ রেট ও রেঞ্জ) আপডেট করুন। আপনার সেভ করা রেট সাথে সাথে মূল ওয়েবসাইটের লাইভ ক্যালকুলেটর ও চেকআউটে আপডেট হবে।
              </p>
            </div>

            <form onSubmit={handleSaveSocialRates} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Facebook Followers Control Card */}
                <div className="bg-[#0f0924] border-2 border-blue-900/50 hover:border-blue-600/70 rounded-3xl p-6 space-y-5 shadow-xl">
                  <div className="flex items-center justify-between pb-4 border-b border-blue-900/40">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#081530] border border-blue-600/40 p-2 flex items-center justify-center">
                        <FacebookLogo className="w-full h-full" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white">Facebook Followers</h3>
                        <p className="text-xs text-blue-300">ফেসবুক প্রোফাইল ও পেজ ফলোয়ার্স</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800/40">
                      1 - 1,000,000 Range
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                        প্রতি ১,০০০ (1K) ফেসবুক ফলোয়ারের দাম (BDT):
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="10000"
                          value={fbRateInput}
                          onChange={(e) => setFbRateInput(Number(e.target.value))}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-[#170c35] border border-blue-800/50 text-white font-mono text-base font-bold focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-400">
                          ৳ BDT / 1,000
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        ১টি ফলোয়ারের মূল্য: <span className="font-mono font-bold text-cyan-300">৳{(fbRateInput / 1000).toFixed(4)} BDT</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">মিনিমাম ফলোয়ার অর্ডার:</label>
                        <input
                          type="number"
                          min="1"
                          value={fbMinFollowers}
                          onChange={(e) => setFbMinFollowers(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg bg-[#170c35] border border-blue-900 text-white text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">ম্যাক্সিমাম ফলোয়ার অর্ডার:</label>
                        <input
                          type="number"
                          min="1000"
                          max="10000000"
                          value={fbMaxFollowers}
                          onChange={(e) => setFbMaxFollowers(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg bg-[#170c35] border border-blue-900 text-white text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* Facebook Live Test Simulator */}
                    <div className="p-4 rounded-2xl bg-[#090518] border border-blue-950 space-y-2">
                      <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wider flex items-center justify-between">
                        <span>লাইভ প্রাইস প্রিভিউ (টেস্টার):</span>
                        <span className="font-mono text-cyan-400">৳{Math.round((testFbQty / 1000) * fbRateInput)} BDT</span>
                      </div>
                      <input
                        type="range"
                        min="1000"
                        max="100000"
                        step="1000"
                        value={testFbQty}
                        onChange={(e) => setTestFbQty(Number(e.target.value))}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>{testFbQty.toLocaleString()} Followers</span>
                        <span>৳{Math.round((testFbQty / 1000) * fbRateInput)} BDT কাস্টমার দেখবে</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Instagram Followers Control Card */}
                <div className="bg-[#0f0924] border-2 border-pink-900/50 hover:border-pink-600/70 rounded-3xl p-6 space-y-5 shadow-xl">
                  <div className="flex items-center justify-between pb-4 border-b border-pink-900/40">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#2b0c1e] border border-pink-600/40 p-2 flex items-center justify-center">
                        <InstagramLogo className="w-full h-full" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white">Instagram Followers</h3>
                        <p className="text-xs text-pink-300">ইনস্টাগ্রাম প্রোফাইল ফলোয়ার্স</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-pink-950 text-pink-300 border border-pink-800/40">
                      1 - 1,000,000 Range
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                        প্রতি ১,০০০ (1K) ইনস্টাগ্রাম ফলোয়ারের দাম (BDT):
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="10000"
                          value={igRateInput}
                          onChange={(e) => setIgRateInput(Number(e.target.value))}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-[#170c35] border border-pink-800/50 text-white font-mono text-base font-bold focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-pink-400">
                          ৳ BDT / 1,000
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        ১টি ফলোয়ারের মূল্য: <span className="font-mono font-bold text-pink-300">৳{(igRateInput / 1000).toFixed(4)} BDT</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">মিনিমাম ফলোয়ার অর্ডার:</label>
                        <input
                          type="number"
                          min="1"
                          value={igMinFollowers}
                          onChange={(e) => setIgMinFollowers(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg bg-[#170c35] border border-pink-900 text-white text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">ম্যাক্সিমাম ফলোয়ার অর্ডার:</label>
                        <input
                          type="number"
                          min="1000"
                          max="10000000"
                          value={igMaxFollowers}
                          onChange={(e) => setIgMaxFollowers(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg bg-[#170c35] border border-pink-900 text-white text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* Instagram Live Test Simulator */}
                    <div className="p-4 rounded-2xl bg-[#090518] border border-pink-950 space-y-2">
                      <div className="text-[11px] font-bold text-pink-300 uppercase tracking-wider flex items-center justify-between">
                        <span>লাইভ প্রাইস প্রিভিউ (টেস্টার):</span>
                        <span className="font-mono text-pink-400">৳{Math.round((testIgQty / 1000) * igRateInput)} BDT</span>
                      </div>
                      <input
                        type="range"
                        min="1000"
                        max="100000"
                        step="1000"
                        value={testIgQty}
                        onChange={(e) => setTestIgQty(Number(e.target.value))}
                        className="w-full accent-pink-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>{testIgQty.toLocaleString()} Followers</span>
                        <span>৳{Math.round((testIgQty / 1000) * igRateInput)} BDT কাস্টমার দেখবে</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button for Social Rates */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-blue-950 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>সোশ্যাল ফলোয়ার্স মূল্য সেভ করুন</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: STREAMING & OTT SUBSCRIPTIONS (NETFLIX, CRUNCHYROLL, SPOTIFY, ETC.) */}
        {/* ========================================================================= */}
        {activeTab === 'streaming' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-red-950/60 via-orange-950/40 to-purple-950/60 border border-red-800/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Tv className="w-7 h-7 text-red-400" />
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    স্ট্রিমিং ও ওটিটি সাবস্ক্রিপশন প্রাইসিং কন্ট্রোল
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  Netflix, Crunchyroll Anime, Spotify, YouTube Premium ও HIDIVE এর ১ মাস, ২ মাস, ৬ মাস ও ১ বছরের দাম যেকোনো সময় পরিবর্তন করুন।
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddServiceModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন সার্ভিস যোগ করুন</span>
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">ফিল্টার:</span>
              <button
                onClick={() => setStreamingCategoryFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  streamingCategoryFilter === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-950/40 text-slate-400 hover:text-white'
                }`}
              >
                সকল সার্ভিস ({streamingServices.length})
              </button>
              <button
                onClick={() => setStreamingCategoryFilter('streaming')}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  streamingCategoryFilter === 'streaming'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-950/40 text-slate-400 hover:text-white'
                }`}
              >
                নেটফ্লিক্স ও ভিডিও ওটিটি
              </button>
              <button
                onClick={() => setStreamingCategoryFilter('anime')}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  streamingCategoryFilter === 'anime'
                    ? 'bg-orange-600 text-white'
                    : 'bg-orange-950/40 text-slate-400 hover:text-white'
                }`}
              >
                ক্রাঞ্চিরোল ও অ্যানিমে
              </button>
              <button
                onClick={() => setStreamingCategoryFilter('music')}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  streamingCategoryFilter === 'music'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-950/40 text-slate-400 hover:text-white'
                }`}
              >
                স্পটিফাই ও মিউজিক
              </button>
            </div>

            {/* Services List with Duration Pricing Tables */}
            <div className="space-y-6">
              {streamingServices
                .filter(
                  (s) => streamingCategoryFilter === 'all' || s.category === streamingCategoryFilter
                )
                .map((service) => (
                  <div
                    key={service.id}
                    className={`bg-[#0f0720] border-2 rounded-3xl p-6 transition-all ${
                      service.serviceKey === 'netflix'
                        ? 'border-red-900/50 hover:border-red-600/60'
                        : service.serviceKey === 'crunchyroll'
                        ? 'border-orange-900/50 hover:border-orange-500/60'
                        : service.serviceKey === 'spotify'
                        ? 'border-emerald-900/50 hover:border-emerald-500/60'
                        : 'border-purple-900/50 hover:border-purple-600/60'
                    }`}
                  >
                    {/* Service Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-purple-900/40 gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#090414] border border-purple-800/40 p-2 flex items-center justify-center shrink-0">
                          {service.serviceKey === 'netflix' ? (
                            <NetflixLogo className="w-full h-full" />
                          ) : service.serviceKey === 'crunchyroll' ? (
                            <CrunchyrollLogo className="w-full h-full" />
                          ) : (
                            <div className={`w-8 h-8 rounded-lg ${service.logoBg || 'bg-purple-600'} flex items-center justify-center text-xs font-black text-white`}>
                              {service.logoText || service.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-white">{service.name}</h3>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/40">
                              {service.category}
                            </span>
                          </div>
                          <p className="text-xs text-purple-300/80 mt-0.5">{service.nameBn} · {service.badge}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleStreamingActive(service.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            service.active
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                              : 'bg-rose-950 text-rose-300 border border-rose-800/40'
                          }`}
                        >
                          {service.active ? '● একটিভ (অন)' : '○ নিষ্ক্রিয় (অফ)'}
                        </button>

                        {/* Add duration button */}
                        <button
                          type="button"
                          onClick={() => handleAddDurationToService(service.id)}
                          className="px-3 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-800/40 text-purple-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-cyan-400" />
                          <span>মেয়াদ যোগ</span>
                        </button>

                        {/* Delete service button (if not standard default) */}
                        {service.id.startsWith('custom') && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`আপনি কি সত্যিই ${service.name} ডিলিট করতে চান?`)) {
                                onDeleteStreamingService(service.id);
                                triggerSaveToast(`${service.name} ডিলিট করা হয়েছে!`);
                              }
                            }}
                            className="p-1.5 rounded-xl bg-rose-950/60 text-rose-400 hover:bg-rose-900/60 border border-rose-800/40 cursor-pointer"
                            title="Delete Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Duration Pricing Control Grid */}
                    <div className="mt-5">
                      <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          <span>মেয়াদভিত্তিক মূল্য তালিকা (Duration Pricing Table):</span>
                        </span>
                        <span className="text-[11px] text-slate-400">যেকোনো দাম পরিবর্তন করলে সরাসরি স্টোরে আপডেট হবে</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {service.durations.map((dur) => (
                          <div
                            key={dur.id}
                            className="bg-[#140a2c] rounded-2xl p-4 border border-purple-900/50 space-y-2 relative group"
                          >
                            {/* Remove duration button */}
                            {service.durations.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveDurationFromService(service.id, dur.id)}
                                className="absolute top-2 right-2 p-1 text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                                title="Remove this duration option"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <div>
                              <span className="text-xs font-bold text-white block">
                                {dur.durationLabelBn || dur.durationLabel}
                              </span>
                              <span className="text-[10px] text-slate-400">{dur.durationLabel}</span>
                            </div>

                            <div>
                              <label className="block text-[10px] text-purple-300 font-medium mb-1">
                                মূল্য (BDT):
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  min="1"
                                  value={dur.priceBdt}
                                  onChange={(e) =>
                                    handleDurationPriceChange(service.id, dur.id, Number(e.target.value))
                                  }
                                  className="w-full px-3 py-2 rounded-lg bg-[#0c051a] border border-purple-800/60 text-white font-mono font-bold text-sm focus:outline-none focus:border-cyan-400"
                                />
                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-400">
                                  ৳
                                </span>
                              </div>
                            </div>

                            {dur.savingsBadge && (
                              <div className="pt-1">
                                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800/40">
                                  {dur.savingsBadgeBn || dur.savingsBadge}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Modal: Add New Streaming Service */}
            {showAddServiceModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="w-full max-w-lg bg-[#0f0720] border border-purple-800 rounded-3xl p-6 space-y-4 shadow-2xl relative">
                  <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Tv className="w-5 h-5 text-red-400" />
                      <span>নতুন সাবস্ক্রিপশন সার্ভিস যুক্ত করুন</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddServiceModal(false)}
                      className="p-1 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateNewService} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        সার্ভিসের নাম (ইংরেজি): e.g. Disney+ Hotstar
                      </label>
                      <input
                        type="text"
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        required
                        placeholder="e.g. Disney+ Hotstar"
                        className="w-full px-3 py-2 rounded-xl bg-[#170c35] border border-purple-800 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        সার্ভিসের নাম (বাংলা):
                      </label>
                      <input
                        type="text"
                        value={newServiceNameBn}
                        onChange={(e) => setNewServiceNameBn(e.target.value)}
                        placeholder="e.g. ডিজনি প্লাস হটস্টার"
                        className="w-full px-3 py-2 rounded-xl bg-[#170c35] border border-purple-800 text-white text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">ক্যাটাগরি:</label>
                        <select
                          value={newServiceCategory}
                          onChange={(e) => setNewServiceCategory(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-[#170c35] border border-purple-800 text-white text-xs"
                        >
                          <option value="streaming">Streaming (ভিডিও ওটিটি)</option>
                          <option value="anime">Anime (অ্যানিমে)</option>
                          <option value="music">Music (মিউজিক)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">ব্যাজ / ট্যাগ:</label>
                        <input
                          type="text"
                          value={newServiceBadge}
                          onChange={(e) => setNewServiceBadge(e.target.value)}
                          placeholder="e.g. 4K Ultra HD"
                          className="w-full px-3 py-2 rounded-xl bg-[#170c35] border border-purple-800 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2">
                        ডিফল্ট ৩টি মেয়াদের মূল্য নির্ধারণ করুন (BDT):
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {newServiceDurations.map((dur, idx) => (
                          <div key={dur.id} className="p-2.5 rounded-xl bg-[#140a2c] border border-purple-900">
                            <span className="text-[10px] text-purple-300 block font-bold">{dur.durationLabel}</span>
                            <input
                              type="number"
                              min="1"
                              value={dur.priceBdt}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setNewServiceDurations((prev) =>
                                  prev.map((d, i) => (i === idx ? { ...d, priceBdt: val } : d))
                                );
                              }}
                              className="w-full px-2 py-1 mt-1 rounded bg-[#0c051a] border border-purple-800 text-white text-xs font-mono font-bold"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-purple-900/40">
                      <button
                        type="button"
                        onClick={() => setShowAddServiceModal(false)}
                        className="px-4 py-2 rounded-xl bg-purple-950 text-slate-300 text-xs font-bold hover:bg-purple-900 cursor-pointer"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold shadow-lg cursor-pointer"
                      >
                        যোগ করুন
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: FREE FIRE DIAMOND PACKAGES CONTROL */}
        {/* ========================================================================= */}
        {activeTab === 'diamonds' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-800/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-7 h-7 text-amber-400" />
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    ফ্রি ফায়ার ডায়মন্ড ও মেম্বারশিপ প্যাকেজ ম্যানেজমেন্ট
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  সকল ডায়মন্ড টিয়ার, উইকলি ও মান্থলি পাসের রেট এডিট করুন অথবা নতুন স্পেশাল প্যাকেজ যোগ করুন।
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddPkgModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন প্যাকেজ তৈরি করুন</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0f0720] p-4 rounded-2xl border border-purple-900/40">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setPkgCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    pkgCategoryFilter === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-950/40 text-slate-400 hover:text-white'
                  }`}
                >
                  সকল ({packages.length})
                </button>
                <button
                  onClick={() => setPkgCategoryFilter('diamond')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    pkgCategoryFilter === 'diamond'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-950/40 text-slate-400 hover:text-white'
                  }`}
                >
                  ডায়মন্ড টপ-আপ
                </button>
                <button
                  onClick={() => setPkgCategoryFilter('membership')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    pkgCategoryFilter === 'membership'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-950/40 text-slate-400 hover:text-white'
                  }`}
                >
                  উইকলি ও মান্থলি
                </button>
                <button
                  onClick={() => setPkgCategoryFilter('special')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    pkgCategoryFilter === 'special'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-950/40 text-slate-400 hover:text-white'
                  }`}
                >
                  স্পেশাল পাস
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="প্যাকেজ সার্চ করুন..."
                  value={pkgSearch}
                  onChange={(e) => setPkgSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-xl bg-[#170c35] border border-purple-800/50 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {packages
                .filter((p) => {
                  if (pkgCategoryFilter !== 'all' && p.category !== pkgCategoryFilter) return false;
                  if (pkgSearch) {
                    const q = pkgSearch.toLowerCase();
                    return p.name.toLowerCase().includes(q) || p.nameBn.toLowerCase().includes(q);
                  }
                  return true;
                })
                .map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-[#0f0720] border border-purple-900/50 hover:border-purple-600/60 rounded-2xl p-5 flex flex-col justify-between transition-all group"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-base font-extrabold text-white">{pkg.name}</h4>
                          <span className="text-xs text-purple-300 font-medium">{pkg.nameBn}</span>
                        </div>
                        {pkg.badge && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800/40 text-[10px] font-bold">
                            {pkg.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline justify-between my-3 py-2 px-3 rounded-xl bg-[#140a2c] border border-purple-900/40">
                        <span className="text-xs text-slate-400 font-medium">ইন-গেম পরিমাণ:</span>
                        <span className="text-sm font-bold text-cyan-300 font-mono">{pkg.diamonds}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-purple-900/40 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">বর্তমান মূল্য:</span>
                        <span className="text-lg font-black text-emerald-400 font-mono">৳{pkg.priceBdt} BDT</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => startEditPackage(pkg)}
                          className="p-2 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-800/50 cursor-pointer"
                          title="Edit Package"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`আপনি কি "${pkg.name}" ডিলিট করতে চান?`)) {
                              onDeletePackage(pkg.id);
                              triggerSaveToast('প্যাকেজ ডিলিট করা হয়েছে!');
                            }
                          }}
                          className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 cursor-pointer"
                          title="Delete Package"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Modal: Edit Existing Diamond Package */}
            {editingPkgId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="w-full max-w-md bg-[#0f0720] border border-purple-800 rounded-3xl p-6 space-y-4 shadow-2xl relative">
                  <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Edit2 className="w-4 h-4 text-cyan-400" />
                      <span>প্যাকেজ এডিট করুন</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingPkgId(null)}
                      className="p-1 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveEditedPackage} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">প্যাকেজের নাম (English):</label>
                      <input
                        type="text"
                        value={pkgName}
                        onChange={(e) => setPkgName(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-[#170c35] border border-purple-800 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">প্যাকেজের নাম (বাংলা):</label>
                      <input
                        type="text"
                        value={pkgNameBn}
                        onChange={(e) => setPkgNameBn(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#170c35] border border-purple-800 text-white text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">ডায়মন্ড পরিমাণ:</label>
                        <input
                          type="text"
                          value={pkgDiamonds}
                          onChange={(e) => setPkgDiamonds(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#170c35] border border-purple-800 text-white text-sm font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">মূল্য (BDT):</label>
                        <input
                          type="number"
                          value={pkgPrice}
                          onChange={(e) => setPkgPrice(Number(e.target.value))}
                          required
                          className="w-full px-3 py-2 rounded-xl bg-[#170c35] border border-purple-800 text-white text-sm font-mono font-bold text-emerald-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">ক্যাটাগরি:</label>
                        <select
                          value={pkgCategory}
                          onChange={(e) => setPkgCategory(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-[#170c35] border border-purple-800 text-white text-xs"
                        >
                          <option value="diamond">ডায়মন্ড</option>
                          <option value="membership">মেম্বারশিপ</option>
                          <option value="special">স্পেশাল</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">ব্যাজ / ট্যাগ:</label>
                        <input
                          type="text"
                          value={pkgBadge}
                          onChange={(e) => setPkgBadge(e.target.value)}
                          placeholder="e.g. Popular / Hot Deal"
                          className="w-full px-3 py-2 rounded-xl bg-[#170c35] border border-purple-800 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-purple-900/40">
                      <button
                        type="button"
                        onClick={() => setEditingPkgId(null)}
                        className="px-4 py-2 rounded-xl bg-purple-950 text-slate-300 text-xs font-bold hover:bg-purple-900 cursor-pointer"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-lg cursor-pointer"
                      >
                        সেভ করুন
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal: Create New Diamond Package */}
            {showAddPkgModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="w-full max-w-md bg-[#0f0720] border border-purple-800 rounded-3xl p-6 space-y-4 shadow-2xl relative">
                  <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-cyan-400" />
                      <span>নতুন ডায়মন্ড প্যাকেজ যোগ করুন</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddPkgModal(false)}
                      className="p-1 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreatePackage} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">প্যাকেজের নাম (English): e.g. 1500 Diamonds</label>
                      <input
                        type="text"
                        value={pkgName}
                        onChange={(e) => setPkgName(e.target.value)}
                        required
                        placeholder="e.g. 1500 Diamonds"
                        className="w-full px-3 py-2 rounded-xl bg-[#170c35] border border-purple-800 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">প্যাকেজের নাম (বাংলা): e.g. ১৫০০ ডায়মন্ড</label>
                      <input
                        type="text"
                        value={pkgNameBn}
                        onChange={(e) => setPkgNameBn(e.target.value)}
                        placeholder="e.g. ১৫০০ ডায়মন্ড"
                        className="w-full px-3 py-2 rounded-xl bg-[#170c35] border border-purple-800 text-white text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">ডায়মন্ড পরিমাণ:</label>
                        <input
                          type="text"
                          value={pkgDiamonds}
                          onChange={(e) => setPkgDiamonds(e.target.value)}
                          placeholder="e.g. 1500"
                          className="w-full px-3 py-2 rounded-xl bg-[#170c35] border border-purple-800 text-white text-sm font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">মূল্য (BDT):</label>
                        <input
                          type="number"
                          value={pkgPrice || ''}
                          onChange={(e) => setPkgPrice(Number(e.target.value))}
                          required
                          placeholder="e.g. 950"
                          className="w-full px-3 py-2 rounded-xl bg-[#170c35] border border-purple-800 text-white text-sm font-mono font-bold text-emerald-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">ক্যাটাগরি:</label>
                        <select
                          value={pkgCategory}
                          onChange={(e) => setPkgCategory(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-[#170c35] border border-purple-800 text-white text-xs"
                        >
                          <option value="diamond">ডায়মন্ড</option>
                          <option value="membership">মেম্বারশিপ</option>
                          <option value="special">স্পেশাল</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">ব্যাজ / ট্যাগ:</label>
                        <input
                          type="text"
                          value={pkgBadge}
                          onChange={(e) => setPkgBadge(e.target.value)}
                          placeholder="e.g. Hot Deal"
                          className="w-full px-3 py-2 rounded-xl bg-[#170c35] border border-purple-800 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-purple-900/40">
                      <button
                        type="button"
                        onClick={() => setShowAddPkgModal(false)}
                        className="px-4 py-2 rounded-xl bg-purple-950 text-slate-300 text-xs font-bold hover:bg-purple-900 cursor-pointer"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white text-xs font-bold shadow-lg cursor-pointer"
                      >
                        তৈরি করুন
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: ADD MONEY REQUESTS & BALANCE APPROVAL */}
        {/* ========================================================================= */}
        {activeTab === 'addmoney' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Top Stats Banner */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-[#110724] border border-amber-800/40 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between text-xs text-amber-300 font-medium mb-1">
                  <span>অপেক্ষমান রিকোয়েস্ট</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-amber-400 flex items-center gap-2">
                  <span>{pendingAddMoneyCount}</span>
                  {pendingAddMoneyCount > 0 && (
                    <span className="text-[10px] bg-amber-500 text-black font-black px-2 py-0.5 rounded-full animate-pulse">
                      Action Required
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-amber-300/80 mt-1">অনুমোদনের জন্য অপেক্ষমান</div>
              </div>

              <div className="bg-[#110724] border border-emerald-800/40 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between text-xs text-emerald-300 font-medium mb-1">
                  <span>অনুমোদিত মোট ক্রেডিট</span>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                  ৳{approvedAddMoneyAmount.toLocaleString()} <span className="text-xs font-sans text-slate-400">BDT</span>
                </div>
                <div className="text-[10px] text-emerald-300/80 mt-1">সাইট ব্যালেন্সে যুক্ত হয়েছে</div>
              </div>

              <div className="bg-[#110724] border border-purple-800/40 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between text-xs text-purple-300 font-medium mb-1">
                  <span>মোট ডিপোজিট রিকোয়েস্ট</span>
                  <Coins className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-white">
                  {addMoneyRequests.length}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">সর্বমোট জমা রিকোয়েস্ট</div>
              </div>

              <div className="bg-[#110724] border border-cyan-800/40 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between text-xs text-cyan-300 font-medium mb-1">
                  <span>অ্যাক্টিভ ইউজার ব্যালেন্স</span>
                  <Wallet className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-cyan-400">
                  ৳{userWallet.balance.toLocaleString()} <span className="text-xs font-sans text-slate-400">Coins</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">{userWallet.phone || '01712345678'}</div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-[#0f0720] border border-purple-900/40 rounded-3xl p-5 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <span className="text-xs font-bold text-slate-400">ফিল্টার:</span>
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setAddMoneyFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                        addMoneyFilter === st
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'bg-purple-950/40 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st === 'all'
                        ? `সকল (${addMoneyRequests.length})`
                        : st === 'pending'
                        ? `পেন্ডিং (${pendingAddMoneyCount})`
                        : st === 'approved'
                        ? `অনুমোদিত (${addMoneyRequests.filter((r) => r.status === 'approved').length})`
                        : `বাতিল (${addMoneyRequests.filter((r) => r.status === 'rejected').length})`}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={addMoneySearch}
                    onChange={(e) => setAddMoneySearch(e.target.value)}
                    placeholder="নম্বর বা TrxID দিয়ে খুঁজুন..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#170c35] border border-purple-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Add Money Requests Table / Cards */}
            <div className="space-y-4">
              {addMoneyRequests
                .filter((req) => {
                  if (addMoneyFilter !== 'all' && req.status !== addMoneyFilter) return false;
                  if (addMoneySearch.trim()) {
                    const q = addMoneySearch.trim().toLowerCase();
                    return (
                      req.id.toLowerCase().includes(q) ||
                      req.userPhone.toLowerCase().includes(q) ||
                      req.senderNumber.toLowerCase().includes(q) ||
                      req.trxId.toLowerCase().includes(q) ||
                      (req.userName && req.userName.toLowerCase().includes(q))
                    );
                  }
                  return true;
                })
                .map((req) => {
                  const isPending = req.status === 'pending';
                  const isApproved = req.status === 'approved';
                  const isRejected = req.status === 'rejected';

                  return (
                    <div
                      key={req.id}
                      className={`p-5 rounded-3xl border transition-all ${
                        isPending
                          ? 'bg-[#140b28] border-amber-600/60 shadow-lg shadow-amber-950/30'
                          : isApproved
                          ? 'bg-[#0f0b20] border-emerald-900/50'
                          : 'bg-[#0f071a] border-rose-950/60 opacity-80'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Left: Request ID & User Info */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-black text-amber-400 text-sm">{req.id}</span>
                            <span className="text-[11px] text-slate-400">
                              {new Date(req.createdAt).toLocaleDateString()} · {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                isApproved
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                                  : isRejected
                                  ? 'bg-rose-950 text-rose-300 border border-rose-700/60'
                                  : 'bg-amber-950 text-amber-300 border border-amber-700/60 animate-pulse'
                              }`}
                            >
                              {isApproved && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                              {isRejected && <XCircle className="w-3 h-3 text-rose-400" />}
                              {isPending && <Clock className="w-3 h-3 text-amber-400" />}
                              <span>
                                {isApproved ? 'অনুমোদিত (Credited)' : isRejected ? 'বাতিলকৃত (Rejected)' : 'অপেক্ষমান (Pending)'}
                              </span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-slate-400">অ্যাকাউন্ট মোবাইল:</span>
                            <span className="font-mono font-bold text-white bg-black/40 px-2 py-0.5 rounded border border-purple-900/40">
                              {req.userPhone}
                            </span>
                            {req.userName && (
                              <span className="text-purple-300 font-medium">({req.userName})</span>
                            )}
                          </div>
                        </div>

                        {/* Middle: Payment Method, Sender Number & TrxID */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-2xl bg-black/40 border border-purple-900/40 text-xs font-mono">
                          <div>
                            <span className="text-slate-400 block text-[10px]">পেমেন্ট মাধ্যম</span>
                            <div className="flex items-center gap-1.5 font-bold text-white mt-0.5">
                              {req.paymentMethod === 'bkash' ? (
                                <>
                                  <BkashLogo className="w-4 h-4 shrink-0" />
                                  <span className="text-[#E2136E]">bKash Personal</span>
                                </>
                              ) : (
                                <>
                                  <NagadLogo className="w-4 h-4 shrink-0" />
                                  <span className="text-[#f7941d]">Nagad Personal</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div>
                            <span className="text-slate-400 block text-[10px]">প্রেরক নম্বর (Sender)</span>
                            <span className="font-bold text-slate-200 mt-0.5 block">{req.senderNumber}</span>
                          </div>

                          <div className="col-span-2 sm:col-span-1">
                            <span className="text-slate-400 block text-[10px]">Transaction ID (TrxID)</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-bold text-amber-300 tracking-wider">{req.trxId}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(req.trxId);
                                  setCopiedTrxId(req.id);
                                  setTimeout(() => setCopiedTrxId(null), 2000);
                                }}
                                className="p-1 rounded hover:bg-purple-900/50 text-slate-400 hover:text-white cursor-pointer"
                                title="Copy TrxID"
                              >
                                {copiedTrxId === req.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Right: Amount & Actions */}
                        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0">
                          <div className="text-left lg:text-right">
                            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold">
                              ডিপোজিট ব্যালেন্স
                            </span>
                            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                              ৳{req.amountBdt.toLocaleString()} <span className="text-xs font-sans text-amber-300 font-bold">AG Coins</span>
                            </div>
                          </div>

                          {/* Approval / Reject Controls */}
                          <div className="flex items-center gap-2">
                            {isPending && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onApproveAddMoney(req.id);
                                    triggerSaveToast(`৳${req.amountBdt} BDT সফলভাবে ইউজারের অ্যাকাউন্টে ক্রেডিট করা হয়েছে!`);
                                  }}
                                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950 flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>অনুমোদন করুন (Approve)</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setRejectingReqId(req.id);
                                    setRejectReason('');
                                  }}
                                  className="px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold cursor-pointer transition-colors"
                                >
                                  <span>বাতিল</span>
                                </button>
                              </>
                            )}

                            {isApproved && (
                              <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/40">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>ব্যালেন্সে ক্রেডিট সম্পন্ন</span>
                              </div>
                            )}

                            {isRejected && (
                              <div className="text-[11px] font-bold text-rose-400 flex items-center gap-1 bg-rose-950/60 px-3 py-1.5 rounded-xl border border-rose-800/40">
                                <XCircle className="w-3.5 h-3.5" />
                                <span>অনুরোধ বাতিল করা হয়েছে</span>
                              </div>
                            )}

                            {onDeleteAddMoney && (
                              <button
                                type="button"
                                onClick={() => onDeleteAddMoney(req.id)}
                                className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Reject reason input prompt if active */}
                      {rejectingReqId === req.id && (
                        <div className="mt-3 p-3.5 rounded-2xl bg-[#1b0816] border border-rose-800/70 space-y-2">
                          <label className="block text-xs font-bold text-rose-300">
                            বাতিল করার কারণ লিখুন (ঐচ্ছিক):
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              placeholder="e.g. TrxID মেলেনি বা টাকা জমা হয়নি"
                              className="flex-1 px-3 py-1.5 rounded-xl bg-black/60 border border-rose-800 text-xs text-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                onRejectAddMoney(req.id, rejectReason || undefined);
                                setRejectingReqId(null);
                                triggerSaveToast('রিকোয়েস্ট বাতিল করা হয়েছে।');
                              }}
                              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
                            >
                              নিশ্চিত বাতিল
                            </button>
                            <button
                              type="button"
                              onClick={() => setRejectingReqId(null)}
                              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs cursor-pointer"
                            >
                              পিছনে যান
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Admin Note display */}
                      {req.adminNote && !isPending && (
                        <div className="mt-2 text-[11px] text-slate-400 bg-black/30 p-2 rounded-xl border border-purple-900/30">
                          <span className="font-semibold text-purple-300">অ্যাডমিন নোট: </span>
                          {req.adminNote}
                        </div>
                      )}
                    </div>
                  );
                })}

              {addMoneyRequests.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs bg-[#0f0720] rounded-3xl border border-purple-900/40 space-y-2">
                  <Coins className="w-10 h-10 mx-auto text-amber-400 opacity-60" />
                  <p>এখনো কোনো অ্যাড মানি রিকোয়েস্ট জমা হয়নি।</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: ORDERS MANAGEMENT (SEARCH, STATUS CHANGER, ADMIN NOTES) */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Filter and Search Bar */}
            <div className="bg-[#0f0720] border border-purple-900/40 rounded-3xl p-5 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <span className="text-xs font-bold text-slate-400">স্ট্যাটাস:</span>
                  {['all', 'pending', 'processing', 'completed', 'rejected'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                        orderStatusFilter === st
                          ? 'bg-cyan-600 text-white shadow-md'
                          : 'bg-purple-950/40 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st} ({st === 'all' ? orders.length : orders.filter((o) => o.status === st).length})
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={orderServiceFilter}
                    onChange={(e) => setOrderServiceFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[#170c35] border border-purple-800 text-xs text-white"
                  >
                    <option value="all">সকল সার্ভিস টাইপ</option>
                    <option value="free_fire">ফ্রি ফায়ার ডায়মন্ড</option>
                    <option value="facebook_followers">ফেসবুক ফলোয়ার্স</option>
                    <option value="instagram_followers">ইনস্টাগ্রাম ফলোয়ার্স</option>
                    <option value="streaming_subscription">স্ট্রিমিং সাবস্ক্রিপশন</option>
                  </select>

                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search ID, UID, TrxID, Phone..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="pl-9 pr-3 py-1.5 rounded-xl bg-[#170c35] border border-purple-800 text-white text-xs w-48 sm:w-64 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#0f0720] border border-purple-900/40 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#140a2c] text-slate-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Order ID & Date</th>
                      <th className="py-3 px-4">সার্ভিস & প্যাকেজ</th>
                      <th className="py-3 px-4">UID / টার্গেট লিংক / ইমেইল</th>
                      <th className="py-3 px-4">কাস্টমার ফোন</th>
                      <th className="py-3 px-4">মূল্য</th>
                      <th className="py-3 px-4">পেমেন্ট মেথড & TrxID</th>
                      <th className="py-3 px-4">স্ট্যাটাস</th>
                      <th className="py-3 px-4">অ্যাডমিন নোট</th>
                      <th className="py-3 px-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-900/30">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-400">
                          কোনো অর্ডার পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-purple-950/20">
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                              <span>{ord.id}</span>
                              <button
                                onClick={() => handleCopy(ord.id, `id-${ord.id}`)}
                                className="text-slate-500 hover:text-white cursor-pointer"
                                title="Copy Order ID"
                              >
                                {copiedKey === `id-${ord.id}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {new Date(ord.createdAt).toLocaleDateString()} {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{ord.packageNameBn || ord.packageName}</div>
                            <div className="text-[10px] text-purple-300">{ord.diamonds}</div>
                          </td>

                          <td className="py-3.5 px-4 max-w-[180px]">
                            <div className="font-mono text-white text-xs truncate" title={ord.playerUid}>
                              {ord.playerUid}
                            </div>
                            {ord.playerName && (
                              <div className="text-[10px] text-slate-400">Name: {ord.playerName}</div>
                            )}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            {ord.contact || 'N/A'}
                          </td>

                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                            ৳{ord.amountBdt} BDT
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1">
                              <span className="uppercase text-[10px] font-black px-1.5 py-0.5 rounded bg-purple-950 text-purple-300">
                                {ord.paymentMethod}
                              </span>
                            </div>
                            <div className="font-mono text-slate-300 flex items-center gap-1 mt-1">
                              <span className="font-bold text-xs">{ord.trxId}</span>
                              <button
                                onClick={() => handleCopy(ord.trxId, `trx-${ord.id}`)}
                                className="text-slate-500 hover:text-white cursor-pointer"
                                title="Copy TrxID"
                              >
                                {copiedKey === `trx-${ord.id}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <select
                              value={ord.status}
                              onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer ${
                                ord.status === 'completed'
                                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600'
                                  : ord.status === 'processing'
                                  ? 'bg-blue-950/80 text-blue-300 border-blue-600'
                                  : ord.status === 'rejected'
                                  ? 'bg-rose-950/80 text-rose-300 border-rose-600'
                                  : 'bg-amber-950/80 text-amber-300 border-amber-600'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="completed">Completed</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-4 max-w-[200px]">
                            <input
                              type="text"
                              defaultValue={ord.adminNote || ''}
                              onBlur={(e) => {
                                if (e.target.value !== ord.adminNote) {
                                  onUpdateOrderStatus(ord.id, ord.status, e.target.value);
                                  triggerSaveToast('অ্যাডমিন নোট সেভ হয়েছে!');
                                }
                              }}
                              placeholder="নোট লিখুন..."
                              className="w-full px-2 py-1 rounded bg-[#170c35] border border-purple-850 text-slate-300 text-xs focus:outline-none focus:border-cyan-400"
                            />
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            {onDeleteOrder && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`আপনি কি সত্যিই অর্ডার ${ord.id} মুছে ফেলতে চান?`)) {
                                    onDeleteOrder(ord.id);
                                    triggerSaveToast('অর্ডার ডিলিট করা হয়েছে!');
                                  }
                                }}
                                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60 border border-rose-900/40 cursor-pointer"
                                title="Delete Order"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* TAB 6: PAYMENTS & BKASH CHECKOUT API GATEWAY CONFIGURATION */}
        {/* ========================================================================= */}
        {activeTab === 'payments' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-pink-950/70 via-purple-950/70 to-indigo-950/70 border border-pink-700/50 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg">
                    <BkashLogo className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    bKash Automated Gateway & পেমেন্ট সেটিংস
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  বিকাশ ও নগদ পার্সোনাল সেন্ড মানি নম্বর এবং হেল্পলাইন কন্টাক্ট নম্বর পরিচালনা করুন।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-600">
                  MFS Send Money: Active
                </span>
              </div>
            </div>

            <form onSubmit={handleSavePaymentsAndSettings} className="space-y-6">
              {/* SECTION: MANUAL PERSONAL MFS NUMBERS & HELPLINE */}
              <div className="bg-[#0f0720] border border-purple-900/50 rounded-3xl p-6 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-purple-900/40">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="text-base font-bold text-white">
                      মোবাইল ফাইন্যান্সিয়াল সার্ভিস (bKash ও Nagad পার্সোনাল নম্বর)
                    </h3>
                    <p className="text-xs text-purple-300/80">
                      গ্রাহকরা চেকআউটে এই নম্বরগুলো দেখে Send Money করবে এবং TrxID জমা দেবে
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* bKash Personal Number */}
                  <div>
                    <label className="block text-xs font-bold text-pink-400 uppercase tracking-wider mb-1.5">
                      বিকাশ পার্সোনাল নম্বর (Send Money):
                    </label>
                    <input
                      type="text"
                      value={editBkash}
                      onChange={(e) => setEditBkash(e.target.value)}
                      required
                      placeholder="015XXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#170c35] border border-pink-800/50 text-white font-mono font-bold focus:outline-none focus:border-pink-400 text-sm"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      গ্রাহক বিকাশ অ্যাপ বা *247# ডায়াল করে Send Money করবে
                    </span>
                  </div>

                  {/* Nagad Personal Number */}
                  <div>
                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                      নগদ পার্সোনাল নম্বর (Send Money):
                    </label>
                    <input
                      type="text"
                      value={editNagad}
                      onChange={(e) => setEditNagad(e.target.value)}
                      required
                      placeholder="015XXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#170c35] border border-amber-800/50 text-white font-mono font-bold focus:outline-none focus:border-amber-400 text-sm"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      গ্রাহক নগদ অ্যাপ বা *167# ডায়াল করে Send Money করবে
                    </span>
                  </div>
                </div>

                {/* Helpline & Support Hours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-purple-900/40">
                  <div>
                    <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
                      হোয়াটসঅ্যাপ হেল্পলাইন নম্বর:
                    </label>
                    <input
                      type="text"
                      value={editWhatsapp}
                      onChange={(e) => setEditWhatsapp(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#170c35] border border-emerald-800/50 text-white font-mono font-bold focus:outline-none focus:border-emerald-400 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1.5">
                      সাপোর্ট সময়সূচী (বাংলা):
                    </label>
                    <input
                      type="text"
                      value={editSupportHoursBn}
                      onChange={(e) => setEditSupportHoursBn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#170c35] border border-cyan-800/50 text-white text-sm"
                    />
                  </div>
                </div>

                {/* Announcement Notices */}
                <div className="space-y-3 pt-3 border-t border-purple-900/40">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      ওয়েবসাইট টপ নোটিশ / অ্যানাউন্সমেন্ট (বাংলা):
                    </label>
                    <textarea
                      rows={2}
                      value={editNoticeBn}
                      onChange={(e) => setEditNoticeBn(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#170c35] border border-purple-800/50 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      ওয়েবসাইট টপ নোটিশ / অ্যানাউন্সমেন্ট (English):
                    </label>
                    <textarea
                      rows={2}
                      value={editNoticeEn}
                      onChange={(e) => setEditNoticeEn(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#170c35] border border-purple-800/50 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-95 text-white font-bold text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>পেমেন্ট ও হেল্পলাইন সেটিংস সেভ করুন</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: SETTINGS, SECURITY & PASSWORD RESET */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Admin Password Change Form */}
            <div className="bg-[#0f0720] border border-purple-900/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-purple-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 shadow-md">
                    <div className="w-full h-full bg-[#0d071f] rounded-[10px] flex items-center justify-center">
                      <Key className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">অ্যাডমিন পাসওয়ার্ড পরিবর্তন (Change Admin Password)</h3>
                    <p className="text-xs text-purple-300/80">
                      আপনার অ্যাডমিন অ্যাকাউন্টের জন্য নতুন সিকিউরিটি পাসওয়ার্ড সেট করুন
                    </p>
                  </div>
                </div>

                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                  <Shield className="w-3.5 h-3.5" />
                  <span>সিকিউর</span>
                </span>
              </div>

              {/* Current Password Status Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-[#120826] border border-purple-800/40 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-bold text-white text-sm">
                      {customAdminPassword ? 'কাস্টম পাসওয়ার্ড সক্রিয়' : 'ডিফল্ট মাস্টার পাসওয়ার্ড সক্রিয়'}
                    </span>
                  </div>
                  {customAdminPassword && (
                    <button
                      type="button"
                      onClick={handleResetToDefaultPassword}
                      className="px-2.5 py-1 rounded-lg bg-rose-950/80 text-rose-300 hover:bg-rose-900 border border-rose-800 text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      ডিফল্ট পাসওয়ার্ডে রিসেট করুন
                    </button>
                  )}
                </div>

                <p className="text-slate-300 leading-relaxed">
                  {customAdminPassword
                    ? 'আপনি একটি কাস্টম পাসওয়ার্ড সেট করেছেন। এটি আপনার ব্রাউজারে সুরক্ষিতভাবে সংরক্ষিত রয়েছে এবং স্থায়ী থাকবে।'
                    : 'বর্তমানে সিস্টেমের ডিফল্ট পাসওয়ার্ড সক্রিয় রয়েছে (আরাফাত সনি এক এক দুই দুই / Arafat Sony 1122)। নিচের ফর্মটি ব্যবহার করে যেকোনো সময় আপনার নিজস্ব নতুন পাসওয়ার্ড সেট করতে পারবেন।'}
                </p>
              </div>

              {/* Password Change Form */}
              <form onSubmit={handleChangeAdminPassword} className="space-y-4">
                {/* Current Password Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    ১. বর্তমান পাসওয়ার্ড (Current Password) *
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      required
                      value={currentPassInput}
                      onChange={(e) => {
                        setCurrentPassInput(e.target.value);
                        setPasswordChangeError(null);
                      }}
                      placeholder="বর্তমান পাসওয়ার্ড দিন..."
                      className="w-full pl-4 pr-11 py-3 rounded-xl bg-[#160a2c] border border-purple-800/60 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password & Confirm New Password Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      ২. নতুন পাসওয়ার্ড (New Password) *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        required
                        value={newPassInput}
                        onChange={(e) => {
                          setNewPassInput(e.target.value);
                          setPasswordChangeError(null);
                        }}
                        placeholder="কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড..."
                        className="w-full pl-4 pr-11 py-3 rounded-xl bg-[#160a2c] border border-purple-800/60 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      ৩. নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm) *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        required
                        value={confirmPassInput}
                        onChange={(e) => {
                          setConfirmPassInput(e.target.value);
                          setPasswordChangeError(null);
                        }}
                        placeholder="নতুন পাসওয়ার্ডটি আবার লিখুন..."
                        className="w-full pl-4 pr-11 py-3 rounded-xl bg-[#160a2c] border border-purple-800/60 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                      >
                        {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {passwordChangeError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{passwordChangeError}</span>
                  </div>
                )}

                {/* Success Banner */}
                {passwordChangeSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{passwordChangeSuccess}</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-purple-950 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  >
                    <Key className="w-4 h-4" />
                    <span>পাসওয়ার্ড পরিবর্তন ও সেভ করুন</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Factory Reset Danger Zone */}
            <div className="bg-[#180812] border-2 border-rose-900/60 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-rose-500" />
                <div>
                  <h3 className="text-lg font-bold text-white">রিসেট ডিফল্টস (Reset to Factory Defaults)</h3>
                  <p className="text-xs text-rose-300/80">
                    সকল প্রোডাক্ট, স্ট্রিমিং ও সোশ্যাল রেট প্রাথমিক ফ্যাক্টরি ডিফল্টে ফিরিয়ে নিতে এখানে ক্লিক করুন।
                  </p>
                </div>
              </div>

              {!showResetConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="px-5 py-2.5 rounded-xl bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800 text-xs font-bold cursor-pointer"
                >
                  ফ্যাক্টরি ডিফল্টে রিসেট করুন
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-black/60 border border-rose-600 space-y-3">
                  <p className="text-xs text-rose-200 font-bold">
                    ⚠️ আপনি কি নিশ্চিত? আপনার কাস্টম মূল্য ও সার্ভিস সেটিংস ডিফল্টে রিসেট হয়ে যাবে।
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleExecuteReset}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
                    >
                      হ্যাঁ, রিসেট করুন
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 cursor-pointer"
                    >
                      বাতিল
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
