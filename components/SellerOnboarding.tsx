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
      estimatedDelivery: "3-5 Business Days"
    };

    onComplete(newUser);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-fade-in">
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl p-10 md:p-16">
        <header className="text-center mb-12">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-6 shadow-xl shadow-indigo-100">V</div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Join VeloMarket</h1>
          <p className="text-slate-500">Transform your craft into a thriving business.</p>
        </header>

        <div className="flex justify-center gap-2 mb-12">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= s ? 'bg-indigo-600' : 'bg-slate-100'}`}></div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold">Personal Information</h2>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <input 
                  type="text" required
                  className="w-full px-5 py-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input 
                  type="email" required
                  className="w-full px-5 py-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold">Store Identity</h2>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Store Name</label>
                <input 
                  type="text" required
                  placeholder="e.g., Silk & Stone"
                  className="w-full px-5 py-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.storeName}
                  onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Business Type</label>
                <select 
                  className="w-full px-5 py-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all"
                  value={formData.businessType}
                  onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                >
                  <option>Sole Trader</option>
                  <option>LLC / Company</option>
                  <option>Artisan Collective</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold">Brand Story</h2>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Short Tagline</label>
                <input 
                  type="text" required
                  placeholder="The essence of your brand in 10 words..."
                  className="w-full px-5 py-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Your Artisan Journey</label>
                <textarea 
                  rows={4} required
                  placeholder="Share the craft and inspiration behind your work..."
                  className="w-full px-5 py-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.longDescription}
                  onChange={e => setFormData({ ...formData, longDescription: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            {step > 1 ? (
              <button 
                type="button" 
                onClick={() => setStep(step - 1)}
                className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
              >
                Back
              </button>
            ) : (
              <button 
                type="button" 
                onClick={onCancel}
                className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            )}
            <button 
              type="submit" 
              className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              {step === 3 ? 'Launch Store' : 'Next Step'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerOnboarding;