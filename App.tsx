import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Product, CartItem, Order, View } from './types';
import { StorageService } from './services/storage';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import ProductDetail from './components/ProductDetail';
import SellerDashboard from './components/SellerDashboard';
import SellerOnboarding from './components/SellerOnboarding';
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
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initApp = useCallback(async () => {
    setLoading(true);
    try {
      const isLive = await StorageService.testConnection();
      setIsDemoMode(!isLive);
      setErrorMsg(StorageService.getConnectionError());
      
      const fetchedProducts = await StorageService.getProducts();
      setProducts(fetchedProducts);
      setCurrentUser(StorageService.getCurrentUser());
    } catch (error: any) {
      console.error("App initialization warning:", error);
      setIsDemoMode(true);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initApp();
  }, [initApp]);

  const navigate = useCallback((view: View) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = (role: 'buyer' | 'seller') => {
    if (role === 'seller') {
      navigate('seller-onboarding');
      return;
    }
    const mockUser: User = {
      id: 'b1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'buyer',
      avatar: `https://picsum.photos/seed/buyer/100`,
      joinedDate: new Date().toISOString()
    };
    StorageService.updateUser(mockUser).catch(console.error);
    setCurrentUser(mockUser);
  };

  const handleOnboardingComplete = async (user: User) => {
    await StorageService.updateUser(user);
    setCurrentUser(user);
    navigate('dashboard');
  };

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
    navigate('home');
  };

  const handleUpdateUser = async (updatedUser: User) => {
    await StorageService.updateUser(updatedUser);
    setCurrentUser(updatedUser);
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    await StorageService.saveProduct(updatedProduct);
    const refreshed = await StorageService.getProducts();
    setProducts(refreshed);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      const effectiveRate = product.commissionRate || 10;
      const productWithRate = { ...product, commissionRate: effectiveRate };
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...productWithRate, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(productId);
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const handleCheckoutSuccess = async (order: Order) => {
    await StorageService.saveOrder(order);
    setCart([]);
    navigate('home');
    alert(`Order placed successfully!`);
  };

  const selectedVendor = useMemo(() => {
    if (!selectedVendorId) return null;
    if (currentUser?.id === selectedVendorId) return currentUser;
    
    // Find vendor info from products if possible
    const productByVendor = products.find(p => p.vendorId === selectedVendorId);
    
    return {
      id: selectedVendorId,
      name: productByVendor?.vendorName || 'Artisan Vendor',
      storeName: productByVendor?.vendorName || 'Artisan Shop',
      email: 'vendor@example.com',
      role: 'seller' as const,
      avatar: `https://picsum.photos/seed/${selectedVendorId}/100`,
      joinedDate: '2023-01-01T00:00:00.000Z',
      businessType: 'Artisan Collective',
      longDescription: "Curated pieces from masters of their craft.",
      shippingPolicy: "Standard artisanal shipping applies.",
      estimatedDelivery: "4-7 Business Days",
      commissionRate: 10
    } as User;
  }, [selectedVendorId, currentUser, products]);

  const vendorProducts = useMemo(() => {
    if (!selectedVendorId) return [];
    return products.filter(p => p.vendorId === selectedVendorId);
  }, [selectedVendorId, products]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Checking Cloud Sync...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {isDemoMode && (
        <div className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] py-1.5 text-center flex items-center justify-center gap-4 border-b border-indigo-700">
          <span>Velo Sandbox Mode Enabled</span>
          <span className="opacity-40">|</span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Local Performance Active
          </span>
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
          <div className="space-y-12 animate-fade-in">
            <header className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-900 text-white p-12 md:p-24 rounded-[48px] text-center relative overflow-hidden">
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
               <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>
               
               <div className="relative z-10">
                <div className="inline-block bg-indigo-500/20 text-indigo-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-500/20">
                  Global Multi-Vendor Platform
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">Artisanal Excellence, <br/><span className="text-indigo-400">Directly Shared.</span></h1>
                <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
                  A high-performance marketplace built for the modern creator. <br className="hidden md:block" /> Buy from the best, sell what you love.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button onClick={() => navigate('browse')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20">Explore Collection</button>
                  <button onClick={() => navigate('manual')} className="bg-white/5 hover:bg-white/10 backdrop-blur px-10 py-4 rounded-2xl font-bold transition-all border border-white/10">Platform Tour</button>
                </div>
               </div>
            </header>
            
            <section>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Featured Creations</h2>
                  <p className="text-slate-500 font-medium">Curated pieces from our top artisans</p>
                </div>
                <button onClick={() => navigate('browse')} className="text-indigo-600 font-bold text-sm hover:underline">View All Collection &rarr;</button>
              </div>
              <ProductGrid products={products} onProductClick={(p) => { setSelectedProduct(p); navigate('product'); }} onAddToCart={addToCart} />
            </section>
          </div>
        )}

        {currentView === 'seller-onboarding' && (
          <SellerOnboarding 
            onComplete={handleOnboardingComplete}
            onCancel={() => navigate('home')}
          />
        )}

        {currentView === 'browse' && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl font-black">All Creations</h1>
            <ProductGrid products={products} onProductClick={(p) => { setSelectedProduct(p); navigate('product'); }} onAddToCart={addToCart} />
          </div>
        )}

        {currentView === 'product' && selectedProduct && (
          <ProductDetail product={selectedProduct} onAddToCart={addToCart} onBack={() => navigate('browse')} onVendorClick={(v) => { setSelectedVendorId(v); navigate('vendor-profile'); }} />
        )}

        {currentView === 'vendor-profile' && selectedVendor && (
          <VendorProfile vendor={selectedVendor} products={vendorProducts} currentUser={currentUser} onProductClick={(p) => { setSelectedProduct(p); navigate('product'); }} onAddToCart={addToCart} onBack={() => navigate('browse')} />
        )}

        {currentView === 'dashboard' && currentUser?.role === 'seller' && (
          <SellerDashboard user={currentUser} products={products.filter(p => p.vendorId === currentUser.id)} onAddProduct={async (p) => { await StorageService.saveProduct(p); setProducts(await StorageService.getProducts()); }} onUpdateProduct={handleUpdateProduct} onUpdateUser={handleUpdateUser} />
        )}

        {currentView === 'cart' && <Cart items={cart} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} onCheckout={() => navigate('checkout')} />}
        {currentView === 'checkout' && <Checkout items={cart} user={currentUser} onSuccess={handleCheckoutSuccess} onBack={() => navigate('cart')} />}
        {currentView === 'policies' && <Policies onBack={() => navigate('home')} user={currentUser} />}
        {currentView === 'manual' && <UserManual onBack={() => navigate('home')} />}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
};

export default App;