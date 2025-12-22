
import React, { useState, useEffect, useMemo } from 'react';
import { User, Product, Review } from '../types';
import { StorageService } from '../services/storage';
import ProductGrid from './ProductGrid';
import VoiceAssistant from './VoiceAssistant';

interface VendorProfileProps {
  vendor: User;
  products: Product[];
  currentUser: User | null;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
  onFollow?: () => void;
}

const VendorProfile: React.FC<VendorProfileProps> = ({ vendor, products, currentUser, onProductClick, onAddToCart, onBack, onFollow }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', productName: '' });
  const [copied, setCopied] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const isFollowing = currentUser?.following?.includes(vendor.id);

  // Dynamic Theme Helpers
  const themeClasses = useMemo(() => {
    const color = vendor.themeColor || 'indigo';
    return {
      bg: `bg-${color}-600`,
      bgHover: `hover:bg-${color}-700`,
      bgLight: `bg-${color}-50`,
      text: `text-${color}-600`,
      textLight: `text-${color}-200`,
      border: `border-${color}-100`,
      borderStrong: `border-${color}-600`,
      ring: `ring-${color}-600`,
      shadow: `shadow-${color}-100`,
      progress: `bg-${color}-600`
    };
  }, [vendor.themeColor]);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      const vendorReviews = await StorageService.getReviews(vendor.id);
      setReviews(vendorReviews);
      setLoadingReviews(false);
    };
    fetchReviews();
  }, [vendor.id]);

  const stats = useMemo(() => {
    if (reviews.length === 0) return { average: '0.0', count: 0, distribution: [0, 0, 0, 0, 0] };
    
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = (sum / reviews.length).toFixed(1);
    
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) {
        dist[5 - r.rating]++;
      }
    });

    return { 
      average, 
      count: reviews.length, 
      distribution: dist.map(c => Math.round((c / reviews.length) * 100)) 
    };
  }, [reviews]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return alert('Please sign in to leave a review.');
    
    const review: Review = {
      id: 'rev-' + Date.now(),
      vendorId: vendor.id,
      authorName: currentUser.name,
      rating: newReview.rating,
      comment: newReview.comment,
      productName: newReview.productName || 'General Store Review',
      date: new Date().toISOString(),
      verified: true 
    };

    await StorageService.saveReview(review);
    setReviews(prev => [review, ...prev]);
    setShowReviewForm(false);
    setNewReview({ rating: 5, comment: '', productName: '' });
  };

  const signatureProduct = products[0];

  return (
    <div className="space-y-16 animate-in fade-in duration-500 relative pb-40">
      <VoiceAssistant contextPrompt={`The user is viewing the store of "${vendor.storeName || vendor.name}". This is an artisan shop of type "${vendor.businessType}". They have ${products.length} products listed. Their story is: ${vendor.longDescription}. Help the user learn about this vendor.`} />
      
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-sm font-black text-slate-400 hover:text-indigo-600 flex items-center gap-1 group uppercase tracking-widest">
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
          Marketplace
        </button>
        <div className="flex gap-4">
           {vendor.socialLinks?.twitter && (
              <a href="#" className="w-10 h-10 bg-white border rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
           )}
           <button onClick={() => {
              navigator.clipboard.writeText(window.location.origin + '?vendor=' + vendor.id);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
           }} className="bg-white border text-slate-900 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-600 transition-all">
             {copied ? 'Link Secured' : 'Share Store'}
           </button>
        </div>
      </div>

      <div className="relative">
         {/* Immersive Brand Header */}
         <div className="bg-white rounded-[60px] border border-slate-200 overflow-hidden shadow-2xl">
            <div className={`h-80 ${themeClasses.bg} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent)]"></div>
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover opacity-30 mix-blend-overlay" alt="" />
            </div>
            
            <div className="px-12 pb-16 -mt-32 relative z-10">
              <div className="flex flex-col md:flex-row gap-10 items-start md:items-end">
                <div className="relative group">
                  <div className={`absolute inset-0 ${themeClasses.bg} rounded-[48px] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                  <img 
                    src={vendor.storeLogo || vendor.avatar} 
                    className="w-48 h-48 rounded-[48px] border-[8px] border-white shadow-2xl object-cover bg-white group-hover:scale-105 transition-transform duration-500 relative" 
                    alt={vendor.storeName} 
                  />
                  <div className={`absolute -bottom-2 -right-2 ${themeClasses.bg} w-12 h-12 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                </div>
                
                <div className="flex-grow pb-4">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter">{vendor.storeName || vendor.name}</h1>
                    <button 
                      onClick={onFollow}
                      className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all ${isFollowing ? 'bg-slate-900 text-white' : 'bg-white border-2 border-slate-100 text-slate-900 hover:border-slate-300'}`}
                    >
                       {isFollowing ? 'Part of Circle' : 'Join Circle'}
                    </button>
                  </div>
                  <p className="text-xl font-medium text-slate-500 max-w-2xl leading-relaxed">{vendor.bio || "Crafting excellence through traditional methods."}</p>
                </div>
              </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-24">
          
          {/* Signature Product Highlight */}
          {signatureProduct && (
            <section className="space-y-10">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Signature Work</h3>
               <div 
                onClick={() => onProductClick(signatureProduct)}
                className="group cursor-pointer bg-slate-50 rounded-[48px] border border-slate-100 overflow-hidden flex flex-col md:flex-row items-stretch hover:shadow-2xl transition-all duration-700"
              >
                  <div className="w-full md:w-1/2 aspect-square md:aspect-auto overflow-hidden">
                    <img src={signatureProduct.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                  </div>
                  <div className="p-12 md:p-16 flex flex-col justify-center flex-grow">
                     <p className={`${themeClasses.text} font-black uppercase tracking-widest text-[10px] mb-4`}>{signatureProduct.category}</p>
                     <h4 className="text-4xl font-black text-slate-900 mb-6 leading-tight">{signatureProduct.name}</h4>
                     <p className="text-slate-500 font-medium leading-relaxed mb-10 line-clamp-3 italic">"{signatureProduct.description}"</p>
                     <div className="flex items-center justify-between">
                        <span className="text-3xl font-black text-slate-900">${signatureProduct.price}</span>
                        <button className={`${themeClasses.bg} ${themeClasses.bgHover} text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg ${themeClasses.shadow}`}>Acquire Signature</button>
                     </div>
                  </div>
               </div>
            </section>
          )}

          <section className="space-y-12">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Artisan Narrative</h3>
            <div className={`p-12 rounded-[48px] bg-white border-l-8 ${themeClasses.borderStrong} shadow-sm space-y-8`}>
               <p className="text-2xl font-medium text-slate-600 leading-relaxed italic whitespace-pre-wrap">
                  {vendor.longDescription || "Masterful curation and handcrafted excellence from the heart of the artisan community."}
               </p>
               <div className="flex gap-4">
                  <div className={`px-4 py-2 rounded-xl ${themeClasses.bgLight} ${themeClasses.text} text-[10px] font-black uppercase tracking-widest`}>Hand-Forged</div>
                  <div className={`px-4 py-2 rounded-xl ${themeClasses.bgLight} ${themeClasses.text} text-[10px] font-black uppercase tracking-widest`}>Carbon Neutral</div>
                  <div className={`px-4 py-2 rounded-xl ${themeClasses.bgLight} ${themeClasses.text} text-[10px] font-black uppercase tracking-widest`}>Lifetime Integrity</div>
               </div>
            </div>
          </section>

          <section className="space-y-12">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">The Catalog</h3>
            <ProductGrid 
              products={products} 
              onProductClick={onProductClick} 
              onAddToCart={onAddToCart} 
            />
          </section>
        </div>

        <aside className="space-y-10">
           <div className={`bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm sticky top-32`}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10">Verification Stats</h4>
              
              <div className="space-y-8">
                 <div className="flex justify-between items-end">
                    <div>
                       <p className="text-4xl font-black text-slate-900 tracking-tighter">{stats.average}</p>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Trust Score</p>
                    </div>
                    <div className="text-right">
                       <p className="text-2xl font-black text-slate-900">{stats.count}</p>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Acquisitions</p>
                    </div>
                 </div>

                 <div className="space-y-4 pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-lg ${themeClasses.bgLight} ${themeClasses.text} flex items-center justify-center`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       </div>
                       <p className="text-xs font-bold text-slate-700">Usually ships in {vendor.estimatedDelivery || '3-5 days'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-lg ${themeClasses.bgLight} ${themeClasses.text} flex items-center justify-center`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                       </div>
                       <p className="text-xs font-bold text-slate-700">Eco-Verfied Packaging</p>
                    </div>
                 </div>

                 <div className="pt-8 space-y-4">
                    <button className={`w-full ${themeClasses.bg} ${themeClasses.bgHover} text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg ${themeClasses.shadow} transition-all`}>Contact Artisan</button>
                    <button onClick={() => setShowReviewForm(true)} className="w-full bg-slate-50 text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all border border-slate-200">Submit Verification</button>
                 </div>
              </div>
           </div>
           
           <div className={`p-10 rounded-[48px] ${themeClasses.bg} text-white space-y-6 shadow-2xl ${themeClasses.shadow}`}>
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] ${themeClasses.textLight}`}>Artisan Standards</h4>
              <p className="font-bold text-sm leading-relaxed italic opacity-90">"Every piece leaving my studio is a testament to the relationship between raw material and human intent."</p>
              <div className="pt-4 border-t border-white/20">
                 <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Location</p>
                 <p className="font-bold text-sm">{vendor.businessAddress || 'Artisan District, Global'}</p>
              </div>
           </div>
        </aside>
      </div>

      {showReviewForm && (
        <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
           <div className="bg-white rounded-[40px] max-w-lg w-full p-10 shadow-2xl">
              <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Post Verification</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                 <select className="w-full p-4 rounded-2xl border bg-slate-50 font-bold" value={newReview.rating} onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})}>
                    <option value="5">5 Stars (Masterful)</option>
                    <option value="4">4 Stars (Excellent)</option>
                    <option value="3">3 Stars (Met Expectations)</option>
                 </select>
                 <textarea className="w-full p-4 rounded-2xl border bg-slate-50 font-medium" rows={4} placeholder="Your acquisition notes..." value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})}></textarea>
                 <div className="flex gap-4">
                    <button type="button" onClick={() => setShowReviewForm(false)} className="flex-1 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Cancel</button>
                    <button type="submit" className="flex-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">Submit</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default VendorProfile;
