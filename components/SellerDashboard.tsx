
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { User, Product, TrackingEntry, Order } from '../types';
import { GeminiService, AIDescriptionOption } from '../services/gemini';
import { ApiService } from '../services/api';

interface SellerDashboardProps {
  user: User;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onUpdateUser: (user: User) => void;
  onPreviewPolicy?: () => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ user, products, onAddProduct, onUpdateProduct, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'payouts' | 'performance' | 'settings'>('inventory');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Shipped' | 'Delivered'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    category: 'Home Decor',
    description: '',
    stock: 10,
    rating: 5,
    image: ''
  });
  
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [aiOptions, setAiOptions] = useState<AIDescriptionOption[] | null>(null);
  const [localTracking, setLocalTracking] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileForm, setProfileForm] = useState<User>({ ...user });

  useEffect(() => {
    const fetchOrders = async () => {
      const allOrders = await ApiService.getOrders();
      setOrders(allOrders.filter(o => !!o.vendorBreakdown[user.id]));
    };
    fetchOrders();
  }, [user.id, activeTab]);

  const filteredAndSortedProducts = useMemo(() => {
    return products.filter(p => {
      const matchesStatus = statusFilter === 'All' 
        ? true 
        : statusFilter === 'Active' 
          ? (!p.status || p.status === 'Active') 
          : p.status === statusFilter;
      
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [products, statusFilter, searchQuery]);

  const financialSummary = useMemo(() => {
    let pending = 0;
    let completed = 0;
    
    const payoutLedger = orders.map(order => {
      const breakdown = order.vendorBreakdown[user.id];
      const isCompleted = order.status === 'delivered';
      if (isCompleted) completed += breakdown.payout;
      else pending += breakdown.payout;

      return {
        id: order.id,
        date: order.createdAt,
        amount: breakdown.payout,
        status: isCompleted ? 'Cleared' : 'Pending',
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { pending, completed, payoutLedger };
  }, [orders, user.id]);

  const performanceStats = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const chartData = last7Days.map(date => {
      const dayOrders = orders.filter(o => o.createdAt.startsWith(date));
      const revenue = dayOrders.reduce((acc, o) => acc + o.vendorBreakdown[user.id].payout, 0);
      return { date, revenue };
    });

    const totalSalesCount = orders.length;
    const avgOrderValue = totalSalesCount > 0 ? (financialSummary.completed + financialSummary.pending) / totalSalesCount : 0;

    return { chartData, totalSalesCount, avgOrderValue };
  }, [orders, user.id, financialSummary]);

  const handleWithdrawRequest = async () => {
    if (financialSummary.completed <= 0) return;
    setIsWithdrawing(true);
    await ApiService.getOrders(); // Simulate network
    setIsWithdrawing(false);
    alert(`Withdrawal request for $${financialSummary.completed.toFixed(2)} submitted.`);
  };

  const handleAiCopyGen = async () => {
    if (!newProduct.name) return alert('Enter a product name.');
    setIsEnhancing(true);
    const options = await GeminiService.generateDescriptionOptions(newProduct.name, newProduct.category);
    setAiOptions(options);
    setIsEnhancing(false);
  };

  const handleAiImageGen = async () => {
    if (!newProduct.name) return alert('Enter a product name.');
    setIsGeneratingImage(true);
    const imageData = await GeminiService.generateProductImage(newProduct.name, newProduct.category);
    if (imageData) setNewProduct(prev => ({ ...prev, image: imageData }));
    setIsGeneratingImage(false);
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading(true);
    const product: Product = {
      id: 'p' + Date.now(),
      vendorId: user.id,
      vendorName: user.storeName || user.name,
      image: newProduct.image || `https://picsum.photos/seed/${newProduct.name}/600/400`,
      reviewsCount: 0,
      status: 'Active',
      trackingHistory: [],
      ...newProduct
    };
    await onAddProduct(product);
    setShowAddForm(false);
    setNewProduct({ name: '', price: 0, category: 'Home Decor', description: '', stock: 10, rating: 5, image: '' });
    setIsActionLoading(false);
  };

  const handleMarkAsShipped = async (product: Product) => {
    const tracking = localTracking[product.id] || '';
    if (!tracking) return alert("Tracking # required.");
    setIsActionLoading(true);
    const updated: Product = {
      ...product,
      status: 'Shipped',
      trackingNumber: tracking,
      trackingHistory: [...(product.trackingHistory || []), { number: tracking, date: new Date().toLocaleString() }]
    };
    await onUpdateProduct(updated);
    setLocalTracking(prev => ({ ...prev, [product.id]: '' }));
    setIsActionLoading(false);
  };

  const handleMarkAsDelivered = async (product: Product) => {
    setIsActionLoading(true);
    await onUpdateProduct({ ...product, status: 'Delivered' });
    setIsActionLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-slate-600 bg-slate-100 border-slate-200';
      case 'Shipped': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case 'Delivered':
      case 'Cleared': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Pending': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Dashboard</h1>
          <p className="text-slate-500 font-medium">Managing <span className="text-indigo-600 font-bold">{user.storeName || user.name}</span></p>
        </div>
        <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl">
          {(['inventory', 'performance', 'payouts', 'settings'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl font-black transition-all text-xs uppercase tracking-widest ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'performance' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Sales</p>
                <p className="text-3xl font-black text-slate-900">{performanceStats.totalSalesCount}</p>
             </div>
             <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Order Value</p>
                <p className="text-3xl font-black text-indigo-600">${performanceStats.avgOrderValue.toFixed(2)}</p>
             </div>
             <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Net Earnings</p>
                <p className="text-3xl font-black text-emerald-600">${(financialSummary.completed + financialSummary.pending).toLocaleString()}</p>
             </div>
             <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-200">
                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Conversion Rate</p>
                <p className="text-3xl font-black">4.8%</p>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
             <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
               <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
               7-Day Revenue Trend
             </h3>
             <div className="h-64 w-full flex items-end justify-between gap-4">
               {performanceStats.chartData.map((day, i) => {
                 const maxRev = Math.max(...performanceStats.chartData.map(d => d.revenue), 1);
                 const height = (day.revenue / maxRev) * 100;
                 return (
                   <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                      <div className="w-full relative bg-slate-50 rounded-xl overflow-hidden h-full flex items-end">
                        <div className="w-full bg-indigo-500 rounded-t-lg transition-all" style={{ height: `${height}%` }}></div>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase">
                        {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                      </span>
                   </div>
                 );
               })}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200">
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <input 
                type="text" placeholder="Search my catalog..."
                className="pl-4 pr-4 py-2 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button onClick={() => setShowAddForm(true)} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest">+ New Product</button>
          </div>

          {showAddForm && (
            <div className="p-8 rounded-3xl border border-indigo-100 bg-indigo-50/30 animate-in slide-in-from-top duration-300 relative">
              {isActionLoading && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center rounded-3xl"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>}
              <form onSubmit={handleAddProductSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="aspect-square bg-white rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center relative overflow-hidden">
                     {newProduct.image ? <img src={newProduct.image} className="w-full h-full object-cover" /> : (
                       <button type="button" onClick={handleAiImageGen} disabled={isGeneratingImage} className="text-indigo-600 font-bold text-xs uppercase">
                         {isGeneratingImage ? 'Painting...' : '✨ Gen AI Image'}
                       </button>
                     )}
                  </div>
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input type="text" placeholder="Name" required className="p-3 rounded-xl border" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                     <input type="number" placeholder="Price" required className="p-3 rounded-xl border" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                     <textarea placeholder="Product Story" required rows={3} className="md:col-span-2 p-3 rounded-xl border" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                     <button type="button" onClick={handleAiCopyGen} className="text-xs font-bold text-indigo-600 uppercase">✨ Suggest Story</button>
                     <button type="submit" className="md:col-span-2 bg-indigo-600 text-white py-3 rounded-xl font-bold">Publish Item</button>
                  </div>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Fulfillment</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {filteredAndSortedProducts.map(p => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 font-bold">{p.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(p.status || 'Active')}`}>{p.status || 'Active'}</span>
                    </td>
                    <td className="px-6 py-4">
                      {p.status !== 'Delivered' && (
                        <input 
                          type="text" placeholder="Track #" className="bg-transparent border-b text-xs w-24 outline-none"
                          value={localTracking[p.id] || ''}
                          onChange={(e) => setLocalTracking({...localTracking, [p.id]: e.target.value})}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      {p.status === 'Active' && <button onClick={() => handleMarkAsShipped(p)} className="text-[10px] font-black text-indigo-600 uppercase">Ship</button>}
                      {p.status === 'Shipped' && <button onClick={() => handleMarkAsDelivered(p)} className="text-[10px] font-black text-emerald-600 uppercase">Deliver</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'payouts' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Available Funds</p>
              <p className="text-3xl font-black text-emerald-600">${financialSummary.completed.toFixed(2)}</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-3xl text-white">
              <button onClick={handleWithdrawRequest} disabled={financialSummary.completed <= 0 || isWithdrawing} className="w-full bg-indigo-600 py-3 rounded-xl font-bold text-sm">
                {isWithdrawing ? 'Processing...' : 'Transfer to Bank'}
              </button>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
             <table className="w-full text-left">
               <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400"><tr className="border-b"><th className="px-8 py-4">Order</th><th className="px-8 py-4">Payout</th><th className="px-8 py-4">Status</th></tr></thead>
               <tbody className="divide-y text-sm">
                 {financialSummary.payoutLedger.map((tx, i) => (
                   <tr key={i}><td className="px-8 py-4 font-mono text-xs">{tx.id}</td><td className="px-8 py-4 font-bold">${tx.amount.toFixed(2)}</td><td className="px-8 py-4"><span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${getStatusColor(tx.status)}`}>{tx.status}</span></td></tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <form onSubmit={(e) => {e.preventDefault(); onUpdateUser(profileForm);}} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase">Store Name</label>
                 <input className="w-full p-3 rounded-xl border bg-slate-50" value={profileForm.storeName} onChange={e => setProfileForm({...profileForm, storeName: e.target.value})} />
              </div>
              <div className="md:col-span-2 space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase">Artisan Bio</label>
                 <textarea rows={4} className="w-full p-3 rounded-xl border bg-slate-50" value={profileForm.longDescription} onChange={e => setProfileForm({...profileForm, longDescription: e.target.value})} />
              </div>
           </div>
           <div className="flex justify-end pt-8"><button type="submit" className="bg-slate-900 text-white px-10 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl">Update Brand</button></div>
        </form>
      )}
    </div>
  );
};

export default SellerDashboard;
