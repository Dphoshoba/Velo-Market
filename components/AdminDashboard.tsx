
import React, { useMemo } from 'react';
import { Product } from '../types';

interface AdminDashboardProps {
  products: Product[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products }) => {
  const stats = useMemo(() => {
    const totalVolume = products.length * 450; // Mock historical volume
    const platformCommissionTotal = totalVolume * 0.10; // 10% average
    const uniqueVendors = new Set(products.map(p => p.vendorId)).size;
    const avgOrderValue = 185;
    
    return {
      totalVolume,
      platformCommissionTotal,
      uniqueVendors,
      avgOrderValue,
      totalListings: products.length
    };
  }, [products]);

  return (
    <div className="space-y-12 animate-fade-in py-8 pb-40">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Marketplace Orchestrator</h1>
          <p className="text-slate-500 font-medium">Enterprise oversight for the global artisan network.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-emerald-50 text-emerald-600 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Network Health: Stable
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[40px] border shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Network Volume</p>
          <h2 className="text-3xl font-black text-slate-900">${stats.totalVolume.toLocaleString()}</h2>
        </div>
        <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">Platform Revenue (10%)</p>
          <h2 className="text-3xl font-black">${stats.platformCommissionTotal.toLocaleString()}</h2>
        </div>
        <div className="bg-white p-8 rounded-[40px] border shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Active Artisans</p>
          <h2 className="text-3xl font-black text-slate-900">{stats.uniqueVendors}</h2>
        </div>
        <div className="bg-white p-8 rounded-[40px] border shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Authentications</p>
          <h2 className="text-3xl font-black text-slate-900">{stats.totalListings}</h2>
        </div>
      </div>

      {/* Global Pulse Visualization */}
      <div className="bg-slate-900 rounded-[48px] p-12 text-white overflow-hidden relative min-h-[400px]">
         <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor">
               <path d="M100 250 Q 250 100 400 250 T 700 250 T 900 250" strokeWidth="1" />
               <path d="M100 350 Q 300 450 500 350 T 900 350" strokeWidth="1" opacity="0.5" />
               <circle cx="200" cy="150" r="3" fill="white" />
               <circle cx="450" cy="380" r="3" fill="white" />
               <circle cx="780" cy="120" r="3" fill="white" />
            </svg>
         </div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between h-full items-start gap-12">
            <div className="max-w-md space-y-6">
               <h3 className="text-4xl font-black tracking-tighter leading-[0.9]">Global <br/><span className="text-indigo-400">Transaction Flux.</span></h3>
               <p className="text-slate-400 font-medium">Monitoring real-time liquidity across 42 logistical nodes. Our automated split-payout system is currently managing cross-border clearances in Zurich, Tokyo, and New York.</p>
               <div className="flex gap-10 pt-4">
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Active Payouts</p>
                     <p className="text-2xl font-black">99.8%</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Node Sync</p>
                     <p className="text-2xl font-black">Stable</p>
                  </div>
               </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 w-full md:w-80">
               <h4 className="text-[10px] font-black uppercase tracking-widest mb-6">Recent Platform Fees</h4>
               <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                     <div key={i} className="flex justify-between items-center opacity-60">
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                           <span className="text-xs font-bold">Node #0{i}</span>
                        </div>
                        <span className="text-xs font-black text-indigo-300">+$24.50</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 bg-white p-12 rounded-[48px] border shadow-sm space-y-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Artisan Performance Ledger</h3>
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead className="border-b">
                     <tr className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        <th className="px-4 py-4 text-left">Vendor</th>
                        <th className="px-4 py-4 text-left">Category</th>
                        <th className="px-4 py-4 text-left">Commission Rate</th>
                        <th className="px-4 py-4 text-right">Activity Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {Array.from(new Set(products.map(p => p.vendorId))).map(vId => {
                        const p = products.find(x => x.vendorId === vId)!;
                        return (
                           <tr key={vId} className="group hover:bg-slate-50 transition-all">
                              <td className="px-4 py-5 flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-[10px]">{p.vendorName.charAt(0)}</div>
                                 <span className="font-bold text-slate-900">{p.vendorName}</span>
                              </td>
                              <td className="px-4 py-5 text-sm text-slate-500">{p.category}</td>
                              <td className="px-4 py-5 font-black text-indigo-600">{p.commissionRate || 10}%</td>
                              <td className="px-4 py-5 text-right">
                                 <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">Active Payouts</span>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="bg-slate-900 p-12 rounded-[48px] text-white shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
               <h3 className="text-2xl font-black tracking-tighter leading-tight">Systemic Audit</h3>
               <p className="text-slate-400 font-medium">All financial gateways are encrypted. Stripe Connect is processing split-payouts for {stats.uniqueVendors} active entities.</p>
               <div className="space-y-4 pt-6">
                  <div className="flex justify-between items-center text-xs">
                     <span className="font-bold text-slate-500">API Latency</span>
                     <span className="text-emerald-400 font-black">24ms</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                     <span className="font-bold text-slate-500">Payout Integrity</span>
                     <span className="text-emerald-400 font-black">99.9%</span>
                  </div>
               </div>
            </div>
            <button className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] mt-12">Export Financial Report</button>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
