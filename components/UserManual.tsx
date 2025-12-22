
import React from 'react';

interface UserManualProps {
  onBack: () => void;
}

const UserManual: React.FC<UserManualProps> = ({ onBack }) => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button onClick={onBack} className="text-sm font-bold text-slate-400 hover:text-indigo-600 mb-12 flex items-center gap-2 transition-colors group">
        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Return to Marketplace
      </button>

      <div className="space-y-24">
        {/* Header Section */}
        <header className="text-center space-y-6">
          <div className="inline-block bg-indigo-50 text-indigo-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-100 mb-4">
            Version 2.5 Operational Guide
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-[0.9]">The <span className="text-indigo-600">VeloMarket</span> <br/>Infrastructure</h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
            A high-performance ecosystem integrating decentralized artisan craft with centralized neural intelligence.
          </p>
        </header>

        {/* Gemini AI Operations Section */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-8">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Gemini AI Operations</h2>
              <p className="text-slate-500 font-medium">Automated intelligence for the artisan entrepreneur.</p>
            </div>
            <div className="flex gap-2">
               <span className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></span>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Intelligence Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4">Neural Price Audit</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Gemini analyzes live global marketplace trends and current boutique standards to ensure your artisanal work is priced for peak competitiveness and luxury positioning.</p>
            </div>

            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4">Cinematic Promos</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Direct your brand's vision with Veo-powered video generation. Transform static listings into high-performance video assets optimized for social conversion and luxury storytelling.</p>
            </div>

            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4">Visual Affinity Search</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Buyers can identify products by uploading images. Our AI identifies materials, styles, and artisanal techniques to find perfect catalog matches across the entire vendor network.</p>
            </div>
          </div>
        </section>

        {/* Financial Flow Section */}
        <section className="bg-slate-900 rounded-[60px] p-12 md:p-24 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-5xl font-black tracking-tight leading-tight">Financial <br/>Infrastructure</h2>
                <p className="text-indigo-200 text-lg leading-relaxed font-medium">
                  Integrated Stripe Connect architecture provides a seamless bridge between global collectors and independent creators.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/10 shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">Elite Verification</h4>
                    <p className="text-slate-400 text-sm">Sellers who complete Stripe onboarding receive the "Verified Artisan" status, increasing buyer trust and catalog placement.</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/10 shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">Automated Net Payouts</h4>
                    <p className="text-slate-400 text-sm">Commissions are automatically routed during the unified checkout process. Sellers track their net earnings via the Real-time Financial Ledger.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[48px] space-y-8">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Ledger Status</span>
                <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase">Active Payouts</span>
              </div>
              
              <div className="space-y-4">
                <div className="h-2 bg-white/10 rounded-full w-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[70%]"></div>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-4xl font-black">$4,290.00</span>
                  <span className="text-xs text-slate-500 font-bold">Total Net Distribution</span>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex justify-between items-center opacity-40">
                    <div className="w-8 h-8 bg-white/10 rounded-lg"></div>
                    <div className="flex-grow mx-4 h-2 bg-white/10 rounded-full"></div>
                    <div className="w-12 h-2 bg-white/10 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Concierge Section */}
        <section className="bg-white border border-slate-200 rounded-[60px] p-12 md:p-24 flex flex-col md:flex-row gap-20 items-center">
           <div className="w-full md:w-1/3 flex justify-center">
             <div className="w-48 h-48 bg-indigo-600 rounded-[60px] shadow-2xl shadow-indigo-100 flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-indigo-400 rounded-[60px] animate-ping opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <svg className="w-24 h-24 text-white relative z-10" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a3 3 0 116 0 3 3 0 01-6 0z" clipRule="evenodd" /></svg>
             </div>
           </div>
           <div className="flex-grow space-y-8">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Velo Concierge</h2>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">
                Our real-time Voice Assistant (Velo) provides 24/7 concierge service for both buyers and sellers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-2">For Buyers</h4>
                    <p className="text-sm text-slate-500">Ask Velo about product materials, artisan backgrounds, or curated recommendations based on your preferences.</p>
                 </div>
                 <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-2">For Sellers</h4>
                    <p className="text-sm text-slate-500">Get instant insights into your store's performance or use voice commands to trigger operational audits.</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Final Summary/CTA */}
        <section className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[60px] p-16 text-center space-y-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-black text-slate-900">Platform Maturity Index</h2>
            <p className="text-slate-500 font-medium">VeloMarket v2.5 represents the pinnacle of artisanal digital infrastructure. We combine the soul of traditional craft with the power of modern neural operations.</p>
          </div>
          <button 
            onClick={() => onBack()}
            className="bg-slate-900 text-white px-12 py-5 rounded-[24px] font-black uppercase tracking-[0.3em] text-xs hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 transform active:scale-95"
          >
            Enter The Marketplace
          </button>
        </section>
      </div>
      
      <footer className="mt-24 pt-12 border-t border-slate-100 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Velo Operational Compliance Document 2024</p>
      </footer>
    </div>
  );
};

export default UserManual;
