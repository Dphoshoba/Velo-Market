
import React from 'react';
import { User } from '../types';

interface PoliciesProps {
  onBack: () => void;
  user?: User | null;
}

const Policies: React.FC<PoliciesProps> = ({ onBack, user }) => {
  const commissionRate = user?.commissionRate || 10;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <button onClick={onBack} className="text-sm font-medium text-slate-400 hover:text-indigo-600 mb-8 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        Back to Marketplace
      </button>

      <div className="bg-white p-10 md:p-16 rounded-[40px] border border-slate-200 shadow-sm space-y-12">
        <section>
          <h1 className="text-4xl font-black text-slate-900 mb-6">Marketplace Policies</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Welcome to VeloMarket. Our platform is built on trust, quality, and transparency. Below you'll find our standard operating procedures and legal terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
            Shipping & Logistics
          </h2>
          <div className="text-slate-600 leading-relaxed space-y-4">
            <p>
              VeloMarket acts as a facilitator for independent artisans. Every vendor manages their own shipping process, but we enforce the following minimum standards:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All orders must be dispatched within the timeframe specified on the vendor profile.</li>
              <li>Tracking information must be provided for all orders over $50.</li>
              <li>Vendors are encouraged to use sustainable, recyclable packaging.</li>
              <li>International shipping availability varies by vendor and will be calculated at checkout.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
            Commission & Fees
          </h2>
          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
            <p className="text-slate-700 leading-relaxed mb-4">
              Our marketplace operates on a shared-growth model. To sustain the platform and support our global community of creators, we apply a commission to each sale.
            </p>
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-indigo-200 shadow-sm">
              <span className="font-bold text-slate-900">Platform Commission Rate</span>
              <span className="text-2xl font-black text-indigo-600">{commissionRate}%</span>
            </div>
            {user?.role === 'seller' && (
              <p className="mt-4 text-xs text-indigo-400 font-medium">
                Note: This rate is configured in your Store Settings and applies to all your active listings.
              </p>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
            Returns & Handcrafted Guarantee
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Due to the unique nature of handcrafted items, return policies are set individually by each vendor. However, the <strong>Velo Guarantee</strong> covers you if an item arrives damaged or significantly different from its description. You have 14 days from delivery to initiate a dispute.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
            Privacy & Data Handling
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Your data is never sold. We only share necessary shipping information with vendors to fulfill your order. Payments are processed securely via Stripe Connect, ensuring your financial details never touch our servers.
          </p>
        </section>

        <div className="pt-12 border-t text-center">
          <p className="text-sm text-slate-400">Last Updated: February 2024</p>
          <button 
            onClick={onBack}
            className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            I Understand, Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Policies;
