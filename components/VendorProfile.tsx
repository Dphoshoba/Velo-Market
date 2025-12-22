
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
}

const VendorProfile: React.FC<VendorProfileProps> = ({ vendor, products, currentUser, onProductClick, onAddToCart, onBack }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', productName: '' });
  const [copied, setCopied] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <VoiceAssistant contextPrompt={`The user is viewing the store of "${vendor.storeName || vendor.name}". This is an artisan shop of type "${vendor.businessType}". They have ${products.length} products listed. Their story is: ${vendor.longDescription}. Help the user learn about this vendor.`} />
      
      <button onClick={onBack} className="text-sm font-medium text-slate-400 hover:text-indigo-600 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        Back to browse
      </button>

      <div className="bg-white rounded-[48px] border border-slate-200 overflow-hidden shadow-sm">
        <div className="h-64 bg-slate-900 relative">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover opacity-40" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        </div>
        
        <div className="px-10 pb-12 -mt-24 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
            <div className="relative group">
              <img 
                src={vendor.storeLogo || vendor.avatar} 
                className="w-40 h-40 rounded-[40px] border-[6px] border-white shadow-2xl object-cover bg-white group-hover:scale-105 transition-transform duration-500" 
                alt={vendor.storeName} 
              />
              <div className="absolute -bottom-2 -right-2 bg-indigo-600 w-10 h-10 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
            </div>
            
            <div className="flex-grow pb-2">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{vendor.storeName || vendor.name}</h1>
                <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                   Stripe Verified Artisan
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm font-bold">
                <span className="text-indigo-600 uppercase tracking-widest text-xs">{vendor.businessType || 'Artisan Vendor'}</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-400">Since {new Date(vendor.joinedDate).getFullYear()}</span>
                <span className="text-slate-300">/</span>
                <div className="flex items-center gap-1.5 text-yellow-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  {stats.average} <span className="text-slate-400 font-medium">({stats.count} Verifications)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-20">
            <div className="lg:col-span-2 space-y-20">
              <section className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">The Artisan Journey</h3>
                <p className="text-2xl font-medium text-slate-600 leading-relaxed italic">
                  "{vendor.longDescription || "Crafting excellence through traditional methods and modern vision."}"
                </p>
              </section>

              <section id="reviews">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Public Verification</h3>
                  <button 
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                  >
                    Submit Feedback
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 bg-slate-50 p-10 rounded-[40px] border border-slate-100">
                  <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-7xl font-black text-slate-900 tracking-tighter">{stats.average}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Aggregate Score</p>
                  </div>
                  
                  <div className="md:col-span-2 space-y-3 justify-center flex flex-col">
                    {stats.distribution.map((percentage, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-slate-400 w-12">{5 - i} STAR</span>
                        <div className="flex-grow h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-600 transition-all duration-1000" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-900 w-8">{percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {reviews.length > 0 ? reviews.map(review => (
                    <div key={review.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:border-indigo-100 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black">
                            {review.authorName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-slate-900">{review.authorName}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date(review.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                           {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-indigo-600 fill-current' : 'text-slate-100'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                           ))}
                        </div>
                      </div>
                      <p className="text-slate-500 leading-relaxed font-medium">"{review.comment}"</p>
                    </div>
                  )) : (
                    <div className="text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200 text-slate-400 font-black uppercase tracking-widest text-[10px]">
                      Verified feedback ledger is currently empty.
                    </div>
                  )}
                </div>
              </section>

              <section className="space-y-12">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Active Catalog</h3>
                <ProductGrid 
                  products={products} 
                  onProductClick={onProductClick} 
                  onAddToCart={onAddToCart} 
                />
              </section>
            </div>

            <aside className="space-y-10">
               <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Contact Artisan</h4>
                  <div className="space-y-4">
                     <button className="w-full bg-white border border-slate-200 py-4 rounded-2xl font-bold text-slate-900 hover:border-indigo-600 transition-all text-sm">Send Direct Inquiry</button>
                     <button className="w-full bg-white border border-slate-200 py-4 rounded-2xl font-bold text-slate-900 hover:border-indigo-600 transition-all text-sm" onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                     }}>{copied ? 'Link Secured!' : 'Share Profile'}</button>
                  </div>
               </div>

               <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-100">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-6">Logistics Policy</h4>
                  <div className="space-y-6">
                     <div>
                        <p className="text-xs font-black uppercase tracking-widest text-indigo-200 mb-1">Standard Dispatch</p>
                        <p className="font-bold text-lg">Within 3-5 Days</p>
                     </div>
                     <div>
                        <p className="text-xs font-black uppercase tracking-widest text-indigo-200 mb-1">Global Shipping</p>
                        <p className="font-bold text-lg">Available Worldwide</p>
                     </div>
                     <div className="pt-6 border-t border-indigo-500/30">
                        <p className="text-[10px] font-medium leading-relaxed text-indigo-100">Every item is insured and shipped in eco-conscious artisanal packaging.</p>
                     </div>
                  </div>
               </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
