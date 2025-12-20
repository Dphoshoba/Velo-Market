
import React from 'react';
import { View } from '../types';

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
            <p className="text-slate-400 max-w-sm mb-6">
              The premium destination for artisanal craft. We empower creators worldwide to share their talent and help buyers find one-of-a-kind treasures.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-indigo-600 cursor-pointer transition-colors">f</div>
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-indigo-600 cursor-pointer transition-colors">t</div>
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-indigo-600 cursor-pointer transition-colors">i</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Marketplace</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><button onClick={() => onNavigate('browse')} className="hover:text-white">Shop All</button></li>
              <li><button onClick={() => onNavigate('browse')} className="hover:text-white">New Arrivals</button></li>
              <li><button onClick={() => onNavigate('manual')} className="hover:text-white font-bold text-indigo-400">User Guide</button></li>
              <li><button onClick={() => onNavigate('seller-onboarding' as View)} className="hover:text-white">Sell on Velo</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><button onClick={(e) => handleLinkClick(e, 'policies')} className="hover:text-white">Shipping Policy</button></li>
              <li><button onClick={(e) => handleLinkClick(e, 'policies')} className="hover:text-white">Returns & Refund</button></li>
              <li><button onClick={(e) => handleLinkClick(e, 'policies')} className="hover:text-white">Privacy Policy</button></li>
              <li><button onClick={(e) => handleLinkClick(e, 'policies')} className="hover:text-white">Terms of Service</button></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
          <p>© 2024 VeloMarket Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <button onClick={(e) => handleLinkClick(e, 'policies')} className="hover:text-white">Marketplace Policy v1.2</button>
            <span>Made with 🤍 for creators</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
