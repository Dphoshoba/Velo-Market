
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

  const hasSocials = vendor.socialLinks && (
    vendor.socialLinks.instagram || 
    vendor.socialLinks.facebook || 
    vendor.socialLinks.linkedin || 
    vendor.socialLinks.website
  );

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

  const handleShare = () => {
    const url = `${window.location.origin}/#vendor/${vendor.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <VoiceAssistant contextPrompt={`The user is viewing the store of "${vendor.storeName || vendor.name}". This is an artisan shop of type "${vendor.businessType}". They have ${products.length} products listed. Their story is: ${vendor.longDescription}. Help the user learn about this vendor.`} />
      
      <button onClick={onBack} className="text-sm font-medium text-slate-400 hover:text-indigo-600 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        Back to browse
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="h-48 bg-gradient-to-r from-indigo-100 to-slate-200 relative">
          <img src="https://picsum.photos/seed/shop-banner/1200/400" className="w-full h-full object-cover opacity-20 mix-blend-overlay" alt="" />
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
              <h1 className="text-4xl font-black text-slate-900 mb-1">{vendor.storeName || vendor.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">{vendor.businessType || 'Artisan Vendor'}</span>
                <span className="text-slate-400">Joined {new Date(vendor.joinedDate).toLocaleDateString()}</span>
                <div className="flex items-center gap-1.5 text-yellow-500 font-bold bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  {stats.average} <span className="text-yellow-600/60 font-medium">({stats.count} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            <div className="lg:col-span-2 space-y-12">
              <section id="reviews" className="pt-6 border-t">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900">Customer Feedback</h3>
                  <button 
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    Write a Review
                  </button>
                </div>

                {/* Reputation Dashboard */}
                <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-8 rounded-[32px] border border-slate-200">
                  <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0">
                    <p className="text-6xl font-black text-slate-900">{stats.average}</p>
                    <div className="flex gap-1 my-3">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-5 h-5 ${i < Math.floor(Number(stats.average)) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      ))}
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Store Rating</p>
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

                {loadingReviews ? (
                  <div className="py-12 text-center text-slate-400 text-sm">Loading verified feedback...</div>
                ) : (
                  <div className="space-y-6">
                    {reviews.length > 0 ? reviews.map(review => (
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
                )}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
