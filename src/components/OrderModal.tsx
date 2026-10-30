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
  Users,
  Tv,
  Flame,
  Sparkles,
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
} from '../types';
import { translations } from '../data/translations';
import { BkashLogo, NagadLogo, FacebookLogo, InstagramLogo, NetflixLogo, CrunchyrollLogo } from './BrandLogos';
import { BkashPaymentModal, BkashPaymentSuccessData } from './BkashPaymentModal';

export interface ActiveOrderSelection {
  serviceType: ServiceType;
  // Free Fire
  diamondPackage?: DiamondPackage | null;
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

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialPaymentMethod === 'bkash' ? 'bkash' : 'nagad');
  const [trxId, setTrxId] = useState('');
  const [showBkashGateway, setShowBkashGateway] = useState(false);
  const [bkashAutoSuccess, setBkashAutoSuccess] = useState<BkashPaymentSuccessData | null>(null);
  const [showManualBkash, setShowManualBkash] = useState(false);

  // UI state
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUidGuide, setShowUidGuide] = useState(false);

  // Base rates
  const fbRatePer1k = config.followerRatePer1k || 120;
  const igRatePer1k = config.instagramFollowerRatePer1k || 150;

  // Sync state whenever activeSelection or selectedPackage updates
  useEffect(() => {
    if (activeSelection) {
      setServiceType(activeSelection.serviceType);

      if (activeSelection.serviceType === 'free_fire' && activeSelection.diamondPackage) {
        setPkgId(activeSelection.diamondPackage.id);
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

  // Determine target payment account (mobile financial services only)
  const getPaymentDetails = () => {
    switch (paymentMethod) {
      case 'bkash':
        return {
          name: 'bKash Personal',
          nameBn: 'বিকাশ পার্সোনাল',
          number: config.bkashMerchantNumber || config.bkashNumber,
          instruction: lang === 'bn' ? 'বিকাশ অ্যাপ বা *247# ডায়াল করে Send Money করুন।' : 'Send Money using bKash App or dial *247#.',
          color: 'from-[#e2136e] to-[#b00f55]',
          border: 'border-pink-500/40',
          badgeBg: 'bg-pink-950/60 text-pink-300 border-pink-800/40',
        };
      case 'nagad':
      default:
        return {
          name: 'Nagad Personal',
          nameBn: 'নগদ পার্সোনাল',
          number: config.nagadNumber,
          instruction: lang === 'bn' ? 'নগদ অ্যাপ বা *167# ডায়াল করে Send Money করুন।' : 'Send Money using Nagad App or dial *167#.',
          color: 'from-[#f7941d] to-[#ee4036]',
          border: 'border-orange-500/40',
          badgeBg: 'bg-amber-950/60 text-amber-300 border-amber-800/40',
        };
    }
  };

  const paymentInfo = getPaymentDetails();

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

  // Helper validation for customer target & contact
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
          error: lang === 'bn' ? 'সঠিক Player UID দিন (শুধুমাত্র সংখ্যা, ৫–১৪ ডিজিট)।' : 'Invalid Player UID. Must be 5-14 digits numbers.',
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

    return {
      valid: true,
      cleanContact,
      finalPlayerUid,
      finalTargetLink,
      finalCustomerEmail,
    };
  };

  // Launch Automated bKash PGW Modal
  const handleLaunchBkashGateway = () => {
    setErrorMessage(null);
    const check = validateFormInputs();
    if (!check.valid) {
      setErrorMessage(check.error || 'Please fill in required fields.');
      return;
    }
    setShowBkashGateway(true);
  };

  // Called automatically when bKash Gateway completes successfully
  const handleBkashGatewaySuccess = async (data: BkashPaymentSuccessData) => {
    setBkashAutoSuccess(data);
    setTrxId(data.trxId);
    setShowBkashGateway(false);

    const check = validateFormInputs();
    if (!check.valid) return;

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
        paymentMethod: 'bkash',
        paymentNumber: data.accountNumber ? `+880${data.accountNumber.replace(/\D/g, '')}` : (config.bkashMerchantNumber || config.bkashNumber),
        trxId: data.trxId.toUpperCase(),
        contact: check.cleanContact!,
        isAutomatedPayment: true,
        paymentDetails: {
          invoiceId: data.invoiceId,
          maskedAccount: data.accountNumber,
          trxId: data.trxId,
          paidAt: data.paidAt,
          gatewayStatus: 'Completed',
        },
      });

      setSubmittedOrderId(newOrderId);
    } catch (err: any) {
      setErrorMessage(err?.message || (lang === 'bn' ? 'অর্ডার জমা দিতে সমস্যা হয়েছে।' : 'Failed to submit order.'));
    } finally {
      setSubmitting(false);
    }
  };

  // Regular / Manual form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // If customer is on bKash automated mode and hasn't paid yet, launch gateway
    if (paymentMethod === 'bkash' && !showManualBkash && !bkashAutoSuccess) {
      handleLaunchBkashGateway();
      return;
    }

    const check = validateFormInputs();
    if (!check.valid) {
      setErrorMessage(check.error || 'Please fill in required fields.');
      return;
    }

    // Payment TrxID validation for manual payment
    const cleanTrx = trxId.trim();
    if (!cleanTrx) {
      setErrorMessage(lang === 'bn' ? 'টাকা পাঠানোর পর প্রাপ্ত Transaction ID (TrxID) দিন।' : 'Transaction ID (TrxID) is required.');
      return;
    }
    if (cleanTrx.length < 4) {
      setErrorMessage(lang === 'bn' ? 'সঠিক Transaction ID বা রেফারেন্স দিন।' : 'Please enter a valid Transaction ID.');
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
        paymentNumber: paymentInfo.number,
        trxId: cleanTrx.toUpperCase(),
        contact: check.cleanContact!,
        isAutomatedPayment: !!bkashAutoSuccess,
        paymentDetails: bkashAutoSuccess
          ? {
              invoiceId: bkashAutoSuccess.invoiceId,
              maskedAccount: bkashAutoSuccess.accountNumber,
              trxId: bkashAutoSuccess.trxId,
              paidAt: bkashAutoSuccess.paidAt,
              gatewayStatus: 'Completed',
            }
          : undefined,
      });

      setSubmittedOrderId(newOrderId);
    } catch (err: any) {
      setErrorMessage(err?.message || (lang === 'bn' ? 'অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' : 'Failed to submit order. Please retry.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setSubmittedOrderId(null);
    setErrorMessage(null);
    onClose();
  };

  // Render Service Icon for summary
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
                : (lang === 'bn' ? 'ডিজিটাল সার্ভিস অর্ডার চেকআউট' : 'Digital Service Order Checkout')}
            </h3>
            <div className="text-xs text-purple-300/80">
              {submittedOrderId
                ? (lang === 'bn' ? 'আপনার অর্ডারটি সফলভাবে সিস্টেমে রেকর্ড করা হয়েছে' : 'Your order has been recorded successfully')
                : (lang === 'bn' ? 'নিরাপদ পেমেন্ট ও দ্রুততম ডেলিভারি সার্ভিস' : 'Safe payment & fast automated fulfillment')}
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
                {lang === 'bn' ? 'ধন্যবাদ! অর্ডার সফলভাবে জমা হয়েছে' : 'Thank You! Order Submitted'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
                {lang === 'bn'
                  ? 'আপনার পেমেন্ট যাচাই করার পর ৫-১৫ মিনিটের মধ্যে ডেলিভারি সম্পন্ন হবে।'
                  : 'Your payment is being verified. Delivery will be fulfilled within 5-15 minutes.'}
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-[#140a2c] rounded-2xl p-5 border border-purple-800/40 text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
                <span className="text-xs text-slate-400 font-medium">{lang === 'bn' ? 'অর্ডার ট্র্যাকিং আইডি:' : 'Order Tracking ID:'}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-cyan-400 text-base">{submittedOrderId}</span>
                  <button
                    onClick={() => handleCopyOrderId(submittedOrderId)}
                    className="p-1 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    title="Copy Order ID"
                  >
                    {copiedOrderId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block">{lang === 'bn' ? 'সার্ভিস আইটেম:' : 'Service Item:'}</span>
                  <span className="font-semibold text-white">{orderTitle}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{lang === 'bn' ? 'পরিমাণ / মেয়াদ:' : 'Quantity / Plan:'}</span>
                  <span className="font-semibold text-purple-300">{orderQuantityOrPlan}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{lang === 'bn' ? 'পরিশোধিত মূল্য:' : 'Amount Paid:'}</span>
                  <span className="font-bold text-emerald-400 font-mono">৳{finalAmountBdt} BDT</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{lang === 'bn' ? 'পেমেন্ট মেথড:' : 'Payment Method:'}</span>
                  <span className="font-semibold text-white uppercase">{paymentMethod}</span>
                </div>
              </div>

              {contactNumber && (
                <div className="pt-2 border-t border-purple-900/40 text-xs">
                  <span className="text-slate-400">{lang === 'bn' ? 'যোগাযোগ নম্বর / হোয়াটসঅ্যাপ:' : 'Contact Phone / WhatsApp:'} </span>
                  <span className="text-white font-medium">{contactNumber}</span>
                </div>
              )}
            </div>

            {/* Direct WhatsApp Confirmation Button */}
            <a
              href={`https://wa.me/88${config.whatsappNumber}?text=${encodeURIComponent(
                `আসসালামু আলাইকুম, আমি আরাফাত গেমিং এ একটি অর্ডার করেছি।\n\nOrder ID: ${submittedOrderId}\nService: ${orderTitle}\nAmount: ৳${finalAmountBdt} BDT\nTrxID: ${trxId}\nPhone: ${contactNumber}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950 transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে অর্ডার কনফার্ম করুন' : 'Confirm via WhatsApp Support'}</span>
            </a>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  handleModalClose();
                  onNavigateToTracking(submittedOrderId);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'অর্ডার লাইভ ট্র্যাক করুন' : 'Track Order Status'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleModalClose}
                className="py-3 px-5 rounded-xl bg-[#140b2a] hover:bg-[#1a0f37] text-slate-300 hover:text-white font-medium text-xs sm:text-sm border border-purple-900/40 cursor-pointer"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        ) : (
          // ================= ORDER FORM =================
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Service Switcher Tabs: 4 distinct categories */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-xl bg-[#080314] border border-purple-900/40">
              <button
                type="button"
                onClick={() => setServiceType('free_fire')}
                className={`py-2 px-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  serviceType === 'free_fire'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Free Fire</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setServiceType('facebook_followers');
                  setFollowerPrice(Math.round((followerCount / 1000) * fbRatePer1k));
                }}
                className={`py-2 px-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  serviceType === 'facebook_followers'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FacebookLogo className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setServiceType('instagram_followers');
                  setFollowerPrice(Math.round((followerCount / 1000) * igRatePer1k));
                }}
                className={`py-2 px-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  serviceType === 'instagram_followers'
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <InstagramLogo className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setServiceType('streaming_subscription');
                  if (!selectedSub && streamingServices.length > 0) {
                    const firstServ = streamingServices.find((s) => s.active) || streamingServices[0];
                    if (firstServ && firstServ.durations.length > 0) {
                      const dur = firstServ.durations[0];
                      setSelectedSub({
                        id: `${firstServ.id}-${dur.id}`,
                        service: firstServ.serviceKey,
                        title: `${firstServ.name} (${dur.durationLabel})`,
                        titleBn: `${firstServ.nameBn} (${dur.durationLabelBn})`,
                        duration: dur.durationLabel,
                        durationBn: dur.durationLabelBn,
                        typeBadge: firstServ.badge,
                        priceBdt: dur.priceBdt,
                        features: firstServ.features,
                        featuresBn: firstServ.featuresBn,
                        popular: dur.popular,
                        active: true,
                      });
                    }
                  }
                }}
                className={`py-2 px-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  serviceType === 'streaming_subscription'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Streaming</span>
              </button>
            </div>

            {/* Live Selected Item Highlight Banner with Logo */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/60 to-[#120829] border border-purple-800/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#090418] border border-purple-900/50 flex items-center justify-center shadow-md">
                  {renderServiceIcon()}
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-purple-400">
                    {lang === 'bn' ? 'নির্বাচিত আইটেম:' : 'Selected Package:'}
                  </span>
                  <div className="font-bold text-sm text-white">
                    {orderTitle}
                  </div>
                  <div className="text-xs text-slate-400">
                    {orderQuantityOrPlan}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 block">{lang === 'bn' ? 'পরিশোধযোগ্য:' : 'Total Payable:'}</span>
                <div className="text-lg sm:text-xl font-black font-mono text-emerald-400">
                  ৳{finalAmountBdt}
                  <span className="text-xs font-sans text-slate-300 ml-1">BDT</span>
                </div>
              </div>
            </div>

            {/* Service-Specific Target Fields */}
            {serviceType === 'free_fire' && (
              <div className="space-y-4 p-4 rounded-xl bg-[#140b2a]/70 border border-purple-900/40">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>{lang === 'bn' ? '১. ফ্রি ফায়ার প্লেয়ার তথ্য' : '1. Free Fire Player Info'}</span>
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
                    placeholder="2847591024"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090312] border border-purple-900/60 font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Package Dropdown Selector */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'bn' ? 'ডায়মন্ড প্যাকেজ পরিবর্তন করুন' : 'Select Package'}
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
                    {lang === 'bn' ? 'প্রোফাইল অবশ্যই পাবলিক (Public) থাকতে হবে। কোনো পাসওয়ার্ড লাগবে না।' : 'Profile must be public. No password required.'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {lang === 'bn' ? 'ফলোয়ার সংখ্যা (১ - ১০,০০,০০০)' : 'Followers Quantity (1 - 1M)'}
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
                      {lang === 'bn' ? 'হিসাবকৃত মূল্য (Dynamic Price)' : 'Calculated Price'}
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
                  <div className="text-[11px] text-slate-400 mt-1">
                    {lang === 'bn' ? 'ইনস্টাগ্রাম অ্যাকাউন্ট অবশ্যই পাবলিক (Public) থাকতে হবে। কোনো পাসওয়ার্ড লাগবে না।' : 'Account must be public. 100% safe, no password needed.'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {lang === 'bn' ? 'ফলোয়ার সংখ্যা (১ - ১০,০০,০০০)' : 'Followers Quantity (1 - 1M)'}
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
                      {lang === 'bn' ? 'হিসাবকৃত মূল্য (Dynamic Price)' : 'Calculated Price'}
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
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-300 flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-red-400" />
                    <span>{lang === 'bn' ? '১. সাবস্ক্রিপশন ডেলিভারি তথ্য' : '1. Subscription Delivery Info'}</span>
                  </h4>
                  {selectedSub && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-red-950/80 text-red-300 border border-red-800/40">
                      {selectedSub.duration}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'bn' ? 'ডেলিভারি ইমেইল অ্যাড্রেস *' : 'Delivery Email Address *'}
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
                    {lang === 'bn' ? 'এই ইমেইলে সাবস্ক্রিপশন লগইন তথ্য ও ইনভাইটেশন পাঠানো হবে।' : 'Login access credentials or family invite will be delivered to this email.'}
                  </div>
                </div>

                {/* Streaming Service & Duration Selector */}
                {streamingServices.length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {lang === 'bn' ? 'সাবস্ক্রিপশন সার্ভিস ও মেয়াদ পরিবর্তন করুন' : 'Select Service & Duration Plan'}
                    </label>
                    <select
                      value={selectedSub?.id || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        for (const serv of streamingServices) {
                          const matchingDur = serv.durations.find(
                            (d) =>
                              `${serv.id}-${d.id}` === val ||
                              `netflix-${d.id}` === val ||
                              `crunchyroll-${d.id}` === val ||
                              d.id === val
                          );
                          if (matchingDur) {
                            setSelectedSub({
                              id: val,
                              service: serv.serviceKey,
                              title: `${serv.name} (${matchingDur.durationLabel})`,
                              titleBn: `${serv.nameBn} (${matchingDur.durationLabelBn})`,
                              duration: matchingDur.durationLabel,
                              durationBn: matchingDur.durationLabelBn,
                              typeBadge: serv.badge,
                              priceBdt: matchingDur.priceBdt,
                              features: serv.features,
                              featuresBn: serv.featuresBn,
                              popular: matchingDur.popular,
                              active: true,
                            });
                            break;
                          }
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090312] border border-red-900/60 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      {streamingServices
                        .filter((s) => s.active)
                        .map((serv) => (
                          <optgroup key={serv.id} label={`${serv.name} (${serv.nameBn})`}>
                            {serv.durations.map((dur) => (
                              <option key={dur.id} value={`${serv.id}-${dur.id}`}>
                                {serv.name} — {dur.durationLabelBn || dur.durationLabel} (৳{dur.priceBdt} BDT)
                              </option>
                            ))}
                          </optgroup>
                        ))}
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
                  placeholder="Arafat Hossain"
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

            {/* Payment Method Selector (bKash & Nagad only) */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-300">
                {lang === 'bn' ? '২. পেমেন্ট মেথড নির্বাচন করুন' : '2. Select Payment Method'}
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* bKash (Automated Gateway) */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('bkash');
                    setShowManualBkash(false);
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer relative overflow-hidden ${
                    paymentMethod === 'bkash'
                      ? 'bg-pink-950/80 border-pink-500 shadow-lg shadow-pink-950/60 ring-2 ring-pink-500/50 scale-[1.01]'
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
                        Auto Gateway
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] text-pink-300 font-medium">১-ক্লিক অটো পেমেন্ট</div>
                </button>

                {/* Nagad (Personal Send Money) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer relative overflow-hidden ${
                    paymentMethod === 'nagad'
                      ? 'bg-amber-950/80 border-orange-500 shadow-lg shadow-amber-950/60 ring-2 ring-orange-500/50 scale-[1.01]'
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
                        Send Money
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] text-amber-300 font-medium">নগদ পার্সোনাল</div>
                </button>
              </div>

              {/* bKash Payment Experience */}
              {paymentMethod === 'bkash' && (
                <div className="space-y-3">
                  {bkashAutoSuccess ? (
                    /* Automated bKash Success Confirmation Badge */
                    <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500 text-emerald-200 space-y-2 animate-fade-in shadow-lg shadow-emerald-950/50">
                      <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>বিকাশ অটোমেটেড পেমেন্ট সফলভাবে ভেরিফাইড!</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-black/40 p-2.5 rounded-xl border border-emerald-800/40">
                        <div>
                          <span className="text-slate-400 block text-[10px]">TrxID:</span>
                          <span className="font-bold text-white text-sm">{bkashAutoSuccess.trxId}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">পরিশোধিত:</span>
                          <span className="font-bold text-emerald-400 text-sm">৳{bkashAutoSuccess.amountBdt} BDT</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-emerald-300/80">
                        আপনার অর্ডারটি সিস্টেমে সাবমিট হচ্ছে...
                      </p>
                    </div>
                  ) : !showManualBkash ? (
                    /* Primary Automated bKash 1-Click Pay Button */
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={handleLaunchBkashGateway}
                        className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#E2136E] to-[#be0f5a] hover:from-[#c90f61] hover:to-[#a00d4c] text-white flex items-center justify-between shadow-xl shadow-pink-950/60 border-2 border-pink-400/40 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                            <BkashLogo className="w-9 h-9" />
                          </div>
                          <div className="text-left">
                            <div className="text-base font-black flex items-center gap-2">
                              <span>Pay with bKash</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-900/80 font-mono font-bold tracking-wider">
                                {config.bkashMode === 'sandbox' ? 'Sandbox' : 'Direct API'}
                              </span>
                            </div>
                            <div className="text-xs text-pink-100 font-medium">
                              ১-ক্লিকে অটোমেটেড পেমেন্ট (TrxID লিখতে হবে না)
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono font-black bg-pink-950/70 border border-pink-400/40 px-3 py-1.5 rounded-xl block">
                            ৳{finalAmountBdt} BDT
                          </span>
                        </div>
                      </button>

                      {/* Manual Send Money toggle */}
                      <div className="text-center pt-1">
                        <button
                          type="button"
                          onClick={() => setShowManualBkash(true)}
                          className="text-xs text-purple-300 hover:text-pink-300 underline cursor-pointer"
                        >
                          {lang === 'bn'
                            ? 'বা বিকাশ পার্সোনাল নম্বরে Send Money করতে চান? (ম্যানুয়াল পদ্ধতি)'
                            : 'Or prefer manual Send Money via bKash personal number?'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Manual bKash Send Money Box */
                    <div className="space-y-3 p-4 rounded-xl bg-[#120826] border border-pink-500/40">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-300 font-semibold">বিকাশ পার্সোনাল নম্বর:</span>
                        <button
                          type="button"
                          onClick={() => setShowManualBkash(false)}
                          className="text-xs text-pink-400 hover:underline cursor-pointer"
                        >
                          ← অটোমেটেড গেটওয়ে ব্যবহার করুন
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#090314] border border-pink-900/50">
                        <span className="font-mono font-bold text-base text-white tracking-wider">
                          {config.bkashMerchantNumber || config.bkashNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyNumber(config.bkashMerchantNumber || config.bkashNumber)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#E2136E] hover:bg-[#c90f61] text-xs font-medium text-white transition-colors cursor-pointer"
                        >
                          {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedNumber ? (lang === 'bn' ? 'কপি হয়েছে' : 'Copied') : (lang === 'bn' ? 'কপি' : 'Copy')}</span>
                        </button>
                      </div>

                      <div className="text-xs text-slate-300">
                        <span className="font-medium text-pink-300">নিয়ম: </span>
                        বিকাশ অ্যাপ বা *247# ডায়াল করে Send Money করুন এবং নিচের ঘরে TrxID দিন।
                      </div>

                      {/* TrxID Input */}
                      <div className="space-y-1 pt-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-pink-300">
                          Transaction ID (TrxID) দিন *
                        </label>
                        <input
                          type="text"
                          required
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          placeholder="BKH89C712X"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#090312] border border-pink-900/60 font-mono text-white text-xs sm:text-sm uppercase tracking-wider placeholder-slate-600 focus:outline-none focus:border-pink-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Nagad Payment Experience (Manual Send Money) */}
              {paymentMethod === 'nagad' && (
                <div className="p-4 rounded-xl bg-[#120826] border border-orange-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-semibold">{paymentInfo.name}:</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${paymentInfo.badgeBg}`}>
                      {lang === 'bn' ? 'সেন্ড মানি করুন' : 'Send Money'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#090314] border border-orange-900/50">
                    <span className="font-mono font-bold text-base text-white tracking-wider">
                      {paymentInfo.number}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyNumber(paymentInfo.number)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-gradient-to-r from-[#f7941d] to-[#ee4036] text-xs font-medium text-white transition-colors cursor-pointer"
                    >
                      {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNumber ? (lang === 'bn' ? 'কপি হয়েছে' : 'Copied') : (lang === 'bn' ? 'কপি' : 'Copy')}</span>
                    </button>
                  </div>

                  <div className="text-xs text-slate-300">
                    <span className="font-medium text-amber-300">{lang === 'bn' ? 'নিয়ম:' : 'Step:'} </span>
                    {paymentInfo.instruction}
                  </div>

                  {/* Nagad TrxID Input */}
                  <div className="space-y-1 pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
                      Transaction ID (TrxID) দিন *
                    </label>
                    <input
                      type="text"
                      required
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="72KSL9284"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090312] border border-orange-900/60 font-mono text-white text-xs sm:text-sm uppercase tracking-wider placeholder-slate-600 focus:outline-none focus:border-orange-500"
                    />
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
            {paymentMethod === 'bkash' && !showManualBkash && !bkashAutoSuccess ? (
              <button
                type="button"
                onClick={handleLaunchBkashGateway}
                disabled={submitting}
                className="w-full py-4 px-4 rounded-xl font-extrabold text-base bg-[#E2136E] hover:bg-[#c90f61] text-white shadow-xl shadow-pink-950 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <BkashLogo className="w-6 h-6" />
                <span>{lang === 'bn' ? `Pay with bKash (৳${finalAmountBdt} BDT)` : `Pay with bKash (৳${finalAmountBdt} BDT)`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
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
                    <span>{lang === 'bn' ? `অর্ডার নিশ্চিত করুন (৳${finalAmountBdt} BDT)` : `Confirm Order (৳${finalAmountBdt} BDT)`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </form>
        )}
      </div>

      {/* Official bKash PGW Checkout Modal */}
      <BkashPaymentModal
        isOpen={showBkashGateway}
        amountBdt={finalAmountBdt}
        orderTitle={orderTitle}
        customerContact={contactNumber}
        config={config}
        onSuccess={handleBkashGatewaySuccess}
        onCancel={() => setShowBkashGateway(false)}
      />
    </div>
  );
};

