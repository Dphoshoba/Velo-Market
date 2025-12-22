
import React, { useState, useMemo } from 'react';
import { User, Product, TrackingEntry } from '../types';
import { GeminiService } from '../services/gemini';

interface SellerDashboardProps {
  user: User;
  products: Product[];
  trends: any[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateUser: (user: User) => void;
  onViewStore: (vendorId: string) => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ 
  user, 
  products, 
  trends, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct,
  onUpdateUser,
  onViewStore
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'analytics' | 'marketing' | 'settings'>('inventory');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Shipped' | 'Delivered'>('All');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [auditingId, setAuditingId] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [generatingVideoId, setGeneratingVideoId] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState("");
  const [promoVideoUrl, setPromoVideoUrl] = useState<string | null>(null);
  const [isGeneratingPersona, setIsGeneratingPersona] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSyncingIntel, setIsSyncingIntel] = useState(false);
  const [intelData, setIntelData] = useState<any[]>([]);

  const [formProduct, setFormProduct] = useState({ 
    name: '', 
    price: 0, 
    category: 'Home Decor', 
    description: '', 
    image: '',
    shippingPolicy: '',
    estimatedDelivery: '',
    weight: '',
    dimensions: '',
    materials: '',
    rating: 5,
    stock: 10
  });
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isEnhancingDescription, setIsEnhancingDescription] = useState(false);
  const [profileForm, setProfileForm] = useState<User>({ ...user });

  const totalSales = products.length * 245; 
  const platformCutPercent = user.commissionRate || 10;
  const platformCut = totalSales * (platformCutPercent / 100);
  const netEarnings = totalSales - platformCut;

  const profileCompleteness = useMemo(() => {
    let score = 0;
    if (user.storeLogo) score += 20;
    if (user.bio) score += 20;
    if (user.longDescription) score += 20;
    if (user.shippingPolicy) score += 20;
    if (user.socialLinks?.twitter || user.socialLinks?.linkedin) score += 20;
    return score;
  }, [user]);

  const handleSyncIntel = async () => {
    setIsSyncingIntel(true);
    try {
      const data = await GeminiService.getInventoryOpportunities(formProduct.category || "Artisan Goods");
      setIntelData(data);
    } finally {
      setIsSyncingIntel(false);
    }
  };

  const handleEnhanceDescription = async () => {
    if (!formProduct.description || !formProduct.name) return alert("Enter a title and basic notes first.");
    setIsEnhancingDescription(true);
    try {
      const enhanced = await GeminiService.enhanceDescription(formProduct.name, formProduct.description);
      setFormProduct(prev => ({ ...prev, description: enhanced }));
    } finally {
      setIsEnhancingDescription(false);
    }
  };

  const handleAuditPrice = async (product: Product) => {
    setAuditingId(product.id);
    const result = await GeminiService.auditPricing(product.name, product.price, trends);
    setAuditResult(result);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '?vendor=' + user.id);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleGeneratePersona = async () => {
    if (!profileForm.storeName || !profileForm.bio) {
        alert("Please provide a store name and a basic tagline/bio first.");
        return;
    }
    setIsGeneratingPersona(true);
    try {
      const data = await GeminiService.generateStorePersona(
        profileForm.storeName, 
        profileForm.businessType || 'Artisan', 
        profileForm.bio
      );
      setProfileForm(prev => ({
        ...prev,
        bio: data.tagline,
        longDescription: data.narrative
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPersona(false);
    }
  };

  const handleGenerateVideo = async (product: Product) => {
    // @ts-ignore
    if (typeof window.aistudio !== 'undefined' && !await window.aistudio.hasSelectedApiKey()) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }
    setGeneratingVideoId(product.id);
    setVideoStatus("Initializing Veo Engine...");
    try {
      const url = await GeminiService.generatePromoVideo(product.name, product.description, product.image, setVideoStatus);
      setPromoVideoUrl(url);
    } catch (err) {
      console.error(err);
      alert("Video generation encountered a neural block.");
      setGeneratingVideoId(null);
    }
  };

  const handleGenerateAIImage = async (highQuality: boolean = false) => {
    if (!formProduct.name || !formProduct.description) return alert("Describe the item first.");
    
    // Check for API key if using high quality Gemini Pro
    // @ts-ignore
    if (highQuality && typeof window.aistudio !== 'undefined' && !await window.aistudio.hasSelectedApiKey()) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }

    setIsGeneratingImage(true);
    try {
      // Use current image as reference if it exists for "Re-imagining"
      const reference = formProduct.image && formProduct.image.startsWith('data:') ? formProduct.image : undefined;
      const imgUrl = await GeminiService.generateProductImage(
        `${formProduct.name}: ${formProduct.description}`,
        reference,
        highQuality
      );
      setFormProduct(prev => ({ ...prev, image: imgUrl }));
    } catch (err) {
      console.error(err);
      alert("Image generation encountered a neural block.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setFormProduct({ 
      name: '', price: 0, category: 'Home Decor', description: '', image: '', 
      shippingPolicy: '', estimatedDelivery: '', weight: '', dimensions: '', 
      materials: '', rating: 5, stock: 10
    });
    setIntelData([]);
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormProduct({
      name: product.name, price: product.price, category: product.category, 
      description: product.description, image: product.image,
      shippingPolicy: product.shippingPolicy || '', estimatedDelivery: product.estimatedDelivery || '',
      weight: product.weight || '', dimensions: product.dimensions || '',
      materials: product.materials || '', rating: product.rating, stock: product.stock
    });
    setIntelData([]);
    setShowForm(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct({ ...editingProduct, ...formProduct });
    } else {
      const product: Product = {
        ...formProduct,
        id: 'p' + Date.now(), 
        vendorId: user.id, 
        vendorName: user.storeName || user.name,
        reviewsCount: 0, 
        status: 'Active', 
        trackingHistory: [], 
        image: formProduct.image || `https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800`,
        commissionRate: user.commissionRate || 10
      };
      onAddProduct(product);
    }
    setShowForm(false);
  };

  const filteredProducts = products.filter(p => {
    if (statusFilter === 'All') return true;
    return (p.status || 'Active') === statusFilter;
  });

  const THEMES: { id: User['themeColor']; class: string }[] = [
    { id: 'indigo', class: 'bg-indigo-600' },
    { id: 'emerald', class: 'bg-emerald-600' },
    { id: 'rose', class: 'bg-rose-600' },
    { id: 'amber', class: 'bg-amber-600' },
    { id: 'slate', class: 'bg-slate-900' },
  ];

  return (
    <div className="space-y-8 animate-fade-in relative pb-40">
      {/* Modals & Overlays */}
      {auditResult && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] max-w-lg w-full p-10 shadow-2xl border border-indigo-100">
             <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" /></svg>
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Gemini Price Audit</h3>
             <p className="text-slate-600 leading-relaxed mb-8">{auditResult}</p>
             <button onClick={() => { setAuditResult(null); setAuditingId(null); }} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Acknowledge</button>
          </div>
        </div>
      )}

      {generatingVideoId && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center overflow-hidden">
           <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
           {promoVideoUrl ? (
             <div className="max-w-4xl w-full bg-white rounded-[48px] overflow-hidden p-4 shadow-2xl relative z-10 animate-fade-in">
                <video src={promoVideoUrl} controls autoPlay className="w-full aspect-video rounded-[32px] bg-slate-100 mb-8 shadow-inner" />
                <div className="flex justify-end gap-3 px-6 pb-4">
                   <button onClick={() => { setPromoVideoUrl(null); setGeneratingVideoId(null); }} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20">Done</button>
                </div>
             </div>
           ) : (
             <div className="relative z-10 flex flex-col items-center max-w-lg">
               <div className="w-40 h-40 bg-indigo-600 rounded-[40px] flex items-center justify-center animate-bounce shadow-[0_0_50px_rgba(79,70,229,0.3)] mb-12">
                 <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               </div>
               <h2 className="text-4xl font-black text-white mb-6 tracking-tighter">Directing Cinematic Promo</h2>
               <p className="text-indigo-200 uppercase tracking-[0.4em] font-black text-[10px] mb-8 bg-white/5 px-6 py-2 rounded-full border border-white/10">{videoStatus || "Initializing Neural Engine..."}</p>
             </div>
           )}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Artisan Suite</h1>
            <p className="text-slate-500 font-medium">Managing <span className="text-indigo-600 font-black uppercase tracking-widest text-sm">{user.storeName || user.name}</span></p>
          </div>
          <div className="hidden lg:flex flex-col gap-1">
             <div className="flex justify-between items-center w-32">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Profile Strength</span>
                <span className="text-[9px] font-black text-indigo-600">{profileCompleteness}%</span>
             </div>
             <div className="w-32 h-1 bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${user.themeColor ? `bg-${user.themeColor}-600` : 'bg-indigo-600'}`} style={{ width: `${profileCompleteness}%` }}></div>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onViewStore(user.id)}
            className="hidden md:flex items-center gap-2 bg-white border border-slate-200 text-slate-900 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-indigo-600 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            Preview Store
          </button>
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            {(['inventory', 'analytics', 'marketing', 'settings'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-slate-900'}`}>{tab}</button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'inventory' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
             <div className="flex gap-2">
                {(['All', 'Active', 'Shipped', 'Delivered'] as const).map(f => (
                  <button key={f} onClick={() => setStatusFilter(f as any)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${statusFilter === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}>{f}</button>
                ))}
             </div>
             <button onClick={openAddForm} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-100">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
               New Listing
             </button>
           </div>

           <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <th className="px-8 py-5 text-left">Product</th>
                    <th className="px-8 py-5 text-left">Category</th>
                    <th className="px-8 py-5 text-left">Price</th>
                    <th className="px-8 py-5 text-left">Status</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map(p => {
                    const status = p.status || 'Active';
                    return (
                      <tr key={p.id} className="group hover:bg-indigo-50/30 transition-colors">
                        <td className="px-8 py-6 flex items-center gap-4">
                          <img src={p.image} className="w-12 h-12 rounded-xl object-cover border" alt="" />
                          <span className="font-bold text-slate-900">{p.name}</span>
                        </td>
                        <td className="px-8 py-6 text-sm text-slate-500">{p.category}</td>
                        <td className="px-8 py-6 font-black text-slate-900">${p.price}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                           <button onClick={() => openEditForm(p)} className="text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">Edit</button>
                           <button onClick={() => handleAuditPrice(p)} className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-3 py-1.5 rounded-lg">Audit</button>
                           <button onClick={() => handleGenerateVideo(p)} className="text-[9px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg">Promo</button>
                           <button onClick={() => onDeleteProduct(p.id)} className="text-[9px] font-black uppercase tracking-widest text-red-500 px-3 py-1.5 rounded-lg">Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[32px] border shadow-sm">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Gross Performance</p>
             <h2 className="text-4xl font-black text-slate-900">${totalSales.toLocaleString()}</h2>
          </div>
          <div className="bg-white p-8 rounded-[32px] border shadow-sm">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Net Earnings</p>
             <h2 className="text-4xl font-black text-slate-900">${netEarnings.toLocaleString()}</h2>
          </div>
          <div className={`p-8 rounded-[32px] shadow-2xl text-white ${user.themeColor ? `bg-${user.themeColor}-600` : 'bg-slate-900'}`}>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Business Health</p>
             <h2 className="text-2xl font-black">Elite Performance</h2>
             <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Syncing live analytics</span>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'marketing' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <div className="bg-white p-12 rounded-[40px] border shadow-sm space-y-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Growth & Visibility</h2>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Direct Storefront Link</label>
                    <div className="flex gap-2">
                       <input 
                         readOnly 
                         className="flex-grow px-5 py-4 rounded-2xl border bg-slate-50 font-bold text-xs" 
                         value={window.location.origin + '?vendor=' + user.id} 
                       />
                       <button 
                         onClick={handleCopyLink}
                         className={`px-6 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all ${copySuccess ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}
                       >
                         {copySuccess ? 'Copied' : 'Copy'}
                       </button>
                    </div>
                 </div>
                 <div className="pt-8 border-t border-slate-100">
                    <h3 className="text-sm font-black text-slate-900 mb-4">Marketing QR Access</h3>
                    <div className="bg-slate-50 p-6 rounded-[32px] flex items-center justify-center border-2 border-dashed border-slate-200 aspect-square w-48 mx-auto">
                       <svg className="w-full h-full text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm13 0h5v2h-2v2h2v2h-5v-6zm3 3h2v2h-2v-2zM5 5v4h4V5H5zm10 0v4h4V5h-4zM5 15v4h4v-4H5z" /></svg>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 text-center mt-4 uppercase tracking-widest">Digital storefront asset</p>
                 </div>
              </div>
           </div>
           
           <div className="bg-indigo-600 p-12 rounded-[40px] text-white shadow-2xl shadow-indigo-100 space-y-8">
              <h2 className="text-2xl font-black tracking-tight">Artisan SEO Toolkit</h2>
              <p className="text-indigo-100 font-medium leading-relaxed">Boost your reach across the global ecosystem using these automated visibility enhancements.</p>
              <div className="space-y-4">
                 <div className="bg-white/10 p-5 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div>
                       <p className="font-bold">Social Auto-Meta</p>
                       <p className="text-[10px] text-indigo-200">Optimized image tags for Instagram/X</p>
                    </div>
                    <div className="w-10 h-6 bg-indigo-400 rounded-full relative">
                       <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                 </div>
                 <div className="bg-white/10 p-5 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div>
                       <p className="font-bold">Artisan Schema</p>
                       <p className="text-[10px] text-indigo-200">Google-ready structured data</p>
                    </div>
                    <div className="w-10 h-6 bg-indigo-400 rounded-full relative">
                       <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-4xl space-y-8 pb-20">
           <div className="bg-white p-10 md:p-16 rounded-[40px] border shadow-sm">
             <div className="flex justify-between items-start mb-10">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Brand & Identity</h2>
                <button 
                    type="button"
                    onClick={handleGeneratePersona}
                    disabled={isGeneratingPersona}
                    className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all disabled:opacity-50"
                >
                    {isGeneratingPersona ? (
                        <div className="w-3 h-3 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                    ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    )}
                    AI Strategy Assistant
                </button>
             </div>
             
             <form className="space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Store Logo URL</label>
                    <div className="flex gap-4 items-center">
                       <img src={profileForm.storeLogo || profileForm.avatar} className="w-16 h-16 rounded-2xl border object-cover bg-slate-50" />
                       <input 
                        type="url" 
                        className="flex-grow px-5 py-4 rounded-2xl border bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm" 
                        value={profileForm.storeLogo || ''}
                        onChange={e => setProfileForm({...profileForm, storeLogo: e.target.value})}
                        placeholder="https://..."
                       />
                    </div>
                 </div>

                 <div className="space-y-4 col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Brand Identity Palette</label>
                    <div className="flex gap-3">
                       {THEMES.map(theme => (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={() => setProfileForm({...profileForm, themeColor: theme.id})}
                            className={`w-12 h-12 rounded-2xl transition-all ${theme.class} ${profileForm.themeColor === theme.id ? 'ring-4 ring-offset-2 ring-indigo-500 scale-110 shadow-lg' : 'opacity-40 hover:opacity-100 hover:scale-105'}`}
                            title={`Select ${theme.id} theme`}
                          />
                       ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Store Front Name</label>
                   <input 
                    type="text" 
                    className="w-full px-5 py-4 rounded-2xl border bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none font-bold" 
                    value={profileForm.storeName}
                    onChange={e => setProfileForm({...profileForm, storeName: e.target.value})}
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Public Contact Email</label>
                   <input 
                    type="email" 
                    className="w-full px-5 py-4 rounded-2xl border bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none font-bold" 
                    value={profileForm.contactEmail || ''}
                    onChange={e => setProfileForm({...profileForm, contactEmail: e.target.value})}
                   />
                 </div>
                 
                 <div className="space-y-2 col-span-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Brand Tagline (Short Bio)</label>
                   <input 
                    type="text" 
                    className="w-full px-5 py-4 rounded-2xl border bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none font-bold" 
                    value={profileForm.bio || ''}
                    onChange={e => setProfileForm({...profileForm, bio: e.target.value})}
                    placeholder="Sustainable luxury for modern homes"
                   />
                 </div>

                 <div className="space-y-2 col-span-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Brand Narrative (Story)</label>
                   <textarea 
                    rows={6}
                    className="w-full px-5 py-4 rounded-2xl border bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none font-medium leading-relaxed" 
                    value={profileForm.longDescription || ''}
                    onChange={e => setProfileForm({...profileForm, longDescription: e.target.value})}
                    placeholder="Tell your brand's heritage story..."
                   />
                 </div>

                 <div className="col-span-2 pt-6 border-t border-slate-100">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Logistics & Compliance</h3>
                    <div className="grid grid-cols-1 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Shipping Policy</label>
                          <textarea 
                            rows={3}
                            className="w-full px-5 py-4 rounded-2xl border bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-sm" 
                            value={profileForm.shippingPolicy || ''}
                            onChange={e => setProfileForm({...profileForm, shippingPolicy: e.target.value})}
                            placeholder="Detail your shipping care standards..."
                          />
                       </div>
                    </div>
                 </div>

                 <div className="col-span-2 pt-6 border-t border-slate-100">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Social Infrastructure</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <input 
                        className="px-5 py-4 rounded-2xl border bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm" 
                        placeholder="Twitter Username (@)" 
                        value={profileForm.socialLinks?.twitter || ''}
                        onChange={e => setProfileForm({...profileForm, socialLinks: {...(profileForm.socialLinks || {}), twitter: e.target.value}})}
                       />
                       <input 
                        className="px-5 py-4 rounded-2xl border bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm" 
                        placeholder="LinkedIn Profile URL" 
                        value={profileForm.socialLinks?.linkedin || ''}
                        onChange={e => setProfileForm({...profileForm, socialLinks: {...(profileForm.socialLinks || {}), linkedin: e.target.value}})}
                       />
                    </div>
                 </div>
               </div>

               <button 
                type="button" 
                onClick={() => onUpdateUser(profileForm)}
                className={`text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all hover:scale-105 active:scale-95 ${profileForm.themeColor ? THEMES.find(t => t.id === profileForm.themeColor)?.class : 'bg-slate-900'}`}
               >
                 Verify & Save Brand Profile
               </button>
             </form>
           </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[40px] max-w-6xl w-full my-12 relative shadow-2xl overflow-hidden border border-indigo-100">
            <button onClick={() => setShowForm(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-12">
               {/* Left Column: Media & Intel */}
               <div className="lg:col-span-4 p-10 bg-slate-50/50 border-r border-slate-100">
                  <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">{editingProduct ? 'Update Listing' : 'New Listing'}</h2>
                  <div className="aspect-[4/3] rounded-[32px] overflow-hidden bg-white border border-slate-200 mb-8 group relative shadow-inner">
                     {formProduct.image ? (
                        <img src={formProduct.image} className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                           <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                           <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Media</p>
                        </div>
                     )}
                  </div>
                  <div className="space-y-3 mb-8">
                    <button 
                      onClick={() => handleGenerateAIImage(false)}
                      type="button" 
                      className="w-full bg-white border-2 border-indigo-100 text-indigo-600 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-indigo-600 transition-all flex items-center justify-center gap-2"
                    >
                      {isGeneratingImage ? "Imagining..." : formProduct.image ? "Re-imagine with AI" : "Draft Concept"}
                    </button>
                    <button 
                      onClick={() => handleGenerateAIImage(true)}
                      type="button" 
                      className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                    >
                      {isGeneratingImage ? "Rendering Studio Shot..." : "Elite Studio Render (4K)"}
                    </button>
                  </div>

                  {/* Neural Intelligence Section */}
                  <div className="bg-indigo-600 rounded-3xl p-6 text-white space-y-4 shadow-xl">
                     <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase tracking-widest">Neural Intel</h3>
                        <button onClick={handleSyncIntel} disabled={isSyncingIntel} className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                           {isSyncingIntel ? "Syncing..." : "Pulse Check"}
                        </button>
                     </div>
                     <div className="space-y-3">
                        {intelData.length > 0 ? intelData.map((intel, idx) => (
                           <div key={idx} className="bg-white/10 p-4 rounded-2xl border border-white/10">
                              <p className="font-black text-sm mb-1">{intel.idea}</p>
                              <p className="text-[10px] opacity-80 leading-relaxed mb-2">{intel.reasoning}</p>
                              <a href={intel.source} target="_blank" className="text-[8px] font-black uppercase tracking-widest underline opacity-50">Trend Report</a>
                           </div>
                        )) : (
                           <p className="text-[10px] opacity-60 leading-relaxed italic">Click Pulse Check to find high-demand gaps in the {formProduct.category} category via Gemini Search.</p>
                        )}
                     </div>
                  </div>
               </div>

               {/* Right Column: Form */}
               <div className="lg:col-span-8 p-10 md:p-16 h-[85vh] overflow-y-auto">
                  <form onSubmit={handleFormSubmit} className="space-y-8">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                           <select className="w-full px-5 py-4 rounded-2xl border bg-slate-50 outline-none font-bold text-sm" value={formProduct.category} onChange={e => setFormProduct({...formProduct, category: e.target.value})}>
                              <option>Home Decor</option>
                              <option>Kitchen</option>
                              <option>Fashion</option>
                              <option>Wellness</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Status</label>
                           <input type="number" required className="w-full px-5 py-4 rounded-2xl border bg-slate-50 outline-none font-bold" placeholder="Stock" value={formProduct.stock} onChange={e => setFormProduct({...formProduct, stock: Number(e.target.value)})} />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Listing Title</label>
                        <input type="text" required className="w-full px-5 py-4 rounded-2xl border outline-none font-bold text-lg" placeholder="e.g. Basalt Clay Pitcher" value={formProduct.name} onChange={e => setFormProduct({...formProduct, name: e.target.value})} />
                     </div>

                     <div className="space-y-2">
                        <div className="flex justify-between items-center">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Brand Narrative & Notes</label>
                           <button 
                             type="button" 
                             onClick={handleEnhanceDescription} 
                             disabled={isEnhancingDescription}
                             className="text-indigo-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:text-indigo-700 transition-all"
                           >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                              {isEnhancingDescription ? "Architecting..." : "Neural Enhance"}
                           </button>
                        </div>
                        <textarea rows={4} required className="w-full px-5 py-4 rounded-2xl border outline-none font-medium leading-relaxed" placeholder="Enter basic notes, then use Neural Enhance for luxury copy..." value={formProduct.description} onChange={e => setFormProduct({...formProduct, description: e.target.value})} />
                     </div>
                     
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Collector Price ($)</label>
                           <input type="number" required className="w-full px-5 py-4 rounded-2xl border outline-none font-black text-2xl text-indigo-600" placeholder="Price" value={formProduct.price} onChange={e => setFormProduct({...formProduct, price: Number(e.target.value)})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Materials</label>
                           <input type="text" className="w-full px-5 py-4 rounded-2xl border outline-none font-bold" placeholder="e.g. Stoneware, Oak" value={formProduct.materials} onChange={e => setFormProduct({...formProduct, materials: e.target.value})} />
                        </div>
                     </div>

                     <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-black uppercase tracking-[0.3em] text-xs shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99]">
                        {editingProduct ? 'Update Global Listing' : 'Authenticate & List'}
                     </button>
                  </form>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
