
import React from 'react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onRemove, onCheckout }) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-500">Go find some amazing artisan creations!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-3xl font-black mb-6">Shopping Bag</h1>
        {items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex gap-4">
            <img src={item.image} className="w-24 h-24 rounded-xl object-cover" alt="" />
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900">{item.name}</h3>
                  <p className="text-xs text-slate-400 mb-2">Sold by: {item.vendorName}</p>
                </div>
                <p className="font-black text-slate-900">${item.price}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-slate-50 text-slate-600">-</button>
                  <span className="px-4 py-1 bg-white font-medium">{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-slate-50 text-slate-600">+</button>
                </div>
                <button onClick={() => onRemove(item.id)} className="text-xs font-bold text-red-500 hover:text-red-600">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white p-8 rounded-3xl border border-slate-200 h-fit sticky top-24">
        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-bold text-slate-900">${subtotal}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Estimated Shipping</span>
            <span className="text-green-600 font-bold">FREE</span>
          </div>
          <div className="border-t pt-4 flex justify-between">
            <span className="font-bold text-slate-900">Total</span>
            <span className="text-2xl font-black text-indigo-600">${subtotal}</span>
          </div>
        </div>
        <button 
          onClick={onCheckout}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          Checkout
        </button>
        <div className="mt-6 flex flex-col items-center gap-2 text-slate-400">
          <p className="text-[10px] uppercase font-bold tracking-widest">Powered by Stripe Connect</p>
          <div className="flex gap-2">
            <div className="w-8 h-4 bg-slate-100 rounded"></div>
            <div className="w-8 h-4 bg-slate-100 rounded"></div>
            <div className="w-8 h-4 bg-slate-100 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
