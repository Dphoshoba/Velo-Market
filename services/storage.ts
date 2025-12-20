
import { Product, User, Order, Review } from '../types';

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

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    vendorId: 'v1',
    productName: 'Handwoven Wool Blanket',
    authorName: 'Emily R.',
    rating: 5,
    comment: 'Absolutely stunning quality. The weave is tight and the wool is incredibly soft. Worth every penny!',
    date: '2023-11-15T10:00:00Z',
    verified: true
  },
  {
    id: 'r2',
    vendorId: 'v1',
    productName: 'Organic Cotton Scarf',
    authorName: 'Michael B.',
    rating: 4,
    comment: 'Great scarf, though the color was slightly darker than in the photos. Still beautiful craftsmanship.',
    date: '2023-12-05T14:30:00Z',
    verified: true
  },
  {
    id: 'r3',
    vendorId: 'v2',
    productName: 'Ceramic Espresso Set',
    authorName: 'Sarah L.',
    rating: 5,
    comment: 'These cups are art. I use them every morning and they feel so balanced in the hand.',
    date: '2024-01-20T09:15:00Z',
    verified: true
  }
];

export const StorageService = {
  getProducts: (): Product[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(data);
  },

  saveProduct: (product: Product) => {
    const products = StorageService.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index > -1) {
      products[index] = product;
    } else {
      products.push(product);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  updateUser: (updatedUser: User) => {
    StorageService.setCurrentUser(updatedUser);
    const usersData = localStorage.getItem(STORAGE_KEYS.USERS);
    let users: User[] = usersData ? JSON.parse(usersData) : [];
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index > -1) {
      users[index] = updatedUser;
    } else {
      users.push(updatedUser);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getOrders: (): Order[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  },

  saveOrder: (order: Order) => {
    const orders = StorageService.getOrders();
    orders.push(order);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  getReviews: (): Review[] => {
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(data);
  },

  saveReview: (review: Review) => {
    const reviews = StorageService.getReviews();
    reviews.push(review);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }
};
