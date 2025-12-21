
import { Product, User, Order, Review } from '../types';

/**
 * ARCHITECTURE NOTE:
 * This service is designed for "White-Label Portability."
 * 1. Demo Mode: Uses localStorage if no backend is configured.
 * 2. Production Mode: Swaps to real fetch calls when API_URL is provided.
 */

const IS_PRODUCTION = false; // Toggle this or use process.env.DATABASE_URL
const STORAGE_KEYS = {
  PRODUCTS: 'velo_products',
  USERS: 'velo_users',
  CURRENT_USER: 'velo_current_user',
  ORDERS: 'velo_orders',
  REVIEWS: 'velo_reviews',
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    vendorId: 'v1',
    vendorName: 'Loom & Thread',
    name: 'Handwoven Wool Blanket',
    description: 'A cozy, ethically sourced wool blanket for winter nights.',
    price: 120,
    category: 'Home Decor',
    image: 'https://picsum.photos/seed/blanket/600/400',
    stock: 5,
    rating: 4.8,
    reviewsCount: 12,
  },
  {
    id: 'p2',
    vendorId: 'v2',
    vendorName: 'Clay & Fire',
    name: 'Ceramic Espresso Set',
    description: 'Minimalist matte black ceramic set. Includes 2 cups and saucers.',
    price: 45,
    category: 'Kitchen',
    image: 'https://picsum.photos/seed/ceramic/600/400',
    stock: 15,
    rating: 4.5,
    reviewsCount: 8,
  },
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const storage = {
  get: <T>(key: string): T | null => JSON.parse(localStorage.getItem(key) || 'null'),
  set: (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data))
};

export const ApiService = {
  /**
   * PRODUCTS
   */
  async getProducts(): Promise<Product[]> {
    if (IS_PRODUCTION) {
      // Example for when you sell to a customer with a real backend:
      // const res = await fetch('/api/products');
      // return res.json();
    }
    
    await sleep(600);
    const local = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS);
    if (!local) {
      storage.set(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    return local;
  },

  async saveProduct(product: Product): Promise<Product> {
    await sleep(1000);
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index > -1) products[index] = product;
    else products.push(product);
    
    storage.set(STORAGE_KEYS.PRODUCTS, products);
    return product;
  },

  /**
   * AUTHENTICATION
   * In Production, this would use Supabase Auth or JWT.
   */
  async getCurrentUser(): Promise<User | null> {
    await sleep(300);
    return storage.get<User>(STORAGE_KEYS.CURRENT_USER);
  },

  async login(role: 'buyer' | 'seller'): Promise<User> {
    await sleep(1200);
    const mockUser: User = {
      id: role === 'seller' ? 'v1' : 'b1',
      name: role === 'seller' ? 'Sarah Weaver' : 'John Doe',
      email: role === 'seller' ? 'sarah@loom.com' : 'john@example.com',
      role,
      avatar: `https://picsum.photos/seed/${role}/100`,
      joinedDate: new Date().toISOString(),
      storeName: role === 'seller' ? 'Loom & Thread' : undefined,
      commissionRate: 10
    };
    storage.set(STORAGE_KEYS.CURRENT_USER, mockUser);
    return mockUser;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  async updateUser(user: User): Promise<User> {
    await sleep(800);
    storage.set(STORAGE_KEYS.CURRENT_USER, user);
    return user;
  },

  /**
   * ORDERS & TRANSACTIONS
   */
  async getOrders(): Promise<Order[]> {
    await sleep(500);
    return storage.get<Order[]>(STORAGE_KEYS.ORDERS) || [];
  },

  async createOrder(order: Order): Promise<Order> {
    // This is where a real API would trigger Stripe or PayPal
    await sleep(2000); 
    const orders = await this.getOrders();
    orders.push(order);
    storage.set(STORAGE_KEYS.ORDERS, orders);
    return order;
  },

  /**
   * REVIEWS
   */
  async getReviews(vendorId: string): Promise<Review[]> {
    const reviews = storage.get<Review[]>(STORAGE_KEYS.REVIEWS) || [];
    return reviews.filter(r => r.vendorId === vendorId);
  },

  async saveReview(review: Review): Promise<Review> {
    const reviews = storage.get<Review[]>(STORAGE_KEYS.REVIEWS) || [];
    reviews.push(review);
    storage.set(STORAGE_KEYS.REVIEWS, reviews);
    return review;
  }
};
