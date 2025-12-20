
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Product, CartItem, Order, View } from './types';
import { ApiService } from './services/api';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import ProductDetail from './components/ProductDetail';
import SellerDashboard from './components/SellerDashboard';
import VendorProfile from './components/VendorProfile';
import Policies from './components/Policies';
import UserManual from './components/UserManual';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  
  // App-wide Status
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  // Initial Data Load
  useEffect(() => {
    const init = async () => {
      try {
        const [prodData, userData] = await Promise.all([
          ApiService.getProducts(),
          ApiService.getCurrentUser()
        ]);
        setProducts(prodData);
        setCurrentUser(userData);
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const navigate = useCallback((view: View) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  }, []);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = async (role: 'buyer' | 'seller') => {
    setIsLoading(true);
    try {
      const user = await ApiService.login(role);
      setCurrentUser(user);
      showNotification(`Welcome back, ${user.name}!`, 'info');
    } catch (err) {
      showNotification("Login failed. Please try again.", "info");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await ApiService.logout();
      setCurrentUser(null);
      navigate('home');
      showNotification("Signed out successfully.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const saved = await ApiService.updateUser(updatedUser);
      setCurrentUser(saved);
      showNotification("Settings updated!");
    } catch (err) {
      showNotification("Update failed.", "info");
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      await ApiService.saveProduct(updatedProduct);
      const updatedList = await ApiService.getProducts();
      setProducts(updatedList);
    } catch (err) {
      showNotification("Failed to update product.");
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      const effectiveRate = currentUser?.id === product.vendorId ? (currentUser.commissionRate || 10) : 10;
      const productWithRate = { ...product, commissionRate: effectiveRate };

      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...productWithRate, quantity: 1 }];
    });
    showNotification(`Added ${product.name} to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(productId);
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const handleCheckoutSuccess = async (order: Order) => {
    try {
      await ApiService.createOrder(order);
      setCart([]);
      navigate('home');
      showNotification("Order placed successfully!", 'success');
      // Refresh products to show updated stock
      const prodList = await ApiService.getProducts();
      setProducts(prodList);
    } catch (err) {
      showNotification("Checkout failed.", "info");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    return ['All', ...new Set(products.map(p => p.category))];
  }, [products]);

  const selectedVendor = useMemo(() => {
    if (!selectedVendorId) return null;
    if (currentUser?.id === selectedVendorId) return currentUser;
    return {
      id: selectedVendorId,
      name: 'Artisan Vendor',
      storeName: products.find(p => p.vendorId === selectedVendorId)?.vendorName || 'Artisan Shop',
      email: 'vendor@example.com',
      role: 'seller' as const,
      avatar: `https://picsum.photos/seed/${selectedVendorId}/100`,
      joinedDate: '2023-01-01T00:00:00.000Z',
      businessType: 'Artisan Collective',
      contactPhone: '+1 (234) 567-8900',
      businessAddress: '123 Artisan Way,\nCraft City, CA 90210',
      longDescription: "Our collective was founded on the idea that artisans deserve a global stage.",
      shippingPolicy: "Standard artisanal shipping applies.",
      estimatedDelivery: "4-7 Business Days",
      processingTime: "2-3 Days",
      commissionRate: 10
    } as User;
  }, [selectedVendorId, currentUser, products]);

  const vendorProducts = useMemo(() => {
    if (!selectedVendorId) return [];
    return products.filter(p => p.vendorId === selectedVendorId);
  }, [selectedVendorId, products]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="text-center">
          <p className="text-2xl font-black text-slate-900 tracking-tighter">Syncing VeloMarket...</p>
          <p className="text-slate-400 font-medium text-sm mt-1 uppercase tracking-widest">Secure Handcrafted Network</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {notification && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 duration-300">
          <div className={`px-6 py-3 rounded-full shadow-2xl border flex items-center gap-3 font-bold text-sm ${
            notification.type === 'success' ? 'bg-emerald-900 text-emerald-50 border-emerald-800' : 'bg-indigo-900 text-indigo-50 border-indigo-800'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${notification.type === 'success' ? 'bg-emerald-400' : 'bg-indigo-400'}`}></div>
            {notification.message}
          </div>
        </div>
      )}

      <Navbar 
        currentUser={currentUser} 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onNavigate={navigate}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        {currentView === 'home' && (
          <div className="space-y-12">
            <header className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white p-12 rounded-[40px] text-center relative overflow-hidden shadow-2xl">
               <div className="relative z-10">
                <h1 className="text-6xl font-black mb-4 tracking-tighter">Artisanal Excellence, <span className="text-indigo-400">Directly Shared.</span></h1>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto font-medium">
                  A high-performance marketplace connecting global creators with collectors.
                </p>
                <div className="flex justify-center gap-4">
                  <button onClick={() => navigate('browse')} className="bg-indigo-500 hover:bg-indigo-600 px-10 py-4 rounded-full font-black text-lg transition-all shadow-lg transform hover:scale-105 active:scale-95">Explore Collection</button>
                  <button onClick={() => navigate('manual')} className="bg-white/10 hover:bg-white/20 backdrop-blur px-10 py-4 rounded-full font-black text-lg transition-all border border-white/20">How it Works</button>
                </div>
               </div>
               <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                 <img src="https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover" alt="" />
               </div>
            </header>

            <section>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                    Handpicked for You
                  </h2>
                  <p className="text-slate-500 font-medium">Discover the latest creations from our master artisans.</p>
                </div>
                <button onClick={() => navigate('browse')} className="text-indigo-600 font-black text-sm uppercase tracking-widest hover:underline">View All Collection →</button>
              </div>
              <ProductGrid 
                products={products.slice(0, 4)} 
                onProductClick={(p) => { setSelectedProduct(p); navigate('product'); }}
                onAddToCart={addToCart}
              />
            </section>
          </div>
        )}

        {currentView === 'browse' && (
          <section className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                <div className="flex-1 w-full">
                   <h2 className="text-3xl font-black text-slate-900 mb-2">Discovery Hub</h2>
                   <p className="text-slate-500 font-medium">Browse through {products.length} unique artisanal items.</p>
                </div>
                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                  <div className="relative flex-grow md:min-w-[300px]">
                    <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input 
                      type="text" 
                      placeholder="Search items, vendors, or stories..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-8">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      selectedCategory === cat 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <ProductGrid 
                products={filteredProducts} 
                onProductClick={(p) => { setSelectedProduct(p); navigate('product'); }}
                onAddToCart={addToCart}
              />
            ) : (
              <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">No treasures found</h3>
                 <p className="text-slate-500 max-w-xs mx-auto mt-2">Try adjusting your filters.</p>
                 <button onClick={() => {setSearchQuery(''); setSelectedCategory('All');}} className="mt-6 text-indigo-600 font-black text-sm uppercase tracking-widest hover:underline">Clear all filters</button>
              </div>
            )}
          </section>
        )}

        {currentView === 'product' && selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            onAddToCart={addToCart}
            onBack={() => navigate('browse')}
            onVendorClick={(vendorId) => { setSelectedVendorId(vendorId); navigate('vendor-profile'); }}
          />
        )}

        {currentView === 'vendor-profile' && selectedVendor && (
          <VendorProfile 
            vendor={selectedVendor}
            products={vendorProducts}
            currentUser={currentUser}
            onProductClick={(p) => { setSelectedProduct(p); navigate('product'); }}
            onAddToCart={addToCart}
            onBack={() => navigate('browse')}
          />
        )}

        {currentView === 'policies' && <Policies onBack={() => navigate('home')} user={currentUser} />}
        {currentView === 'manual' && <UserManual onBack={() => navigate('home')} />}
        {currentView === 'cart' && <Cart items={cart} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} onCheckout={() => navigate('checkout')} />}
        {currentView === 'checkout' && <Checkout items={cart} user={currentUser} onSuccess={handleCheckoutSuccess} onBack={() => navigate('cart')} />}

        {currentView === 'dashboard' && currentUser?.role === 'seller' && (
          <SellerDashboard 
            user={currentUser}
            products={products.filter(p => p.vendorId === currentUser.id)}
            onAddProduct={async (p) => { 
              await ApiService.saveProduct(p);
              const prodData = await ApiService.getProducts();
              setProducts(prodData);
              showNotification("Product published successfully!");
            }}
            onUpdateProduct={handleUpdateProduct}
            onUpdateUser={handleUpdateUser}
          />
        )}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
};

export default App;
