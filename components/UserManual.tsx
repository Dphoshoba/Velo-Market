
import React from 'react';

interface UserManualProps {
  onBack: () => void;
}

const UserManual: React.FC<UserManualProps> = ({ onBack }) => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button onClick={onBack} className="text-sm font-bold text-slate-400 hover:text-indigo-600 mb-12 flex items-center gap-2 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Return to Marketplace
      </button>

      <div className="space-y-16">
        {/* Header Section */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">The <span className="text-indigo-600">VeloMarket</span> Manual</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            Discover the high-performance artisan cycle where creators meet collectors.
          </p>
        </header>

        {/* The Lifecycle Section */}
        <section className="bg-white rounded-[40px] border border-slate-200 p-10 md:p-16 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
          
          <h2 className="text-3xl font-black text-slate-900 mb-12 flex items-center gap-3">
            <span className="bg-indigo-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center text-lg">01</span>
            The Cycle of a Creation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </div>
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Listing</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Artisans upload their work. Our <strong>Gemini AI</strong> suggests professional, poetic descriptions to maximize appeal.</p>
            </div>
            
            {/* Step 2 */}
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Unified Purchase</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Buyers add items from multiple vendors. At checkout, a single payment is made, and funds are automatically split.</p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Fulfillment</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Sellers receive notifications and manage shipping from their dashboard, providing real-time tracking history.</p>
            </div>

            {/* Step 4 */}
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Payouts</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Platform commission is deducted based on vendor settings, and net earnings are deposited via Stripe Connect.</p>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Buyer Perspective */}
          <section className="bg-slate-900 text-white rounded-[40px] p-10 md:p-12 space-y-8">
             <h2 className="text-2xl font-bold flex items-center gap-3">
               <span className="w-2 h-8 bg-indigo-400 rounded-full"></span>
               For Collectors (Buyers)
             </h2>
             <ul className="space-y-6">
               <li className="flex gap-4">
                 <div className="text-indigo-400 font-bold">01</div>
                 <div>
                   <h4 className="font-bold mb-1">Artisan Discovery</h4>
                   <p className="text-sm text-slate-400">Visit detailed Vendor Profiles to see the artist's full story, social links, and complete catalog in one curated space.</p>
                 </div>
               </li>
               <li className="flex gap-4">
                 <div className="text-indigo-400 font-bold">02</div>
                 <div>
                   <h4 className="font-bold mb-1">Reputation Engine</h4>
                   <p className="text-sm text-slate-400">Our visual review dashboard aggregates verified buyer feedback, showing star distribution and verified purchase badges.</p>
                 </div>
               </li>
               <li className="flex gap-4">
                 <div className="text-indigo-400 font-bold">03</div>
                 <div>
                   <h4 className="font-bold mb-1">Seamless Cart</h4>
                   <p className="text-sm text-slate-400">Buy from 10 different sellers at once. Our backend handles the complex routing of payments behind the scenes.</p>
                 </div>
               </li>
             </ul>
          </section>

          {/* Seller Perspective */}
          <section className="bg-indigo-600 text-white rounded-[40px] p-10 md:p-12 space-y-8">
             <h2 className="text-2xl font-bold flex items-center gap-3">
               <span className="w-2 h-8 bg-white rounded-full"></span>
               For Creators (Sellers)
             </h2>
             <ul className="space-y-6">
               <li className="flex gap-4">
                 <div className="text-indigo-200 font-bold">01</div>
                 <div>
                   <h4 className="font-bold mb-1">AI Listing Partner</h4>
                   <p className="text-sm text-indigo-100">Stop struggling with copy. Provide a product name and let our AI generate poetic, high-conversion descriptions instantly.</p>
                 </div>
               </li>
               <li className="flex gap-4">
                 <div className="text-indigo-200 font-bold">02</div>
                 <div>
                   <h4 className="font-bold mb-1">Store Personalization</h4>
                   <p className="text-sm text-indigo-100">Upload your logo, define your "Artisan Journey" story, and set your own shipping policies to reflect your unique brand.</p>
                 </div>
               </li>
               <li className="flex gap-4">
                 <div className="text-indigo-200 font-bold">03</div>
                 <div>
                   <h4 className="font-bold mb-1">Automated Finance</h4>
                   <p className="text-sm text-indigo-100">Set your platform commission rate once. Every transaction calculates your net profit automatically—no spreadsheets needed.</p>
                 </div>
               </li>
             </ul>
          </section>
        </div>

        {/* Final CTA/Summary */}
        <section className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] p-12 text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-4">Ready to start the cycle?</h2>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto">VeloMarket is more than just a store; it's an infrastructure for the artisanal economy.</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => onBack()}
              className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Start Browsing
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserManual;
