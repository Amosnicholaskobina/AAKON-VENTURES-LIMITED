import { useState } from 'react';
import { ShoppingCart, Plus, Filter, Trash2 } from 'lucide-react';
import { Card } from '../components/ui';
import { cn } from '../utils/cn';
import { getSales, getCustomers, addSale, deleteSale, getSettings } from '../data/store';

export function SalesPage({ onDataChange }: { onDataChange: () => void }) {
  const [sales, setSales] = useState(getSales());
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'partial'>('all');
  const [showForm, setShowForm] = useState(false);
  const customers = getCustomers();
  const settings = getSettings();
  const [form, setForm] = useState({ customer_id: '', quantity: '', method: 'Mobile Money', status: 'paid' as 'paid' | 'pending' | 'partial' });

  const reload = () => { setSales(getSales()); onDataChange(); };
  const filtered = sales.filter((s) => filter === 'all' || s.payment_status === filter);
  const totalAmount = filtered.reduce((sum, s) => sum + s.total_amount, 0);

  const handleAdd = () => {
    const cust = customers.find(c => c.id === form.customer_id);
    if (!cust || !form.quantity) return;
    const qty = parseInt(form.quantity);
    addSale({ customer_id: cust.id, customer_name: cust.name, quantity: qty, total_amount: qty * settings.pricePerBag, payment_status: form.status, payment_method: form.method });
    setForm({ customer_id: '', quantity: '', method: 'Mobile Money', status: 'paid' });
    setShowForm(false);
    reload();
  };

  const handleDelete = (id: string) => { if (confirm('Delete this sale?')) { deleteSale(id); reload(); } };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h2 className="text-2xl font-bold text-slate-900">Sales</h2><p className="text-sm text-slate-500">Record and track all water sales</p></div>
        <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:shadow-lg transition">
          {showForm ? 'Cancel' : <><ShoppingCart className="w-4 h-4" /> Record Sale</>}
        </button>
      </div>

      {showForm && (
        <Card title="New Sale" subtitle="Record a water sale">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Customer *</label>
              <select value={form.customer_id} onChange={e => setForm({ ...form, customer_id: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-sky-500 outline-none text-sm">
                <option value="">Select customer...</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Quantity (bags) *</label>
              <input type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder="0" className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Price per bag: GHS {settings.pricePerBag}</label>
              <p className="text-lg font-bold text-emerald-600">Total: GHS {(parseInt(form.quantity) || 0) * settings.pricePerBag}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Payment Method</label>
              <select value={form.method} onChange={e => setForm({ ...form, method: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm">
                <option>Mobile Money</option><option>Cash</option><option>Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Payment Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'paid' | 'pending' | 'partial' })} className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm">
                <option value="paid">Paid</option><option value="pending">Pending</option><option value="partial">Partial</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={handleAdd} disabled={!form.customer_id || !form.quantity} className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center gap-2 disabled:opacity-50">
              <Plus className="w-4 h-4" /> Save & Generate Receipt
            </button>
          </div>
        </Card>
      )}

      <Card title={`${filtered.length} Sales`} subtitle={`Total: GHS ${totalAmount.toLocaleString()}`}>
        <div className="flex items-center gap-2 mb-4 overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          {(['all', 'paid', 'pending', 'partial'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={cn('px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition', filter === f ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}>{f}</button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No sales recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left border-b border-slate-200">
                <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Customer</th><th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Qty</th>
                <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Amount</th><th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Method</th>
                <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Status</th><th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Date</th><th className="pb-3"></th>
              </tr></thead>
              <tbody>
                {filtered.map((sale) => (
                  <tr key={sale.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 font-medium text-slate-900">{sale.customer_name}</td>
                    <td className="py-3 text-slate-600">{sale.quantity} bags</td>
                    <td className="py-3 font-semibold text-slate-900">GHS {sale.total_amount}</td>
                    <td className="py-3 text-slate-600">{sale.payment_method}</td>
                    <td className="py-3"><span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full capitalize', sale.payment_status === 'paid' && 'bg-emerald-100 text-emerald-700', sale.payment_status === 'pending' && 'bg-amber-100 text-amber-700', sale.payment_status === 'partial' && 'bg-blue-100 text-blue-700')}>{sale.payment_status}</span></td>
                    <td className="py-3 text-slate-500 text-xs">{sale.created_at}</td>
                    <td className="py-3"><button onClick={() => handleDelete(sale.id)} className="p-1 hover:bg-red-100 rounded text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
