export type Language = 'bn' | 'en';

export type PaymentMethod = 'bkash' | 'nagad' | 'wallet';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'rejected' | 'cancelled';

export type PackageCategory =
  | 'diamond'
  | 'membership'
  | 'special'
  | 'mystery_box'
  | 'bonus_offer'
  | 'unipin'
  | 'ff_likes';

export type ServiceType =
  | 'free_fire'
  | 'mystery_box'
  | 'bonus_offer'
  | 'unipin_voucher'
  | 'ff_likes'
  | 'facebook_followers'
  | 'facebook_likes'
  | 'facebook_views'
  | 'instagram_followers'
  | 'instagram_likes'
  | 'instagram_views'
  | 'streaming_subscription';

export interface AuthUser {
  id: string; // e.g. "AG-USR-82190"
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  loginMethod: 'google' | 'phone' | 'email';
  googleSub?: string;
  createdAt: string;
}

export interface UserWallet {
  phone: string;
  name?: string;
  email?: string;
  avatar?: string;
  balance: number; // In AG Coins / BDT (1 AG Coin = ৳1 BDT)
}

export type AddMoneyStatus = 'pending' | 'approved' | 'rejected';

export interface AddMoneyRequest {
  id: string;
  userPhone: string;
  userName?: string;
  amountBdt: number;
  paymentMethod: 'bkash' | 'nagad';
  senderNumber: string;
  trxId: string;
  status: AddMoneyStatus;
  createdAt: string;
  updatedAt: string;
  adminNote?: string;
}

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
  image?: string;
  active: boolean;
  rewardsList?: string[];
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
  playerUid: string; // Used for FF Game UID or Social Profile link or Subscription Account
  playerName?: string;
  customerEmail?: string;
  targetAccountLink?: string;
  packageId: string;
  packageName: string;
  packageNameBn: string;
  diamonds: string | number; // quantity or subscription detail
  amountBdt: number;
  paymentMethod: PaymentMethod;
  paymentNumber: string; // Sender's bKash or Nagad number
  trxId: string;
  contact?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  adminNote?: string;
  refunded?: boolean;
}

export interface SiteConfig {
  siteName: string;
  bkashNumber: string;
  nagadNumber: string;
  whatsappNumber: string;
  supportHours: string;
  supportHoursBn: string;
  noticeEn: string;
  noticeBn: string;
  topNoticeBn?: string;
  topNoticeEn?: string;
  telegramLink?: string;
  telegramGroupLink?: string;
  facebookGroupLink?: string;
  adminPin: string;
  followerRatePer1k: number; // e.g. 120 BDT
  instagramFollowerRatePer1k?: number; // e.g. 150 BDT
  fbLikesRatePer1k?: number; // e.g. 80 BDT
  fbViewsRatePer1k?: number; // e.g. 60 BDT
  igLikesRatePer1k?: number; // e.g. 90 BDT
  igViewsRatePer1k?: number; // e.g. 70 BDT
  fbMinFollowers?: number;
  fbMaxFollowers?: number;
  igMinFollowers?: number;
  igMaxFollowers?: number;
}

