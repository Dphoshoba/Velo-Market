
import { Product, User, Order, Review } from '../types';

/**
 * PRODUCTION NOTE: 
 * In a real app, replace BASE_URL with your actual backend endpoint (Node, Go, Python, etc.)
 * The service now uses async/await to simulate real network latency and prepare for a real API.
 */
const BASE_URL = 'https://api.velomarket.com/v1'; // Placeholder

// Fallback to localStorage for demo purposes if the API doesn't exist
const storageFallback = {
  get: <T>(key: string): T | null => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  set: (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

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

export const ApiService = {
  /**
   * PRODUCTS
   */
  async getProducts(): Promise<Product[]> {
    await sleep(600); // Simulate network delay
    const local = storageFallback.get<Product[]>(STORAGE_KEYS.PRODUCTS);
    if (!local) {
      storageFallback.set(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    return local;
  },

  async saveProduct(product: Product): Promise<Product> {
    await sleep(1000);
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index > -1) {
      products[index] = product;
    } else {
      products.push(product);
    }
    storageFallback.set(STORAGE_KEYS.PRODUCTS, products);
    return product;
  },

  /**
   * USER & AUTH
   */
  async getCurrentUser(): Promise<User | null> {
    await sleep(300);
    return storageFallback.get<User>(STORAGE_KEYS.CURRENT_USER);
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
      businessType: role === 'seller' ? 'Sole Trader' : undefined,
      longDescription: role === 'seller' ? "Hand-woven storytelling textiles." : undefined,
      shippingPolicy: "Standard artisanal shipping.",
      estimatedDelivery: "3-5 Business Days",
      processingTime: "1-2 Days",
      commissionRate: role === 'seller' ? 10 : undefined
    };
    storageFallback.set(STORAGE_KEYS.CURRENT_USER, mockUser);
    return mockUser;
  },

  async logout(): Promise<void> {
    await sleep(200);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  async updateUser(user: User): Promise<User> {
    await sleep(1000);
    storageFallback.set(STORAGE_KEYS.CURRENT_USER, user);
    // Update in users list too
    const users = storageFallback.get<User[]>(STORAGE_KEYS.USERS) || [];
    const index = users.findIndex(u => u.id === user.id);
    if (index > -1) users[index] = user;
    else users.push(user);
    storageFallback.set(STORAGE_KEYS.USERS, users);
    return user;
  },

  /**
   * ORDERS
   */
  async getOrders(): Promise<Order[]> {
    await sleep(500);
    return storageFallback.get<Order[]>(STORAGE_KEYS.ORDERS) || [];
  },

  async createOrder(order: Order): Promise<Order> {
    await sleep(2000); // Simulate heavy payment/split processing
    const orders = await this.getOrders();
    orders.push(order);
    storageFallback.set(STORAGE_KEYS.ORDERS, orders);
    return order;
  },

  /**
   * REVIEWS
   */
  async getReviews(vendorId: string): Promise<Review[]> {
    await sleep(400);
    const reviews = storageFallback.get<Review[]>(STORAGE_KEYS.REVIEWS) || [];
    return reviews.filter(r => r.vendorId === vendorId);
  },

  async saveReview(review: Review): Promise<Review> {
    await sleep(800);
    const reviews = storageFallback.get<Review[]>(STORAGE_KEYS.REVIEWS) || [];
    reviews.push(review);
    storageFallback.set(STORAGE_KEYS.REVIEWS, reviews);
    return review;
  }
};
