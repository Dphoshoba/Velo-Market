
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
  onVendorClick?: (vendorId: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onBack, onVendorClick }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/#product/${product.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="h-[400px] md:h-auto">
          <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <button onClick={onBack} className="text-sm font-medium text-slate-400 hover:text-indigo-600 mb-6 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Back to browse
          </button>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mb-2">{product.category}</p>
              <h1 className="text-4xl font-black text-slate-900 mb-4">{product.name}</h1>
            </div>
            <button 
              onClick={handleShare}
              className={`p-3 rounded-2xl border transition-all ${
                copied ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Share Product"
            >
              {copied ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 12.684a3 3 0 100-2.684 3 3 0 000 2.684z" /></svg>
              )}
            </button>
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <span className="font-bold">{product.rating}</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 text-sm">{product.reviewsCount} verified reviews</span>
          </div>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">{product.description}</p>
          
          <div className="border-t border-b py-6 mb-8">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-slate-900">${product.price}</span>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">In Stock ({product.stock})</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <button 
                onClick={() => onAddToCart(product)}
                className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98]"
              >
                Add to Cart
              </button>
              <button 
                onClick={handleShare}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-2xl font-bold transition-all border ${
                  copied ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-indigo-600 border-indigo-100 hover:bg-indigo-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 12.684a3 3 0 100-2.684 3 3 0 000 2.684z" />
                </svg>
                {copied ? 'Copied' : 'Share'}
              </button>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Secure Checkout
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Ships in 2-3 days
              </div>
            </div>
          </div>

          <div 
            className="mt-12 pt-8 border-t flex items-center gap-4 cursor-pointer group"
            onClick={() => onVendorClick?.(product.vendorId)}
          >
             <img src={`https://picsum.photos/seed/${product.vendorId}/50`} className="w-12 h-12 rounded-full ring-2 ring-slate-100 group-hover:ring-indigo-200 transition-all" alt="Vendor" />
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Sold by</p>
               <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors underline underline-offset-4 decoration-transparent group-hover:decoration-indigo-200">{product.vendorName}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
