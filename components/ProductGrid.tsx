
import React from 'react';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick, onAddToCart }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    const secondaryFallback = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800';
    if (target.src !== secondaryFallback) {
      target.src = secondaryFallback;
    } else {
      target.style.display = 'none';
      if (target.parentElement) {
        target.parentElement.classList.add('bg-gradient-to-br', 'from-indigo-50', 'to-slate-100', 'flex', 'flex-col', 'items-center', 'justify-center', 'p-10');
        target.parentElement.innerHTML = '';
        const icon = document.createElement('div');
        icon.className = 'w-12 h-12 bg-indigo-100 rounded-2xl mb-4 flex items-center justify-center';
        icon.innerHTML = '<svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
        const label = document.createElement('div');
        label.className = 'text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]';
        label.innerText = 'Artisan Preview';
        target.parentElement.appendChild(icon);
        target.parentElement.appendChild(label);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => {
        // Simulated Neural Pulse
        const viewCount = Math.floor(Math.random() * 15) + 3;
        
        return (
          <div 
            key={product.id} 
            className="group bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:border-indigo-100 transition-all duration-500 cursor-pointer flex flex-col"
            onClick={() => onProductClick(product)}
          >
            <div className="aspect-[4/3] overflow-hidden relative bg-slate-100">
              <img 
                src={product.image} 
                onError={handleImageError}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                alt={product.name} 
              />
              
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                 <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm border border-slate-100 w-fit">
                  {product.category}
                </div>
                {product.rating >= 4.9 && (
                  <div className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 w-fit">
                    Elite Craft
                  </div>
                )}
              </div>

              <div className="absolute top-4 right-4">
                 <div className="bg-slate-900/40 backdrop-blur-md px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] text-white border border-white/10 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
                    {viewCount} Collectors Viewing
                 </div>
              </div>
            </div>

            <div className="p-8 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <div className="max-w-[70%]">
                  <h3 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors text-lg leading-tight mb-1 truncate" title={product.name}>{product.name}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">by {product.vendorName}</p>
                </div>
                <p className="font-black text-indigo-600 text-xl tracking-tighter">${product.price}</p>
              </div>
              
              <div className="flex items-center gap-2 mb-8">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">({product.reviewsCount} Verifications)</span>
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                className="mt-auto w-full bg-slate-900 text-white py-4 rounded-[20px] font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-600/20 transform active:scale-[0.97]"
              >
                Secure Acquisition
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
