
export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  website?: string;
  facebook?: string;
  linkedin?: string;
}

export interface Review {
  id: string;
  vendorId: string;
  productId?: string;
  productName?: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar: string;
  bio?: string;
  longDescription?: string; 
  joinedDate: string;
  // Social
  following?: string[]; // Array of vendor IDs
  // Seller specific fields
  storeName?: string;
  storeLogo?: string;
  themeColor?: 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  contactPhone?: string;
  contactEmail?: string; 
  businessAddress?: string;
  businessType?: string; 
  socialLinks?: SocialLinks;
  shippingPolicy?: string;
  estimatedDelivery?: string;
  commissionRate?: number; 
  // Financial fields
  stripeConnected?: boolean;
  stripeAccountId?: string;
  payoutStatus?: 'pending' | 'active' | 'restricted';
}

export interface TrackingEntry {
  number: string;
  date: string;
}

export interface Product {
  id: string;
  vendorId: string;
  vendorName: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  status?: 'Active' | 'Shipped' | 'Delivered';
  trackingNumber?: string;
  trackingHistory?: TrackingEntry[];
  commissionRate?: number; 
  shippingPolicy?: string;
  estimatedDelivery?: string;
  weight?: string;
  dimensions?: string;
  materials?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  buyerId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  vendorBreakdown: {
    [vendorId: string]: {
      items: CartItem[];
      subtotal: number;
      commission: number;
      payout: number;
    }
  };
}

export type View = 'home' | 'browse' | 'product' | 'cart' | 'checkout' | 'dashboard' | 'seller-onboarding' | 'vendor-profile' | 'policies' | 'manual' | 'admin';
