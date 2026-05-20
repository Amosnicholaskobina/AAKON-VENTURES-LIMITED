import { useState } from 'react';
import { Card } from '../components/ui';
import { Package, AlertTriangle, TrendingDown, Plus, Trash2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { getInventory, addInventoryItem, deleteInventoryItem } from '../data/store';

export function InventoryPage({ onDataChange }: { onDataChange: () => void }) {
  const [inventory, setInventory] = useState(getInventory());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ product_name: '', quantity_available: '', reorder_level: '' });

  const reload = () => { setInventory(getInventory()); onDataChange(); };
  const totalStock = inventory.reduce((sum, i) => sum + i.quantity_available, 0);
  const lowStockCount = inventory.filter((i) => i.quantity_available < i.reorder_level).length;

  const handleAdd = () => {
    if (!form.product_name) return;
    addInventoryItem({ product_name: form.product_name, quantity_available: parseInt(form.quantity_available) || 0, reorder_level: parseInt(form.reorder_level) || 50 });
    setForm({ product_name: '', quantity_available: '', reorder_level: '' });
    setShowForm(false);
    reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h2 className="text-2xl font-bold text-slate-900">Inventory</h2><p className="text-sm text-slate-500">Monitor stock levels and reorder alerts</p></div>
        <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:shadow-lg transition">
          {showForm ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Product</>}
        </button>
      </div>

      {showForm && (
        <Card title="Add Product" subtitle="Add a new inventory item">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="text-xs font-semibold text-slate-700 block mb-1">Product Name *</label><input value={form.product_name} onChange={e => setForm({ ...form, product_name: e.target.value })} placeholder="e.g. Spring Water 500ml" className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm" /></div>
            <div><label className="text-xs font-semibold text-slate-700 block mb-1">Initial Quantity</label><input type="number" value={form.quantity_available} onChange={e => setForm({ ...form, quantity_available: e.target.value })} placeholder="0" className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm" /></div>
            <div><label className="text-xs font-semibold text-slate-700 block mb-1">Reorder Level</label><input type="number" value={form.reorder_level} onChange={e => setForm({ ...form, reorder_level: e.target.value })} placeholder="50" className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm" /></div>
          </div>
          <div className="mt-4"><button onClick={handleAdd} disabled={!form.product_name} className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg disabled:opacity-50">Save Product</button></div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"><Package className="w-6 h-6 text-white" /></div><div><p className="text-xs text-slate-500 font-medium">Total Stock</p><p className="text-2xl font-bold text-slate-900">{totalStock} bags</p></div></div></div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center"><TrendingDown className="w-6 h-6 text-white" /></div><div><p className="text-xs text-slate-500 font-medium">Products</p><p className="text-2xl font-bold text-slate-900">{inventory.length}</p></div></div></div>
        <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-white" /></div><div><p className="text-xs text-slate-500 font-medium">Low Stock</p><p className="text-2xl font-bold text-red-600">{lowStockCount}</p></div></div></div>
      </div>

      <Card title="Stock Items" subtitle="All products in inventory">
        {inventory.length === 0 ? <p className="text-center text-slate-500 py-8">No products in inventory. Add one above.</p> : (
          <div className="space-y-3">{inventory.map((item) => {
            const isLow = item.quantity_available < item.reorder_level;
            const percentage = Math.min((item.quantity_available / (item.reorder_level * 2)) * 100, 100);
            return (
              <div key={item.id} className={cn('p-4 rounded-xl border transition', isLow ? 'border-red-200 bg-red-50/50' : 'border-slate-200 bg-white hover:border-sky-300')}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3"><div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', isLow ? 'bg-red-100' : 'bg-sky-100')}><Package className={cn('w-5 h-5', isLow ? 'text-red-600' : 'text-sky-600')} /></div><div><p className="font-semibold text-slate-900">{item.product_name}</p><p className="text-xs text-slate-500">Reorder level: {item.reorder_level} bags</p></div></div>
                  <div className="flex items-center gap-3"><div className="text-right"><p className={cn('text-2xl font-bold', isLow ? 'text-red-600' : 'text-slate-900')}>{item.quantity_available}</p><p className="text-xs text-slate-500">bags available</p></div><button onClick={() => { deleteInventoryItem(item.id); reload(); }} className="p-1 hover:bg-red-100 rounded text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></div>
                </div>
                <div className="mt-3"><div className="flex items-center justify-between text-xs mb-1"><span className="text-slate-500">Stock level</span><span className={cn('font-semibold', isLow ? 'text-red-600' : 'text-emerald-600')}>{isLow ? '⚠ Low Stock' : '✓ Healthy'}</span></div><div className="w-full bg-slate-200 rounded-full h-2"><div className={cn('h-2 rounded-full transition-all', isLow ? 'bg-gradient-to-r from-red-500 to-rose-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500')} style={{ width: `${percentage}%` }} /></div></div>
              </div>
            );
          })}</div>
        )}
      </Card>
    </div>
  );
}
