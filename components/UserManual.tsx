
import React from 'react';

interface UserManualProps {
  onBack: () => void;
}

const UserManual: React.FC<UserManualProps> = ({ onBack }) => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button onClick={onBack} className="text-sm font-bold text-slate-400 hover:text-indigo-600 mb-12 flex items-center gap-2 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Return to Marketplace
      </button>

      <div className="space-y-20">
        {/* Hero Section */}
        <header className="text-center space-y-6">
          <div className="inline-block bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-indigo-100">
            Marketplace Blueprint v2.0
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
            Welcome to <span className="text-indigo-600">VeloMarket.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
            A high-performance artisanal ecosystem where global creators meet modern collectors. This guide covers everything from your first purchase to managing a storefront.
          </p>
        </header>

        {/* Discovery & Shopping (The Buyer Experience) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-1 space-y-6">
             <h2 className="text-3xl font-black text-slate-900 leading-tight">Collector's <br/>Experience</h2>
             <p className="text-slate-500 font-medium">Finding one-of-a-kind treasures has never been more intuitive.</p>
             <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4 shadow-xl">
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center font-black">?</div>
                <h4 className="font-bold">The Velo Guarantee</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Every purchase is protected. If an artisan creation doesn't match the story, we ensure a fair resolution through our unified dispute system.</p>
             </div>
          </div>
          
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:border-indigo-200 transition-all">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-3">The Discovery Hub</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Use our real-time search engine and category pills to filter through hundreds of items. Sort by price, newest arrivals, or artisanal categories instantly.</p>
             </div>

             <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:border-indigo-200 transition-all">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-3">Reputation Engine</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Check vendor profiles for star-distribution charts. We aggregate verified customer feedback to show you the "vibe" of every store before you buy.</p>
             </div>

             <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:border-indigo-200 transition-all">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-3">Unified Checkout</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Add items from 10 different sellers to one cart. Pay once. Our intelligent ledger handles the multi-vendor payout split automatically behind the scenes.</p>
             </div>

             <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:border-indigo-200 transition-all">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-3">Real-Time Tracking</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Stay updated with a detailed shipment history. From "In Processing" to "Delivered," your dashboard shows the exact journey of your handcrafted goods.</p>
             </div>
          </div>
        </section>

        {/* The Command Center (The Seller Experience) */}
        <section className="bg-white rounded-[40px] border border-slate-200 p-10 md:p-16 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] -mr-48 -mt-48 opacity-60"></div>
          
          <div className="max-w-3xl mb-16 relative z-10">
            <h2 className="text-4xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="bg-slate-900 text-white w-10 h-10 rounded-2xl flex items-center justify-center text-lg">02</span>
              Creator's Command Center
            </h2>
            <p className="text-lg text-slate-500 font-medium">Your Dashboard is the nervous system of your business. Here is how to master the 4 primary hubs:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 relative z-10">
            {/* Inventory Hub */}
            <div className="space-y-4">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs">A</div>
                 <h3 className="text-lg font-black text-slate-900">Inventory & AI Listing</h3>
               </div>
               <p className="text-sm text-slate-500 leading-relaxed mb-4">Leverage our <strong>Gemini AI</strong> tools to scale faster:</p>
               <ul className="space-y-3 text-xs font-bold text-slate-400">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> ✨ MAGIC COPY: Generate poetic descriptions in Luxury, Minimalist, or Storyteller styles.</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> 🖼️ AI ARTIST: Generate professional studio product photos using only a prompt.</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> 🔍 SEARCH & SORT: Manage thousands of items with real-time stock filtering.</li>
               </ul>
            </div>

            {/* Performance Hub */}
            <div className="space-y-4">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 font-black text-xs">B</div>
                 <h3 className="text-lg font-black text-slate-900">Performance Analytics</h3>
               </div>
               <p className="text-sm text-slate-500 leading-relaxed mb-4">Data-driven growth for your artisan brand:</p>
               <ul className="space-y-3 text-xs font-bold text-slate-400">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> 📈 REVENUE TRENDS: A visual 7-day sparkline tracking your daily earnings.</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> 🎯 CONVERSION RATE: Understand how many visitors become customers.</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> 💰 AVG ORDER VALUE: Track the health of your pricing strategy.</li>
               </ul>
            </div>

            {/* Fulfillment Hub */}
            <div className="space-y-4">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-xs">C</div>
                 <h3 className="text-lg font-black text-slate-900">Fulfillment & Logistics</h3>
               </div>
               <p className="text-sm text-slate-500 leading-relaxed mb-4">Keep your customers informed at every turn:</p>
               <ul className="space-y-3 text-xs font-bold text-slate-400">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 📦 ORDER STATUS: Mark items as Shipped or Delivered with one click.</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 🛤️ TRACKING HISTORY: Provide multiple updates as the item moves through transit.</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ⏱️ PROCESSING TIMES: Set transparent timelines to manage buyer expectations.</li>
               </ul>
            </div>

            {/* Financial Hub */}
            <div className="space-y-4">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-black text-xs">D</div>
                 <h3 className="text-lg font-black text-slate-900">Payouts & Treasury</h3>
               </div>
               <p className="text-sm text-slate-500 leading-relaxed mb-4">Transparent and automated finance:</p>
               <ul className="space-y-3 text-xs font-bold text-slate-400">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> 🔗 STRIPE CONNECT: Securely link your bank account for automated transfers.</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> ✂️ COMMISSION SPLITS: Set your platform contribution rate in Store Settings.</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> 📅 PAYOUT LEDGER: View a detailed history of every transaction and fee split.</li>
               </ul>
            </div>
          </div>
        </section>

        {/* Global Policies Summary */}
        <section className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] p-12 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-6">Marketplace Standards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
            <div className="space-y-2">
              <h4 className="font-black text-xs uppercase tracking-widest text-indigo-600">Ethics First</h4>
              <p className="text-sm text-slate-500">Every item must be handcrafted, vintage, or a unique craft supply. No mass-produced resale.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-black text-xs uppercase tracking-widest text-indigo-600">Global Split</h4>
              <p className="text-sm text-slate-500">Platform commissions are reinvested into marketing your storefront to the world.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-black text-xs uppercase tracking-widest text-indigo-600">Fast Support</h4>
              <p className="text-sm text-slate-500">Our unified help center resolves buyer/seller disputes within 48 business hours.</p>
            </div>
          </div>
          
          <div className="mt-12">
            <button 
              onClick={() => onBack()}
              className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 transform hover:scale-105 active:scale-95"
            >
              Start Your Journey
            </button>
          </div>
        </section>

        <footer className="text-center pt-8 border-t text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
           © 2024 VeloMarket | Built for the Modern Artisan Economy
        </footer>
      </div>
    </div>
  );
};

export default UserManual;
