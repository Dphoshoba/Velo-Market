
import React, { useState, useRef } from 'react';
import { User, Product, TrackingEntry } from '../types';
import { GeminiService } from '../services/gemini';

interface SellerDashboardProps {
  user: User;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onUpdateUser: (user: User) => void;
  onPreviewPolicy?: () => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ user, products, onAddProduct, onUpdateProduct, onUpdateUser, onPreviewPolicy }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'settings'>('inventory');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Shipped' | 'Delivered'>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    category: 'Home Decor',
    description: '',
    stock: 10,
    rating: 5
  });
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [localTracking, setLocalTracking] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Form State initialized with current user data
  const [profileForm, setProfileForm] = useState<User>({ ...user });

  const totalSales = products.length * 45; // Mock data
  const platformCutPercent = profileForm.commissionRate || 10;
  const platformCut = totalSales * (platformCutPercent / 100);
  const netEarnings = totalSales - platformCut;

  const filteredProducts = products.filter(p => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Active') return !p.status || p.status === 'Active';
    return p.status === statusFilter;
  });

  const handleEnhance = async () => {
    if (!newProduct.name) return alert('Please enter a product name first.');
    setIsEnhancing(true);
    const enhanced = await GeminiService.enhanceDescription(newProduct.name, newProduct.category);
    setNewProduct(prev => ({ ...prev, description: enhanced }));
    setIsEnhancing(false);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: 'p' + Date.now(),
      vendorId: user.id,
      vendorName: user.storeName || user.name,
      image: `https://picsum.photos/seed/${newProduct.name}/600/400`,
      reviewsCount: 0,
      status: 'Active',
      trackingHistory: [],
      ...newProduct
    };
    onAddProduct(product);
    setShowAddForm(false);
    setNewProduct({ name: '', price: 0, category: 'Home Decor', description: '', stock: 10, rating: 5 });
  };

  const handleMarkAsShipped = (product: Product) => {
    const tracking = localTracking[product.id] || product.trackingNumber || '';
    if (!tracking) {
      alert("Please provide a tracking number before marking as shipped.");
      return;
    }
    
    const newEntry: TrackingEntry = {
      number: tracking,
      date: new Date().toLocaleString()
    };

    const updatedProduct: Product = {
      ...product,
      status: 'Shipped',
      trackingNumber: tracking,
      trackingHistory: [...(product.trackingHistory || []), newEntry]
    };
    onUpdateProduct(updatedProduct);
    setLocalTracking(prev => ({ ...prev, [product.id]: '' }));
    alert(`${product.name} marked as shipped with tracking: ${tracking}`);
  };

  const handleMarkAsDelivered = (product: Product) => {
    const updatedProduct: Product = {
      ...product,
      status: 'Delivered'
    };
    onUpdateProduct(updatedProduct);
    alert(`${product.name} marked as delivered.`);
  };

  const handleTrackingChange = (productId: string, value: string) => {
    setLocalTracking(prev => ({ ...prev, [productId]: value }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(profileForm);
    alert('Store settings updated successfully!');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Logo must be smaller than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm(prev => ({
          ...prev,
          storeLogo: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'Shipped': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case 'Delivered': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-amber-600 bg-amber-50 border-amber-100';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Seller Dashboard</h1>
          <p className="text-slate-500">Managing <span className="text-indigo-600 font-bold">{user.storeName || user.name}</span></p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${activeTab === 'inventory' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Inventory
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Store Settings
          </button>
        </div>
      </div>

      {activeTab === 'inventory' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total Sales</p>
              <p className="text-3xl font-black text-slate-900">${totalSales.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Platform Fees ({platformCutPercent}%)</p>
              <p className="text-3xl font-black text-red-500">-${platformCut.toLocaleString()}</p>
            </div>
            <div className="bg-indigo-600 p-6 rounded-2xl border border-indigo-700 shadow-lg text-white">
              <p className="text-sm font-bold text-indigo-200 uppercase tracking-wider mb-1">Net Earnings</p>
              <p className="text-3xl font-black">${netEarnings.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {(['All', 'Active', 'Shipped', 'Delivered'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition-all text-sm flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Add Product
            </button>
          </div>

          {showAddForm && (
            <div className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-2xl animate-in slide-in-from-top duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">List a New Product</h2>
                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleAddProductSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Product Name</label>
                    <input 
                      type="text" required
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newProduct.name}
                      onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Price ($)</label>
                    <input 
                      type="number" required min="1"
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newProduct.price}
                      onChange={e => setNewProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Average Rating (1-5)</label>
                    <input 
                      type="number" required min="1" max="5" step="0.1"
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newProduct.rating}
                      onChange={e => setNewProduct(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                      value={newProduct.category}
                      onChange={e => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="Home Decor">Home Decor</option>
                      <option value="Kitchen">Kitchen</option>
                      <option value="Apparel">Apparel</option>
                      <option value="Art">Art</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Initial Stock</label>
                    <input 
                      type="number" required min="0"
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newProduct.stock}
                      onChange={e => setNewProduct(prev => ({ ...prev, stock: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-700">Description</label>
                    <button 
                      type="button"
                      onClick={handleEnhance}
                      disabled={isEnhancing}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 disabled:opacity-50"
                    >
                      {isEnhancing ? 'Writing...' : '✨ Enhance with AI'}
                    </button>
                  </div>
                  <textarea 
                    required rows={4}
                    className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newProduct.description}
                    onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all">
                  Publish Product
                </button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Fulfillment</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {filteredProducts.map(p => (
                    <React.Fragment key={p.id}>
                      <tr className="hover:bg-slate-50 group">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={p.image} className="w-10 h-10 rounded border object-cover" alt="" />
                          <span className="font-bold text-slate-700">{p.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(p.status)}`}>
                            {p.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{p.stock} units</td>
                        <td className="px-6 py-4 font-bold text-indigo-600">${p.price}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              {p.status !== 'Delivered' && (
                                <input 
                                  type="text" 
                                  placeholder="New Tracking #" 
                                  className="bg-transparent border-b border-slate-200 focus:border-indigo-500 outline-none px-1 py-0.5 text-xs w-32 transition-colors"
                                  value={localTracking[p.id] || ''}
                                  onChange={(e) => handleTrackingChange(p.id, e.target.value)}
                                />
                              )}
                              {p.trackingHistory && p.trackingHistory.length > 0 && (
                                <button 
                                  onClick={() => setExpandedHistory(expandedHistory === p.id ? null : p.id)}
                                  className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 uppercase flex items-center gap-1"
                                >
                                  History ({p.trackingHistory.length})
                                  <svg className={`w-3 h-3 transition-transform ${expandedHistory === p.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {p.status !== 'Delivered' && (
                              <>
                                <button 
                                  onClick={() => handleMarkAsShipped(p)}
                                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all"
                                >
                                  {p.status === 'Shipped' ? 'Update Tracking' : 'Mark as Shipped'}
                                </button>
                                <button 
                                  onClick={() => handleMarkAsDelivered(p)}
                                  className="text-xs font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-all"
                                >
                                  Mark as Delivered
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                      {expandedHistory === p.id && p.trackingHistory && (
                        <tr className="bg-slate-50/50">
                          <td colSpan={6} className="px-8 py-4">
                            <div className="space-y-2 border-l-2 border-indigo-200 pl-4">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Shipment History</h4>
                              {p.trackingHistory.map((entry, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                    <span className="font-mono text-slate-700">{entry.number}</span>
                                  </div>
                                  <span className="text-slate-400">{entry.date}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                        {statusFilter === 'All' ? 'No products listed yet.' : `No products currently in ${statusFilter} status.`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
          {/* Sidebar / Preview */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-indigo-50 mx-auto overflow-hidden bg-slate-100 flex items-center justify-center">
                  <img 
                    src={profileForm.storeLogo || profileForm.avatar || 'https://via.placeholder.com/150'} 
                    className="w-full h-full object-cover" 
                    alt="Store Logo" 
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full shadow-lg border border-white cursor-pointer hover:bg-indigo-700 text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{profileForm.storeName || 'New Store'}</h3>
              <p className="text-sm text-slate-500 mb-4">{profileForm.businessType || 'Artisan Vendor'}</p>
              <div className="flex justify-center gap-2">
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">Verified Seller</span>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                Marketplace Compliance
              </h4>
              <p className="text-sm text-slate-400 mb-4">Your business structure and contact information are required for automated payouts via Stripe.</p>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span>ID Verification</span>
                  <span className="text-green-400">Complete</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ID (ABN/VAT)</span>
                  <span className="text-green-400">Provided</span>
                </div>
                <div className="flex justify-between">
                  <span>Payout Schedule</span>
                  <span className="text-indigo-400">Weekly</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleProfileSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                    General Information
                  </h3>
                  <button 
                    type="button"
                    onClick={onPreviewPolicy}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    Preview Marketplace Policy
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Store Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={profileForm.storeName}
                      onChange={e => setProfileForm({ ...profileForm, storeName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Business Type</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                      value={profileForm.businessType}
                      onChange={e => setProfileForm({ ...profileForm, businessType: e.target.value })}
                    >
                      <option value="Sole Trader">Sole Trader</option>
                      <option value="Limited Company">Limited Company / LLC</option>
                      <option value="Non-Profit">Non-Profit / Charity</option>
                      <option value="Artisan Collective">Artisan Collective</option>
                    </select>
                  </div>
                </div>
                
                {/* Commission Setting Field */}
                <div className="mb-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                  <label className="block text-sm font-black text-slate-900 mb-2 uppercase tracking-tight">Platform Commission Rate (%)</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative">
                      <input 
                        type="number" 
                        min="0" max="50" step="1"
                        className="w-24 px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-indigo-600"
                        value={profileForm.commissionRate || 10}
                        onChange={e => setProfileForm({ ...profileForm, commissionRate: Number(e.target.value) })}
                      />
                      <span className="absolute right-3 top-3.5 text-slate-400 font-bold">%</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Adjust your contribution to the platform infrastructure. This rate is reflected in your <strong>Marketplace Policy</strong> document and impacts your net payouts automatically at checkout.
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tagline / Short Bio</label>
                  <input 
                    type="text"
                    placeholder="Briefly summarize your brand..."
                    className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={profileForm.bio || ''}
                    onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Detailed Store Story (Rich Text Support)</label>
                  <div className="border rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                    <div className="bg-slate-50 border-b px-4 py-2 flex items-center justify-between">
                      <div className="flex gap-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Story Editor</span>
                        <div className="flex gap-3 items-center border-l pl-4">
                          <button type="button" className="text-xs font-bold text-slate-600 hover:text-indigo-600 p-1 rounded hover:bg-white transition-colors">B</button>
                          <button type="button" className="text-xs italic font-serif text-slate-600 hover:text-indigo-600 p-1 rounded hover:bg-white transition-colors">I</button>
                          <button type="button" className="text-xs font-bold text-slate-600 hover:text-indigo-600 p-1 rounded hover:bg-white transition-colors flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                            List
                          </button>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 pr-4">Characters: {profileForm.longDescription?.length || 0}</span>
                    </div>
                    <textarea 
                      rows={8}
                      placeholder="Share your detailed artisanal journey, process, and brand values..."
                      className="w-full px-4 py-4 outline-none resize-none min-h-[250px] leading-relaxed font-serif"
                      value={profileForm.longDescription || ''}
                      onChange={e => setProfileForm({ ...profileForm, longDescription: e.target.value })}
                    />
                  </div>
                  <p className="mt-2 text-[10px] text-slate-400">This story is featured prominently on your public profile right below the header.</p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                  Shipping & Delivery
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Estimated Delivery Time</label>
                    <input 
                      type="text" 
                      placeholder="e.g., 3-5 business days"
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={profileForm.estimatedDelivery || ''}
                      onChange={e => setProfileForm({ ...profileForm, estimatedDelivery: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Shipping Policy</label>
                    <textarea 
                      rows={4}
                      placeholder="Explain your shipping methods, international options, and return terms..."
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={profileForm.shippingPolicy || ''}
                      onChange={e => setProfileForm({ ...profileForm, shippingPolicy: e.target.value })}
                    />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                  Contact & Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Business Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={profileForm.email}
                      onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Contact Phone</label>
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={profileForm.contactPhone || ''}
                      onChange={e => setProfileForm({ ...profileForm, contactPhone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Business Address</label>
                  <textarea 
                    rows={2}
                    placeholder="Physical location for shipping returns..."
                    className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={profileForm.businessAddress || ''}
                    onChange={e => setProfileForm({ ...profileForm, businessAddress: e.target.value })}
                  />
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                  Social & Brand
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Instagram Handle</label>
                    <div className="flex">
                      <span className="bg-slate-100 border border-r-0 px-3 py-3 rounded-l-xl text-slate-500">@</span>
                      <input 
                        type="text" 
                        placeholder="yourhandle"
                        className="w-full px-4 py-3 rounded-r-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={profileForm.socialLinks?.instagram || ''}
                        onChange={e => setProfileForm({ 
                          ...profileForm, 
                          socialLinks: { ...(profileForm.socialLinks || {}), instagram: e.target.value } 
                        })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Facebook Handle</label>
                    <div className="flex">
                      <span className="bg-slate-100 border border-r-0 px-3 py-3 rounded-l-xl text-slate-500">fb/</span>
                      <input 
                        type="text" 
                        placeholder="yourpage"
                        className="w-full px-4 py-3 rounded-r-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={profileForm.socialLinks?.facebook || ''}
                        onChange={e => setProfileForm({ 
                          ...profileForm, 
                          socialLinks: { ...(profileForm.socialLinks || {}), facebook: e.target.value } 
                        })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">LinkedIn Profile URL</label>
                    <input 
                      type="url" 
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={profileForm.socialLinks?.linkedin || ''}
                      onChange={e => setProfileForm({ 
                        ...profileForm, 
                        socialLinks: { ...(profileForm.socialLinks || {}), linkedin: e.target.value } 
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Portfolio/Website</label>
                    <input 
                      type="url" 
                      placeholder="https://yourwebsite.com"
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={profileForm.socialLinks?.website || ''}
                      onChange={e => setProfileForm({ 
                        ...profileForm, 
                        socialLinks: { ...(profileForm.socialLinks || {}), website: e.target.value } 
                      })}
                    />
                  </div>
                </div>
              </section>

              <div className="pt-8 border-t flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setProfileForm({ ...user })}
                  className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50"
                >
                  Reset
                </button>
                <button 
                  type="submit" 
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Save Store Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
