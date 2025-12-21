
import React, { useState, useRef } from 'react';
import { User, Product, TrackingEntry } from '../types';
import { GeminiService } from '../services/gemini';

interface SellerDashboardProps {
  user: User;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onUpdateUser: (user: User) => void;
  onPreviewPolicy?: () => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ user, products, onAddProduct, onUpdateProduct, onUpdateUser, onPreviewPolicy }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'analytics' | 'settings'>('inventory');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Shipped' | 'Delivered'>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [generatingVideoId, setGeneratingVideoId] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState("");
  const [promoVideoUrl, setPromoVideoUrl] = useState<string | null>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    category: 'Home Decor',
    description: '',
    stock: 10,
    rating: 5
  });
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isBranding, setIsBranding] = useState(false);
  const [localTracking, setLocalTracking] = useState<Record<string, string>>({});

  const [profileForm, setProfileForm] = useState<User>({ ...user });

  const totalSales = products.length * 245; 
  const platformCutPercent = profileForm.commissionRate || 10;
  const platformCut = totalSales * (platformCutPercent / 100);
  const netEarnings = totalSales - platformCut;

  const handleGenerateVideo = async (product: Product) => {
    // @ts-ignore
    if (!await window.aistudio.hasSelectedApiKey()) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }
    
    setGeneratingVideoId(product.id);
    try {
      const url = await GeminiService.generatePromoVideo(product.name, product.description, product.image, setVideoStatus);
      setPromoVideoUrl(url);
    } catch (err: any) {
      if (err.message.includes("Requested entity was not found")) {
        alert("API Key reset required. Please select a valid paid key.");
        // @ts-ignore
        await window.aistudio.openSelectKey();
      } else {
        alert("Video generation encountered an error. Please check your billing settings.");
      }
      setGeneratingVideoId(null);
    }
  };

  const handleEnhance = async () => {
    if (!newProduct.name) return alert('Please enter a product name first.');
    setIsEnhancing(true);
    const enhanced = await GeminiService.enhanceDescription(newProduct.name, newProduct.category);
    setNewProduct(prev => ({ ...prev, description: enhanced }));
    setIsEnhancing(false);
  };

  const handleBrandStoryAI = async () => {
    if (!profileForm.storeName || !profileForm.bio) return alert('Enter store name and tagline first.');
    setIsBranding(true);
    const story = await GeminiService.generateStoreStory(profileForm.storeName, profileForm.businessType || 'Artisan', profileForm.bio);
    setProfileForm(prev => ({ ...prev, longDescription: story }));
    setIsBranding(false);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: 'p' + Date.now(),
      vendorId: user.id,
      vendorName: user.storeName || user.name,
      image: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&q=80&w=800`,
      reviewsCount: 0,
      status: 'Active',
      trackingHistory: [],
      ...newProduct
    };
    onAddProduct(product);
    setShowAddForm(false);
    setNewProduct({ name: '', price: 0, category: 'Home Decor', description: '', stock: 10, rating: 5 });
  };

  const handleMarkAsShipped = (product: Product) => {
    const tracking = localTracking[product.id] || product.trackingNumber || '';
    if (!tracking) return alert("Provide tracking number first.");
    const newEntry: TrackingEntry = { number: tracking, date: new Date().toLocaleString() };
    onUpdateProduct({
      ...product,
      status: 'Shipped',
      trackingNumber: tracking,
      trackingHistory: [...(product.trackingHistory || []), newEntry]
    });
    setLocalTracking(prev => ({ ...prev, [product.id]: '' }));
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {generatingVideoId && (
        <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white rounded-[48px] p-12 max-w-lg w-full text-center space-y-8 shadow-2xl animate-fade-in">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
               <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-slate-900">Velo Cinematic Studio</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{videoStatus}</p>
            </div>
            <div className="pt-4 flex flex-col items-center gap-4">
               <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 animate-[loading_120s_ease-in-out]"></div>
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Veo 3.1 Fast Render Engine</p>
            </div>
            {!promoVideoUrl && (
              <button 
                onClick={() => setGeneratingVideoId(null)}
                className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
              >
                Cancel Generation
              </button>
            )}
            {promoVideoUrl && (
              <div className="space-y-6">
                <video src={promoVideoUrl} controls autoPlay className="w-full rounded-3xl border shadow-lg" />
                <button onClick={() => { setPromoVideoUrl(null); setGeneratingVideoId(null); }} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold">Close Studio</button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Management Suite</h1>
          <p className="text-slate-500 font-medium">Global operations for <span className="text-indigo-600 font-bold">{user.storeName || user.name}</span></p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
          {(['inventory', 'analytics', 'settings'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-bold">Revenue Distribution</h3>
                  <p className="text-sm text-slate-400">Monthly split-payment visualization</p>
                </div>
                <div className="text-right">
                   <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Gross Sales</p>
                   <p className="text-2xl font-black text-slate-900">${totalSales.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="h-64 flex items-end justify-between gap-4 px-4 pb-2 border-b">
                 {[40, 65, 30, 85, 45, 90, 70].map((h, i) => (
                   <div key={i} className="flex-grow group relative">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                         ${Math.floor(h * 123)}
                      </div>
                      <div className="bg-indigo-100 rounded-t-lg group-hover:bg-indigo-200 transition-colors w-full" style={{ height: `${h}%` }}></div>
                   </div>
                 ))}
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter px-2">
                 <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
           </div>

           <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
              <h3 className="text-xl font-bold relative z-10">Commission Ledger</h3>
              <div className="space-y-6 relative z-10">
                 <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Platform Contribution</p>
                    <div className="flex items-center gap-4">
                       <div className="flex-grow h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-400" style={{ width: `${platformCutPercent}%` }}></div>
                       </div>
                       <span className="font-black text-indigo-400">{platformCutPercent}%</span>
                    </div>
                 </div>
                 <div className="pt-6 border-t border-white/10 space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-sm text-slate-400 font-medium">System Fees</span>
                       <span className="font-bold">-${platformCut.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                       <span className="font-bold text-slate-100">Net Artisan Payout</span>
                       <span className="font-black text-emerald-400">${netEarnings.toFixed(2)}</span>
                    </div>
                 </div>
                 <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                    View Tax Documents
                 </button>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
             <div className="flex gap-2">
                {(['All', 'Active', 'Shipped'] as const).map(f => (
                  <button key={f} onClick={() => setStatusFilter(f)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === f ? 'bg-slate-900 text-white' : 'bg-white border text-slate-500 hover:bg-slate-50'}`}>{f}</button>
                ))}
             </div>
             <button onClick={() => setShowAddForm(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                New Listing
             </button>
           </div>

           {showAddForm && (
              <div className="bg-white p-8 rounded-[32px] border border-indigo-100 shadow-xl space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Item Name</label>
                       <input type="text" className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={newProduct.name} onChange={e => setNewProduct(p=>({...p, name: e.target.value}))} />
                    </div>
                    <div>
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Price ($)</label>
                       <input type="number" className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={newProduct.price} onChange={e => setNewProduct(p=>({...p, price: Number(e.target.value)}))} />
                    </div>
                    <div>
                       <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Description</label>
                          <button type="button" onClick={handleEnhance} disabled={isEnhancing} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline disabled:opacity-50">
                             {isEnhancing ? 'Warping...' : '✨ AI Enhance'}
                          </button>
                       </div>
                       <textarea rows={1} className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={newProduct.description} onChange={e => setNewProduct(p=>({...p, description: e.target.value}))} />
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => setShowAddForm(false)} className="px-8 py-3 font-bold text-slate-400">Cancel</button>
                    <button onClick={handleAddProductSubmit} className="flex-grow bg-slate-900 text-white py-3 rounded-xl font-bold">Publish to Marketplace</button>
                 </div>
              </div>
           )}

           <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full">
                 <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b">
                    <tr>
                       <th className="px-8 py-5 text-left">Asset</th>
                       <th className="px-8 py-5 text-left">Fulfillment Status</th>
                       <th className="px-8 py-5 text-left">Revenue</th>
                       <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y">
                    {products.filter(p => statusFilter === 'All' || p.status === statusFilter).map(p => (
                       <tr key={p.id} className="hover:bg-slate-50/50 group transition-colors">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <img src={p.image} className="w-12 h-12 rounded-xl object-cover border" alt="" />
                                <div>
                                   <p className="font-bold text-slate-900">{p.name}</p>
                                   <p className="text-xs text-slate-400">{p.category}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${p.status === 'Shipped' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                {p.status || 'Active'}
                             </span>
                          </td>
                          <td className="px-8 py-6 font-bold text-slate-900">${p.price}</td>
                          <td className="px-8 py-6 text-right">
                             <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleGenerateVideo(p)} className="p-2 hover:bg-white border rounded-lg text-slate-400 hover:text-indigo-600 transition-colors" title="Generate AI Promo Video">
                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                </button>
                                <button className="p-2 hover:bg-white border rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button onClick={() => handleMarkAsShipped(p)} className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 hover:bg-indigo-600 hover:text-white transition-all">Mark Shipped</button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
              <div className="flex justify-between items-center">
                 <h3 className="text-2xl font-black">Brand Identity</h3>
                 <button onClick={handleBrandStoryAI} disabled={isBranding} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all flex items-center gap-2">
                    {isBranding ? 'Consulting Gemini...' : '✨ Rewrite with AI'}
                 </button>
              </div>
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Store Name</label>
                       <input type="text" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" value={profileForm.storeName} onChange={e => setProfileForm({...profileForm, storeName: e.target.value})} />
                    </div>
                    <div>
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Tagline</label>
                       <input type="text" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} />
                    </div>
                 </div>
                 <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Artisan Story (Public Profile)</label>
                    <textarea rows={8} className="w-full p-6 bg-slate-50 border rounded-[32px] outline-none font-serif leading-relaxed" value={profileForm.longDescription} onChange={e => setProfileForm({...profileForm, longDescription: e.target.value})} />
                 </div>
                 <button onClick={() => { onUpdateUser(profileForm); alert("Profile Synced!"); }} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:shadow-xl transition-all">Save Brand Identity</button>
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                 <h4 className="font-bold mb-4">Commission Config</h4>
                 <p className="text-xs text-slate-400 mb-6 leading-relaxed">Adjust your marketplace contribution. This affects all real-time payout calculations.</p>
                 <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-center">
                    <input type="range" min="0" max="30" className="w-full accent-indigo-600" value={profileForm.commissionRate} onChange={e => setProfileForm({...profileForm, commissionRate: Number(e.target.value)})} />
                    <p className="mt-4 text-3xl font-black text-indigo-600">{profileForm.commissionRate}%</p>
                 </div>
              </div>
              <div className="bg-emerald-600 text-white p-8 rounded-[32px] shadow-xl">
                 <h4 className="font-bold mb-2">Artisan Status</h4>
                 <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold uppercase tracking-widest">Store Live & Verified</span>
                 </div>
                 <p className="text-sm text-emerald-100 leading-relaxed mb-6">Your store is currently visible to the global marketplace. All sales are protected by Velo Guarantee.</p>
                 <button className="w-full py-3 bg-white/10 border border-white/20 rounded-xl text-xs font-bold hover:bg-white/20">Manage Stripe Account</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
