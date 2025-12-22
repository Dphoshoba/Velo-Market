
import React from 'react';

interface UserManualProps {
  onBack: () => void;
}

const UserManual: React.FC<UserManualProps> = ({ onBack }) => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-40">
      <button onClick={onBack} className="text-sm font-bold text-slate-400 hover:text-indigo-600 mb-12 flex items-center gap-2 transition-colors group">
        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Return to Marketplace
      </button>

      <div className="space-y-32">
        {/* Header Section */}
        <header className="text-center space-y-6">
          <div className="inline-block bg-indigo-50 text-indigo-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-100 mb-4">
            Official Platform Manual
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-[0.9]">The <span className="text-indigo-600">Smart Seller</span> <br/>Playbook</h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
            Master our proprietary Neural Suite. From automated studio photography to market-gap discovery, this is your roadmap to artisan dominance.
          </p>
        </header>

        {/* Visual Identity Engine (Image Generation) */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-8">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Visual Identity Engine</h2>
              <p className="text-slate-500 font-medium">Professional product photography, without the expensive studio.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
               <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                  <h3 className="text-2xl font-black text-slate-900 mb-6">Two Ways to Render</h3>
                  
                  <div className="space-y-8">
                    <div className="flex gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 mb-1">Draft Concept (Description to Image)</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">Simply type a title and description. Our AI will imagine the product from scratch, creating a stunning visual representation of your idea.</p>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 mb-1">Elite Studio Render (Image to Image)</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">Already have a basic photo? Upload it and click **Re-imagine**. The AI uses your photo as a structural guide, adding professional lighting, luxury textures, and high-end studio backgrounds.</p>
                      </div>
                    </div>
                  </div>
               </div>
            </div>

            <div className="bg-indigo-600 p-12 rounded-[40px] text-white flex flex-col justify-center shadow-2xl shadow-indigo-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
               <h4 className="text-2xl font-black mb-6">The Success Secret:</h4>
               <p className="text-indigo-100 leading-relaxed font-medium mb-8">
                 High-conversion listings require high-quality visuals. If your workshop photo is cluttered, use the **Elite Render** to isolate your product in a clean, minimalist environment. It’s like having a professional photographer and retoucher available 24/7.
               </p>
               <div className="flex gap-3">
                 <div className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest">4K Definition</div>
                 <div className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest">Studio Lighting</div>
               </div>
            </div>
          </div>
        </section>

        {/* Neural Intelligence Section */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-8">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Market Intelligence</h2>
              <p className="text-slate-500 font-medium">Find out what buyers want before you even list.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              <h3 className="text-2xl font-black text-slate-900 mb-6">How to use "Pulse Check"</h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black shrink-0">1</div>
                   <p className="text-slate-600 font-medium pt-1">Open your **New Listing** form and select a category (e.g., Kitchenware).</p>
                </li>
                <li className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black shrink-0">2</div>
                   <p className="text-slate-600 font-medium pt-1">Click the <span className="text-indigo-600 font-black uppercase tracking-widest text-[10px]">Pulse Check</span> button in the Neural Intel box.</p>
                </li>
                <li className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black shrink-0">3</div>
                   <p className="text-slate-600 font-medium pt-1">Gemini will search Google for trending items and suggest "High-Demand Gaps" you can fill.</p>
                </li>
              </ul>
            </div>
            <div className="bg-indigo-600 p-12 rounded-[40px] text-white flex flex-col justify-center shadow-2xl shadow-indigo-100">
               <h4 className="text-xl font-black mb-4">Why it works:</h4>
               <p className="text-indigo-100 leading-relaxed font-medium">
                 Instead of guessing what people want, you're using real-time search data. If Gemini tells you "Hand-carved wooden spoons" are trending, you can adjust your craft to meet that specific demand.
               </p>
            </div>
          </div>
        </section>

        {/* AI Architect Section */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-8">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">The AI Architect</h2>
              <p className="text-slate-500 font-medium">Let Gemini write your professional sales descriptions.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step 01</p>
                <h4 className="font-black text-slate-900">Type Basic Notes</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Just type the simple facts: "clay bowl, blue, for cereal, made in Japan."</p>
             </div>
             <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step 02</p>
                <h4 className="font-black text-slate-900">Click Neural Enhance</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Click the magic wand icon above the description box in the dashboard.</p>
             </div>
             <div className="bg-indigo-50 p-8 rounded-[32px] border border-indigo-100 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Step 03</p>
                <h4 className="font-black text-slate-900">Get Luxury Copy</h4>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">Gemini transforms your notes into a poetic, luxury description that sounds like a boutique catalog.</p>
             </div>
          </div>
        </section>

        {/* Trust Pulse Section */}
        <section className="bg-slate-900 rounded-[60px] p-12 md:p-24 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-5xl font-black tracking-tight leading-tight">Automated Trust Pulse</h2>
            <p className="text-xl text-indigo-100 font-medium leading-relaxed">
              Every product you list automatically displays a "Neural Pulse" indicator to visiting collectors.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left pt-12">
               <div className="bg-white/5 border border-white/10 p-8 rounded-[40px]">
                  <h4 className="text-xl font-black mb-4">Urgency Driven</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">When collectors see "12 people viewing," it creates a natural sense of scarcity that encourages them to secure the acquisition before it's gone.</p>
               </div>
               <div className="bg-white/5 border border-white/10 p-8 rounded-[40px]">
                  <h4 className="text-xl font-black mb-4">Social Proof</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">A "busy" shop feels successful. The Trust Pulse shows your items are in active demand across the entire global network.</p>
               </div>
            </div>
          </div>
        </section>

        {/* Global Admin Section */}
        <section className="bg-white border border-slate-200 rounded-[60px] p-12 md:p-24 flex flex-col md:flex-row gap-20 items-center">
           <div className="w-full md:w-1/3 flex justify-center">
             <div className="w-48 h-48 bg-slate-900 rounded-[60px] shadow-2xl flex items-center justify-center relative">
                <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
             </div>
           </div>
           <div className="flex-grow space-y-8">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Platform Revenue View</h2>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">
                If you are running the marketplace, the **Orchestrator Dashboard** gives you a birds-eye view of your empire.
              </p>
              <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-black text-white">✓</div>
                    <p className="text-slate-500 font-bold">Track "Platform Fees" from every single sale (Automated 10%).</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-black text-white">✓</div>
                    <p className="text-slate-500 font-bold">Monitor "Network Volume" and payout integrity.</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-black text-white">✓</div>
                    <p className="text-slate-500 font-bold">Manage artisans and visualize global liquidity flux.</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Final CTA */}
        <section className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[60px] p-16 text-center space-y-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Ready to Authenticate?</h2>
            <p className="text-slate-500 font-medium leading-relaxed">Return to the archive and start curating your own collection or launch your debut storefront today.</p>
          </div>
          <button 
            onClick={() => onBack()}
            className="bg-slate-900 text-white px-12 py-5 rounded-[24px] font-black uppercase tracking-[0.3em] text-xs hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 hover:scale-105 active:scale-95"
          >
            Enter Marketplace
          </button>
        </section>
      </div>
    </div>
  );
};

export default UserManual;
