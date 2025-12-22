
import React, { useState } from 'react';
import { User } from '../types';

interface SellerOnboardingProps {
  onComplete: (user: User) => void;
  onCancel: () => void;
}

const SellerOnboarding: React.FC<SellerOnboardingProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    storeName: '',
    businessType: 'Sole Trader',
    bio: '',
    longDescription: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    const newUser: User = {
      id: 'v-' + Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      role: 'seller',
      avatar: `https://picsum.photos/seed/${formData.email}/150`,
      joinedDate: new Date().toISOString(),
      storeName: formData.storeName,
      businessType: formData.businessType,
      bio: formData.bio,
      longDescription: formData.longDescription,
      commissionRate: 10,
      shippingPolicy: "Standard artisanal shipping applies.",
      estimatedDelivery: "3-5 Business Days",
      stripeConnected: false,
      payoutStatus: 'pending'
    };

    onComplete(newUser);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-fade-in">
      <div className="bg-white rounded-[48px] border border-slate-200 shadow-2xl p-10 md:p-16">
        <header className="text-center mb-12">
          <div className="w-20 h-20 bg-indigo-600 rounded-[28px] flex items-center justify-center text-white text-3xl font-black mx-auto mb-8 shadow-2xl shadow-indigo-100">V</div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Artisan Onboarding</h1>
          <p className="text-slate-500 font-medium">Launch your global store in three steps.</p>
        </header>

        <div className="flex justify-center gap-2 mb-16">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-2 w-16 rounded-full transition-all duration-700 ${step >= s ? 'bg-indigo-600' : 'bg-slate-100'}`}></div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-2xl font-black text-slate-900">Personal Infrastructure</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Legal Representative Name</label>
                  <input 
                    type="text" required
                    className="w-full px-6 py-5 rounded-2xl border bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Financial Contact Email</label>
                  <input 
                    type="email" required
                    className="w-full px-6 py-5 rounded-2xl border bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="bg-indigo-50 p-6 rounded-[28px] border border-indigo-100 flex gap-4">
                 <div className="shrink-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <p className="text-sm font-medium text-indigo-700 leading-relaxed">
                   <strong>Secure Payouts:</strong> VeloMarket uses Stripe Connect. After store setup, you'll be prompted to verify your identity and link your bank account.
                 </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-2xl font-black text-slate-900">Store Front Identity</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Public Store Name</label>
                  <input 
                    type="text" required
                    placeholder="e.g., Nordic Woolens"
                    className="w-full px-6 py-5 rounded-2xl border bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                    value={formData.storeName}
                    onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Business Model</label>
                  <select 
                    className="w-full px-6 py-5 rounded-2xl border bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all font-bold"
                    value={formData.businessType}
                    onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                  >
                    <option>Sole Trader</option>
                    <option>LLC / Company</option>
                    <option>Artisan Collective</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-2xl font-black text-slate-900">Brand Philosophy</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Brand Tagline</label>
                  <input 
                    type="text" required
                    placeholder="E.g. Sustainable luxury for modern homes"
                    className="w-full px-6 py-5 rounded-2xl border bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Artisan Narrative</label>
                  <textarea 
                    rows={4} required
                    placeholder="Share the craft, heritage, and soul of your work..."
                    className="w-full px-6 py-5 rounded-2xl border bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium leading-relaxed"
                    value={formData.longDescription}
                    onChange={e => setFormData({ ...formData, longDescription: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-8">
            {step > 1 ? (
              <button 
                type="button" 
                onClick={() => setStep(step - 1)}
                className="flex-1 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-slate-400 hover:bg-slate-50 transition-all"
              >
                Previous
              </button>
            ) : (
              <button 
                type="button" 
                onClick={onCancel}
                className="flex-1 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-slate-400 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            )}
            <button 
              type="submit" 
              className="flex-[2] bg-indigo-600 text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-100 transform active:scale-95"
            >
              {step === 3 ? 'Finalize Store' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerOnboarding;
