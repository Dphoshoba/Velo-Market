import React, { useState } from 'react';
import { User, Product, TrackingEntry } from '../types';
import { GeminiService } from '../services/gemini';

interface SellerDashboardProps {
  user: User;
  products: Product[];
  trends: any[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onUpdateUser: (user: User) => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ user, products, trends, onAddProduct, onUpdateProduct, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'analytics' | 'settings'>('inventory');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Shipped'>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [auditingId, setAuditingId] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [generatingVideoId, setGeneratingVideoId] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState("");
  const [promoVideoUrl, setPromoVideoUrl] = useState<string | null>(null);
  const [isConnectingStripe, setIsConnectingStripe] = useState(false);

  const [newProduct, setNewProduct] = useState({ name: '', price: 0, category: 'Home Decor', description: '', image: '' });
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [profileForm, setProfileForm] = useState<User>({ ...user });

  const totalSales = products.length * 245; 
  const platformCutPercent = user.commissionRate || 10;
  const platformCut = totalSales * (platformCutPercent / 100);
  const netEarnings = totalSales - platformCut;

  const handleAuditPrice = async (product: Product) => {
    setAuditingId(product.id);
    const result = await GeminiService.auditPricing(product.name, product.price, trends);
    setAuditResult(result);
  };

  const handleConnectStripe = async () => {
    setIsConnectingStripe(true);
    // Simulate Stripe Express Onboarding redirection and return
    await new Promise(r => setTimeout(r, 2000));
    
    const updatedUser: User = {
      ...user,
      stripeConnected: true,
      payoutStatus: 'active',
      stripeAccountId: 'acct_' + Math.random().toString(36).substr(2, 10)
    };
    onUpdateUser(updatedUser);
    setIsConnectingStripe(false);
  };

  const handleGenerateVideo = async (product: Product) => {
    // @ts-ignore
    if (typeof window.aistudio !== 'undefined' && !await window.aistudio.hasSelectedApiKey()) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }
    setGeneratingVideoId(product.id);
    try {
      const url = await GeminiService.generatePromoVideo(product.name, product.description, product.image, setVideoStatus);
      setPromoVideoUrl(url);
    } catch (err) {
      console.error(err);
      setGeneratingVideoId(null);
    }
  };

  const handleGenerateAIImage = async () => {
    if (!newProduct.name || !newProduct.description) return alert("Describe the item first.");
    setIsGeneratingImage(true);
    try {
      const imgUrl = await GeminiService.generateProductImage(`${newProduct.name}: ${newProduct.description}`);
      setNewProduct(prev => ({ ...prev, image: imgUrl }));
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: 'p' + Date.now(), vendorId: user.id, vendorName: user.storeName || user.name,
      reviewsCount: 0, status: 'Active', trackingHistory: [], stock: 10, rating: 5,
      ...newProduct, image: newProduct.image || `https://images.unsplash.com/photo-1500000000000?auto=format&fit=crop&q=80&w=800`,
      commissionRate: user.commissionRate || 10
    };
    onAddProduct(product);
    setShowAddForm(false);
    setNewProduct({ name: '', price: 0, category: 'Home Decor', description: '', image: '' });
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* MODALS */}
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
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
           {promoVideoUrl ? (
             <div className="max-w-4xl w-full bg-white rounded-[48px] overflow-hidden p-4 shadow-2xl">
                <video src={promoVideoUrl} controls autoPlay className="w-full aspect-video rounded-[32px] bg-slate-100 mb-8" />
                <div className="flex justify-between items-center px-6 pb-4">
                   <div className="text-left">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cinematic Asset</p>
                     <p className="text-lg font-bold text-slate-900">High-Performance Promo Ready</p>
                   </div>
                   <button onClick={() => { setPromoVideoUrl(null); setGeneratingVideoId(null); }} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold">Done</button>
                </div>
             </div>
           ) : (
             <>
               <div className="w-32 h-32 bg-indigo-600 rounded-[32px] flex items-center justify-center animate-pulse mb-8">
                 <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
               </div>
               <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Directing Your Vision</h2>
               <p className="text-indigo-200 uppercase tracking-[0.3em] font-black text-xs">{videoStatus || "Initializing Neural Engine..."}</p>
             </>
           )}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Artisan Suite</h1>
          <p className="text-slate-500 font-medium">Operations for <span className="text-indigo-600 font-black uppercase tracking-widest text-sm">{user.storeName || user.name}</span></p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
          {(['inventory', 'analytics', 'settings'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-slate-900'}`}>{tab}</button>
          ))}
        </div>
      </div>

      {activeTab === 'inventory' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
             <div className="flex gap-2">
                {(['All', 'Active', 'Shipped'] as const).map(f => (
                  <button key={f} onClick={() => setStatusFilter(f as any)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${statusFilter === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}>{f}</button>
                ))}
             </div>
             <button onClick={() => setShowAddForm(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-100">
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
                    <th className="px-8 py-5 text-left">Stock</th>
                    <th className="px-8 py-5 text-right">Optimization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr key={p.id} className="group hover:bg-indigo-50/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={p.image} className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
                          <span className="font-bold text-slate-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-slate-500">{p.category}</td>
                      <td className="px-8 py-6 font-black text-slate-900">${p.price}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${p.stock < 5 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>{p.stock} units</span>
                      </td>
                      <td className="px-8 py-6 text-right space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleAuditPrice(p)} disabled={auditingId === p.id} className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
                            {auditingId === p.id ? 'Auditing...' : 'Audit Price'}
                         </button>
                         <button onClick={() => handleGenerateVideo(p)} className="text-[10px] font-black uppercase tracking-widest text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:shadow-md transition-all">
                            Promo Video
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-8 -mt-8 opacity-40"></div>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Gross Performance</p>
                 <h2 className="text-4xl font-black text-slate-900">${totalSales.toLocaleString()}</h2>
                 <p className="text-emerald-500 font-bold text-xs mt-3 flex items-center gap-1">
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                   +12.4% vs last period
                 </p>
              </div>
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Platform Contribution</p>
                 <h2 className="text-4xl font-black text-slate-900">${platformCut.toLocaleString()}</h2>
                 <p className="text-slate-400 font-bold text-xs mt-3 italic">Calculated at {platformCutPercent}% commission</p>
              </div>
              <div className="bg-slate-900 p-8 rounded-[32px] shadow-2xl shadow-indigo-100 border border-slate-800 relative group overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full -mr-12 -mt-12 group-hover:scale-125 transition-transform duration-700"></div>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Net Payout Ready</p>
                 <h2 className="text-4xl font-black text-white">${netEarnings.toLocaleString()}</h2>
                 <div className="mt-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{user.stripeConnected ? 'Secured via Stripe' : 'Connection Required'}</p>
                 </div>
              </div>
           </div>

           {/* Payout History Ledger */}
           <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Financial Ledger</h3>
               <button className="text-indigo-600 font-black text-[10px] uppercase tracking-widest border border-indigo-100 px-4 py-2 rounded-xl">Export Statement</button>
             </div>
             <div className="space-y-4">
               {[
                 { date: 'Oct 24, 2024', amount: 1240.50, status: 'Completed', ref: 'TRX-9921' },
                 { date: 'Oct 17, 2024', amount: 890.00, status: 'Completed', ref: 'TRX-8822' },
                 { date: 'Oct 10, 2024', amount: 2105.20, status: 'Completed', ref: 'TRX-7741' }
               ].map((trx, i) => (
                 <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors">
                   <div className="flex gap-4 items-center">
                     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                     </div>
                     <div>
                       <p className="font-bold text-slate-900">${trx.amount.toLocaleString()}</p>
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{trx.date} • Ref: {trx.ref}</p>
                     </div>
                   </div>
                   <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                     {trx.status}
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-4xl space-y-8">
           {/* STRIPE CONNECT SECTION */}
           <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-10 md:p-16 rounded-[48px] shadow-2xl relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -mr-[250px] -mt-[250px]"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                 <div className="flex-grow space-y-6">
                    <div className="flex items-center gap-3">
                       <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M13.911 8.612l1.03 5.404c1.139.149 1.622.742 1.622 1.573 0 1.087-.988 1.642-2.757 1.642-1.601 0-2.728-.415-2.728-1.116 0-.306.245-.534.603-.534.345 0 .528.227 1.354.554.815.32 1.258.12 1.258-.426 0-.365-.4-.445-1.397-.564-1.144-.138-1.627-.711-1.627-1.562 0-1.076.992-1.631 2.766-1.631.954 0 1.514.138 2.304.425.322.12.508.316.508.573 0 .326-.245.554-.601.554-.151 0-.312-.04-.837-.252-.464-.187-.927-.266-1.258-.266-.33 0-.742.069-.742.365 0 .356.366.425 1.5.562zM21.2 12c0 5.081-4.119 9.2-9.2 9.2-5.081 0-9.2-4.119-9.2-9.2 0-5.081 4.119-9.2 9.2-9.2 5.081 0 9.2 4.119 9.2 9.2zm-9.2-12C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>
                       <h2 className="text-3xl font-black tracking-tight">Payout Infrastructure</h2>
                    </div>
                    <p className="text-indigo-100 text-lg leading-relaxed max-w-lg">
                      VeloMarket uses Stripe Connect to route funds directly to your bank account. Ensure your business details are up to date to maintain active payout status.
                    </p>
                    
                    {user.stripeConnected ? (
                       <div className="flex flex-col gap-4">
                          <div className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 flex items-center gap-4">
                             <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.5)]"></div>
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">ID Verification</p>
                                <p className="font-bold text-white">Stripe Account: {user.stripeAccountId}</p>
                             </div>
                          </div>
                          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Commission Rate: {user.commissionRate}%</p>
                       </div>
                    ) : (
                       <button 
                        onClick={handleConnectStripe}
                        disabled={isConnectingStripe}
                        className="bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-4 hover:bg-indigo-50 transition-all shadow-2xl shadow-indigo-900/40 disabled:opacity-50"
                       >
                          {isConnectingStripe ? (
                            <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                          ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.911 8.612l1.03 5.404c1.139.149 1.622.742 1.622 1.573 0 1.087-.988 1.642-2.757 1.642-1.601 0-2.728-.415-2.728-1.116 0-.306.245-.534.603-.534.345 0 .528.227 1.354.554.815.32 1.258.12 1.258-.426 0-.365-.4-.445-1.397-.564-1.144-.138-1.627-.711-1.627-1.562 0-1.076.992-1.631 2.766-1.631.954 0 1.514.138 2.304.425.322.12.508.316.508.573 0 .326-.245.554-.601.554-.151 0-.312-.04-.837-.252-.464-.187-.927-.266-1.258-.266-.33 0-.742.069-.742.365 0 .356.366.425 1.5.562zM21.2 12c0 5.081-4.119 9.2-9.2 9.2-5.081 0-9.2-4.119-9.2-9.2 0-5.081 4.119-9.2 9.2-9.2 5.081 0 9.2 4.119 9.2 9.2zm-9.2-12C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>
                          )}
                          Set Up Stripe Payouts
                       </button>
                    )}
                 </div>
                 <div className="hidden lg:block w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-3xl border border-white/20">
                    <svg className="w-24 h-24 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
              </div>
           </div>

           <div className="bg-white p-10 md:p-16 rounded-[40px] border border-slate-200 shadow-sm">
             <h2 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">Store Profile Configuration</h2>
             <form className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Store Front Name</label>
                   <input 
                    type="text" 
                    className="w-full px-5 py-4 rounded-2xl border bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold" 
                    value={profileForm.storeName}
                    onChange={e => setProfileForm({...profileForm, storeName: e.target.value})}
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Business Structure</label>
                   <select 
                    className="w-full px-5 py-4 rounded-2xl border bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                    value={profileForm.businessType}
                    onChange={e => setProfileForm({...profileForm, businessType: e.target.value})}
                   >
                     <option>Sole Trader</option>
                     <option>LLC / Company</option>
                     <option>Artisan Collective</option>
                   </select>
                 </div>
               </div>
               
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Business Biography</label>
                 <textarea 
                  rows={4} 
                  className="w-full px-5 py-4 rounded-2xl border bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium leading-relaxed"
                  value={profileForm.longDescription}
                  onChange={e => setProfileForm({...profileForm, longDescription: e.target.value})}
                 />
               </div>

               <button 
                type="button" 
                onClick={() => onUpdateUser(profileForm)}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
               >
                 Save Identity Updates
               </button>
             </form>
           </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[40px] max-w-4xl w-full my-12 relative shadow-2xl overflow-hidden border border-indigo-100">
            <button onClick={() => setShowAddForm(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
               <div className="p-10 md:p-16 border-r border-slate-100 bg-slate-50/50">
                  <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">New Listing</h2>
                  <div className="aspect-[4/3] rounded-[32px] overflow-hidden bg-white border border-slate-200 mb-8 group relative shadow-inner">
                     {newProduct.image ? (
                        <img src={newProduct.image} className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                           <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                           <p className="text-[10px] font-black uppercase tracking-widest">Awaiting AI Generation</p>
                        </div>
                     )}
                     {isGeneratingImage && (
                       <div className="absolute inset-0 bg-indigo-600/10 backdrop-blur-sm flex items-center justify-center">
                          <div className="w-12 h-12 border-4 border-white/30 border-t-indigo-600 rounded-full animate-spin"></div>
                       </div>
                     )}
                  </div>
                  <button 
                    onClick={handleGenerateAIImage}
                    type="button" 
                    className="w-full bg-white border-2 border-indigo-100 text-indigo-600 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-indigo-600 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Generate Conceptual Image
                  </button>
               </div>

               <div className="p-10 md:p-16">
                  <form onSubmit={handleAddProductSubmit} className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Title</label>
                        <input type="text" required className="w-full px-5 py-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold" placeholder="E.g. Nordic Wool Blanket" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price ($)</label>
                           <input type="number" required className="w-full px-5 py-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                           <select className="w-full px-5 py-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold bg-white" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                              <option>Home Decor</option>
                              <option>Kitchen</option>
                              <option>Apparel</option>
                              <option>Jewelry</option>
                           </select>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description (AI will enhance)</label>
                        <textarea rows={4} required className="w-full px-5 py-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium leading-relaxed" placeholder="Briefly describe the materials and craft..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                     </div>
                     <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-indigo-100 transform transition-all hover:-translate-y-1 active:scale-95">Verify & List Product</button>
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