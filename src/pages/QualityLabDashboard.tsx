import { useState } from 'react';
import {
  FlaskConical,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle,
  AlertCircle,
  Search,
  Plus,
  ClipboardCheck,
  Thermometer,
  Droplets,
} from 'lucide-react';
import { Card } from '../components/ui';
import { cn } from '../utils/cn';

export function QualityLabDashboard({ onDataChange: _onDataChange }: { onDataChange?: () => void }) {
  const [activeTab, setActiveTab] = useState<'in' | 'out' | 'checks'>('in');
  const [showForm, setShowForm] = useState(false);

  const itemsIn = [
    { id: 'IN-001', product: '500ml Pure Spring', supplier: 'AquaSource Ltd', qty: 500, status: 'approved', time: '9:00 AM', batch: 'B245' },
    { id: 'IN-002', product: '1L Crystal Clear', supplier: 'Pure Water Co', qty: 300, status: 'pending', time: '10:30 AM', batch: 'B246' },
    { id: 'IN-003', product: '2L Mountain Fresh', supplier: 'Crystal Springs', qty: 200, status: 'approved', time: '11:15 AM', batch: 'B247' },
    { id: 'IN-004', product: '5L Premium Aqua', supplier: 'Fresh Flow Inc', qty: 150, status: 'rejected', time: '12:00 PM', batch: 'B248' },
  ];

  const itemsOut = [
    { id: 'OUT-001', product: '500ml Pure Spring', destination: 'Accra Branch', qty: 200, status: 'dispatched', time: '8:30 AM', order: 'ORD-4521' },
    { id: 'OUT-002', product: '1L Crystal Clear', destination: 'Kumasi Branch', qty: 150, status: 'pending', time: '10:00 AM', order: 'ORD-4522' },
    { id: 'OUT-003', product: '2L Mountain Fresh', destination: 'Tema Branch', qty: 100, status: 'dispatched', time: '11:30 AM', order: 'ORD-4523' },
    { id: 'OUT-004', product: '5L Premium Aqua', destination: 'Cape Coast', qty: 80, status: 'pending', time: '1:00 PM', order: 'ORD-4524' },
  ];

  const qualityChecks = [
    { id: 'QC-001', batch: 'B245', product: '500ml Pure Spring', pH: 7.2, turbidity: '0.3 NTU', result: 'pass', inspector: 'Lab Tech A' },
    { id: 'QC-002', batch: 'B246', product: '1L Crystal Clear', pH: 7.1, turbidity: '0.4 NTU', result: 'pass', inspector: 'Lab Tech B' },
    { id: 'QC-003', batch: 'B247', product: '2L Mountain Fresh', pH: 7.3, turbidity: '0.2 NTU', result: 'pass', inspector: 'Lab Tech A' },
    { id: 'QC-004', batch: 'B248', product: '5L Premium Aqua', pH: 6.8, turbidity: '1.2 NTU', result: 'fail', inspector: 'Lab Tech B' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl text-white">
          <ArrowDownToLine className="w-6 h-6 mb-2" />
          <p className="text-emerald-100 text-xs">Items In Today</p>
          <p className="text-2xl font-bold mt-1">245</p>
          <p className="text-xs text-emerald-100 mt-1">batches</p>
        </div>
        <div className="bg-gradient-to-br from-sky-500 to-cyan-600 p-4 rounded-2xl text-white">
          <ArrowUpFromLine className="w-6 h-6 mb-2" />
          <p className="text-sky-100 text-xs">Items Out</p>
          <p className="text-2xl font-bold mt-1">189</p>
          <p className="text-xs text-sky-100 mt-1">batches</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-4 rounded-2xl text-white">
          <ClipboardCheck className="w-6 h-6 mb-2" />
          <p className="text-violet-100 text-xs">Quality Checks</p>
          <p className="text-2xl font-bold mt-1">42</p>
          <p className="text-xs text-violet-100 mt-1">today</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-2xl text-white">
          <AlertCircle className="w-6 h-6 mb-2" />
          <p className="text-amber-100 text-xs">Pending Review</p>
          <p className="text-2xl font-bold mt-1">8</p>
          <p className="text-xs text-amber-100 mt-1">batches</p>
        </div>
        <div className="bg-gradient-to-br from-rose-500 to-red-600 p-4 rounded-2xl text-white">
          <AlertCircle className="w-6 h-6 mb-2" />
          <p className="text-rose-100 text-xs">Rejected</p>
          <p className="text-2xl font-bold mt-1">3</p>
          <p className="text-xs text-rose-100 mt-1">today</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <Card title="" subtitle="">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <TabButton active={activeTab === 'in'} onClick={() => setActiveTab('in')} icon={ArrowDownToLine} label="Items In" color="emerald" />
            <TabButton active={activeTab === 'out'} onClick={() => setActiveTab('out')} icon={ArrowUpFromLine} label="Items Out" color="sky" />
            <TabButton active={activeTab === 'checks'} onClick={() => setActiveTab('checks')} icon={ClipboardCheck} label="Quality Checks" color="violet" />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Entry
          </button>
        </div>

        {/* Items In Table */}
        {activeTab === 'in' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-200">
                  <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">ID</th>
                  <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Product</th>
                  <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Supplier</th>
                  <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Qty</th>
                  <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Batch</th>
                  <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Time</th>
                  <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {itemsIn.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 font-medium text-slate-900">{item.id}</td>
                    <td className="py-3 text-slate-700">{item.product}</td>
                    <td className="py-3 text-slate-600">{item.supplier}</td>
                    <td className="py-3 text-slate-700">{item.qty}</td>
                    <td className="py-3 text-slate-600 font-mono text-xs">{item.batch}</td>
                    <td className="py-3 text-slate-500 text-xs">{item.time}</td>
                    <td className="py-3">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Items Out Table */}
        {activeTab === 'out' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-200">
                  <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">ID</th>
                  <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Product</th>
                  <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Destination</th>
                  <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Qty</th>
                  <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Order</th>
                  <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Time</th>
                  <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {itemsOut.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 font-medium text-slate-900">{item.id}</td>
                    <td className="py-3 text-slate-700">{item.product}</td>
                    <td className="py-3 text-slate-600">{item.destination}</td>
                    <td className="py-3 text-slate-700">{item.qty}</td>
                    <td className="py-3 text-slate-600 font-mono text-xs">{item.order}</td>
                    <td className="py-3 text-slate-500 text-xs">{item.time}</td>
                    <td className="py-3">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Quality Checks Table */}
        {activeTab === 'checks' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-200">
                  <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">ID</th>
                  <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Batch</th>
                  <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Product</th>
                  <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">pH Level</th>
                  <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Turbidity</th>
                  <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Inspector</th>
                  <th className="pb-3 text-xs font-semibold text-slate-600 uppercase">Result</th>
                </tr>
              </thead>
              <tbody>
                {qualityChecks.map((check) => (
                  <tr key={check.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 font-medium text-slate-900">{check.id}</td>
                    <td className="py-3 text-slate-700 font-mono text-xs">{check.batch}</td>
                    <td className="py-3 text-slate-700">{check.product}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1 text-slate-700">
                        <Droplets className="w-3 h-3 text-blue-500" /> {check.pH}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1 text-slate-700">
                        <Thermometer className="w-3 h-3 text-amber-500" /> {check.turbidity}
                      </div>
                    </td>
                    <td className="py-3 text-slate-600 text-xs">{check.inspector}</td>
                    <td className="py-3">
                      <ResultBadge result={check.result} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Today's Quality Metrics" subtitle="Lab readings">
          <div className="space-y-3">
            <MetricRow label="Avg pH Level" value="7.15" target="7.0-7.5" status="good" icon={Droplets} color="blue" />
            <MetricRow label="Avg Turbidity" value="0.35 NTU" target="< 1.0 NTU" status="good" icon={Thermometer} color="amber" />
            <MetricRow label="Pass Rate" value="96.5%" target="> 95%" status="good" icon={CheckCircle} color="emerald" />
            <MetricRow label="Tests Completed" value="42" target="40/day" status="good" icon={FlaskConical} color="violet" />
          </div>
        </Card>

        <Card title="Recent Alerts" subtitle="Quality issues">
          <div className="space-y-2">
            <AlertRow type="critical" message="Batch B248 failed quality check - High turbidity" time="12:05 PM" />
            <AlertRow type="warning" message="Batch B249 pending review - pH borderline" time="11:30 AM" />
            <AlertRow type="info" message="Supplier delivery IN-005 requires inspection" time="10:45 AM" />
          </div>
        </Card>

        <Card title="Quick Actions" subtitle="Common tasks">
          <div className="grid grid-cols-2 gap-2">
            <QuickAction icon={ArrowDownToLine} label="Record Item In" color="emerald" />
            <QuickAction icon={ArrowUpFromLine} label="Record Item Out" color="sky" />
            <QuickAction icon={ClipboardCheck} label="New Quality Check" color="violet" />
            <QuickAction icon={Search} label="Search Batch" color="amber" />
            <QuickAction icon={Package} label="View Inventory" color="indigo" />
            <QuickAction icon={FlaskConical} label="Lab Reports" color="rose" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label, color }: { active: boolean; onClick: () => void; icon: React.ComponentType<{ className?: string }>; label: string; color: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition',
        active 
          ? `bg-${color}-600 text-white` 
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      )}
    >
      <Icon className="w-4 h-4" /> {label}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    approved: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    rejected: 'bg-red-100 text-red-700',
    dispatched: 'bg-sky-100 text-sky-700',
  };
  return (
    <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full capitalize', styles[status] || 'bg-slate-100 text-slate-700')}>
      {status}
    </span>
  );
}

function ResultBadge({ result }: { result: string }) {
  return (
    <span className={cn(
      'text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit',
      result === 'pass' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
    )}>
      {result === 'pass' ? '✓' : '✗'} {result.toUpperCase()}
    </span>
  );
}

function MetricRow({ icon: Icon, label, value, target, status, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; target: string; status: string; color: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
      <div className="flex items-center gap-3">
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', `bg-${color}-100`)}>
          <Icon className={cn('w-4 h-4', `text-${color}-600`)} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="text-xs text-slate-500">Target: {target}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-slate-900">{value}</p>
        <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', status === 'good' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>
          {status === 'good' ? '✓' : '⚠'}
        </span>
      </div>
    </div>
  );
}

function AlertRow({ type, message, time }: { type: 'critical' | 'warning' | 'info'; message: string; time: string }) {
  const colors = {
    critical: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-sky-50 border-sky-200 text-sky-800',
  };
  const icons = { critical: '🔴', warning: '🟡', info: '🔵' };

  return (
    <div className={cn('p-3 rounded-xl border flex items-start gap-3', colors[type])}>
      <span className="text-lg">{icons[type]}</span>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
        <p className="text-xs opacity-70 mt-1">{time}</p>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, color }: { icon: React.ComponentType<{ className?: string }>; label: string; color: string }) {
  return (
    <button className={cn(
      'p-3 rounded-xl border-2 transition flex flex-col items-center gap-2 hover:shadow-md',
      `border-${color}-200 bg-${color}-50 hover:border-${color}-300`
    )}>
      <Icon className={cn('w-5 h-5', `text-${color}-600`)} />
      <span className="text-xs font-semibold text-slate-700">{label}</span>
    </button>
  );
}
