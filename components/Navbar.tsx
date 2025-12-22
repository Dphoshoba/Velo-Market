
import React, { useRef, useState, useEffect } from 'react';
import { User, View } from '../types';

interface NavbarProps {
  currentUser: User | null;
  cartCount: number;
  onNavigate: (view: View) => void;
  onLogin: (role: 'buyer' | 'seller') => void;
  onLogout: () => void;
  onVisualSearch: (file: File) => void;
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 
  'Portuguese', 'Dutch', 'Russian', 'Chinese', 'Japanese', 
  'Korean', 'Arabic', 'Hindi', 'Bengali', 'Turkish', 
  'Vietnamese', 'Thai', 'Indonesian', 'Polish', 'Swedish', 
  'Norwegian', 'Danish', 'Finnish', 'Greek', 'Hebrew'
];

const Navbar: React.FC<NavbarProps> = ({ 
  currentUser, 
  cartCount, 
  onNavigate, 
  onLogin, 
  onLogout, 
  onVisualSearch,
  currentLanguage,
  onLanguageChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onVisualSearch(file);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div 
            className="text-2xl font-black text-slate-900 cursor-pointer flex items-center gap-2"
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-indigo-100">V</div>
            <span className="hidden sm:inline tracking-tighter">VELO<span className="text-indigo-600">MARKET</span></span>
          </div>
          
          <div className="hidden lg:flex items-center bg-slate-50 border rounded-2xl px-4 py-2 gap-3 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search creators..." className="bg-transparent border-none outline-none text-sm w-48 font-medium" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 hover:bg-white rounded-lg text-indigo-600 transition-colors"
              title="Visual Search with AI"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Global Language Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={`p-2.5 rounded-xl transition-all border flex items-center gap-2 ${isLangOpen ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">{currentLanguage.slice(0, 3)}</span>
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-[32px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 p-4 animate-fade-in grid grid-cols-2 gap-1 overflow-hidden">
                <div className="col-span-2 px-3 pt-2 pb-4 border-b border-slate-50 mb-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Language</p>
                </div>
                {LANGUAGES.map(lang => (
                  <button
                    key={lang}
                    onClick={() => {
                      onLanguageChange(lang);
                      setIsLangOpen(false);
                    }}
                    className={`text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${currentLanguage === lang ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => onNavigate('cart')} className="relative p-2.5 bg-slate-50 text-slate-600 hover:bg-white border rounded-xl transition-all border-slate-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white">{cartCount}</span>}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3 pl-3 border-l ml-1">
              <div className="text-right hidden md:block">
                <p className="text-xs font-black text-slate-900 leading-none">{currentUser.storeName || currentUser.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{currentUser.role}</p>
              </div>
              <img src={currentUser.storeLogo || currentUser.avatar} className="w-10 h-10 rounded-xl border border-slate-200 object-cover cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate(currentUser.role === 'seller' ? 'dashboard' : 'home')} alt="User" />
              <button onClick={onLogout} className="text-[9px] font-black text-red-400 hover:text-red-500 uppercase tracking-[0.2em] ml-2">Exit</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => onLogin('seller')} className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-indigo-600 px-4 py-2 hover:bg-indigo-50 rounded-xl transition-colors">Start Selling</button>
              <button onClick={() => onLogin('buyer')} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">Sign In</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
