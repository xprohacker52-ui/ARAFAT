export type Language = 'bn' | 'en';

export type PaymentMethod = 'bkash' | 'nagad';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'rejected';

export type PackageCategory = 'diamond' | 'membership' | 'special';

export type ServiceType = 'free_fire' | 'facebook_followers' | 'instagram_followers' | 'streaming_subscription';

export interface DiamondPackage {
  id: string;
  name: string;
  nameBn: string;
  diamonds: number | string;
  priceBdt: number;
  category: PackageCategory;
  popular?: boolean;
  bonus?: string;
  bonusBn?: string;
  badge?: string;
  active: boolean;
}

export interface DurationOption {
  id: string;
  durationLabel: string;
  durationLabelBn: string;
  priceBdt: number;
  popular?: boolean;
  savingsBadge?: string;
  savingsBadgeBn?: string;
}

export interface StreamingServiceItem {
  id: string;
  serviceKey: 'netflix' | 'crunchyroll' | 'spotify' | 'youtube_premium' | 'hidive' | string;
  name: string;
  nameBn: string;
  category: 'streaming' | 'anime' | 'music';
  badge: string;
  badgeBn?: string;
  logoBg?: string;
  logoText?: string;
  durations: DurationOption[];
  features: string[];
  featuresBn: string[];
  active: boolean;
}

export interface StreamingSubscription {
  id: string;
  service: 'netflix' | 'crunchyroll' | 'funimation' | 'hidive' | 'spotify' | 'youtube_premium' | string;
  title: string;
  titleBn: string;
  duration: string;
  durationBn: string;
  typeBadge: string;
  priceBdt: number;
  features: string[];
  featuresBn: string[];
  popular?: boolean;
  active: boolean;
}

export interface FollowerCalculation {
  followersCount: number;
  ratePer1k: number;
  totalBdt: number;
  profileLink: string;
}

export interface Order {
  id: string;
  serviceType?: ServiceType;
  playerUid: string; // Used for FF UID or Social Profile link or Subscription Account
  playerName?: string;
  customerEmail?: string;
  targetAccountLink?: string;
  packageId: string;
  packageName: string;
  packageNameBn: string;
  diamonds: string | number; // quantity or subscription detail
  amountBdt: number;
  paymentMethod: PaymentMethod;
  paymentNumber: string;
  trxId: string;
  contact?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  adminNote?: string;
  isAutomatedPayment?: boolean;
  paymentDetails?: {
    invoiceId?: string;
    maskedAccount?: string;
    trxId?: string;
    paidAt?: string;
    gatewayStatus?: string;
  };
}

export interface SiteConfig {
  siteName: string;
  bkashNumber: string;
  nagadNumber: string;
  // bKash Automated Checkout API Gateway credentials
  bkashGatewayEnabled: boolean;
  bkashMode: 'sandbox' | 'live';
  bkashMerchantNumber: string;
  bkashAppKey: string;
  bkashAppSecret: string;
  bkashUsername: string;
  bkashPassword: string;
  whatsappNumber: string;
  supportHours: string;
  supportHoursBn: string;
  noticeEn: string;
  noticeBn: string;
  adminPin: string;
  followerRatePer1k: number; // e.g. 120 BDT
  instagramFollowerRatePer1k?: number; // e.g. 150 BDT
  fbMinFollowers?: number;
  fbMaxFollowers?: number;
  igMinFollowers?: number;
  igMaxFollowers?: number;
}

