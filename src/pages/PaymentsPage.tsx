import { useState } from 'react';
import { Card } from '../components/ui';
import { CreditCard, TrendingUp, Plus } from 'lucide-react';
import { getPayments, getSales, addPayment } from '../data/store';

export function PaymentsPage({ onDataChange }: { onDataChange: () => void }) {
  const [payments, setPayments] = useState(getPayments());
  const [showForm, setShowForm] = useState(false);
  const pendingSales = getSales().filter(s => s.payment_status !== 'paid');
  const [selectedSale, setSelectedSale] = useState('');

  const reload = () => { setPayments(getPayments()); onDataChange(); };
  const totalPaid = payments.reduce((sum, p) => sum + p.amount_paid, 0);

  const handleAdd = () => {
    const sale = pendingSales.find(s => s.id === selectedSale);
    if (!sale) return;
    addPayment({ sale_id: sale.id, customer_name: sale.customer_name, amount_paid: sale.total_amount, payment_reference: `PAY-${Date.now().toString(36).toUpperCase()}`, payment_date: new Date().toISOString().slice(0, 16).replace('T', ' ') });
    setSelectedSale('');
    setShowForm(false);
    reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h2 className="text-2xl font-bold text-slate-900">Payments</h2><p className="text-sm text-slate-500">Track all payment transactions</p></div>
        {pendingSales.length > 0 && (
          <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:shadow-lg transition">
            {showForm ? 'Cancel' : <><Plus className="w-4 h-4" /> Record Payment</>}
          </button>
        )}
      </div>

      {showForm && (
        <Card title="Record Payment" subtitle="Confirm payment for pending sale">
          <div className="space-y-3">
            <select value={selectedSale} onChange={e => setSelectedSale(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm">
              <option value="">Select pending sale...</option>
              {pendingSales.map(s => <option key={s.id} value={s.id}>{s.customer_name} — GHS {s.total_amount} ({s.quantity} bags)</option>)}
            </select>
            <button onClick={handleAdd} disabled={!selectedSale} className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50">Confirm Payment</button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5 rounded-2xl shadow"><div className="flex items-center justify-between"><div><p className="text-emerald-100 text-sm">Total Received</p><p className="text-3xl font-bold mt-1">GHS {totalPaid}</p></div><TrendingUp className="w-10 h-10 text-emerald-200" /></div></div>
        <div className="bg-gradient-to-br from-sky-500 to-cyan-600 text-white p-5 rounded-2xl shadow"><div className="flex items-center justify-between"><div><p className="text-sky-100 text-sm">Transactions</p><p className="text-3xl font-bold mt-1">{payments.length}</p></div><CreditCard className="w-10 h-10 text-sky-200" /></div></div>
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 text-white p-5 rounded-2xl shadow"><div className="flex items-center justify-between"><div><p className="text-violet-100 text-sm">Avg. Payment</p><p className="text-3xl font-bold mt-1">GHS {payments.length ? (totalPaid / payments.length).toFixed(0) : 0}</p></div><TrendingUp className="w-10 h-10 text-violet-200" /></div></div>
      </div>

      <Card title="Payment History" subtitle="All recorded payments">
        {payments.length === 0 ? <p className="text-center text-slate-500 py-8">No payments recorded yet.</p> : (
          <div className="space-y-2">{payments.slice().reverse().map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-100 hover:border-sky-300 transition">
              <div className="flex items-center gap-4"><div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center"><CreditCard className="w-5 h-5 text-emerald-600" /></div><div><p className="font-semibold text-slate-900">{payment.customer_name}</p><p className="text-xs text-slate-500">Ref: {payment.payment_reference}</p></div></div>
              <div className="text-right"><p className="font-bold text-emerald-600">GHS {payment.amount_paid}</p><p className="text-xs text-slate-500">{payment.payment_date}</p></div>
            </div>
          ))}</div>
        )}
      </Card>
    </div>
  );
}
