import React from 'react';
import { View } from '../types';
import { StorageService } from '../services/storage';

interface FooterProps {
  onNavigate: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLinkClick = (e: React.MouseEvent, view: View) => {
    e.preventDefault();
    onNavigate(view);
  };

  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div 
              className="text-2xl font-black mb-6 cursor-pointer" 
              onClick={() => onNavigate('home')}
            >
              VELO<span className="text-indigo-400">MARKET</span>
            </div>
            <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
              The premium destination for artisanal craft. We empower creators worldwide to share their talent and help buyers find one-of-a-kind treasures.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-indigo-600 cursor-pointer transition-colors text-sm font-bold">In</div>
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-indigo-600 cursor-pointer transition-colors text-sm font-bold">X</div>
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-indigo-600 cursor-pointer transition-colors text-sm font-bold">Ig</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-indigo-300 text-xs uppercase tracking-[0.2em]">Marketplace</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li><button onClick={() => onNavigate('browse')} className="hover:text-white transition-colors">Shop All</button></li>
              <li><button onClick={() => onNavigate('manual')} className="hover:text-indigo-400 transition-colors">Platform Manual</button></li>
              <li><button onClick={() => onNavigate('seller-onboarding' as View)} className="hover:text-white transition-colors">Seller Onboarding</button></li>
              <li><button onClick={() => StorageService.resetDemo()} className="text-slate-600 hover:text-red-400 transition-colors flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Reset Demo Environment
              </button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-indigo-300 text-xs uppercase tracking-[0.2em]">Compliance</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li><button onClick={(e) => handleLinkClick(e, 'policies')} className="hover:text-white transition-colors">Shipping & Returns</button></li>
              <li><button onClick={(e) => handleLinkClick(e, 'policies')} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={(e) => handleLinkClick(e, 'policies')} className="hover:text-white transition-colors">Terms of Service</button></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium tracking-tight">
          <p>© 2024 VeloMarket Inc. Built with Velo Performance Engine.</p>
          <div className="flex gap-8">
            <button onClick={(e) => handleLinkClick(e, 'policies')} className="hover:text-white">Marketplace Policy v1.2</button>
            <span className="text-slate-700">|</span>
            <span>Design: Artisan Studio</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;