import React, { useState, useEffect } from 'react';
import {
  AddMoneyRequest,
  AuthUser,
  DiamondPackage,
  Language,
  Order,
  OrderStatus,
  PackageCategory,
  PaymentMethod,
  ServiceType,
  SiteConfig,
  StreamingServiceItem,
  StreamingSubscription,
  UserWallet,
} from './types';
import {
  DEFAULT_SITE_CONFIG,
  DEFAULT_USER_WALLET,
  INITIAL_ADD_MONEY_REQUESTS,
  INITIAL_ORDERS,
  INITIAL_PACKAGES,
  INITIAL_STREAMING_CATALOG,
} from './data/initialData';
import { TopNoticeTicker } from './components/TopNoticeTicker';
import { Navbar } from './components/Navbar';
import { HeroBannerSlider } from './components/HeroBannerSlider';
import { QuickSocialActions } from './components/QuickSocialActions';
import { PaymentBanner } from './components/PaymentBanner';
import { CategorizedProductGrid } from './components/CategorizedProductGrid';
import { LiveRecentOrders } from './components/LiveRecentOrders';
import { FloatingWidgets } from './components/FloatingWidgets';
import { ActiveOrderSelection, OrderModal } from './components/OrderModal';
import { AddMoneyModal } from './components/AddMoneyModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { OrderTracker } from './components/OrderTracker';
import { HowToOrder } from './components/HowToOrder';
import { PaymentGuide } from './components/PaymentGuide';
import { AdminPanel } from './components/AdminPanel';
import { ContactSection } from './components/ContactSection';
import { LegalModal } from './components/LegalModal';
import { Footer } from './components/Footer';
import { ToastProvider, useToast } from './context/ToastContext';

const STORAGE_KEYS = {
  PACKAGES: 'arafat_gaming_packages_v2',
  ORDERS: 'arafat_gaming_orders_v2',
  CONFIG: 'arafat_gaming_config_v1',
  LANG: 'arafat_gaming_lang_v1',
  STREAMING: 'arafat_gaming_streaming_services_v1',
  ADD_MONEY: 'arafat_gaming_add_money_requests_v1',
  USER_WALLET: 'arafat_gaming_user_wallet_v1',
  CURRENT_USER: 'arafat_gaming_current_user_v1',
};

function MainApp() {
  const { showToast, notifyOrderStatusChange } = useToast();

  // Clear any legacy cached packages with old prices
  useEffect(() => {
    try {
      localStorage.removeItem('arafat_gaming_packages_v1');
    } catch {}
  }, []);

  // 1. Language state
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANG);
      return (saved as Language) || 'bn';
    } catch {
      return 'bn';
    }
  });

  // 2. Site Configuration state
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return saved ? JSON.parse(saved) : DEFAULT_SITE_CONFIG;
    } catch {
      return DEFAULT_SITE_CONFIG;
    }
  });

  // 3. Diamond Packages state
  const [packages, setPackages] = useState<DiamondPackage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PACKAGES);
      if (saved) {
        const parsed: DiamondPackage[] = JSON.parse(saved);
        const hasNewPacks =
          parsed.some((p) => p.id === 'pack-mystery-99' && Array.isArray(p.rewardsList)) &&
          parsed.some((p) => p.id === 'pack-310');
        if (!hasNewPacks) {
          return INITIAL_PACKAGES;
        }
        return parsed;
      }
      return INITIAL_PACKAGES;
    } catch {
      return INITIAL_PACKAGES;
    }
  });

  // 4. Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // 5. Streaming & OTT Services state
  const [streamingServices, setStreamingServices] = useState<StreamingServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STREAMING);
      return saved ? JSON.parse(saved) : INITIAL_STREAMING_CATALOG;
    } catch {
      return INITIAL_STREAMING_CATALOG;
    }
  });

  // 6. User Wallet & Balance
  const [userWallet, setUserWallet] = useState<UserWallet>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_WALLET);
      return saved ? JSON.parse(saved) : DEFAULT_USER_WALLET;
    } catch {
      return DEFAULT_USER_WALLET;
    }
  });

  // 7. Add Money Deposit Requests
  const [addMoneyRequests, setAddMoneyRequests] = useState<AddMoneyRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADD_MONEY);
      return saved ? JSON.parse(saved) : INITIAL_ADD_MONEY_REQUESTS;
    } catch {
      return INITIAL_ADD_MONEY_REQUESTS;
    }
  });

  // 8. Logged in Client / User Profile state (Single-click Google & email account)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<string>('home');
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [addMoneyModalOpen, setAddMoneyModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<DiamondPackage | null>(null);
  const [activeSelection, setActiveSelection] = useState<ActiveOrderSelection | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('bkash');
  const [trackingSearchId, setTrackingSearchId] = useState<string>('');
  const [adminOpen, setAdminOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; type: 'privacy' | 'terms' }>({
    isOpen: false,
    type: 'privacy',
  });

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, lang);
    } catch {}
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    } catch {}
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
    } catch {}
  }, [packages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STREAMING, JSON.stringify(streamingServices));
    } catch {}
  }, [streamingServices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_WALLET, JSON.stringify(userWallet));
    } catch {}
  }, [userWallet]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADD_MONEY, JSON.stringify(addMoneyRequests));
    } catch {}
  }, [addMoneyRequests]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch {}
  }, [currentUser]);

  // Dynamic SEO Synchronization per section & language
  useEffect(() => {
    const SEO_CONFIG: Record<string, { titleBn: string; titleEn: string; descBn: string; descEn: string }> = {
      home: {
        titleBn: 'ARAFAT GAMING | Free Fire Top-Up, FB Followers & OTT Subscriptions',
        titleEn: 'ARAFAT GAMING | Free Fire Top-Up, FB Followers & OTT Subscriptions',
        descBn: 'বাংলাদেশের বিশ্বস্ত ডিজিটাল সার্ভিস শপ। ফ্রি ফায়ার ডায়মন্ড, ফেসবুক ফলোয়ার্স এবং নেটফ্লিক্স ও ক্রাঞ্চিরোল ওটিটি সাবস্ক্রিপশন নিন সবচেয়ে কম মূল্যে।',
        descEn: 'Trusted Free Fire diamond top-up, high-retention Facebook followers, and Netflix/Crunchyroll streaming subscriptions in Bangladesh.',
      },
      packages: {
        titleBn: 'ডায়মন্ড প্যাকেজসমূহ ও দাম | ARAFAT GAMING - Free Fire BD',
        titleEn: 'Free Fire Diamond Packages & Prices in BD | ARAFAT GAMING',
        descBn: 'ফ্রি ফায়ার ডায়মন্ড প্যাকেজের সর্বশেষ আপডেট মূল্য তালিকা। ১ ডায়মন্ড থেকে ২১৮০ ডায়মন্ড এবং উইকলি ও মান্থলি মেম্বারশিপ সাশ্রয়ী মূল্যে কিনুন।',
        descEn: 'Check latest Free Fire diamond package prices in Bangladesh. Regular diamonds, Weekly and Monthly VIP memberships with instant UID top-up.',
      },
      'facebook-followers': {
        titleBn: 'ফেসবুক ফলোয়ার্স ক্যালকুলেটর ও মূল্য | ARAFAT GAMING BD',
        titleEn: 'Facebook Followers & Price Calculator | ARAFAT GAMING',
        descBn: 'আপনার ফেসবুক পেজ বা প্রোফাইলের জন্য ১,০০০ থেকে ১,০০,০০০ পর্যন্ত রিয়েল ফলোয়ার্স লাইভ হিসাব করে অর্ডার করুন।',
        descEn: 'Calculate and order 1,000 to 100,000 Facebook followers for page or profile with instant delivery in Bangladesh.',
      },
      'streaming-subscriptions': {
        titleBn: 'নেটফ্লিক্স, ক্রাঞ্চিরোল ও ওটিটি সাবস্ক্রিপশন | ARAFAT GAMING',
        titleEn: 'Netflix, Crunchyroll Anime & OTT Subscriptions | ARAFAT GAMING',
        descBn: 'নেটফ্লিক্স ৪K আল্ট্রা এইচডি, ক্রাঞ্চিরোল অ্যানিমে মেগা ফ্যান, স্পটিফাই ও ইউটিউব প্রিমিয়াম সাশ্রয়ী মূল্যে কিনুন ফুল রিপ্লেসমেন্ট ওয়ারেন্টি সহ।',
        descEn: 'Buy genuine Netflix 4K, Crunchyroll anime pass, Spotify and YouTube Premium with replacement warranty in BD.',
      },
      'how-to-order': {
        titleBn: 'কীভাবে অর্ডার করবেন? (টপ-আপ গাইড) | ARAFAT GAMING',
        titleEn: 'How to Order Free Fire Diamonds | ARAFAT GAMING Guide',
        descBn: 'সহজ ৪টি ধাপে বিকাশ বা নগদ থেকে টাকা পাঠিয়ে ফ্রি ফায়ার ডায়মন্ড টপ-আপ করার সম্পূর্ণ নিয়ম জানুন।',
        descEn: 'Step-by-step guide on how to order Free Fire diamonds using bKash and Nagad personal Send Money.',
      },
      payment: {
        titleBn: 'পেমেন্ট নির্দেশিকা (বিকাশ, নগদ ও রকেট) | ARAFAT GAMING',
        titleEn: 'bKash, Nagad & Rocket Payment Guide | ARAFAT GAMING',
        descBn: 'বিকাশ, নগদ ও রকেট পার্সোনাল নম্বরে (01575630127) কীভাবে Send Money করবেন এবং TrxID পাবেন তার বিস্তারিত নির্দেশিকা।',
        descEn: 'Detailed instructions to Send Money to our official bKash, Nagad, and Rocket numbers and retrieve Transaction ID.',
      },
      track: {
        titleBn: 'অর্ডার ট্র্যাকিং (রিয়েল-টাইম স্ট্যাটাস) | ARAFAT GAMING',
        titleEn: 'Track Your Top-Up Order | ARAFAT GAMING Status',
        descBn: 'আপনার Order ID অথবা Player UID দিয়ে ডায়মন্ড টপ-আপ অর্ডারের লাইভ প্রসেসিং এবং ডেলিভারি স্ট্যাটাস চেক করুন।',
        descEn: 'Track your Free Fire diamond top-up order status in real time with your Order ID or Player UID.',
      },
      contact: {
        titleBn: 'যোগাযোগ ও সরাসরি সাপোর্ট | ARAFAT GAMING',
        titleEn: 'Contact Helpline & Support | ARAFAT GAMING',
        descBn: 'যেকোনো জিজ্ঞাসা বা টপ-আপ সমস্যার দ্রুত সমাধানের জন্য সরাসরি আমাদের হোয়াটসঅ্যাপ ও হেল্পলাইনে যোগাযোগ করুন।',
        descEn: 'Get in touch with ARAFAT GAMING support team on WhatsApp for instant assistance with your diamond top-up.',
      },
      admin: {
        titleBn: 'Admin Panel | ARAFAT GAMING',
        titleEn: 'Admin Panel | ARAFAT GAMING',
        descBn: 'Secure admin control dashboard for ARAFAT GAMING.',
        descEn: 'Secure admin control dashboard for ARAFAT GAMING.',
      },
    };

    const currentMeta = SEO_CONFIG[activeTab] || SEO_CONFIG.home;
    const pageTitle = lang === 'bn' ? currentMeta.titleBn : currentMeta.titleEn;
    const pageDesc = lang === 'bn' ? currentMeta.descBn : currentMeta.descEn;

    document.title = pageTitle;
    document.documentElement.lang = lang;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', pageDesc);

    // Update OpenGraph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', pageDesc);

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', pageTitle);
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', pageDesc);

    // Update canonical link dynamically if origin exists
    try {
      const canonicalTag = document.getElementById('canonical-url');
      if (canonicalTag && window.location.origin) {
        canonicalTag.setAttribute('href', `${window.location.origin}/`);
      }
    } catch {}
  }, [activeTab, lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'admin') {
      setAdminOpen(true);
      return;
    }
    if (tab === 'track') {
      const el = document.getElementById('track-order');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const sectionMap: Record<string, string> = {
      home: 'hero-top',
      topup: 'topup-products',
      uid: 'uid',
      membership: 'membership',
      packages: 'category-games',
      games: 'category-games',
      mystery: 'category-mystery',
      subscriptions: 'category-subscriptions',
      'social-boost': 'category-social',
      'social-followers': 'category-social',
      'facebook-followers': 'category-social',
      'streaming-subscriptions': 'category-subscriptions',
      'how-to-order': 'how-to-order',
      payment: 'payment-methods',
      contact: 'contact',
    };
    const targetId = sectionMap[tab];
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Order Submission Handler
  const handleSubmitOrder = async (
    orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'adminNote'>
  ): Promise<string> => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const prefix =
      orderData.serviceType === 'mystery_box'
        ? 'MYS'
        : orderData.serviceType === 'bonus_offer'
        ? 'BON'
        : orderData.serviceType === 'unipin_voucher'
        ? 'UNI'
        : orderData.serviceType === 'ff_likes'
        ? 'LIK'
        : orderData.serviceType === 'facebook_followers' ||
          orderData.serviceType === 'facebook_likes' ||
          orderData.serviceType === 'facebook_views'
        ? 'FB'
        : orderData.serviceType === 'instagram_followers' ||
          orderData.serviceType === 'instagram_likes' ||
          orderData.serviceType === 'instagram_views'
        ? 'IG'
        : orderData.serviceType === 'streaming_subscription'
        ? 'SUB'
        : 'AG';
    const newOrderId = `${prefix}-${randomNum}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: newOrderId,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      adminNote:
        orderData.serviceType === 'mystery_box'
          ? 'লাকি মিস্ট্রি বক্স অর্ডার পেন্ডিং। TrxID যাচাই করার পর ডায়মন্ড ও রিওয়ার্ড পাঠানো হবে।'
          : orderData.serviceType === 'bonus_offer'
          ? 'মেগা বোনাস টপ-আপ অর্ডার পেন্ডিং। TrxID যাচাই সম্পন্ন হলে ডায়মন্ড ক্রেডিটেড হবে।'
          : orderData.serviceType === 'ff_likes'
          ? 'প্লেয়ার লাইক বুস্ট অর্ডার পেন্ডিং। TrxID ভেরিফাই হলে লাইক ডেলিভারি শুরু হবে।'
          : orderData.serviceType === 'unipin_voucher'
          ? 'ইন্দোনেশিয়া সার্ভার ইউনিপিন ভাউচার অর্ডার পেন্ডিং। ভাউচার পিন পাঠানো হবে।'
          : orderData.serviceType === 'facebook_followers' || orderData.serviceType === 'facebook_likes' || orderData.serviceType === 'facebook_views'
          ? 'ফেসবুক বুস্টিং অর্ডার পেন্ডিং আছে। TrxID যাচাই সম্পন্ন হলে কাজ শুরু হবে।'
          : orderData.serviceType === 'instagram_followers' || orderData.serviceType === 'instagram_likes' || orderData.serviceType === 'instagram_views'
          ? 'ইনস্টাগ্রাম বুস্টিং অর্ডার পেন্ডিং আছে। TrxID যাচাই সম্পন্ন হলে কাজ শুরু হবে।'
          : orderData.serviceType === 'streaming_subscription'
          ? 'সাবস্ক্রিপশন অর্ডার পেন্ডিং আছে। TrxID যাচাই করে অ্যাকাউন্ট ক্রেডেনশিয়াল পাঠানো হবে।'
          : 'অর্ডার পেন্ডিং আছে। TrxID যাচাই করার পর ডায়মন্ড পাঠানো হবে।',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Instant toast notification for customer
    showToast({
      title: 'অর্ডার সফলভাবে জমা হয়েছে!',
      message: `Order ID: ${newOrderId} · আপনার ${orderData.packageNameBn || orderData.packageName} পেমেন্ট ভেরিফাই করে দ্রুত ডেলিভারি দেওয়া হবে।`,
      status: 'pending',
      type: 'success',
      duration: 8000,
      action: {
        label: 'অর্ডার ট্র্যাক করুন',
        onClick: () => handleNavigateToTracking(newOrderId),
      },
    });

    return newOrderId;
  };

  // Admin Actions with Real-Time Toast Notification Alert & Automatic Wallet Refund
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const target = orders.find((o) => o.id === orderId);
    let didRefund = false;
    let refundAmount = 0;

    // If changing to cancelled, check if paid with wallet and not yet refunded
    if (status === 'cancelled' && target && target.paymentMethod === 'wallet' && !target.refunded) {
      didRefund = true;
      refundAmount = target.amountBdt;
      setUserWallet((prev) => ({
        ...prev,
        balance: prev.balance + refundAmount,
      }));
    }

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            refunded: ord.refunded || didRefund,
            adminNote: note !== undefined ? note : ord.adminNote,
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );

    // Trigger real-time snackbar toast notification!
    notifyOrderStatusChange(orderId, status, note, handleNavigateToTracking);

    if (didRefund) {
      showToast({
        title: 'অর্ডার বাতিল ও রিফান্ড সম্পন্ন!',
        message: `Order #${orderId} বাতিল করা হয়েছে এবং ৳${refundAmount.toLocaleString()} BDT অ্যাকাউন্ট ব্যালেন্সে রিফান্ড ক্রেডিট করা হয়েছে।`,
        status: 'cancelled',
        type: 'warning',
        duration: 6000,
      });
    }
  };

  // User Order Cancellation Handler with Automatic Wallet Refund
  const handleCancelOrder = async (orderId: string): Promise<boolean> => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return false;

    if (targetOrder.status !== 'pending') {
      showToast({
        title: 'অর্ডার বাতিল সম্ভব নয়',
        message: 'শুধুমাত্র পেন্ডিং (Pending) অবস্থায় থাকা অর্ডার বাতিল করা যাবে।',
        status: 'rejected',
        type: 'error',
        duration: 4000,
      });
      return false;
    }

    let isRefunded = false;
    if (targetOrder.paymentMethod === 'wallet' && !targetOrder.refunded) {
      isRefunded = true;
      setUserWallet((prev) => ({
        ...prev,
        balance: prev.balance + targetOrder.amountBdt,
      }));
    }

    const cancelNote = 'গ্রাহক কর্তৃক অর্ডারটি বাতিল করা হয়েছে।';

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'cancelled',
            refunded: ord.refunded || isRefunded,
            adminNote: ord.adminNote ? `${ord.adminNote} (${cancelNote})` : cancelNote,
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );

    notifyOrderStatusChange(orderId, 'cancelled', cancelNote, handleNavigateToTracking);

    showToast({
      title: 'অর্ডার সফলভাবে বাতিল করা হয়েছে',
      message: isRefunded
        ? `Order #${orderId} বাতিল হয়েছে এবং ৳${targetOrder.amountBdt.toLocaleString()} AG Coins আপনার ওয়ালেটে ফেরত দেওয়া হয়েছে!`
        : `Order #${orderId} সফলভাবে বাতিল করা হয়েছে।`,
      status: 'cancelled',
      type: 'warning',
      duration: 6000,
    });

    return true;
  };

  // Cross-tab real-time listener for order updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.ORDERS && e.newValue && e.oldValue) {
        try {
          const oldList: Order[] = JSON.parse(e.oldValue);
          const newList: Order[] = JSON.parse(e.newValue);
          newList.forEach((newOrd) => {
            const oldOrd = oldList.find((o) => o.id === newOrd.id);
            if (oldOrd && oldOrd.status !== newOrd.status) {
              notifyOrderStatusChange(newOrd.id, newOrd.status, newOrd.adminNote, handleNavigateToTracking);
            }
          });
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [notifyOrderStatusChange]);

  const handleUpdatePackage = (updatedPkg: DiamondPackage) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === updatedPkg.id ? updatedPkg : p))
    );
  };

  const handleAddPackage = (newPkgData: Omit<DiamondPackage, 'id'>) => {
    const newId = `pack-${Date.now()}`;
    const newPkg: DiamondPackage = { ...newPkgData, id: newId };
    setPackages((prev) => [...prev, newPkg]);
  };

  const handleDeletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateConfig = (newConfig: Partial<SiteConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const handleUpdateStreamingService = (updated: StreamingServiceItem) => {
    setStreamingServices((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  };

  const handleAddStreamingService = (newService: StreamingServiceItem) => {
    setStreamingServices((prev) => [...prev, newService]);
  };

  const handleDeleteStreamingService = (id: string) => {
    setStreamingServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  // Add Money / Wallet handlers
  const handleSubmitAddMoneyRequest = async (
    reqData: Omit<AddMoneyRequest, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'adminNote'>
  ): Promise<string> => {
    const randomId = `DEP-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();
    const newReq: AddMoneyRequest = {
      ...reqData,
      id: randomId,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    setAddMoneyRequests((prev) => [newReq, ...prev]);

    showToast({
      title: 'ডিপোজিট রিকোয়েস্ট সফল!',
      message: `Deposit ID: ${randomId} · অ্যাডমিন TrxID যাচাই করার পর ৳${reqData.amountBdt} ব্যালেন্স আপনার অ্যাকাউন্টে যোগ হবে।`,
      status: 'pending',
      type: 'success',
      duration: 6000,
    });

    return randomId;
  };

  // Admin approves deposit request: automatically adds funds to user wallet
  const handleApproveAddMoney = (requestId: string) => {
    const target = addMoneyRequests.find((r) => r.id === requestId);
    if (!target) return;
    if (target.status === 'approved') return;

    // Update request status
    setAddMoneyRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'approved', updatedAt: new Date().toISOString() }
          : r
      )
    );

    // Auto credit to user wallet balance
    setUserWallet((prev) => ({
      ...prev,
      balance: prev.balance + target.amountBdt,
    }));

    showToast({
      title: 'ব্যালেন্স যুক্ত হয়েছে! (Approved)',
      message: `৳${target.amountBdt.toLocaleString()} BDT সফলভাবে অ্যাকাউন্টে ক্রেডিট করা হয়েছে।`,
      status: 'completed',
      type: 'success',
      duration: 5000,
    });
  };

  // Admin rejects deposit request
  const handleRejectAddMoney = (requestId: string, note?: string) => {
    setAddMoneyRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'rejected', adminNote: note, updatedAt: new Date().toISOString() }
          : r
      )
    );

    showToast({
      title: 'রিকোয়েস্ট বাতিল (Rejected)',
      message: 'ডিপোজিট রিকোয়েস্টটি বাতিল করা হয়েছে।',
      status: 'rejected',
      type: 'info',
      duration: 4000,
    });
  };

  // Admin deletes deposit request
  const handleDeleteAddMoney = (requestId: string) => {
    setAddMoneyRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  // Deduct balance when user pays via wallet
  const handleDeductWalletBalance = (amount: number): boolean => {
    if (userWallet.balance < amount) return false;
    setUserWallet((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - amount),
    }));
    return true;
  };

  // Google / Client User Auth Handlers
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    // Sync with wallet
    setUserWallet((prev) => ({
      ...prev,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone || prev.phone,
    }));

    showToast({
      title: lang === 'bn' ? '🎉 স্বাগতম!' : '🎉 Welcome!',
      message:
        lang === 'bn'
          ? `${user.name}, আপনার ${user.loginMethod === 'google' ? 'Google' : ''} অ্যাকাউন্ট সফলভাবে সংযুক্ত হয়েছে!`
          : `Signed in successfully as ${user.name}!`,
      status: 'completed',
      type: 'success',
      duration: 5000,
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast({
      title: lang === 'bn' ? 'লগআউট সম্পন্ন' : 'Logged Out',
      message:
        lang === 'bn'
          ? 'আপনি সফলভাবে অ্যাকাউন্ট থেকে লগআউট করেছেন।'
          : 'You have been signed out successfully.',
      status: 'cancelled',
      type: 'info',
      duration: 4000,
    });
  };

  const handleUpdateUserPhone = (newPhone: string) => {
    if (currentUser) {
      setCurrentUser((prev) => (prev ? { ...prev, phone: newPhone } : null));
    }
    setUserWallet((prev) => ({ ...prev, phone: newPhone }));
    showToast({
      title: lang === 'bn' ? 'নম্বর সংরক্ষিত' : 'Phone Saved',
      message:
        lang === 'bn'
          ? 'আপনার বিকাশ/নগদ লেনদেনের নম্বর সফলভাবে আপডেট হয়েছে।'
          : 'Phone number updated successfully.',
      status: 'completed',
      type: 'success',
      duration: 4000,
    });
  };

  const handleResetToDefaults = () => {
    setPackages(INITIAL_PACKAGES);
    setConfig(DEFAULT_SITE_CONFIG);
    setStreamingServices(INITIAL_STREAMING_CATALOG);
    try {
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(INITIAL_PACKAGES));
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_SITE_CONFIG));
      localStorage.setItem(STORAGE_KEYS.STREAMING, JSON.stringify(INITIAL_STREAMING_CATALOG));
    } catch {}
  };

  // Open modal preselected with package (Free Fire, Mystery Box, Bonus, Likes, UniPin)
  const handleSelectPackageForOrder = (pkg: DiamondPackage, playerUid?: string) => {
    setSelectedPackage(pkg);
    const serviceType =
      pkg.category === 'mystery_box'
        ? 'mystery_box'
        : pkg.category === 'bonus_offer'
        ? 'bonus_offer'
        : pkg.category === 'unipin'
        ? 'unipin_voucher'
        : pkg.category === 'ff_likes'
        ? 'ff_likes'
        : 'free_fire';

    setActiveSelection({
      serviceType,
      diamondPackage: pkg,
      playerUid,
    });
    setOrderModalOpen(true);
  };

  // Open modal for Streaming Subscriptions
  const handleSelectStreamingForOrder = (service: StreamingServiceItem, durationId?: string) => {
    const selectedDur = durationId
      ? service.durations.find((d) => d.id === durationId) || service.durations[0]
      : service.durations[0];

    const subItem: StreamingSubscription = {
      id: `${service.id}-${selectedDur.id}`,
      service: service.serviceKey,
      title: `${service.name} (${selectedDur.durationLabel})`,
      titleBn: `${service.nameBn} (${selectedDur.durationLabelBn})`,
      duration: selectedDur.durationLabel,
      durationBn: selectedDur.durationLabelBn,
      typeBadge: selectedDur.savingsBadge || service.badge,
      priceBdt: selectedDur.priceBdt,
      features: service.features,
      featuresBn: service.featuresBn,
      active: true,
    };

    setSelectedPackage(null);
    setActiveSelection({
      serviceType: 'streaming_subscription',
      subscription: subItem,
    });
    setOrderModalOpen(true);
  };

  // Open modal for Social Media Boost Services (Followers, Likes, Views)
  const handleSelectSocialService = (
    service: 'fb_followers' | 'fb_likes' | 'fb_views' | 'ig_followers' | 'ig_likes' | 'ig_views'
  ) => {
    const defaultQty = service.includes('views') ? 10000 : 5000;
    const rate =
      service === 'fb_followers'
        ? config.followerRatePer1k || 120
        : service === 'fb_likes'
        ? config.fbLikesRatePer1k || 80
        : service === 'fb_views'
        ? config.fbViewsRatePer1k || 50
        : service === 'ig_followers'
        ? config.instagramFollowerRatePer1k || 150
        : service === 'ig_likes'
        ? config.igLikesRatePer1k || 90
        : config.igViewsRatePer1k || 60;

    const calcPrice = Math.round((defaultQty / 1000) * rate);
    const serviceTypeMap: Record<string, ServiceType> = {
      fb_followers: 'facebook_followers',
      fb_likes: 'facebook_likes',
      fb_views: 'facebook_views',
      ig_followers: 'instagram_followers',
      ig_likes: 'instagram_likes',
      ig_views: 'instagram_views',
    };

    setSelectedPackage(null);
    setActiveSelection({
      serviceType: serviceTypeMap[service],
      followerCount: defaultQty,
      followerPriceBdt: calcPrice,
    });
    setOrderModalOpen(true);
  };

  // Open modal preselected with payment method
  const handleSelectPaymentMethodForOrder = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setOrderModalOpen(true);
  };

  const handleNavigateToTracking = (orderId: string) => {
    setTrackingSearchId(orderId);
    const el = document.getElementById('track-order');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="hero-top" className="min-h-screen bg-[#070314] text-slate-100 flex flex-col font-sans selection:bg-cyan-600 selection:text-white">
      {/* 0. Top Notice Ticker Bar (TopupPapa Blue Ticker Line) */}
      <TopNoticeTicker lang={lang} config={config} />

      {/* 1. Header & Navigation */}
      <Navbar
        lang={lang}
        onToggleLang={toggleLanguage}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenOrderModal={() => {
          setSelectedPackage(null);
          setActiveSelection({ serviceType: 'free_fire' });
          setOrderModalOpen(true);
        }}
        onOpenTrack={() => {
          const el = document.getElementById('track-order');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        wallet={userWallet}
        onOpenAddMoney={() => setAddMoneyModalOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenProfileModal={() => setProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* 2. Banner Slider (Game Characters & Offers) */}
        <HeroBannerSlider
          lang={lang}
          onExploreTopup={() => {
            const el = document.getElementById('category-games');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onExploreMystery={() => {
            const el = document.getElementById('category-mystery');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onExploreSubscriptions={() => {
            const el = document.getElementById('category-subscriptions');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 3. Quick Social Action Buttons (Telegram, Group, WhatsApp, Facebook) */}
        <QuickSocialActions lang={lang} config={config} />

        {/* 4. Payment Methods Banner (MFS & Site Wallet) */}
        <PaymentBanner
          lang={lang}
          config={config}
          onSelectPaymentMethodForOrder={handleSelectPaymentMethodForOrder}
        />

        {/* 5. Categorized Product Grid Sections (TopupPapa Cards & Blue Badges) */}
        <CategorizedProductGrid
          packages={packages}
          streamingServices={streamingServices}
          lang={lang}
          config={config}
          onSelectDiamondPackage={handleSelectPackageForOrder}
          onSelectSubscription={handleSelectStreamingForOrder}
          onSelectSocialService={handleSelectSocialService}
        />

        {/* 6. Real-time Order Tracking & History with Cancel Feature */}
        <OrderTracker
          orders={orders}
          lang={lang}
          config={config}
          initialSearchId={trackingSearchId}
          onCancelOrder={handleCancelOrder}
        />

        {/* 7. Live Recent Orders Section */}
        <LiveRecentOrders orders={orders} lang={lang} />

        {/* 8. How to Order Guide */}
        <HowToOrder
          lang={lang}
          onGoToPackages={() => {
            const el = document.getElementById('topup-products');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenOrderModal={() => {
            setSelectedPackage(null);
            setActiveSelection({ serviceType: 'free_fire' });
            setOrderModalOpen(true);
          }}
        />

        {/* 9. Payment Instructions */}
        <PaymentGuide
          lang={lang}
          config={config}
          onOpenOrderModal={() => setOrderModalOpen(true)}
        />

        {/* 10. Contact Section */}
        <ContactSection lang={lang} config={config} />
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        config={config}
        onSelectTab={handleSelectTab}
        onOpenLegal={(type) => setLegalModal({ isOpen: true, type })}
      />

      {/* Floating Support & Bottom Promo Banner */}
      <FloatingWidgets
        lang={lang}
        config={config}
        onOpenOrderModal={() => {
          setSelectedPackage(null);
          setActiveSelection({ serviceType: 'free_fire' });
          setOrderModalOpen(true);
        }}
      />

      {/* Unified Digital Checkout Order Modal */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        lang={lang}
        packages={packages}
        selectedPackage={selectedPackage}
        activeSelection={activeSelection}
        streamingServices={streamingServices}
        initialPaymentMethod={selectedPaymentMethod}
        config={config}
        wallet={userWallet}
        currentUser={currentUser}
        onOpenAddMoney={() => setAddMoneyModalOpen(true)}
        onDeductWallet={handleDeductWalletBalance}
        onSubmitOrder={handleSubmitOrder}
        onNavigateToTracking={handleNavigateToTracking}
      />

      {/* Personal Add Money Modal */}
      <AddMoneyModal
        isOpen={addMoneyModalOpen}
        onClose={() => setAddMoneyModalOpen(false)}
        lang={lang}
        config={config}
        wallet={userWallet}
        currentUser={currentUser}
        requests={addMoneyRequests}
        onSubmitAddMoney={handleSubmitAddMoneyRequest}
      />

      {/* Seamless Google Sign-In & Sign-Up Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        lang={lang}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* User Profile & Account Management Modal */}
      {currentUser && (
        <UserProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          lang={lang}
          user={currentUser}
          wallet={userWallet}
          onOpenAddMoney={() => {
            setProfileModalOpen(false);
            setAddMoneyModalOpen(true);
          }}
          onOpenTracking={() => {
            setProfileModalOpen(false);
            const el = document.getElementById('track-order');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onLogout={handleLogout}
          onUpdatePhone={handleUpdateUserPhone}
        />
      )}

      {/* Comprehensive Admin Panel Modal */}
      {adminOpen && (
        <AdminPanel
          orders={orders}
          packages={packages}
          streamingServices={streamingServices}
          config={config}
          lang={lang}
          addMoneyRequests={addMoneyRequests}
          userWallet={userWallet}
          onApproveAddMoney={handleApproveAddMoney}
          onRejectAddMoney={handleRejectAddMoney}
          onDeleteAddMoney={handleDeleteAddMoney}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onDeleteOrder={handleDeleteOrder}
          onUpdatePackage={handleUpdatePackage}
          onAddPackage={handleAddPackage}
          onDeletePackage={handleDeletePackage}
          onUpdateStreamingService={handleUpdateStreamingService}
          onAddStreamingService={handleAddStreamingService}
          onDeleteStreamingService={handleDeleteStreamingService}
          onUpdateConfig={handleUpdateConfig}
          onResetToDefaults={handleResetToDefaults}
          onClose={() => setAdminOpen(false)}
        />
      )}

      {/* Privacy Policy & Terms Modal */}
      <LegalModal
        isOpen={legalModal.isOpen}
        type={legalModal.type}
        lang={lang}
        onClose={() => setLegalModal({ isOpen: false, type: 'privacy' })}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
