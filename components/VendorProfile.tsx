
import React, { useState, useEffect, useMemo } from 'react';
import { User, Product, Review } from '../types';
import { ApiService } from '../services/api';
import ProductGrid from './ProductGrid';

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
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', productName: '' });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const vendorReviews = await ApiService.getReviews(vendor.id);
        setReviews(vendorReviews);
      } catch (err) {
        console.error("Failed to load reviews", err);
      } finally {
        setIsLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [vendor.id]);

  // Comprehensive rating statistics calculation
  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return { 
        average: 0, 
        averageStr: '0.0', 
        count: 0, 
        distribution: [0, 0, 0, 0, 0] 
      };
    }
    
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / reviews.length;
    
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach(r => {
      const idx = 5 - Math.max(1, Math.min(5, Math.round(r.rating)));
      dist[idx]++;
    });

    return { 
      average,
      averageStr: average.toFixed(1),
      count: reviews.length, 
      distribution: dist.map(c => Math.round((c / reviews.length) * 100)) 
    };
  }, [reviews]);

  const hasSocials = useMemo(() => {
    if (!vendor.socialLinks) return false;
    return !!(
      vendor.socialLinks.instagram ||
      vendor.socialLinks.twitter ||
      vendor.socialLinks.website ||
      vendor.socialLinks.facebook ||
      vendor.socialLinks.linkedin
    );
  }, [vendor.socialLinks]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return alert('Please sign in to leave a review.');
    
    setIsSubmitting(true);
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

    try {
      await ApiService.saveReview(review);
      setReviews(prev => [review, ...prev]);
      setShowReviewForm(false);
      setNewReview({ rating: 5, comment: '', productName: '' });
    } catch (err) {
      alert("Failed to save review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/#vendor/${vendor.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <button onClick={onBack} className="text-sm font-medium text-slate-400 hover:text-indigo-600 flex items-center gap-1 group transition-colors">
        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        Back to browse
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="h-48 bg-gradient-to-r from-indigo-100 to-slate-200 relative">
          <img src={`https://picsum.photos/seed/${vendor.id}-banner/1200/400`} className="w-full h-full object-cover opacity-20 mix-blend-overlay" alt="" />
        </div>
        <div className="px-8 pb-8 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
            <div className="relative">
              <img 
                src={vendor.storeLogo || vendor.avatar} 
                className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl object-cover bg-white" 
                alt={vendor.storeName} 
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
            </div>
            
            <div className="flex-grow">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-4xl font-black text-slate-900 mb-1">{vendor.storeName || vendor.name}</h1>
                <button 
                  onClick={handleShare}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${copied ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-indigo-600 border-indigo-100 hover:bg-indigo-50'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 12.684a3 3 0 100-2.684 3 3 0 000 2.684z" /></svg>
                  {copied ? 'Copied Link!' : 'Share Store'}
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium mt-2">
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold">{vendor.businessType || 'Artisan Vendor'}</span>
                
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < Math.floor(stats.average) ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-slate-900 font-black">{stats.averageStr}</span>
                  <span className="text-slate-400 font-medium">({stats.count} {stats.count === 1 ? 'review' : 'reviews'})</span>
                </div>

                <span className="text-slate-300">|</span>
                <span className="text-slate-400">Since {new Date(vendor.joinedDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {vendor.longDescription && (
            <div className="mt-12 bg-indigo-50/40 p-10 rounded-[40px] border border-indigo-100/50 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-200/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-indigo-200"></span>
                The Artisan Journey
              </h3>
              <div className="text-slate-800 leading-[1.8] text-xl font-serif italic max-w-4xl">
                {vendor.longDescription}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            <div className="lg:col-span-2 space-y-12">
              
              <section className="bg-slate-50 p-8 rounded-3xl border border-slate-200 flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Fulfillment Promise
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                      <p className="text-xl font-black text-indigo-600">{vendor.processingTime || '1-2 Days'}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Processing</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                      <p className="text-xl font-black text-indigo-600">{vendor.estimatedDelivery || 'Standard'}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Transit</p>
                    </div>
                  </div>
                </div>
                <div className="flex-[2] space-y-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                    Shipping Policy
                  </h3>
                  <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {vendor.shippingPolicy || "We ship with care using sustainable packaging. All items are dispatched within the estimated timeframe."}
                  </div>
                </div>
              </section>

              <section id="reviews" className="pt-6 border-t">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900">Customer Feedback ({stats.count})</h3>
                  <button 
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    Write a Review
                  </button>
                </div>

                {/* Rating Summary Dashboard */}
                <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-8 rounded-[32px] border border-slate-200">
                  <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0">
                    <p className="text-6xl font-black text-slate-900">{stats.averageStr}</p>
                    <div className="flex gap-1 my-3">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-5 h-5 ${i < Math.floor(stats.average) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      ))}
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Store Rating ({stats.count} total)</p>
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    {stats.distribution.map((percentage, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <span className="text-xs font-bold text-slate-500 w-12">{5 - i} stars</span>
                        <div className="flex-grow h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-400 transition-all duration-1000" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-slate-400 w-8">{percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {showReviewForm && (
                  <div className="mb-10 bg-white p-8 rounded-3xl border border-indigo-100 shadow-xl animate-in slide-in-from-top duration-300 relative">
                    {isSubmitting && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center rounded-3xl"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>}
                    <h4 className="font-bold mb-4 text-xl">Leave your review</h4>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Rating</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(num => (
                              <button 
                                key={num}
                                type="button"
                                onClick={() => setNewReview(prev => ({ ...prev, rating: num }))}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all font-bold ${newReview.rating >= num ? 'bg-yellow-400 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Product Purchased</label>
                          <select 
                            className="w-full px-3 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            value={newReview.productName}
                            onChange={e => setNewReview(prev => ({ ...prev, productName: e.target.value }))}
                          >
                            <option value="">Select a product...</option>
                            {products.map(p => (
                              <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Comment</label>
                        <textarea 
                          required
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="What did you think about your purchase?"
                          value={newReview.comment}
                          onChange={e => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        />
                      </div>
                      <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50">
                        {isSubmitting ? 'Posting...' : 'Post Review'}
                      </button>
                    </form>
                  </div>
                )}

                <div className="space-y-6">
                  {isLoadingReviews ? (
                    <div className="text-center py-12"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
                  ) : reviews.length > 0 ? reviews.map(review => (
                    <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-200 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                            {review.authorName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{review.authorName}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                ))}
                              </div>
                              <span className="text-[10px] text-slate-400">{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        {review.verified && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-indigo-500 mb-2">{review.productName}</p>
                      <p className="text-slate-600 text-sm italic leading-relaxed">"{review.comment}"</p>
                    </div>
                  )) : (
                    <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-300 text-slate-400">
                      No reviews yet for this vendor.
                    </div>
                  )}
                </div>
              </section>

              <div className="pt-6 border-t">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Catalog ({products.length})</h3>
                <ProductGrid 
                  products={products} 
                  onProductClick={onProductClick} 
                  onAddToCart={onAddToCart} 
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                   <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                   Business Insights
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-indigo-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Vendor Reputation</p>
                      <p className="text-sm font-black text-slate-700">{stats.averageStr} / 5.0 Average</p>
                      <p className="text-xs text-slate-400">{stats.count} verified customer reviews</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-indigo-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2V10a2 2 0 002 2z" /></svg>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Contact Email</p>
                      <p className="text-sm font-medium text-slate-700">{vendor.email}</p>
                    </div>
                  </li>
                  {vendor.contactPhone && (
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-indigo-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Phone Number</p>
                        <p className="text-sm font-medium text-slate-700">{vendor.contactPhone}</p>
                      </div>
                    </li>
                  )}
                  {vendor.businessAddress && (
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-indigo-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Studio Location</p>
                        <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap">{vendor.businessAddress}</p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4">Connect with Creator</h3>
                <div className="flex flex-col gap-4">
                  {hasSocials ? (
                    <div className="flex flex-col gap-3">
                      {vendor.socialLinks?.instagram && (
                        <a href={`https://instagram.com/${vendor.socialLinks.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-600 hover:text-indigo-600 transition-colors group">
                          <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600 group-hover:bg-pink-100 transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                          </div>
                          <span className="font-bold">@{vendor.socialLinks.instagram}</span>
                        </a>
                      )}
                      {vendor.socialLinks?.website && (
                        <a href={vendor.socialLinks.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-600 hover:text-indigo-600 transition-colors group">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                          </div>
                          <span className="font-bold">Official Website</span>
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No social links provided.</p>
                  )}
                  
                  <div className="pt-4 border-t">
                    <button 
                      onClick={handleShare}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${copied ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-50 text-indigo-600 border-slate-100 hover:bg-indigo-50 hover:border-indigo-200'}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 12.684a3 3 0 100-2.684 3 3 0 000 2.684z" /></svg>
                      {copied ? 'Copied Store URL' : 'Copy Share Link'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
