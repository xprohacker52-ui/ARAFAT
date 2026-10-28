export type Language = 'bn' | 'en';

export type PaymentMethod = 'bkash' | 'nagad';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'rejected';

export type PackageCategory = 'diamond' | 'membership' | 'special';

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

export interface Order {
  id: string;
  playerUid: string;
  playerName?: string;
  packageId: string;
  packageName: string;
  packageNameBn: string;
  diamonds: string | number;
  amountBdt: number;
  paymentMethod: PaymentMethod;
  paymentNumber: string;
  trxId: string;
  contact?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  adminNote?: string;
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
  adminPin: string;
}
