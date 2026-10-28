import React, { useState, useEffect } from 'react';
import {
  DiamondPackage,
  Language,
  Order,
  OrderStatus,
  PaymentMethod,
  SiteConfig,
} from './types';
import {
  DEFAULT_SITE_CONFIG,
  INITIAL_ORDERS,
  INITIAL_PACKAGES,
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PaymentBanner } from './components/PaymentBanner';
import { DiamondPackages } from './components/DiamondPackages';
import { OrderModal } from './components/OrderModal';
import { OrderTracker } from './components/OrderTracker';
import { HowToOrder } from './components/HowToOrder';
import { PaymentGuide } from './components/PaymentGuide';
import { AdminPanel } from './components/AdminPanel';
import { ContactSection } from './components/ContactSection';
import { LegalModal } from './components/LegalModal';
import { Footer } from './components/Footer';
import { MessageCircle, ShoppingBag, Search } from 'lucide-react';
import { ToastProvider, useToast } from './context/ToastContext';

const STORAGE_KEYS = {
  PACKAGES: 'arafat_gaming_packages_v2',
  ORDERS: 'arafat_gaming_orders_v2',
  CONFIG: 'arafat_gaming_config_v1',
  LANG: 'arafat_gaming_lang_v1',
};

function MainApp() {
  const { showToast, notifyOrderStatusChange } = useToast();
  // Clear any legacy v1 cached packages with old prices
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

  // 3. Diamond Packages state (Defaults to updated INITIAL_PACKAGES)
  const [packages, setPackages] = useState<DiamondPackage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PACKAGES);
      return saved ? JSON.parse(saved) : INITIAL_PACKAGES;
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

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<string>('home');
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<DiamondPackage | null>(null);
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

  // Dynamic SEO Synchronization per section & language
  useEffect(() => {
    const SEO_CONFIG: Record<string, { titleBn: string; titleEn: string; descBn: string; descEn: string }> = {
      home: {
        titleBn: 'ARAFAT GAMING | Free Fire Diamond Top-Up Bangladesh',
        titleEn: 'ARAFAT GAMING | Free Fire Diamond Top-Up Bangladesh',
        descBn: 'বাংলাদেশের বিশ্বস্ত ফ্রি ফায়ার ডায়মন্ড টপ-আপ শপ। বিকাশ ও নগদ পার্সোনাল দিয়ে দ্রুত ও নিরাপদে শুধুমাত্র Player UID দিয়ে ডায়মন্ড টপ-আপ করুন। ডেলিভারি ৫-১৫ মিনিট।',
        descEn: 'Trusted Free Fire diamond top-up in Bangladesh. Fast, secure UID top-up via bKash & Nagad. 5-15 min delivery, 100% safe.',
      },
      packages: {
        titleBn: 'ডায়মন্ড প্যাকেজসমূহ ও দাম | ARAFAT GAMING - Free Fire BD',
        titleEn: 'Free Fire Diamond Packages & Prices in BD | ARAFAT GAMING',
        descBn: 'ফ্রি ফায়ার ডায়মন্ড প্যাকেজের সর্বশেষ আপডেট মূল্য তালিকা। ১ ডায়মন্ড থেকে ২১৮০ ডায়মন্ড এবং উইকলি ও মান্থলি মেম্বারশিপ সাশ্রয়ী মূল্যে কিনুন।',
        descEn: 'Check latest Free Fire diamond package prices in Bangladesh. Regular diamonds, Weekly and Monthly VIP memberships with instant UID top-up.',
      },
      'how-to-order': {
        titleBn: 'কীভাবে অর্ডার করবেন? (টপ-আপ গাইড) | ARAFAT GAMING',
        titleEn: 'How to Order Free Fire Diamonds | ARAFAT GAMING Guide',
        descBn: 'সহজ ৪টি ধাপে বিকাশ বা নগদ থেকে টাকা পাঠিয়ে ফ্রি ফায়ার ডায়মন্ড টপ-আপ করার সম্পূর্ণ নিয়ম জানুন।',
        descEn: 'Step-by-step guide on how to order Free Fire diamonds using bKash and Nagad personal Send Money.',
      },
      payment: {
        titleBn: 'পেমেন্ট নির্দেশিকা (বিকাশ ও নগদ) | ARAFAT GAMING',
        titleEn: 'bKash & Nagad Payment Guide | ARAFAT GAMING',
        descBn: 'বিকাশ ও নগদ পার্সোনাল নম্বরে (01575630127) কীভাবে Send Money করবেন এবং TrxID পাবেন তার বিস্তারিত নির্দেশিকা।',
        descEn: 'Detailed instructions to Send Money to our official bKash & Nagad personal numbers and retrieve Transaction ID.',
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
      packages: 'diamond-packages',
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
    // Generate unique Order ID
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newOrderId = `AG-${randomNum}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: newOrderId,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      adminNote: 'অর্ডার পেন্ডিং আছে। TrxID যাচাই করার পর ডায়মন্ড পাঠানো হবে।',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Instant toast notification for customer
    showToast({
      title: `অর্ডার সফলভাবে জমা হয়েছে!`,
      message: `Order ID: ${newOrderId} · আপনার ${orderData.packageNameBn || orderData.packageName} পেমেন্ট ভেরিফাই করে ৫–১৫ মিনিটের মধ্যে ডায়মন্ড পাঠানো হবে।`,
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

  // Admin Actions with Real-Time Toast Notification Alert
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            adminNote: note !== undefined ? note : ord.adminNote,
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );

    // Trigger real-time snackbar toast notification!
    notifyOrderStatusChange(orderId, status, note, handleNavigateToTracking);
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

  // Open modal preselected with package
  const handleSelectPackageForOrder = (pkg: DiamondPackage) => {
    setSelectedPackage(pkg);
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
    <div id="hero-top" className="min-h-screen bg-[#090514] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        lang={lang}
        onToggleLang={toggleLanguage}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenOrderModal={() => {
          setSelectedPackage(null);
          setOrderModalOpen(true);
        }}
        onOpenTrack={() => {
          const el = document.getElementById('track-order');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection
          lang={lang}
          config={config}
          onExplorePackages={() => {
            const el = document.getElementById('diamond-packages');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onTrackOrder={() => {
            const el = document.getElementById('track-order');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 2. Payment Methods Banner (bKash & Nagad Personal) */}
        <PaymentBanner
          lang={lang}
          config={config}
          onSelectPaymentMethodForOrder={handleSelectPaymentMethodForOrder}
        />

        {/* 3. Diamond Packages Showcase */}
        <DiamondPackages
          packages={packages}
          lang={lang}
          onSelectPackage={handleSelectPackageForOrder}
        />

        {/* 4. Real-time Order Tracking */}
        <OrderTracker
          orders={orders}
          lang={lang}
          config={config}
          initialSearchId={trackingSearchId}
        />

        {/* 5. How to Order Guide */}
        <HowToOrder
          lang={lang}
          onGoToPackages={() => {
            const el = document.getElementById('diamond-packages');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenOrderModal={() => {
            setSelectedPackage(null);
            setOrderModalOpen(true);
          }}
        />

        {/* 6. Payment Instructions */}
        <PaymentGuide
          lang={lang}
          config={config}
          onOpenOrderModal={() => setOrderModalOpen(true)}
        />

        {/* 7. Contact Section */}
        <ContactSection lang={lang} config={config} />
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        config={config}
        onSelectTab={handleSelectTab}
        onOpenLegal={(type) => setLegalModal({ isOpen: true, type })}
      />

      {/* Floating Action Button (Mobile Friendly Fast Order & WhatsApp) */}
      <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-2.5 items-end">
        {/* WhatsApp Chat Floating */}
        <a
          href={`https://wa.me/88${config.whatsappNumber}?text=${encodeURIComponent(
            'আসসালামু আলাইকুম, আমি আরাফাত গেমিং থেকে ফ্রি ফায়ার ডায়মন্ড নিতে চাই।'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          title="WhatsApp Helpline"
        >
          <MessageCircle className="w-6 h-6" />
        </a>

        {/* Fast Order Button */}
        <button
          onClick={() => {
            setSelectedPackage(null);
            setOrderModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-950 hover:from-purple-500 hover:to-indigo-500 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>টপ-আপ অর্ডার</span>
        </button>
      </div>

      {/* Top-Up Order Modal */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        packages={packages}
        selectedPackage={selectedPackage}
        initialPaymentMethod={selectedPaymentMethod}
        config={config}
        onSubmitOrder={handleSubmitOrder}
        onNavigateToTracking={handleNavigateToTracking}
      />

      {/* Admin Panel Modal */}
      {adminOpen && (
        <AdminPanel
          orders={orders}
          packages={packages}
          config={config}
          lang={lang}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdatePackage={handleUpdatePackage}
          onAddPackage={handleAddPackage}
          onDeletePackage={handleDeletePackage}
          onUpdateConfig={handleUpdateConfig}
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
