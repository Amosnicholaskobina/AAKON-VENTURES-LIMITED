import { useState } from 'react';
import { Plus, Mail, Phone, MapPin, Search, UserPlus, Trash2 } from 'lucide-react';
import { Card } from '../components/ui';
import { cn } from '../utils/cn';
import { getCustomers, addCustomer, deleteCustomer } from '../data/store';

export function CustomersPage({ onDataChange }: { onDataChange: () => void }) {
  const [customers, setCustomers] = useState(getCustomers());
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });

  const reload = () => { setCustomers(getCustomers()); onDataChange(); };

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name || !form.phone) return;
    addCustomer(form);
    setForm({ name: '', phone: '', email: '', address: '' });
    setShowForm(false);
    reload();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this customer?')) { deleteCustomer(id); reload(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Customers</h2>
          <p className="text-sm text-slate-500">Manage all your customer information</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-sky-500/30 transition">
          {showForm ? 'Cancel' : <><UserPlus className="w-4 h-4" /> Add Customer</>}
        </button>
      </div>

      {showForm && (
        <Card title="New Customer" subtitle="Add customer details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name *" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="John Doe" />
            <Field label="Phone *" value={form.phone} onChange={v => setForm({ ...form, phone: v })} placeholder="+233 24 123 4567" />
            <Field label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="john@example.com" />
            <Field label="Address" value={form.address} onChange={v => setForm({ ...form, address: v })} placeholder="123 Main St, Accra" />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={handleAdd} disabled={!form.name || !form.phone} className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center gap-2 disabled:opacity-50">
              <Plus className="w-4 h-4" /> Save Customer
            </button>
          </div>
        </Card>
      )}

      <Card title={`${filtered.length} Customers`} subtitle="All registered customers">
        <div className="mb-4 flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 max-w-md">
          <Search className="w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search by name, phone, email..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm flex-1 text-slate-700" />
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No customers found. Add your first customer above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((customer) => (
              <div key={customer.id} className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-sky-300 transition">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-cyan-600 flex items-center justify-center text-white font-bold shrink-0">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 truncate">{customer.name}</h4>
                    <p className="text-xs text-slate-500">Since {customer.created_at}</p>
                  </div>
                  <button onClick={() => handleDelete(customer.id)} className="p-1 hover:bg-red-100 rounded text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600"><Phone className="w-3.5 h-3.5 text-sky-600" /><span className="truncate">{customer.phone}</span></div>
                  {customer.email && <div className="flex items-center gap-2 text-slate-600"><Mail className="w-3.5 h-3.5 text-sky-600" /><span className="truncate">{customer.email}</span></div>}
                  {customer.address && <div className="flex items-start gap-2 text-slate-600"><MapPin className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" /><span className="line-clamp-2">{customer.address}</span></div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Field({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-700 block mb-1">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={cn('w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition')} />
    </div>
  );
}
