import { useState } from 'react';
import { Card } from '../components/ui';
import { FileText, Download, Share2, Mail, MessageCircle, X, Printer } from 'lucide-react';
import { cn } from '../utils/cn';
import { getReceipts, markReceiptSent, getSettings } from '../data/store';
import { Receipt } from '../data/mockData';

export function ReceiptsPage({ onDataChange }: { onDataChange: () => void }) {
  const [receipts, setReceipts] = useState(getReceipts());
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const settings = getSettings();

  const reload = () => { setReceipts(getReceipts()); onDataChange(); };

  const handleMarkSent = (id: string) => { markReceiptSent(id); reload(); };

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Receipts</h2><p className="text-sm text-slate-500">Generate, preview, and send receipts</p></div>

      <Card title={`${receipts.length} Receipts`} subtitle="All generated receipts">
        {receipts.length === 0 ? <p className="text-center text-slate-500 py-8">No receipts yet. Record a sale to auto-generate receipts.</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{receipts.slice().reverse().map((receipt) => (
            <div key={receipt.id} className="p-4 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-cyan-100 flex items-center justify-center"><FileText className="w-5 h-5 text-cyan-600" /></div><div><p className="font-bold text-slate-900">{receipt.receipt_number}</p><p className="text-xs text-slate-500">{receipt.created_at}</p></div></div>
                <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', receipt.sent_status ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>{receipt.sent_status ? 'Sent' : 'Pending'}</span>
              </div>
              <div className="space-y-2 text-sm border-t border-slate-100 pt-3">
                <div className="flex justify-between"><span className="text-slate-500">Customer</span><span className="font-medium text-slate-900">{receipt.customer_name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Amount</span><span className="font-bold text-emerald-600">GHS {receipt.amount}</span></div>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setSelectedReceipt(receipt)} className="flex-1 py-2 bg-slate-100 hover:bg-sky-600 hover:text-white text-slate-700 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"><FileText className="w-4 h-4" /> View</button>
                {!receipt.sent_status && <button onClick={() => handleMarkSent(receipt.id)} className="px-3 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-sm font-semibold">Mark Sent</button>}
              </div>
            </div>
          ))}</div>
        )}
      </Card>

      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full my-8">
            <div className="flex items-center justify-between p-4 border-b border-slate-200"><h3 className="font-bold text-slate-900">Receipt Preview</h3><button onClick={() => setSelectedReceipt(null)} className="p-1 hover:bg-slate-100 rounded"><X className="w-5 h-5" /></button></div>
            <div className="p-6 font-mono text-sm">
              <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4">
                <p className="text-lg font-bold text-sky-700">💧 {settings.businessName}</p>
                <p className="text-xs text-slate-500 mt-1">Pure Bagged Water Supply</p>
                <p className="text-xs text-slate-500">{settings.address}</p>
                <p className="text-xs text-slate-500">{settings.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="font-bold">Receipt No: {selectedReceipt.receipt_number}</p>
                <p>Date: {selectedReceipt.created_at}</p>
                <p className="pt-2 border-t border-dashed border-slate-300 mt-2">Customer: {selectedReceipt.customer_name}</p>
                <p>Amount Paid: GHS {selectedReceipt.amount}</p>
                <p className="pt-2 font-bold">Status: {selectedReceipt.sent_status ? 'SENT ✓' : 'PENDING'}</p>
              </div>
              <div className="text-center border-t-2 border-dashed border-slate-300 pt-4 mt-4">
                <p className="text-xs">Thank you for your purchase!</p>
                <p className="text-xs text-slate-500 mt-1">{settings.businessName}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 p-4 border-t border-slate-200">
              <button className="flex items-center justify-center gap-2 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-semibold"><Printer className="w-4 h-4" /> Print</button>
              <button className="flex items-center justify-center gap-2 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-semibold"><Download className="w-4 h-4" /> PDF</button>
              <button className="flex items-center justify-center gap-2 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold"><MessageCircle className="w-4 h-4" /> WhatsApp</button>
              <button className="flex items-center justify-center gap-2 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold"><Mail className="w-4 h-4" /> Email</button>
            </div>
            <div className="px-4 pb-4"><button className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-semibold"><Share2 className="w-4 h-4" /> Share via Link</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
