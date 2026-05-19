import { useState } from 'react';
import {
  ShoppingCart,
  CreditCard,
  Search,
  Printer,
  MessageCircle,
  Mail,
  UserPlus,
  FileText,
} from 'lucide-react';
import { Card } from '../components/ui';
import { customers } from '../data/mockData';
import { cn } from '../utils/cn';

export function CashierDashboard({ onDataChange: _onDataChange }: { onDataChange?: () => void }) {
  const [quickSale, setQuickSale] = useState({ customer: '', quantity: '', method: 'Mobile Money' });
  const [showReceipt, setShowReceipt] = useState(false);

  const handleQuickSale = () => {
    setShowReceipt(true);
  };

  return (
    <div className="space-y-6">
      {/* Quick Sale Form */}
      <Card title="Quick Sale" subtitle="Process a new transaction">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label className="text-xs font-semibold text-slate-700 block mb-1">Customer</label>
            <select
              value={quickSale.customer}
              onChange={(e) => setQuickSale({ ...quickSale, customer: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
            >
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="text-xs font-semibold text-slate-700 block mb-1">Quantity (bags)</label>
            <input
              type="number"
              value={quickSale.quantity}
              onChange={(e) => setQuickSale({ ...quickSale, quantity: e.target.value })}
              placeholder="0"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
            />
          </div>
          <div className="md:col-span-1">
            <label className="text-xs font-semibold text-slate-700 block mb-1">Payment Method</label>
            <select
              value={quickSale.method}
              onChange={(e) => setQuickSale({ ...quickSale, method: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
            >
              <option>Mobile Money</option>
              <option>Cash</option>
              <option>Bank Transfer</option>
            </select>
          </div>
          <div className="md:col-span-1 flex items-end">
            <button
              onClick={handleQuickSale}
              className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-rose-500/30 transition flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" /> Process Sale
            </button>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-semibold transition">
            <UserPlus className="w-4 h-4" /> New Customer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-semibold transition">
            <Search className="w-4 h-4" /> Lookup Order
          </button>
        </div>
      </Card>

      {/* Today's Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl text-white">
          <p className="text-emerald-100 text-xs">Sales Today</p>
          <p className="text-2xl font-bold mt-1">GHS 350</p>
          <p className="text-xs text-emerald-100 mt-1">+12.5% vs yesterday</p>
        </div>
        <div className="bg-gradient-to-br from-sky-500 to-cyan-600 p-4 rounded-2xl text-white">
          <p className="text-sky-100 text-xs">Transactions</p>
          <p className="text-2xl font-bold mt-1">8</p>
          <p className="text-xs text-sky-100 mt-1">Completed</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-4 rounded-2xl text-white">
          <p className="text-violet-100 text-xs">Avg. Sale</p>
          <p className="text-2xl font-bold mt-1">GHS 44</p>
          <p className="text-xs text-violet-100 mt-1">Per transaction</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-2xl text-white">
          <p className="text-amber-100 text-xs">Receipts</p>
          <p className="text-2xl font-bold mt-1">8</p>
          <p className="text-xs text-amber-100 mt-1">Generated</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Recent Transactions" subtitle="Today's sales">
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Customer {i}</p>
                    <p className="text-xs text-slate-500">10 bags • Mobile Money</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600">GHS 100</p>
                  <p className="text-xs text-slate-500">10:{30 + i * 5}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Quick Actions" subtitle="Common tasks">
          <div className="grid grid-cols-2 gap-3">
            <ActionButton icon={FileText} label="View Receipts" color="sky" />
            <ActionButton icon={Printer} label="Print Receipt" color="emerald" />
            <ActionButton icon={MessageCircle} label="WhatsApp" color="green" />
            <ActionButton icon={Mail} label="Email Receipt" color="indigo" />
            <ActionButton icon={Search} label="Search Order" color="amber" />
            <ActionButton icon={UserPlus} label="Add Customer" color="purple" />
          </div>
        </Card>
      </div>

      {/* Receipt Preview Modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">Receipt Generated</h3>
              <button onClick={() => setShowReceipt(false)} className="p-1 hover:bg-slate-100 rounded">✕</button>
            </div>
            <div className="p-6 font-mono text-sm">
              <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4">
                <p className="text-lg font-bold text-rose-700">💧 AQUAFLOW</p>
                <p className="text-xs text-slate-500 mt-1">Sales Receipt</p>
              </div>
              <div className="space-y-1">
                <p><strong>Receipt No:</strong> BW-{Math.floor(Math.random() * 1000) + 1000}</p>
                <p><strong>Customer:</strong> {quickSale.customer || 'Walk-in'}</p>
                <p><strong>Quantity:</strong> {quickSale.quantity || 10} bags</p>
                <p><strong>Amount:</strong> GHS {(parseInt(quickSale.quantity) || 10) * 10}</p>
                <p><strong>Payment:</strong> {quickSale.method}</p>
                <p className="pt-2 font-bold">Status: PAID ✓</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 p-4 border-t border-slate-200">
              <button className="flex items-center justify-center gap-2 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-semibold">
                <Printer className="w-4 h-4" /> Print
              </button>
              <button className="flex items-center justify-center gap-2 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({ icon: Icon, label, color }: { icon: React.ComponentType<{ className?: string }>; label: string; color: string }) {
  return (
    <button className={cn(
      'p-4 rounded-xl border-2 transition flex flex-col items-center gap-2 hover:shadow-md',
      `border-${color}-200 bg-${color}-50 hover:border-${color}-300`
    )}>
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', `bg-${color}-100`)}>
        <Icon className={cn('w-5 h-5', `text-${color}-600`)} />
      </div>
      <span className="text-xs font-semibold text-slate-700">{label}</span>
    </button>
  );
}
