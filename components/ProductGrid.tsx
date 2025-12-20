
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick, onAddToCart }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleShare = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const url = `${window.location.origin}/#product/${product.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(product.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer relative"
          onClick={() => onProductClick(product)}
        >
          <div className="aspect-[4/3] overflow-hidden relative">
            <img 
              src={product.image} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              alt={product.name} 
            />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-slate-600">
              {product.category}
            </div>
            
            {/* Quick Share Button */}
            <button 
              onClick={(e) => handleShare(e, product)}
              className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all duration-300 z-10 ${
                copiedId === product.id 
                  ? 'bg-emerald-500 border-emerald-400 text-white' 
                  : 'bg-white/40 border-white/20 text-slate-900 hover:bg-white/80 opacity-0 group-hover:opacity-100'
              }`}
              title="Copy link to product"
            >
              {copiedId === product.id ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 12.684a3 3 0 100-2.684 3 3 0 000 2.684z" />
                </svg>
              )}
              {copiedId === product.id && (
                <span className="absolute -bottom-8 right-0 bg-slate-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap">Copied!</span>
              )}
            </button>
          </div>
          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</h3>
                <p className="text-xs text-slate-500">by {product.vendorName}</p>
              </div>
              <p className="font-black text-indigo-600">${product.price}</p>
            </div>
            
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-slate-400">({product.reviewsCount})</span>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className="w-full bg-slate-100 hover:bg-indigo-600 hover:text-white py-2.5 rounded-xl font-bold text-sm transition-all"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
