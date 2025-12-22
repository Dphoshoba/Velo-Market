
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Product, CartItem, Order, View } from './types';
import { StorageService } from './services/storage';
import { GeminiService } from './services/gemini';
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
  const [trends, setTrends] = useState<{ topic: string, trend: string, sourceUrl: string }[]>([]);
  const [language, setLanguage] = useState('English');
  const [isSearchingVisually, setIsSearchingVisually] = useState(false);
  const [searchFilter, setSearchFilter] = useState<string[]>([]);

  const initApp = useCallback(async () => {
    setLoading(true);
    try {
      const isLive = await StorageService.testConnection();
      setIsDemoMode(!isLive);
      const fetchedProducts = await StorageService.getProducts();
      setProducts(fetchedProducts);
      setCurrentUser(StorageService.getCurrentUser());
      const marketTrends = await GeminiService.getMarketplaceTrends();
      setTrends(marketTrends);
    } catch (error) {
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initApp();
  }, [initApp]);

  const handleVisualSearch = async (file: File) => {
    setIsSearchingVisually(true);
    setCurrentView('browse');
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const keywords = await GeminiService.analyzeVisualSearch(base64);
        setSearchFilter(keywords);
        setIsSearchingVisually(false);
      };
    } catch (err) {
      setIsSearchingVisually(false);
    }
  };

  const translatedProducts = useMemo(() => {
    return products.filter(p => {
      if (searchFilter.length === 0) return true;
      const content = `${p.name} ${p.category} ${p.description}`.toLowerCase();
      return searchFilter.some(k => content.includes(k));
    });
  }, [products, searchFilter]);

  const navigate = useCallback((view: View) => {
    setCurrentView(view);
    if (view !== 'browse') setSearchFilter([]);
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = (role: 'buyer' | 'seller') => {
    if (role === 'seller') return navigate('seller-onboarding');
    const mockUser: User = {
      id: 'b1', name: 'Elite Buyer', email: 'buyer@velo.com', role: 'buyer',
      avatar: `https://picsum.photos/seed/buyer/100`, joinedDate: new Date().toISOString()
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
    setProducts(await StorageService.getProducts());
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const selectedVendor = useMemo(() => {
    if (!selectedVendorId) return null;
    const p = products.find(p => p.vendorId === selectedVendorId);
    return {
      id: selectedVendorId, 
      name: p?.vendorName || 'Artisan', 
      storeName: p?.vendorName || 'Artisan Shop',
      role: 'seller' as const, 
      avatar: `https://picsum.photos/seed/${selectedVendorId}/200`,
      joinedDate: '2023-01-01T00:00:00.000Z', 
      businessType: 'Artisan Collective',
      longDescription: "Masterful curation and handcrafted excellence from the heart of the artisan community.", 
      commissionRate: 10,
      stripeConnected: true,
      payoutStatus: 'active'
    } as User;
  }, [selectedVendorId, products]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        currentUser={currentUser} 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onNavigate={navigate}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onVisualSearch={handleVisualSearch}
        currentLanguage={language}
        onLanguageChange={setLanguage}
      />

      <main className="flex-grow container mx-auto px-4 py-8 relative">
        {isSearchingVisually && (
          <div className="fixed inset-0 z-[60] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center space-y-6">
             <div className="w-32 h-32 bg-indigo-600 rounded-[32px] flex items-center justify-center animate-pulse shadow-2xl shadow-indigo-200">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <div className="text-center">
                <h2 className="text-2xl font-black text-slate-900">AI Visual Matcher</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Identifying artisanal traits...</p>
             </div>
          </div>
        )}

        {currentView === 'home' && (
          <div className="space-y-16 animate-fade-in">
            <header className="bg-slate-900 text-white p-16 md:p-40 rounded-[80px] text-center relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/30 via-transparent to-transparent"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none"></div>
               
               <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-white/10 backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
                  Global Artisan Infrastructure
                </div>
                <h1 className="text-6xl md:text-[100px] font-black mb-10 tracking-tighter leading-[0.9] max-w-5xl mx-auto">
                  Handcrafted <br/><span className="text-indigo-400">Excellence.</span>
                </h1>
                <p className="text-xl text-slate-400 mb-16 max-w-2xl mx-auto font-medium leading-relaxed">The high-performance architecture for the borderless creator economy. Powered by Gemini, built for curators.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <button onClick={() => navigate('browse')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-14 py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-2xl shadow-indigo-600/40 transform hover:-translate-y-1 active:translate-y-0">Explore Archive</button>
                  <button onClick={() => navigate('manual')} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-14 py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-[11px] transition-all backdrop-blur-md">Whitepaper</button>
                </div>
               </div>
            </header>

            {trends.length > 0 && (
              <section className="bg-white border rounded-[40px] p-2.5 overflow-hidden flex items-center shadow-sm">
                <div className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.3em] px-10 py-4.5 rounded-[28px] shrink-0 mr-8">Live Global Pulse</div>
                <div className="flex gap-20 animate-[scroll_60s_linear_infinite] whitespace-nowrap">
                   {[...trends, ...trends].map((t, i) => (
                     <div key={i} className="flex items-center gap-5">
                        <span className="font-black text-slate-900 uppercase tracking-widest text-xs">{t.topic}:</span>
                        <span className="text-slate-500 font-medium text-sm">{t.trend}</span>
                        <span className="text-slate-200">/</span>
                     </div>
                   ))}
                </div>
              </section>
            )}

            <section>
              <div className="flex justify-between items-end mb-16 px-4">
                <div>
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">Artisan Batch</h2>
                  <p className="text-slate-400 font-medium text-xl">Top verified acquisitions of the week</p>
                </div>
                <button onClick={() => navigate('browse')} className="text-indigo-600 font-black text-xs uppercase tracking-[0.3em] hover:underline decoration-4 underline-offset-[12px] transition-all">Archive Access &rarr;</button>
              </div>
              <ProductGrid products={products.slice(0, 4)} onProductClick={(p) => { setSelectedProduct(p); navigate('product'); }} onAddToCart={addToCart} />
            </section>
          </div>
        )}

        {currentView === 'browse' && (
          <div className="space-y-16 animate-fade-in py-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 px-4">
               <div>
                  <h1 className="text-6xl font-black tracking-tighter">Marketplace Index</h1>
                  {searchFilter.length > 0 && (
                    <div className="flex items-center gap-3 mt-4">
                      <p className="text-indigo-600 font-black uppercase tracking-widest text-xs">Visual Affinity:</p>
                      {searchFilter.map(k => (
                        <span key={k} className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">{k}</span>
                      ))}
                    </div>
                  )}
               </div>
               {searchFilter.length > 0 && <button onClick={() => setSearchFilter([])} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors">Reset Global Filter</button>}
            </div>
            <ProductGrid products={translatedProducts} onProductClick={(p) => { setSelectedProduct(p); navigate('product'); }} onAddToCart={addToCart} />
          </div>
        )}
        
        {currentView === 'product' && selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            onAddToCart={addToCart} 
            onBack={() => navigate('browse')} 
            onVendorClick={(v) => { setSelectedVendorId(v); navigate('vendor-profile'); }}
            language={language}
          />
        )}
        
        {currentView === 'dashboard' && currentUser?.role === 'seller' && <SellerDashboard user={currentUser} products={products.filter(p => p.vendorId === currentUser.id)} trends={trends} onAddProduct={async (p) => { await StorageService.saveProduct(p); setProducts(await StorageService.getProducts()); }} onUpdateProduct={handleUpdateProduct} onUpdateUser={handleUpdateUser} />}
        {currentView === 'vendor-profile' && selectedVendor && <VendorProfile vendor={selectedVendor} products={products.filter(p => p.vendorId === selectedVendor.id)} currentUser={currentUser} onProductClick={(p) => { setSelectedProduct(p); navigate('product'); }} onAddToCart={addToCart} onBack={() => navigate('browse')} />}
        {currentView === 'checkout' && <Checkout items={cart} user={currentUser} onSuccess={async (o) => { await StorageService.saveOrder(o); setCart([]); navigate('home'); }} onBack={() => navigate('cart')} />}
        {currentView === 'cart' && <Cart items={cart} onUpdateQuantity={(id, qty) => setCart(prev => qty < 1 ? prev.filter(i => i.id !== id) : prev.map(i => i.id === id ? { ...i, quantity: qty } : i))} onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))} onCheckout={() => navigate('checkout')} />}
        {currentView === 'seller-onboarding' && <SellerOnboarding onComplete={handleOnboardingComplete} onCancel={() => navigate('home')} />}
        {currentView === 'policies' && <Policies onBack={() => navigate('home')} user={currentUser} />}
        {currentView === 'manual' && <UserManual onBack={() => navigate('home')} />}
      </main>
      <Footer onNavigate={navigate} />
      <style>{`
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
};

export default App;
