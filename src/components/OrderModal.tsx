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
  Tv,
  Sparkles,
  Wallet,
  Coins,
} from 'lucide-react';
import {
  DiamondPackage,
  Language,
  Order,
  PaymentMethod,
  ServiceType,
  SiteConfig,
  StreamingServiceItem,
  StreamingSubscription,
  UserWallet,
} from '../types';
import { BkashLogo, NagadLogo, FacebookLogo, InstagramLogo, NetflixLogo, CrunchyrollLogo } from './BrandLogos';

export interface ActiveOrderSelection {
  serviceType: ServiceType;
  // Free Fire
  diamondPackage?: DiamondPackage | null;
  playerUid?: string;
  // Facebook / Instagram Followers
  followerCount?: number;
  followerPriceBdt?: number;
  profileLink?: string;
  // Streaming Subscription
  subscription?: StreamingSubscription | null;
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
  packages: DiamondPackage[];
  selectedPackage?: DiamondPackage | null;
  activeSelection?: ActiveOrderSelection | null;
  streamingServices?: StreamingServiceItem[];
  initialPaymentMethod?: PaymentMethod;
  config: SiteConfig;
  wallet?: UserWallet;
  onOpenAddMoney?: () => void;
  onDeductWallet?: (amount: number) => boolean;
  onSubmitOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'adminNote'>) => Promise<string>;
  onNavigateToTracking: (orderId: string) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  lang = 'bn',
  packages,
  selectedPackage,
  activeSelection,
  streamingServices = [],
  initialPaymentMethod = 'bkash',
  config,
  wallet,
  onOpenAddMoney,
  onDeductWallet,
  onSubmitOrder,
  onNavigateToTracking,
}) => {
  // Service Type
  const [serviceType, setServiceType] = useState<ServiceType>('free_fire');

  // Customer Contact info
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Service specific target fields
  const [playerUid, setPlayerUid] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [targetAccountLink, setTargetAccountLink] = useState('');

  // Packages & Selection
  const [pkgId, setPkgId] = useState('');
  const [followerCount, setFollowerCount] = useState<number>(5000);
  const [followerPrice, setFollowerPrice] = useState<number>(600);
  const [selectedSub, setSelectedSub] = useState<StreamingSubscription | null>(null);

  // Manual Payment fields
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialPaymentMethod === 'bkash' ? 'bkash' : 'nagad');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');

  // UI state
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUidGuide, setShowUidGuide] = useState(false);

  // Base rates for followers
  const fbRatePer1k = config.followerRatePer1k || 120;
  const igRatePer1k = config.instagramFollowerRatePer1k || 150;

  // Sync state whenever activeSelection or selectedPackage updates
  useEffect(() => {
    if (activeSelection) {
      setServiceType(activeSelection.serviceType);

      if (activeSelection.serviceType === 'free_fire') {
        if (activeSelection.diamondPackage) {
          setPkgId(activeSelection.diamondPackage.id);
        }
        if (activeSelection.playerUid) {
          setPlayerUid(activeSelection.playerUid);
        }
      } else if (activeSelection.serviceType === 'facebook_followers') {
        const count = activeSelection.followerCount || 5000;
        setFollowerCount(count);
        setFollowerPrice(activeSelection.followerPriceBdt || Math.round((count / 1000) * fbRatePer1k));
        if (activeSelection.profileLink) {
          setTargetAccountLink(activeSelection.profileLink);
        }
      } else if (activeSelection.serviceType === 'instagram_followers') {
        const count = activeSelection.followerCount || 5000;
        setFollowerCount(count);
        setFollowerPrice(activeSelection.followerPriceBdt || Math.round((count / 1000) * igRatePer1k));
        if (activeSelection.profileLink) {
          setTargetAccountLink(activeSelection.profileLink);
        }
      } else if (activeSelection.serviceType === 'streaming_subscription' && activeSelection.subscription) {
        setSelectedSub(activeSelection.subscription);
      }
    } else if (selectedPackage) {
      setServiceType('free_fire');
      setPkgId(selectedPackage.id);
    } else if (packages.length > 0 && !pkgId) {
      setPkgId(packages[0].id);
    }
  }, [activeSelection, selectedPackage, packages, fbRatePer1k, igRatePer1k]);

  useEffect(() => {
    if (initialPaymentMethod) {
      setPaymentMethod(initialPaymentMethod);
    }
  }, [initialPaymentMethod]);

  if (!isOpen) return null;

  // Determine current item summary
  const currentPkg = packages.find((p) => p.id === pkgId) || packages[0];

  let orderTitle = '';
  let orderTitleBn = '';
  let orderQuantityOrPlan: string | number = '';
  let finalAmountBdt = 0;

  if (serviceType === 'free_fire') {
    orderTitle = currentPkg ? currentPkg.name : 'Free Fire Diamonds';
    orderTitleBn = currentPkg ? currentPkg.nameBn : 'ফ্রি ফায়ার ডায়মন্ড';
    orderQuantityOrPlan = currentPkg ? currentPkg.diamonds : 'UID Top-Up';
    finalAmountBdt = currentPkg ? currentPkg.priceBdt : 0;
  } else if (serviceType === 'facebook_followers') {
    orderTitle = `${followerCount.toLocaleString()} Facebook Followers`;
    orderTitleBn = `${followerCount.toLocaleString()} ফেসবুক ফলোয়ার্স`;
    orderQuantityOrPlan = `${followerCount.toLocaleString()} Followers`;
    finalAmountBdt = followerPrice;
  } else if (serviceType === 'instagram_followers') {
    orderTitle = `${followerCount.toLocaleString()} Instagram Followers`;
    orderTitleBn = `${followerCount.toLocaleString()} ইনস্টাগ্রাম ফলোয়ার্স`;
    orderQuantityOrPlan = `${followerCount.toLocaleString()} Followers`;
    finalAmountBdt = followerPrice;
  } else if (serviceType === 'streaming_subscription') {
    orderTitle = selectedSub ? selectedSub.title : 'Streaming Subscription';
    orderTitleBn = selectedSub ? selectedSub.titleBn : 'স্ট্রিমিং সাবস্ক্রিপশন';
    orderQuantityOrPlan = selectedSub ? `${selectedSub.duration} · ${selectedSub.typeBadge}` : '1 Month';
    finalAmountBdt = selectedSub ? selectedSub.priceBdt : 0;
  }

  // Determine receiver payment details
  const getReceiverPaymentDetails = () => {
    if (paymentMethod === 'wallet') {
      return {
        name: 'AG Coins Wallet',
        nameBn: 'AG অ্যাকাউন্ট ব্যালেন্স',
        number: wallet?.phone || 'AG-ACCOUNT',
        instruction:
          lang === 'bn'
            ? 'আপনার অ্যাকাউন্ট ব্যালেন্স থেকে সরাসরি পেমেন্ট কাটা হবে।'
            : 'Payment will be deducted directly from your AG Site Balance.',
        color: 'from-amber-500 to-emerald-500',
        border: 'border-amber-500/40',
        badgeBg: 'bg-amber-950/60 text-amber-300 border-amber-800/40',
      };
    }
    if (paymentMethod === 'bkash') {
      return {
        name: 'bKash Personal',
        nameBn: 'বিকাশ পার্সোনাল',
        number: config.bkashNumber,
        instruction:
          lang === 'bn'
            ? 'বিকাশ অ্যাপ অথবা *247# ডায়াল করে Send Money করুন।'
            : 'Send Money using bKash App or dial *247#.',
        color: 'from-[#e2136e] to-[#b00f55]',
        border: 'border-pink-500/40',
        badgeBg: 'bg-pink-950/60 text-pink-300 border-pink-800/40',
      };
    }
    return {
      name: 'Nagad Personal',
      nameBn: 'নগদ পার্সোনাল',
      number: config.nagadNumber,
      instruction:
        lang === 'bn'
          ? 'নগদ অ্যাপ অথবা *167# ডায়াল করে Send Money করুন।'
          : 'Send Money using Nagad App or dial *167#.',
      color: 'from-[#f7941d] to-[#ee4036]',
      border: 'border-orange-500/40',
      badgeBg: 'bg-amber-950/60 text-amber-300 border-amber-800/40',
    };
  };

  const receiverInfo = getReceiverPaymentDetails();

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  // Helper validation for customer inputs
  const validateFormInputs = () => {
    const cleanContact = contactNumber.trim();
    if (!cleanContact) {
      return {
        valid: false,
        error: lang === 'bn' ? 'অনুগ্রহ করে আপনার মোবাইল বা হোয়াটসঅ্যাপ নম্বর দিন।' : 'Please enter your Mobile or WhatsApp number.',
      };
    }

    let finalPlayerUid = '';
    let finalTargetLink = '';
    let finalCustomerEmail = customerEmail.trim();

    if (serviceType === 'free_fire') {
      const cleanUid = playerUid.trim();
      if (!cleanUid) {
        return {
          valid: false,
          error: lang === 'bn' ? 'অনুগ্রহ করে আপনার Free Fire Player UID দিন।' : 'Player UID is required for Free Fire top-up.',
        };
      }
      if (!/^\d{5,14}$/.test(cleanUid)) {
        return {
          valid: false,
          error: lang === 'bn' ? 'সঠিক Player UID দিন (শুধুমাত্র সংখ্যা, ৫–১৪ ডিজিট)।' : 'Invalid Player UID. Must be 5-14 numeric digits.',
        };
      }
      finalPlayerUid = cleanUid;
    } else if (serviceType === 'facebook_followers') {
      const cleanLink = targetAccountLink.trim();
      if (!cleanLink) {
        return {
          valid: false,
          error: lang === 'bn' ? 'অনুগ্রহ করে আপনার ফেসবুক প্রোফাইল বা পেজ লিংক (URL) দিন।' : 'Please provide your Facebook Profile or Page link.',
        };
      }
      if (followerCount < 1 || followerCount > 1000000) {
        return {
          valid: false,
          error: lang === 'bn' ? 'ফলোয়ার সংখ্যা ১ থেকে ১০,০০,০০০ (১ মিলিয়ন) এর মধ্যে হতে হবে।' : 'Follower quantity must be between 1 and 1,000,000.',
        };
      }
      finalTargetLink = cleanLink;
      finalPlayerUid = cleanLink;
    } else if (serviceType === 'instagram_followers') {
      const cleanLink = targetAccountLink.trim();
      if (!cleanLink) {
        return {
          valid: false,
          error: lang === 'bn' ? 'অনুগ্রহ করে আপনার ইনস্টাগ্রাম ইউজারনেম বা প্রোফাইল লিংক দিন।' : 'Please provide your Instagram username or profile link.',
        };
      }
      if (followerCount < 1 || followerCount > 1000000) {
        return {
          valid: false,
          error: lang === 'bn' ? 'ফলোয়ার সংখ্যা ১ থেকে ১০,০০,০০০ (১ মিলিয়ন) এর মধ্যে হতে হবে।' : 'Follower quantity must be between 1 and 1,000,000.',
        };
      }
      finalTargetLink = cleanLink;
      finalPlayerUid = cleanLink;
    } else if (serviceType === 'streaming_subscription') {
      if (!finalCustomerEmail) {
        return {
          valid: false,
          error: lang === 'bn' ? 'সাবস্ক্রিপশন ডেলিভারির জন্য আপনার ইমেইল দিন।' : 'Please provide your email for subscription delivery.',
        };
      }
      if (!/\S+@\S+\.\S+/.test(finalCustomerEmail)) {
        return {
          valid: false,
          error: lang === 'bn' ? 'সঠিক ইমেইল অ্যাড্রেস দিন।' : 'Please provide a valid email address.',
        };
      }
      finalPlayerUid = finalCustomerEmail;
    }

    // Payment validation
    let cleanSender = senderNumber.trim() || cleanContact;
    let cleanTrx = trxId.trim();

    if (paymentMethod === 'wallet') {
      const currentBal = wallet?.balance || 0;
      if (currentBal < finalAmountBdt) {
        return {
          valid: false,
          error:
            lang === 'bn'
              ? `আপনার AG ব্যালেন্স অপর্যাপ্ত! বর্তমান ব্যালেন্স ৳${currentBal.toLocaleString()} BDT, প্রয়োজন ৳${finalAmountBdt.toLocaleString()} BDT। অনুগ্রহ করে অ্যাড মানি করুন।`
              : `Insufficient AG Balance! Current: ৳${currentBal.toLocaleString()}, Required: ৳${finalAmountBdt.toLocaleString()} BDT. Please Add Money first.`,
        };
      }
      cleanSender = wallet?.phone || cleanContact || 'AG-USER';
      cleanTrx = `WALLET-${Date.now().toString().slice(-6)}`;
    } else {
      // Sender payment number validation
      if (!cleanSender) {
        return {
          valid: false,
          error: lang === 'bn' ? 'যে নম্বর থেকে টাকা পাঠিয়েছেন তা দিন।' : 'Please enter the number you paid from.',
        };
      }

      // TrxID validation
      if (!cleanTrx) {
        return {
          valid: false,
          error: lang === 'bn' ? 'টাকা পাঠানোর পর প্রাপ্ত Transaction ID (TrxID) দিন।' : 'Transaction ID (TrxID) is required.',
        };
      }
      if (cleanTrx.length < 4) {
        return {
          valid: false,
          error: lang === 'bn' ? 'সঠিক Transaction ID দিন।' : 'Please enter a valid Transaction ID.',
        };
      }
    }

    return {
      valid: true,
      cleanContact,
      cleanSender,
      cleanTrx,
      finalPlayerUid,
      finalTargetLink,
      finalCustomerEmail,
    };
  };

  // Manual payment submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const check = validateFormInputs();
    if (!check.valid) {
      setErrorMessage(check.error || 'Please fill in required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const newOrderId = await onSubmitOrder({
        serviceType,
        playerUid: check.finalPlayerUid!,
        playerName: playerName.trim() || customerName.trim() || undefined,
        customerEmail: check.finalCustomerEmail || undefined,
        targetAccountLink: check.finalTargetLink || undefined,
        packageId:
          serviceType === 'free_fire'
            ? (currentPkg?.id || 'ff-custom')
            : serviceType === 'facebook_followers'
            ? `fb-${followerCount}`
            : serviceType === 'instagram_followers'
            ? `ig-${followerCount}`
            : (selectedSub?.id || 'sub-custom'),
        packageName: orderTitle,
        packageNameBn: orderTitleBn,
        diamonds: orderQuantityOrPlan,
        amountBdt: finalAmountBdt,
        paymentMethod,
        paymentNumber: check.cleanSender!,
        trxId: check.cleanTrx!.toUpperCase(),
        contact: check.cleanContact!,
      });

      if (paymentMethod === 'wallet') {
        onDeductWallet?.(finalAmountBdt);
      }

      setSubmittedOrderId(newOrderId);
    } catch (err: any) {
      setErrorMessage(err?.message || (lang === 'bn' ? 'অর্ডার জমা করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' : 'Failed to submit order. Please retry.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setSubmittedOrderId(null);
    setErrorMessage(null);
    setTrxId('');
    setSenderNumber('');
    onClose();
  };

  const renderServiceIcon = () => {
    if (serviceType === 'facebook_followers') {
      return <FacebookLogo className="w-5 h-5 shrink-0" />;
    }
    if (serviceType === 'instagram_followers') {
      return <InstagramLogo className="w-5 h-5 shrink-0" />;
    }
    if (serviceType === 'streaming_subscription') {
      if (selectedSub?.service === 'netflix') return <NetflixLogo className="w-4 h-5 shrink-0" />;
      if (selectedSub?.service === 'crunchyroll') return <CrunchyrollLogo className="w-5 h-5 shrink-0" />;
      return <Tv className="w-5 h-5 text-red-400 shrink-0" />;
    }
    return <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 rounded-2xl bg-[#0e071f] border border-purple-800/50 shadow-2xl shadow-purple-950 overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-purple-900/40 bg-[#140b2b]">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
              {submittedOrderId
                ? (lang === 'bn' ? 'অর্ডার কনফার্মেশন — ARAFAT GAMING' : 'Order Confirmation — ARAFAT GAMING')
                : (lang === 'bn' ? 'অর্ডার চেকআউট (সহজ পেমেন্ট)' : 'Order Checkout')}
            </h3>
            <div className="text-xs text-purple-300/80">
              {submittedOrderId
                ? (lang === 'bn' ? 'আপনার অর্ডারটি সফলভাবে সিস্টেমে রেকর্ড করা হয়েছে' : 'Your order has been recorded successfully')
                : (lang === 'bn' ? 'বিকাশ ও নগদ পার্সোনাল সেন্ড মানি করে TrxID দিয়ে অর্ডার করুন' : 'Pay via bKash / Nagad Send Money & enter TrxID')}
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-purple-900/30 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {submittedOrderId ? (
          // ================= SUCCESS SCREEN =================
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60 mx-auto flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-white">
                {lang === 'bn' ? 'ধন্যবাদ! আপনার অর্ডার সফলভাবে জমা হয়েছে' : 'Thank You! Order Submitted'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
                {lang === 'bn'
                  ? 'আপনার পেমেন্ট TrxID চেক করে কিছুক্ষণের মধ্যে ডেলিভারি সম্পন্ন করা হবে।'
                  : 'Your payment will be verified shortly and order will be processed.'}
              </p>
            </div>

            {/* Order Details Receipt Box */}
            <div className="p-4 rounded-xl bg-[#13092b] border border-purple-800/40 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-purple-900/40">
                <span className="text-slate-400">{lang === 'bn' ? 'অর্ডার আইডি:' : 'Order ID:'}</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-purple-300 text-sm">
                  <span>{submittedOrderId}</span>
                  <button
                    onClick={() => handleCopyOrderId(submittedOrderId)}
                    className="p-1 rounded hover:bg-purple-900/40 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between py-1 border-b border-purple-900/20">
                <span className="text-slate-400">{lang === 'bn' ? 'সার্ভিস আইটেম:' : 'Service:'}</span>
                <span className="font-semibold text-white">{lang === 'bn' ? orderTitleBn : orderTitle}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-purple-900/20">
                <span className="text-slate-400">{lang === 'bn' ? 'পরিমাণ / প্ল্যান:' : 'Quantity / Plan:'}</span>
                <span className="font-mono text-purple-300 font-semibold">{orderQuantityOrPlan}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-purple-900/20">
                <span className="text-slate-400">{lang === 'bn' ? 'টার্গেট / UID:' : 'Target / UID:'}</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {serviceType === 'free_fire'
                    ? playerUid
                    : serviceType === 'streaming_subscription'
                    ? customerEmail
                    : targetAccountLink}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-purple-900/20">
                <span className="text-slate-400">{lang === 'bn' ? 'পরিশোধিত মূল্য:' : 'Amount:'}</span>
                <span className="font-bold text-emerald-400 text-sm">৳{finalAmountBdt} BDT</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-400">{lang === 'bn' ? 'পেমেন্ট মেথড ও TrxID:' : 'Payment:'}</span>
                <span className="font-mono text-amber-300 font-semibold uppercase">
                  {paymentMethod.toUpperCase()} · {trxId}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  onNavigateToTracking(submittedOrderId);
                  handleModalClose();
                }}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-950 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'লাইভ অর্ডার স্ট্যাটাস ট্র্যাক করুন' : 'Track Order Live'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleModalClose}
                className="py-3 px-5 rounded-xl text-xs sm:text-sm font-semibold bg-purple-950/60 hover:bg-purple-900/60 text-slate-300 border border-purple-800/40 cursor-pointer"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        ) : (
          // ================= ORDER FORM =================
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
            {/* Service Type Switcher Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#090314] rounded-xl border border-purple-900/40 text-[11px] sm:text-xs">
              <button
                type="button"
                onClick={() => setServiceType('free_fire')}
                className={`py-2 px-1 rounded-lg font-bold transition-all cursor-pointer text-center ${
                  serviceType === 'free_fire'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                FF Diamond
              </button>
              <button
                type="button"
                onClick={() => setServiceType('facebook_followers')}
                className={`py-2 px-1 rounded-lg font-bold transition-all cursor-pointer text-center ${
                  serviceType === 'facebook_followers'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Facebook
              </button>
              <button
                type="button"
                onClick={() => setServiceType('instagram_followers')}
                className={`py-2 px-1 rounded-lg font-bold transition-all cursor-pointer text-center ${
                  serviceType === 'instagram_followers'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Instagram
              </button>
              <button
                type="button"
                onClick={() => setServiceType('streaming_subscription')}
                className={`py-2 px-1 rounded-lg font-bold transition-all cursor-pointer text-center ${
                  serviceType === 'streaming_subscription'
                    ? 'bg-red-600 text-white shadow-md shadow-red-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                OTT / Stream
              </button>
            </div>

            {/* Selected Item Summary Card */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/70 via-indigo-950/50 to-purple-950/70 border border-purple-800/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-black/40 border border-purple-800/50">
                  {renderServiceIcon()}
                </div>
                <div>
                  <div className="text-xs text-purple-300 font-medium">
                    {lang === 'bn' ? 'নির্বাচিত সার্ভিস' : 'Selected Service'}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white">
                    {lang === 'bn' ? orderTitleBn : orderTitle}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {orderQuantityOrPlan}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                  {lang === 'bn' ? 'মোট মূল্য' : 'Total Price'}
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono">
                  ৳{finalAmountBdt} <span className="text-xs text-slate-300 font-sans">BDT</span>
                </div>
              </div>
            </div>

            {/* Target Fields Based on Service */}
            {serviceType === 'free_fire' && (
              <div className="space-y-4 p-4 rounded-xl bg-[#140b2a]/70 border border-purple-900/40">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>{lang === 'bn' ? '১. ফ্রি ফায়ার প্লেয়ার তথ্য (UID)' : '1. Free Fire Player Info (UID)'}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowUidGuide(!showUidGuide)}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'UID কোথায় পাবো?' : 'UID Guide'}</span>
                  </button>
                </div>

                {showUidGuide && (
                  <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-200 space-y-1">
                    <div className="font-bold">UID কীভাবে পাবেন:</div>
                    <div>১. Free Fire গেম ওপেন করে ওপরের বামপাশে আপনার প্রোফাইল ব্যানারে ক্লিক করুন।</div>
                    <div>২. প্রোফাইল ইনফোতে আপনার নামের নিচে ৮–১০ সংখ্যার Player UID দেখতে পাবেন এবং কপি করুন।</div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'bn' ? 'Free Fire Player UID (আবশ্যক)' : 'Free Fire Player UID (Required)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={playerUid}
                    onChange={(e) => setPlayerUid(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 2847591024"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090312] border border-purple-900/60 font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Package Dropdown Selector */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'bn' ? 'ডায়মন্ড প্যাকেজ পরিবর্তন করুন (১০০ - ১২,০০০)' : 'Select Package (100 - 12,000)'}
                  </label>
                  <select
                    value={pkgId}
                    onChange={(e) => setPkgId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090312] border border-purple-900/60 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
                  >
                    {packages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.nameBn}) — ৳{p.priceBdt} BDT
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {serviceType === 'facebook_followers' && (
              <div className="space-y-4 p-4 rounded-xl bg-[#140b2a]/70 border border-blue-900/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                  <FacebookLogo className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? '১. ফেসবুক প্রোফাইল / পেজ তথ্য' : '1. Facebook Profile / Page'}</span>
                </h4>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'bn' ? 'ফেসবুক প্রোফাইল বা পেজ লিংক (URL) *' : 'Target Facebook Profile or Page Link *'}
                  </label>
                  <input
                    type="url"
                    required
                    value={targetAccountLink}
                    onChange={(e) => setTargetAccountLink(e.target.value)}
                    placeholder="https://facebook.com/yourprofile"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090312] border border-blue-900/60 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  />
                  <div className="text-[11px] text-slate-400 mt-1">
                    {lang === 'bn' ? 'প্রোফাইল অবশ্যই পাবলিক (Public) থাকতে হবে।' : 'Profile must be public. No password required.'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {lang === 'bn' ? 'ফলোয়ার সংখ্যা (১ - ১০,০০,০০০)' : 'Followers (1 - 1M)'}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={1000000}
                      step={1}
                      value={followerCount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 0;
                        setFollowerCount(val);
                        const calculated = val > 0 ? Math.max(1, Math.round((val / 1000) * fbRatePer1k)) : 0;
                        setFollowerPrice(calculated);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#090312] border border-blue-900/60 font-mono font-bold text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {lang === 'bn' ? 'মূল্য (Dynamic Price)' : 'Calculated Price'}
                    </label>
                    <div className="px-3.5 py-2 rounded-xl bg-[#090312] border border-blue-900/60 text-emerald-400 font-mono font-bold text-sm">
                      ৳{followerPrice.toLocaleString()} BDT
                    </div>
                  </div>
                </div>
              </div>
            )}

            {serviceType === 'instagram_followers' && (
              <div className="space-y-4 p-4 rounded-xl bg-[#140b2a]/70 border border-pink-900/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
                  <InstagramLogo className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? '১. ইনস্টাগ্রাম প্রোফাইল তথ্য' : '1. Instagram Profile / Handle'}</span>
                </h4>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'bn' ? 'ইনস্টাগ্রাম ইউজারনেম বা প্রোফাইল লিংক *' : 'Target Instagram Username or Profile URL *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={targetAccountLink}
                    onChange={(e) => setTargetAccountLink(e.target.value)}
                    placeholder="@yourprofile or https://instagram.com/yourprofile"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090312] border border-pink-900/60 text-white text-xs sm:text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {lang === 'bn' ? 'ফলোয়ার সংখ্যা (১ - ১০,০০,০০০)' : 'Followers (1 - 1M)'}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={1000000}
                      step={1}
                      value={followerCount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 0;
                        setFollowerCount(val);
                        const calculated = val > 0 ? Math.max(1, Math.round((val / 1000) * igRatePer1k)) : 0;
                        setFollowerPrice(calculated);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#090312] border border-pink-900/60 font-mono font-bold text-white text-xs sm:text-sm focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {lang === 'bn' ? 'মূল্য (Dynamic Price)' : 'Calculated Price'}
                    </label>
                    <div className="px-3.5 py-2 rounded-xl bg-[#090312] border border-pink-900/60 text-emerald-400 font-mono font-bold text-sm">
                      ৳{followerPrice.toLocaleString()} BDT
                    </div>
                  </div>
                </div>
              </div>
            )}

            {serviceType === 'streaming_subscription' && (
              <div className="space-y-4 p-4 rounded-xl bg-[#140b2a]/70 border border-red-900/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-300 flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? '১. সাবস্ক্রিপশন ডেলিভারি তথ্য' : '1. Subscription Delivery Info'}</span>
                </h4>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'bn' ? 'ডেলিভারি ইমেইল (যেখানে আইডি/পাসওয়ার্ড পাবেন) *' : 'Delivery Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090312] border border-red-900/60 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500"
                  />
                  <div className="text-[11px] text-slate-400 mt-1">
                    {lang === 'bn'
                      ? 'অর্ডার অনুমোদিত হলে আপনার এই ইমেইলে এবং হোয়াটসঅ্যাপে লগইন ডিটেইল পাঠানো হবে।'
                      : 'Login credentials and profile details will be sent here upon payment verification.'}
                  </div>
                </div>

                {streamingServices.length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {lang === 'bn' ? 'সাবস্ক্রিপশন প্ল্যান পরিবর্তন করুন' : 'Change Subscription Plan'}
                    </label>
                    <select
                      value={selectedSub?.id || ''}
                      onChange={(e) => {
                        const targetId = e.target.value;
                        for (const serv of streamingServices) {
                          const matchedDur = serv.durations.find((d) => `${serv.id}-${d.id}` === targetId);
                          if (matchedDur) {
                            setSelectedSub({
                              id: `${serv.id}-${matchedDur.id}`,
                              service: serv.serviceKey,
                              title: `${serv.name} (${matchedDur.durationLabel})`,
                              titleBn: `${serv.nameBn} (${matchedDur.durationLabelBn})`,
                              duration: matchedDur.durationLabel,
                              durationBn: matchedDur.durationLabelBn,
                              typeBadge: serv.badge,
                              priceBdt: matchedDur.priceBdt,
                              features: serv.features,
                              featuresBn: serv.featuresBn,
                              active: true,
                            });
                            break;
                          }
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090312] border border-red-900/60 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500"
                    >
                      {streamingServices.flatMap((serv) =>
                        serv.durations.map((dur) => (
                          <option key={`${serv.id}-${dur.id}`} value={`${serv.id}-${dur.id}`}>
                            {serv.name}: {dur.durationLabel} ({dur.durationLabelBn}) — ৳{dur.priceBdt} BDT
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Customer Contact & Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {lang === 'bn' ? 'আপনার নাম (Customer Name)' : 'Customer Name'}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Arafat Hossain"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090312] border border-purple-900/60 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {lang === 'bn' ? 'হোয়াটসঅ্যাপ / ফোন নম্বর *' : 'WhatsApp / Mobile Number *'}
                </label>
                <input
                  type="text"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090312] border border-purple-900/60 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Payment Method Selector (bKash, Nagad, and AG Coins Wallet) */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-300">
                {lang === 'bn' ? '২. পেমেন্ট মেথড নির্বাচন করুন' : '2. Select Payment Method'}
              </label>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {/* bKash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer relative overflow-hidden ${
                    paymentMethod === 'bkash'
                      ? 'bg-pink-950/80 border-pink-500 shadow-lg shadow-pink-950/60 ring-2 ring-pink-500/50 scale-[1.01]'
                      : 'bg-[#120826] border-purple-900/40 hover:border-pink-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 mb-1">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white p-0.5 flex items-center justify-center shadow-sm">
                      <BkashLogo className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="text-xs sm:text-sm font-black text-white">bKash</div>
                      <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-[#E2136E] text-white">
                        Personal
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] text-pink-300 font-medium">সেন্ড মানি</div>
                </button>

                {/* Nagad */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer relative overflow-hidden ${
                    paymentMethod === 'nagad'
                      ? 'bg-amber-950/80 border-orange-500 shadow-lg shadow-amber-950/60 ring-2 ring-orange-500/50 scale-[1.01]'
                      : 'bg-[#120826] border-purple-900/40 hover:border-orange-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 mb-1">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-[#f7941d] to-[#ee4036] p-0.5 flex items-center justify-center shadow-sm">
                      <NagadLogo className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="text-xs sm:text-sm font-black text-white">Nagad</div>
                      <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-orange-600 text-white">
                        Personal
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] text-amber-300 font-medium">সেন্ড মানি</div>
                </button>

                {/* AG Coins Wallet */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer relative overflow-hidden ${
                    paymentMethod === 'wallet'
                      ? 'bg-amber-950/80 border-amber-400 shadow-lg shadow-amber-950/60 ring-2 ring-amber-400/50 scale-[1.01]'
                      : 'bg-[#120826] border-purple-900/40 hover:border-amber-600'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 mb-1">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5 flex items-center justify-center text-black font-black text-xs shadow-sm">
                      ৳
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="text-xs sm:text-sm font-black text-white">AG Coins</div>
                      <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-emerald-600 text-white">
                        ৳{wallet?.balance ?? 0}
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] text-amber-300 font-medium">অ্যাকাউন্ট ব্যালেন্স</div>
                </button>
              </div>

              {/* Payment Detail Box */}
              {paymentMethod === 'wallet' ? (
                /* AG Wallet Balance Payment Box */
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 via-[#120826] to-emerald-950/40 border border-amber-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold text-xs">
                        ৳
                      </div>
                      <span className="text-xs font-bold text-amber-200">
                        {lang === 'bn' ? 'ব্যক্তিগত সাইট ব্যালেন্স পেমেন্ট' : 'Personal Site Balance Payment'}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800/40">
                      ইনস্ট্যান্ট ডেলিভারি
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#090314] border border-purple-900/40">
                      <div className="text-slate-400 text-[10px]">আপনার বর্তমান ব্যালেন্স</div>
                      <div className="font-mono font-black text-emerald-400 text-sm">
                        ৳{(wallet?.balance || 0).toLocaleString()} AG Coins
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#090314] border border-purple-900/40">
                      <div className="text-slate-400 text-[10px]">অর্ডারে কাটা হবে</div>
                      <div className="font-mono font-black text-amber-300 text-sm">
                        ৳{finalAmountBdt.toLocaleString()} BDT
                      </div>
                    </div>
                  </div>

                  {(wallet?.balance || 0) >= finalAmountBdt ? (
                    <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-800/40 flex items-center justify-between text-xs text-emerald-200">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>ব্যালেন্স পর্যাপ্ত! সরাসরি অর্ডার কনফার্ম হবে (TrxID লাগবে না)।</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-300">
                        অবশিষ্ট: ৳{((wallet?.balance || 0) - finalAmountBdt).toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-800/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-rose-200">
                      <div className="flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>
                          ব্যালেন্স অপর্যাপ্ত! আরও ৳{(finalAmountBdt - (wallet?.balance || 0)).toLocaleString()} প্রয়োজন।
                        </span>
                      </div>
                      {onOpenAddMoney && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenAddMoney();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-bold text-xs shadow cursor-pointer whitespace-nowrap"
                        >
                          + এখনই অ্যাড মানি করুন
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Manual bKash / Nagad Send Money Box */
                <div className={`p-4 rounded-xl bg-[#120826] border ${receiverInfo.border} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-semibold">{receiverInfo.name}:</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${receiverInfo.badgeBg}`}>
                      {lang === 'bn' ? 'সেন্ড মানি করুন' : 'Send Money'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#090314] border border-purple-900/50">
                    <span className="font-mono font-bold text-base sm:text-lg text-white tracking-wider">
                      {receiverInfo.number}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyNumber(receiverInfo.number)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNumber ? (lang === 'bn' ? 'কপি হয়েছে' : 'Copied') : (lang === 'bn' ? 'নম্বর কপি' : 'Copy Number')}</span>
                    </button>
                  </div>

                  <div className="text-xs text-slate-300">
                    <span className="font-semibold text-purple-300">{lang === 'bn' ? 'নির্দেশনা:' : 'Instruction:'} </span>
                    {receiverInfo.instruction} মোট ৳{finalAmountBdt} BDT পাঠাবেন।
                  </div>

                  {/* Sender Payment Number & TrxID Input */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-purple-900/30">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        {lang === 'bn' ? 'আপনার পেমেন্ট নম্বর (যেটি থেকে পাঠিয়েছেন) *' : 'Sender Mobile Number *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        placeholder={contactNumber || '017xxxxxxxx'}
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
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Main Action Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-lg shadow-purple-950 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{lang === 'bn' ? 'অর্ডার জমা হচ্ছে...' : 'Submitting Order...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'bn' ? `অর্ডার নিশ্চিত করুন (৳${finalAmountBdt} BDT)` : `Confirm Order (৳${finalAmountBdt} BDT)`}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
