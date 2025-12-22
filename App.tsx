
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
import AdminDashboard from './components/AdminDashboard';

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
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesVisual = searchFilter.length === 0 || searchFilter.some(k => 
        `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(k.toLowerCase())
      );
      const matchesText = !searchTerm || 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesVisual && matchesText;
    });
  }, [products, searchFilter, searchTerm]);

  const featuredVendors = useMemo(() => {
    const vendors = new Map<string, any>();
    products.forEach(p => {
      if (!vendors.has(p.vendorId)) {
        vendors.set(p.vendorId, {
          id: p.vendorId,
          name: p.vendorName,
          category: p.category,
          avatar: `https://picsum.photos/seed/${p.vendorId}/200`,
        });
      }
    });
    return Array.from(vendors.values()).slice(0, 3);
  }, [products]);

  const navigate = useCallback((view: View) => {
    setCurrentView(view);
    if (view !== 'browse') {
      setSearchFilter([]);
      setSearchTerm('');
    }
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = (role: 'buyer' | 'seller' | 'admin') => {
    if (role === 'seller') return navigate('seller-onboarding');
    const mockUser: User = {
      id: role === 'admin' ? 'adm-1' : 'b1', 
      name: role === 'admin' ? 'Marketplace Owner' : 'Elite Buyer', 
      email: role === 'admin' ? 'admin@velo.com' : 'buyer@velo.com', 
      role: role as any,
      avatar: `https://picsum.photos/seed/${role}/100`, 
      joinedDate: new Date().toISOString()
    };
    StorageService.updateUser(mockUser).catch(console.error);
    setCurrentUser(mockUser);
    if (role === 'admin') navigate('admin');
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

  const handleFollowVendor = (vendorId: string) => {
    if (!currentUser) return handleLogin('buyer');
    const following = currentUser.following || [];
    const updatedFollowing = following.includes(vendorId) 
      ? following.filter(id => id !== vendorId)
      : [...following, vendorId];
    
    handleUpdateUser({ ...currentUser, following: updatedFollowing });
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    await StorageService.saveProduct(updatedProduct);
    setProducts(await StorageService.getProducts());
  };

  const handleDeleteProduct = async (productId: string) => {
    await StorageService.deleteProduct(productId);
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
    const isMe = currentUser?.id === selectedVendorId;
    if (isMe) return currentUser;
    
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
      contactPhone: "+1 (555) 123-4567",
      businessAddress: "42 Craft Boulevard, Studio 9, Artisan District",
      commissionRate: 10,
      stripeConnected: true,
      payoutStatus: 'active',
      themeColor: 'indigo'
    } as User;
  }, [selectedVendorId, products, currentUser]);

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
        searchTerm={searchTerm}
        onSearch={(val) => { setSearchTerm(val); if (currentView !== 'browse' && val) setCurrentView('browse'); }}
      />

      <main className="flex-grow container mx-auto px-4 py-8 relative">
        {isSearchingVisually && (
          <div className="fixed inset-0 z-[60] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center space-y-6">
             <div className="w-32 h-32 bg-indigo-600 rounded-[32px] flex items-center justify-center animate-pulse">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <h2 className="text-2xl font-black text-slate-900">Identifying traits...</h2>
          </div>
        )}

        {currentView === 'home' && (
          <div className="space-y-24 animate-fade-in">
            {/* Live Activity Ticker */}
            <div className="bg-slate-900 overflow-hidden py-3 -mx-4">
                <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite] gap-12 items-center">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-12 items-center">
                            <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
                                New Authentication: Terra Ceramics Listed "Ochre Serving Bowl"
                            </span>
                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                                Recent Acquisition: Collector in Zurich secured "Kiso Petty Knife"
                            </span>
                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                                Platform Growth: Artisan Collective "Loom & Thread" joined the network
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <header className="bg-slate-900 text-white p-16 md:p-40 rounded-[80px] text-center relative overflow-hidden shadow-2xl">
               <div className="absolute inset-0 opacity-20 pointer-events-none">
                 <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(79,70,229,0.3),transparent)]"></div>
               </div>
               <div className="relative z-10">
                <h1 className="text-6xl md:text-[100px] font-black mb-10 tracking-tighter leading-[0.9]">Handcrafted <br/><span className="text-indigo-400">Excellence.</span></h1>
                <p className="text-xl text-slate-400 mb-16 max-w-2xl mx-auto font-medium">The high-performance architecture for the borderless creator economy.</p>
                <div className="flex flex-wrap justify-center gap-6">
                  <button onClick={() => navigate('browse')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-14 py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-2xl">Explore Archive</button>
                  <button onClick={() => handleLogin('seller')} className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-14 py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-[11px] transition-all">Join as Artisan</button>
                </div>
               </div>
            </header>

            <section className="space-y-12 px-6">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Curated Collectibles</h2>
                  <p className="text-slate-500 font-medium">Recently authenticated artisanal works.</p>
                </div>
                <button onClick={() => navigate('browse')} className="text-[10px] font-black uppercase tracking-widest text-indigo-600 border-b-2 border-indigo-100 hover:border-indigo-600 pb-1 transition-all">View All Products</button>
              </div>
              <ProductGrid products={products.slice(0, 4)} onProductClick={(p) => { setSelectedProduct(p); navigate('product'); }} onAddToCart={addToCart} />
            </section>

            <section className="bg-white border border-slate-200 rounded-[60px] p-12 md:p-24 overflow-hidden relative">
               <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
                  <svg className="w-64 h-64 text-slate-900" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a3 3 0 116 0 3 3 0 01-6 0z" clipRule="evenodd" /></svg>
               </div>
               <div className="relative z-10 max-w-3xl space-y-12">
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black tracking-tight text-slate-900 leading-tight">Meet the Makers</h2>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed">Discover the humans behind the craft. Every purchase directly supports an independent artisan's heritage and future.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {featuredVendors.map(vendor => (
                        <div 
                          key={vendor.id} 
                          onClick={() => { setSelectedVendorId(vendor.id); navigate('vendor-profile'); }}
                          className="group cursor-pointer space-y-4"
                        >
                           <div className="aspect-square rounded-[40px] overflow-hidden border-4 border-slate-50 shadow-sm group-hover:shadow-xl transition-all duration-500">
                              <img src={vendor.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1">{vendor.category}</p>
                              <h4 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{vendor.name}</h4>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </section>
          </div>
        )}

        {currentView === 'browse' && (
          <div className="space-y-16 animate-fade-in py-8">
            <h1 className="text-6xl font-black tracking-tighter px-4">Marketplace Index</h1>
            <ProductGrid products={filteredProducts} onProductClick={(p) => { setSelectedProduct(p); navigate('product'); }} onAddToCart={addToCart} />
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
        
        {currentView === 'dashboard' && currentUser?.role === 'seller' && (
          <SellerDashboard 
            user={currentUser} 
            products={products.filter(p => p.vendorId === currentUser.id)} 
            trends={trends} 
            onAddProduct={async (p) => { await StorageService.saveProduct(p); setProducts(await StorageService.getProducts()); }} 
            onUpdateProduct={handleUpdateProduct} 
            onDeleteProduct={handleDeleteProduct}
            onUpdateUser={handleUpdateUser} 
            onViewStore={(v) => { setSelectedVendorId(v); navigate('vendor-profile'); }}
          />
        )}

        {currentView === 'admin' && currentUser?.role === 'admin' && (
          <AdminDashboard products={products} />
        )}

        {currentView === 'vendor-profile' && selectedVendor && (
          <VendorProfile 
            vendor={selectedVendor} 
            products={products.filter(p => p.vendorId === selectedVendor.id)} 
            currentUser={currentUser} 
            onProductClick={(p) => { setSelectedProduct(p); navigate('product'); }} 
            onAddToCart={addToCart} 
            onBack={() => navigate('home')} 
            onFollow={() => handleFollowVendor(selectedVendor.id)}
          />
        )}

        {currentView === 'cart' && <Cart items={cart} onUpdateQuantity={(id, qty) => setCart(prev => qty < 1 ? prev.filter(i => i.id !== id) : prev.map(i => i.id === id ? { ...i, quantity: qty } : i))} onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))} onCheckout={() => navigate('checkout')} />}
        {currentView === 'checkout' && <Checkout items={cart} user={currentUser} onSuccess={async (o) => { await StorageService.saveOrder(o); setCart([]); navigate('home'); }} onBack={() => navigate('cart')} />}
        {currentView === 'seller-onboarding' && <SellerOnboarding onComplete={handleOnboardingComplete} onCancel={() => navigate('home')} />}
        {currentView === 'policies' && <Policies onBack={() => navigate('home')} user={currentUser} />}
        {currentView === 'manual' && <UserManual onBack={() => navigate('home')} />}
      </main>
      <Footer onNavigate={navigate} onLoginAdmin={() => handleLogin('admin')} />
      <style>{`
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
};

export default App;
