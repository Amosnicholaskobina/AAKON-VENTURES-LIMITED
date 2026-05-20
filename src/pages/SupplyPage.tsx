import { useState } from 'react';
import { Card } from '../components/ui';
import { Truck, Plus, Clock, CheckCircle2, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { getSupplyCheckIns, addSupplyCheckIn, deleteSupplyCheckIn, updateSupplyStatus } from '../data/store';

export function SupplyPage({ onDataChange }: { onDataChange: () => void }) {
  // getSupplyCheckIns exists in store.ts, checking why it failed lint... 
  // Wait, I see I didn't export it with that name in the last create_file. 
  // Let me re-verify store exports.
  const [supply, setSupply] = useState(getSupplyCheckIns());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ supplier_name: '', quantity_supplied: '', payment_reference: '', status: 'pending' as 'delivered' | 'in-transit' | 'pending' });

  const reload = () => { setSupply(getSupplyCheckIns()); onDataChange(); };

  const handleAdd = () => {
    if (!form.supplier_name || !form.quantity_supplied) return;
    addSupplyCheckIn({ supplier_name: form.supplier_name, quantity_supplied: parseInt(form.quantity_supplied), payment_reference: form.payment_reference || `SUP-${Date.now().toString(36).toUpperCase()}`, checkin_time: new Date().toISOString().slice(0, 16).replace('T', ' '), status: form.status });
    setForm({ supplier_name: '', quantity_supplied: '', payment_reference: '', status: 'pending' });
    setShowForm(false);
    reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h2 className="text-2xl font-bold text-slate-900">Supply Check-In</h2><p className="text-sm text-slate-500">Track supplier deliveries and check-ins</p></div>
        <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:shadow-lg transition">
          {showForm ? 'Cancel' : <><Truck className="w-4 h-4" /> New Check-In</>}
        </button>
      </div>

      {showForm && (
        <Card title="Record Supply Check-In" subtitle="Log a new delivery">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-xs font-semibold text-slate-700 block mb-1">Supplier Name *</label><input value={form.supplier_name} onChange={e => setForm({ ...form, supplier_name: e.target.value })} placeholder="e.g. AquaSource Ltd" className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm" /></div>
            <div><label className="text-xs font-semibold text-slate-700 block mb-1">Quantity Supplied *</label><input type="number" value={form.quantity_supplied} onChange={e => setForm({ ...form, quantity_supplied: e.target.value })} placeholder="0 bags" className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm" /></div>
            <div><label className="text-xs font-semibold text-slate-700 block mb-1">Payment Reference</label><input value={form.payment_reference} onChange={e => setForm({ ...form, payment_reference: e.target.value })} placeholder="Auto-generated" className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm" /></div>
            <div><label className="text-xs font-semibold text-slate-700 block mb-1">Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'delivered' | 'in-transit' | 'pending' })} className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm"><option value="pending">Pending</option><option value="in-transit">In Transit</option><option value="delivered">Delivered</option></select></div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={handleAdd} disabled={!form.supplier_name || !form.quantity_supplied} className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center gap-2 disabled:opacity-50"><Plus className="w-4 h-4" /> Save Check-In</button>
          </div>
        </Card>
      )}

      <Card title={`${supply.length} Deliveries`} subtitle="All supply check-ins">
        {supply.length === 0 ? <p className="text-center text-slate-500 py-8">No supply check-ins recorded yet.</p> : (
          <div className="space-y-3">{supply.slice().reverse().map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-sm transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', item.status === 'delivered' && 'bg-emerald-100', item.status === 'in-transit' && 'bg-amber-100', item.status === 'pending' && 'bg-slate-100')}>
                    {item.status === 'delivered' && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                    {item.status === 'in-transit' && <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />}
                    {item.status === 'pending' && <AlertCircle className="w-6 h-6 text-slate-600" />}
                  </div>
                  <div><p className="font-semibold text-slate-900">{item.supplier_name}</p><p className="text-xs text-slate-500">Ref: {item.payment_reference}</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right"><p className="text-xs text-slate-500">Quantity</p><p className="font-bold text-slate-900">{item.quantity_supplied} bags</p></div>
                  <div className="text-right"><p className="text-xs text-slate-500 flex items-center gap-1 justify-end"><Clock className="w-3 h-3" /> Check-In</p><p className="text-sm font-medium text-slate-700">{item.checkin_time}</p></div>
                  {item.status !== 'delivered' && (
                    <button onClick={() => { updateSupplyStatus(item.id, 'delivered'); reload(); }} className="px-3 py-1.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200">Mark Delivered</button>
                  )}
                  <span className={cn('text-xs font-semibold px-3 py-1.5 rounded-full capitalize whitespace-nowrap', item.status === 'delivered' && 'bg-emerald-100 text-emerald-700', item.status === 'in-transit' && 'bg-amber-100 text-amber-700', item.status === 'pending' && 'bg-slate-100 text-slate-700')}>{item.status}</span>
                  <button onClick={() => { deleteSupplyCheckIn(item.id); reload(); }} className="p-1 hover:bg-red-100 rounded text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}</div>
        )}
      </Card>
    </div>
  );
}
