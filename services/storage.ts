
import { Product, User, Order, Review } from '../types';
import { supabase } from './supabase';

const TABLES = {
  PRODUCTS: 'products',
  PROFILES: 'profiles',
  ORDERS: 'orders',
  REVIEWS: 'reviews',
};

// Increment this to force a full local storage purge for all users
const SCHEMA_VERSION = '1.8';

const DEFAULT_MOCK_PRODUCTS: Product[] = [
  {
    id: 'mdl-1',
    vendorId: 'v-moody-1',
    vendorName: 'Moody Dark Loner',
    name: 'Hubei Turquoise Teardrop Ring',
    description: 'A striking teardrop-shaped Hubei turquoise stone set in a fine silver serrated bezel with a textured sterling silver band.',
    price: 65,
    category: 'Jewelry',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3f416?auto=format&fit=crop&q=80&w=800',
    stock: 1,
    rating: 5.0,
    reviewsCount: 12,
    commissionRate: 10,
    shippingPolicy: 'Ships in a gift box with a tracking number via USPS.',
    estimatedDelivery: '3-5 Business Days',
    materials: 'Hubei Turquoise, Sterling Silver'
  },
  {
    id: 'mdl-2',
    vendorId: 'v-moody-1',
    vendorName: 'Moody Dark Loner',
    name: 'Ghost Pirate? Necklace',
    description: 'An intricate, multi-layered pendant featuring a skeletal motif and turquoise accents on a heavy link chain.',
    price: 200,
    category: 'Jewelry',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
    stock: 1,
    rating: 4.9,
    reviewsCount: 5,
    commissionRate: 10,
    shippingPolicy: 'Signature required upon delivery.',
    estimatedDelivery: '5-7 Business Days',
    materials: 'Mixed Metals, Turquoise, Bone'
  },
  {
    id: 'mdl-3',
    vendorId: 'v-moody-1',
    vendorName: 'Moody Dark Loner',
    name: 'White Buffalo Me & My Flaws Necklace',
    description: 'A bold White Buffalo stone pendant set in sterling silver, celebrating the natural imperfections of the earth.',
    price: 95,
    category: 'Jewelry',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
    stock: 2,
    rating: 5.0,
    reviewsCount: 8,
    commissionRate: 10,
    materials: 'White Buffalo Stone, Sterling Silver'
  },
  {
    id: 'mdl-4',
    vendorId: 'v-moody-1',
    vendorName: 'Moody Dark Loner',
    name: 'Rosarita Cuff Bangle',
    description: 'A vibrant red Rosarita glass stone set in a hand-stamped sterling silver cuff bangle.',
    price: 110,
    category: 'Jewelry',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
    stock: 1,
    rating: 4.8,
    reviewsCount: 3,
    commissionRate: 10,
    materials: 'Rosarita Glass, Sterling Silver'
  },
  {
    id: 'mdl-5',
    vendorId: 'v-moody-1',
    vendorName: 'Moody Dark Loner',
    name: 'Royston Ribbon Ring',
    description: 'An oval Royston Ribbon turquoise with a beautiful host rock matrix on a wide stamped band.',
    price: 75,
    category: 'Jewelry',
    image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&q=80&w=800',
    stock: 1,
    rating: 5.0,
    reviewsCount: 15,
    commissionRate: 10,
    materials: 'Royston Ribbon Turquoise, Sterling Silver'
  },
  {
    id: 'mdl-6',
    vendorId: 'v-moody-1',
    vendorName: 'Moody Dark Loner',
    name: 'Kween Konch Bangle',
    description: 'A soft pink Queen Conch shell teardrop set in a darkened, textured sterling silver bangle.',
    price: 100,
    category: 'Jewelry',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
    stock: 1,
    rating: 4.9,
    reviewsCount: 7,
    commissionRate: 10,
    materials: 'Queen Conch Shell, Sterling Silver'
  },
  {
    id: 'seed-1',
    vendorId: 'v-artisan-1',
    vendorName: 'Terra Ceramics',
    name: 'Minimalist Stone Pitcher',
    description: 'A hand-thrown stoneware pitcher with a matte basalt glaze. Perfect for morning rituals.',
    price: 85,
    category: 'Home Decor',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800',
    stock: 12,
    rating: 4.9,
    reviewsCount: 24,
    commissionRate: 12,
    materials: 'Stoneware Clay, Basalt Glaze'
  }
];

let useFallback = false;
let connectionError: string | null = null;

const localStore = {
  get: (key: string) => {
    const currentVersion = localStorage.getItem('velo_schema_version');
    if (currentVersion !== SCHEMA_VERSION) {
      Object.values(TABLES).forEach(t => localStorage.removeItem(`velo_fallback_${t}`));
      localStorage.setItem('velo_schema_version', SCHEMA_VERSION);
    }

    const data = localStorage.getItem(`velo_fallback_${key}`);
    const items = data ? JSON.parse(data) : [];
    
    if (key === TABLES.PRODUCTS && items.length === 0) {
      localStorage.setItem(`velo_fallback_${key}`, JSON.stringify(DEFAULT_MOCK_PRODUCTS));
      return DEFAULT_MOCK_PRODUCTS;
    }
    return items;
  },
  save: (key: string, item: any) => {
    const items = localStore.get(key);
    const existingIdx = items.findIndex((i: any) => i.id === item.id);
    if (existingIdx > -1) {
      items[existingIdx] = item;
    } else {
      items.push(item);
    }
    localStorage.setItem(`velo_fallback_${key}`, JSON.stringify(items));
  },
  clear: () => {
    Object.values(TABLES).forEach(t => localStorage.removeItem(`velo_fallback_${t}`));
    localStorage.removeItem('velo_current_user_cache');
    localStorage.removeItem('velo_schema_version');
    window.location.reload();
  }
};

export const StorageService = {
  isUsingFallback: () => useFallback,
  getConnectionError: () => connectionError,
  resetDemo: () => localStore.clear(),

  testConnection: async (): Promise<boolean> => {
    try {
      if (supabase.supabaseUrl.includes('your-project-id')) {
        throw new Error("Supabase URL not configured.");
      }

      const { error } = await supabase.from(TABLES.PRODUCTS).select('id').limit(1);
      if (error) throw error;
      
      useFallback = false;
      connectionError = null;
      return true;
    } catch (error: any) {
      useFallback = true;
      return false;
    }
  },

  getProducts: async (): Promise<Product[]> => {
    if (useFallback) return localStore.get(TABLES.PRODUCTS);
    try {
      const { data, error } = await supabase.from(TABLES.PRODUCTS).select('*');
      if (error) throw error;
      return (data && data.length > 0) ? data : localStore.get(TABLES.PRODUCTS);
    } catch (error) {
      return localStore.get(TABLES.PRODUCTS);
    }
  },

  saveProduct: async (product: Product) => {
    if (useFallback) return localStore.save(TABLES.PRODUCTS, product);
    try {
      const { error } = await supabase.from(TABLES.PRODUCTS).upsert(product);
      if (error) throw error;
    } catch (error) {
      localStore.save(TABLES.PRODUCTS, product);
    }
  },

  deleteProduct: async (id: string) => {
    if (useFallback) {
      const items = localStore.get(TABLES.PRODUCTS);
      const filtered = items.filter((p: any) => p.id !== id);
      localStorage.setItem(`velo_fallback_${TABLES.PRODUCTS}`, JSON.stringify(filtered));
      return;
    }
    try {
      const { error } = await supabase.from(TABLES.PRODUCTS).delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      const items = localStore.get(TABLES.PRODUCTS);
      const filtered = items.filter((p: any) => p.id !== id);
      localStorage.setItem(`velo_fallback_${TABLES.PRODUCTS}`, JSON.stringify(filtered));
    }
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem('velo_current_user_cache');
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem('velo_current_user_cache', JSON.stringify(user));
    } else {
      localStorage.removeItem('velo_current_user_cache');
    }
  },

  updateUser: async (updatedUser: User) => {
    StorageService.setCurrentUser(updatedUser);
    if (useFallback) return localStore.save(TABLES.PROFILES, updatedUser);
    try {
      const { error } = await supabase.from(TABLES.PROFILES).upsert(updatedUser);
      if (error) throw error;
    } catch (error) {
      localStore.save(TABLES.PROFILES, updatedUser);
    }
  },

  getOrders: async (userId: string): Promise<Order[]> => {
    if (useFallback) {
      const all = localStore.get(TABLES.ORDERS);
      return all.filter((o: Order) => o.buyerId === userId);
    }
    try {
      const { data, error } = await supabase
        .from(TABLES.ORDERS)
        .select('*')
        .eq('buyerId', userId);
      if (error) throw error;
      return data || [];
    } catch (error) {
      return [];
    }
  },

  saveOrder: async (order: Order) => {
    if (useFallback) return localStore.save(TABLES.ORDERS, order);
    try {
      const { error } = await supabase.from(TABLES.ORDERS).insert(order);
      if (error) throw error;
    } catch (error) {
      localStore.save(TABLES.ORDERS, order);
    }
  },

  getReviews: async (vendorId: string): Promise<Review[]> => {
    if (useFallback) {
      const all = localStore.get(TABLES.REVIEWS);
      return all.filter((r: Review) => r.vendorId === vendorId);
    }
    try {
      const { data, error } = await supabase
        .from(TABLES.REVIEWS)
        .select('*')
        .eq('vendorId', vendorId);
      if (error) throw error;
      return data || [];
    } catch (error) {
      return [];
    }
  },

  saveReview: async (review: Review) => {
    if (useFallback) return localStore.save(TABLES.REVIEWS, review);
    try {
      const { error } = await supabase.from(TABLES.REVIEWS).insert(review);
      if (error) throw error;
    } catch (error) {
      localStore.save(TABLES.REVIEWS, review);
    }
  }
};
