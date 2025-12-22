
import React from 'react';
import { Product } from '../types';
import VoiceAssistant from './VoiceAssistant';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
  onVendorClick?: (vendorId: string) => void;
  language?: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onBack, onVendorClick, language = 'English' }) => {
  return (
    <div className="bg-white rounded-[48px] border border-slate-200 overflow-hidden shadow-sm relative animate-fade-in">
      <VoiceAssistant 
        language={language}
        contextPrompt={`The user is viewing a product named "${product.name}" in the "${product.category}" category. The description is: ${product.description}. The price is $${product.price}. Handled by vendor ${product.vendorName}. Help the user decide if they should buy it.`} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="h-[500px] md:h-auto bg-slate-50 relative">
          <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>
        <div className="p-10 md:p-20 flex flex-col justify-center">
          <button onClick={onBack} className="text-[10px] font-black text-slate-400 hover:text-indigo-600 mb-8 flex items-center gap-2 uppercase tracking-widest transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
            Marketplace Index
          </button>
          <div className="flex gap-2 mb-4">
             <span className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px] bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">{product.category}</span>
             <span className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">Handcrafted</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 font-black text-slate-900 text-sm">{product.rating}</span>
            </div>
            <span className="text-slate-300">/</span>
            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">{product.reviewsCount} Verified Acquisitions</span>
          </div>

          <p className="text-slate-500 text-xl font-medium leading-relaxed mb-12 italic border-l-4 border-indigo-100 pl-6">"{product.description}"</p>
          
          {/* PHYSICAL SPECIFICATIONS */}
          {(product.weight || product.dimensions || product.materials) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
               {product.weight && (
                 <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5">
                       ⚖️ Weight
                    </p>
                    <p className="font-bold text-slate-900 text-sm">{product.weight}</p>
                 </div>
               )}
               {product.dimensions && (
                 <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5">
                       📏 Size
                    </p>
                    <p className="font-bold text-slate-900 text-sm">{product.dimensions}</p>
                 </div>
               )}
               {product.materials && (
                 <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5">
                       🧶 Material
                    </p>
                    <p className="font-bold text-slate-900 text-sm truncate" title={product.materials}>{product.materials}</p>
                 </div>
               )}
            </div>
          )}

          <div className="bg-slate-50 rounded-3xl p-8 mb-10 flex items-center justify-between border border-slate-100">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard Price</p>
                <span className="text-4xl font-black text-slate-900 tracking-tighter">${product.price}</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Stock Availability</p>
                <span className="font-black text-slate-900">{product.stock} units remaining</span>
              </div>
          </div>

          {/* PRODUCT LOGISTICS INFO */}
          <div className="mb-10 p-6 bg-indigo-50/50 rounded-[32px] border border-indigo-50 flex flex-col gap-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Estimated Arrival</p>
                   <p className="font-bold text-slate-900">{product.estimatedDelivery || "Standard Lead Times"}</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                </div>
                <div>
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Shipping Policy</p>
                   <p className="font-medium text-slate-600 text-sm leading-tight">{product.shippingPolicy || "Handled with artisanal care."}</p>
                </div>
             </div>
          </div>

          <div className="flex flex-col gap-6">
            <button 
              onClick={() => onAddToCart(product)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[24px] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-indigo-600/30 transition-all transform active:scale-[0.98]"
            >
              Add to Collection
            </button>
            <div className="flex items-center justify-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Stripe Verified
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Artisan Logistics
              </div>
            </div>
          </div>

          <div 
            className="mt-16 pt-10 border-t-2 border-slate-50 flex items-center gap-6 cursor-pointer group"
            onClick={() => onVendorClick?.(product.vendorId)}
          >
             <div className="relative">
                <img src={`https://picsum.photos/seed/${product.vendorId}/100`} className="w-16 h-16 rounded-2xl ring-4 ring-slate-100 group-hover:ring-indigo-200 transition-all object-cover" alt="Vendor" />
                <div className="absolute -bottom-1 -right-1 bg-indigo-600 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
             </div>
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] group-hover:text-indigo-600 transition-colors">Artisan Vendor</p>
               <p className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors underline underline-offset-8 decoration-transparent group-hover:decoration-indigo-100">{product.vendorName}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;