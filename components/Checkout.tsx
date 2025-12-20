
import React, { useState } from 'react';
import { CartItem, User, Order } from '../types';

interface CheckoutProps {
  items: CartItem[];
  user: User | null;
  onSuccess: (order: Order) => void;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, user, onSuccess, onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePay = async () => {
    if (!user) return alert('Please sign in to checkout.');
    setIsProcessing(true);
    
    // Split payment logic (Simulating Secure Multi-Vendor Split)
    const vendorBreakdown: Order['vendorBreakdown'] = {};
    items.forEach(item => {
      if (!vendorBreakdown[item.vendorId]) {
        vendorBreakdown[item.vendorId] = { items: [], subtotal: 0, commission: 0, payout: 0 };
      }
      const v = vendorBreakdown[item.vendorId];
      v.items.push(item);
      const itemSubtotal = item.price * item.quantity;
      v.subtotal += itemSubtotal;
      
      const rate = item.commissionRate || 10;
      v.commission += itemSubtotal * (rate / 100);
      v.payout = v.subtotal - v.commission;
    });

    const newOrder: Order = {
      id: 'ord-' + Math.random().toString(36).substr(2, 9),
      buyerId: user.id,
      items: [...items],
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      vendorBreakdown
    };

    // The checkout success handler in App.tsx now handles the async ApiService.createOrder call
    onSuccess(newOrder);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-700">
      <button onClick={onBack} className="text-slate-400 hover:text-indigo-600 mb-8 flex items-center gap-1 font-medium">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        Review Bag
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Delivery Hub</h2>
            <div className="space-y-4">
              <input placeholder="Full Name" className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" defaultValue={user?.name} />
              <input placeholder="Global Shipping Address" className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Secure Payment</h2>
            <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16"></div>
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center border border-slate-700">
                   <div className="w-4 h-4 bg-indigo-500 rounded-full opacity-50"></div>
                 </div>
                 <span className="text-xs font-black uppercase tracking-widest text-slate-400">Card Terminal</span>
              </div>
              <input placeholder="Card Number" className="w-full bg-slate-800 border-none rounded-xl p-4 text-white mb-4 placeholder:text-slate-600" />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Expiry" className="bg-slate-800 border-none rounded-xl p-4 text-white placeholder:text-slate-600" />
                <input placeholder="CVC" className="bg-slate-800 border-none rounded-xl p-4 text-white placeholder:text-slate-600" />
              </div>
            </div>
            <p className="mt-4 text-[10px] text-slate-400 uppercase font-black tracking-widest text-center flex items-center justify-center gap-2">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
              Encrypted by Stripe Connect
            </p>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-slate-200 h-fit shadow-xl shadow-slate-100">
          <h2 className="text-xl font-bold mb-8">Order Summary</h2>
          <div className="divide-y border-t border-b mb-8">
            {items.map(item => (
              <div key={item.id} className="py-4 flex justify-between gap-4">
                <div className="flex-grow">
                  <p className="font-bold text-slate-900 leading-tight">{item.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">x{item.quantity} units</p>
                </div>
                <span className="font-black text-slate-900">${item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="space-y-4 mb-10">
             <div className="flex justify-between text-slate-400 text-sm font-bold uppercase tracking-widest">
               <span>Total</span>
               <span className="text-2xl text-indigo-600 font-black tracking-tighter">${total}</span>
             </div>
          </div>
          <button 
            disabled={isProcessing}
            onClick={handlePay}
            className="w-full bg-indigo-600 text-white py-5 rounded-[20px] font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isProcessing ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : `Confirm & Pay $${total}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
