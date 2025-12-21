
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

  const handlePay = () => {
    if (!user) return alert('Please sign in to checkout.');
    setIsProcessing(true);
    
    // Simulate payment delay
    setTimeout(() => {
      // Split payment logic (Dynamic Multi-Vendor Payouts)
      const vendorBreakdown: Order['vendorBreakdown'] = {};
      items.forEach(item => {
        if (!vendorBreakdown[item.vendorId]) {
          vendorBreakdown[item.vendorId] = { items: [], subtotal: 0, commission: 0, payout: 0 };
        }
        const v = vendorBreakdown[item.vendorId];
        v.items.push(item);
        const itemSubtotal = item.price * item.quantity;
        v.subtotal += itemSubtotal;
        
        // Use the snapshot rate from the item (or default to 10 if missing)
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

      setIsProcessing(false);
      onSuccess(newOrder);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="text-slate-400 hover:text-indigo-600 mb-8 flex items-center gap-1 font-medium">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        Review Cart
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="First Name" className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" defaultValue={user?.name.split(' ')[0]} />
                <input placeholder="Last Name" className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" defaultValue={user?.name.split(' ')[1]} />
              </div>
              <input placeholder="Shipping Address" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="City" className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                <input placeholder="Postal Code" className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Payment</h2>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-5 h-5 border-2 border-indigo-600 rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>
                </div>
                <span className="font-bold text-slate-900">Credit or Debit Card</span>
              </div>
              <input placeholder="Card Number" className="w-full p-3 border rounded-xl mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="MM/YY" className="p-3 border rounded-xl" />
                <input placeholder="CVC" className="p-3 border rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 h-fit">
          <h2 className="text-xl font-bold mb-6">Checkout Summary</h2>
          <div className="divide-y mb-6">
            {items.map(item => (
              <div key={item.id} className="py-3 flex justify-between text-sm">
                <div>
                  <span className="text-slate-600">{item.quantity}x {item.name}</span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Vendor contribution: {item.commissionRate}%</p>
                </div>
                <span className="font-bold">${item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3 pt-6 border-t mb-8">
             <div className="flex justify-between text-slate-500">
               <span>Subtotal</span>
               <span>${total}</span>
             </div>
             <div className="flex justify-between text-indigo-600 font-bold text-xl">
               <span>Total to Pay</span>
               <span>${total}</span>
             </div>
          </div>
          <button 
            disabled={isProcessing}
            onClick={handlePay}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </>
            ) : `Pay $${total}`}
          </button>
          <p className="text-center text-xs text-slate-400 mt-4">
            By clicking pay, you agree to our Marketplace Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
