
import React from 'react';
import { User, View } from '../types';
import { CURRENT_CONFIG } from '../config';

interface NavbarProps {
  currentUser: User | null;
  cartCount: number;
  onNavigate: (view: View) => void;
  onLogin: (role: 'buyer' | 'seller') => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, cartCount, onNavigate, onLogin, onLogout }) => {
  const color = CURRENT_CONFIG.primaryColor;

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="text-2xl font-black text-slate-900 cursor-pointer flex items-center gap-2"
          onClick={() => onNavigate('home')}
        >
          <div className={`w-8 h-8 bg-${color}-600 rounded-lg flex items-center justify-center text-white text-sm`}>
            {CURRENT_CONFIG.logoText}
          </div>
          {CURRENT_CONFIG.brandName}<span className={`text-${color}-600`}>MARKET</span>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <button onClick={() => onNavigate('home')} className={`hover:text-${color}-600`}>Home</button>
          <button onClick={() => onNavigate('browse')} className={`hover:text-${color}-600`}>Browse</button>
          {currentUser?.role === 'seller' && (
            <button onClick={() => onNavigate('dashboard')} className={`hover:text-${color}-600`}>Seller Dashboard</button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => onNavigate('cart')}
            className={`relative p-2 text-slate-600 hover:text-${color}-600 transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className={`absolute top-0 right-0 bg-${color}-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white`}>
                {cartCount}
              </span>
            )}
          </button>

          {currentUser ? (
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none">{currentUser.storeName || currentUser.name}</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{currentUser.role}</p>
              </div>
              <img 
                src={currentUser.storeLogo || currentUser.avatar} 
                className="w-8 h-8 rounded-full border shadow-sm object-cover" 
                alt="User" 
              />
              <button 
                onClick={onLogout}
                className="text-sm font-semibold text-red-500 hover:text-red-600 ml-2"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <button 
                onClick={() => onLogin('buyer')}
                className="text-sm font-semibold px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => onLogin('seller')}
                className="text-sm font-semibold px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all"
              >
                Become a Seller
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
