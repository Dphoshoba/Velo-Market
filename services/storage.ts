
import { Product, User, Order, Review } from '../types';
import { supabase } from './supabase';

const TABLES = {
  PRODUCTS: 'products',
  PROFILES: 'profiles',
  ORDERS: 'orders',
  REVIEWS: 'reviews',
};

// Increment this to force a full local storage purge for all users
const SCHEMA_VERSION = '1.7';

const DEFAULT_MOCK_PRODUCTS: Product[] = [
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
    shippingPolicy: 'Shipped in recycled honeycomb paper for maximum protection.',
    estimatedDelivery: '3-5 Business Days',
    weight: '1.2 kg',
    dimensions: '22cm x 12cm',
    materials: 'Stoneware Clay, Basalt Glaze'
  },
  {
    id: 'seed-2',
    vendorId: 'v-artisan-2',
    vendorName: 'Loom & Thread',
    name: 'Organic Indigo Throw',
    description: 'Hand-woven GOTS certified organic cotton throw, dyed with natural plant-based indigo.',
    price: 145,
    category: 'Home Decor',
    image: 'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?auto=format&fit=crop&q=80&w=800',
    stock: 5,
    rating: 5.0,
    reviewsCount: 18,
    commissionRate: 10,
    shippingPolicy: 'Eco-conscious minimal packaging. Tracked worldwide shipping.',
    estimatedDelivery: '5-7 Business Days',
    weight: '0.8 kg',
    dimensions: '150cm x 200cm',
    materials: 'GOTS Certified Organic Cotton, Natural Indigo'
  },
  {
    id: 'seed-3',
    vendorId: 'v-artisan-3',
    vendorName: 'Kiso Knives',
    name: 'Hand-Forged Petty Knife',
    description: 'Damascus steel utility knife with a charred oak handle. Masterfully balanced for precision.',
    price: 210,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1557844352-761f2565b576?auto=format&fit=crop&q=80&w=800',
    stock: 3,
    rating: 4.8,
    reviewsCount: 42,
    commissionRate: 15,
    shippingPolicy: 'Insured express shipping in a signed cedar wood box.',
    estimatedDelivery: '2-4 Business Days',
    weight: '150g',
    dimensions: '15cm Blade',
    materials: 'Damascus Steel, Charred Oak'
  },
  {
    id: 'seed-4',
    vendorId: 'v-artisan-1',
    vendorName: 'Terra Ceramics',
    name: 'Ochre Serving Bowl',
    description: 'Wide, shallow serving bowl with a rich ochre interior and raw clay exterior.',
    price: 65,
    category: 'Home Decor',
    image: 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?auto=format&fit=crop&q=80&w=800',
    stock: 20,
    rating: 4.7,
    reviewsCount: 9,
    commissionRate: 12,
    shippingPolicy: 'Fragile handling guaranteed. Double-walled corrugated boxing.',
    estimatedDelivery: '3-5 Business Days',
    weight: '1.5 kg',
    dimensions: '30cm Diameter',
    materials: 'Ochre Pigment, Raw Clay'
  }
];

let useFallback = false;
let connectionError: string | null = null;

const localStore = {
  get: (key: string) => {
    // Versioned Reset Logic: Wipes the cache if version mismatch is detected
    const currentVersion = localStorage.getItem('velo_schema_version');
    if (currentVersion !== SCHEMA_VERSION) {
      console.warn("VeloMarket: Schema Update Detected. Purging local cache...");
      Object.values(TABLES).forEach(t => localStorage.removeItem(`velo_fallback_${t}`));
      localStorage.setItem('velo_schema_version', SCHEMA_VERSION);
    }

    const data = localStorage.getItem(`velo_fallback_${key}`);
    const items = data ? JSON.parse(data) : [];
    
    // Seed default products if inventory is empty
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
      const msg = error.message || String(error);
      connectionError = msg.includes("fetch") || msg.includes("URL")
        ? "Database unconfigured" 
        : `Connection Error: ${msg}`;
        
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