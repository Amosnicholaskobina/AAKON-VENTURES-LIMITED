import {
  Truck, Package, Clock, CheckCircle, AlertTriangle, ShoppingCart, Cog, Droplets,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard, Card } from '../components/ui';
import { supplyCheckIns } from '../data/mockData';
import { cn } from '../utils/cn';
import {
  getLeakageStats, getTodayBaggerTotal, getLoaderDeliveries, getAvailableBagsForDelivery,
  getOperatorStats, getLabItemsIn, getLabItemsOut, getQualityChecks, getBaggerProductions,
} from '../data/store';

const hourlySales = [
  { hour: '8AM', sales: 12 }, { hour: '9AM', sales: 18 }, { hour: '10AM', sales: 25 },
  { hour: '11AM', sales: 22 }, { hour: '12PM', sales: 30 }, { hour: '1PM', sales: 28 },
  { hour: '2PM', sales: 20 }, { hour: '3PM', sales: 15 },
];

export function SupervisorDashboard() {
  const leakage = getLeakageStats();
  const todayBagged = getTodayBaggerTotal();
  const todayDate = new Date().toISOString().slice(0, 10);
  const todayDeliveries = getLoaderDeliveries().filter(d => d.date === todayDate);
  const availableBags = getAvailableBagsForDelivery();
  const opStats = getOperatorStats();
  const labIn = getLabItemsIn();
  const labOut = getLabItemsOut();
  const labChecks = getQualityChecks();
  const todayProductions = getBaggerProductions().filter(p => p.date === todayDate);

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Orders Today" value={String(todayDeliveries.length + todayProductions.length)} change="All workers" icon={ShoppingCart} gradient="bg-gradient-to-br from-sky-500 to-cyan-600" />
        <StatCard title="Bags Produced" value={String(todayBagged)} change="Bagger output" icon={Package} gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
        <StatCard title="Leakage Alerts" value={String(leakage.todayLeakage)} change={`${leakage.todayLeakedBags} bags`} changeType={leakage.todayLeakage > 0 ? 'negative' : 'positive'} icon={AlertTriangle} gradient="bg-gradient-to-br from-rose-500 to-red-600" />
        <StatCard title="Machine Alerts" value={String(opStats.criticalAlerts)} change="Operator checks" changeType={opStats.criticalAlerts > 0 ? 'negative' : 'positive'} icon={Cog} gradient="bg-gradient-to-br from-indigo-500 to-blue-600" />
      </div>

      {/* ═══ ALL WORKER GROUPS OVERVIEW ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Operators */}
        <Card title="⚙️ Operators" subtitle="Machine & water levels">
          <div className="space-y-2">
            <Row label="Supply Loads Today" value={String(opStats.totalLoadsToday)} color="indigo" />
            <Row label="Water Level Checks" value={String(opStats.totalChecksToday)} color="sky" />
            <Row label="Critical Alerts" value={String(opStats.criticalAlerts)} color={opStats.criticalAlerts > 0 ? 'red' : 'emerald'} />
            {opStats.todayLevels.length > 0 && (
              <div className="mt-2 border-t border-slate-100 pt-2">
                <p className="text-xs font-semibold text-slate-600 mb-1">Latest Readings:</p>
                {opStats.todayLevels.slice(-3).reverse().map(w => (
                  <div key={w.id} className="text-xs flex justify-between py-0.5">
                    <span className="text-slate-700">{w.machineName}</span>
                    <span className={cn('font-semibold', w.status === 'critical' ? 'text-red-600' : w.status === 'low' ? 'text-amber-600' : 'text-emerald-600')}>{w.levelPercent}% • {w.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Baggers */}
        <Card title="📦 Baggers" subtitle="Production output">
          <div className="space-y-2">
            <Row label="Bags Produced Today" value={String(todayBagged)} color="sky" />
            <Row label="Production Entries" value={String(todayProductions.length)} color="blue" />
            <Row label="Available for Delivery" value={String(availableBags)} color="emerald" />
            {todayProductions.length > 0 && (
              <div className="mt-2 border-t border-slate-100 pt-2">
                <p className="text-xs font-semibold text-slate-600 mb-1">Recent Output:</p>
                {todayProductions.slice(-3).reverse().map(p => (
                  <div key={p.id} className="text-xs flex justify-between py-0.5">
                    <span className="text-slate-700">{p.timestamp}</span>
                    <span className="font-semibold text-sky-700">{p.bagCount} bags</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Loaders */}
        <Card title="🚚 Loaders" subtitle="Deliveries & leakage">
          <div className="space-y-2">
            <Row label="Deliveries Today" value={String(todayDeliveries.length)} color="amber" />
            <Row label="Bags Delivered" value={String(todayDeliveries.reduce((s, d) => s + d.bagCount, 0))} color="orange" />
            <Row label="Leakage Reports" value={String(leakage.todayLeakage)} color={leakage.todayLeakage > 0 ? 'red' : 'emerald'} />
            <Row label="Bags Leaked" value={String(leakage.todayLeakedBags)} color={leakage.todayLeakedBags > 0 ? 'red' : 'emerald'} />
            {leakage.recentLeakages.length > 0 && (
              <div className="mt-2 border-t border-slate-100 pt-2">
                <p className="text-xs font-semibold text-red-600 mb-1">⚠ Leakage Incidents:</p>
                {leakage.recentLeakages.slice(0, 3).map(d => (
                  <div key={d.id} className="text-xs flex justify-between py-0.5">
                    <span className="text-slate-700">{d.destination}</span>
                    <span className="font-semibold text-red-600">{d.leakageCount} bags</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Quality Lab */}
        <Card title="🧪 Quality Lab" subtitle="Inspections & results">
          <div className="space-y-2">
            <Row label="Items Checked In" value={String(labIn.length)} color="emerald" />
            <Row label="Items Dispatched" value={String(labOut.length)} color="sky" />
            <Row label="Quality Tests" value={String(labChecks.length)} color="violet" />
            <Row label="Failed Tests" value={String(labChecks.filter(c => c.result === 'fail').length)} color={labChecks.filter(c => c.result === 'fail').length > 0 ? 'red' : 'emerald'} />
            {labChecks.length > 0 && (
              <div className="mt-2 border-t border-slate-100 pt-2">
                <p className="text-xs font-semibold text-slate-600 mb-1">Recent Tests:</p>
                {labChecks.slice(-3).reverse().map(c => (
                  <div key={c.id} className="text-xs flex justify-between py-0.5">
                    <span className="text-slate-700">{c.product}</span>
                    <span className={cn('font-semibold', c.result === 'pass' ? 'text-emerald-600' : 'text-red-600')}>{c.result === 'pass' ? '✓ Pass' : '✗ Fail'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Bagger→Loader Pipeline & Leakage Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Bagger → Loader Pipeline" subtitle="Production to delivery flow">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50 border border-sky-200">
              <div className="flex items-center gap-3"><Package className="w-5 h-5 text-sky-600" /><span className="text-sm font-semibold text-slate-900">Bags Produced Today</span></div>
              <span className="text-lg font-bold text-sky-700">{todayBagged}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-3"><Truck className="w-5 h-5 text-amber-600" /><span className="text-sm font-semibold text-slate-900">Deliveries Made</span></div>
              <span className="text-lg font-bold text-amber-700">{todayDeliveries.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-emerald-600" /><span className="text-sm font-semibold text-slate-900">Available for Delivery</span></div>
              <span className="text-lg font-bold text-emerald-700">{availableBags}</span>
            </div>
          </div>
        </Card>

        <Card title="Operator Water Level Summary" subtitle={`${opStats.totalChecksToday} checks today`}>
          {opStats.todayLevels.length === 0 ? (
            <p className="text-center text-slate-500 py-6">No operator water level checks yet today.</p>
          ) : (
            <div className="space-y-2">{opStats.todayLevels.slice().reverse().slice(0, 5).map(w => (
              <div key={w.id} className={cn('flex items-center justify-between p-3 rounded-xl border', w.status === 'critical' ? 'bg-red-50 border-red-200' : w.status === 'low' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200')}>
                <div className="flex items-center gap-3">
                  {w.status === 'critical' ? <AlertTriangle className="w-5 h-5 text-red-600" /> : <Droplets className="w-5 h-5 text-sky-600" />}
                  <div><p className="text-sm font-semibold text-slate-900">{w.machineName}</p><p className="text-xs text-slate-500">{w.hour} • {w.timestamp}</p></div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-bold">{w.levelPercent}%</span>
                  <span>{w.temperature}°C</span>
                  <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full capitalize', w.status === 'normal' ? 'bg-emerald-100 text-emerald-700' : w.status === 'low' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700')}>{w.status}</span>
                </div>
              </div>
            ))}</div>
          )}
        </Card>
      </div>

      {/* Sales Chart & Deliveries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Hourly Sales Trend" subtitle="Today's performance">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={hourlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="sales" fill="#0891b2" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Active Deliveries" subtitle="Supply chain">
          <div className="space-y-3">
            {supplyCheckIns.filter(s => s.status === 'in-transit').map((delivery) => (
              <div key={delivery.id} className="p-3 rounded-xl border border-sky-200 bg-sky-50">
                <div className="flex items-center gap-3"><Truck className="w-5 h-5 text-sky-600" /><div className="flex-1"><p className="font-semibold text-slate-900 text-sm">{delivery.supplier_name}</p><p className="text-xs text-slate-600">{delivery.quantity_supplied} bags</p></div></div>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500"><Clock className="w-3 h-3" /><span>ETA: {delivery.checkin_time}</span></div>
              </div>
            ))}
            {supplyCheckIns.filter(s => s.status === 'in-transit').length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No active deliveries</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-slate-700">{label}</span>
      <span className={cn('text-sm font-bold', `text-${color}-700`)}>{value}</span>
    </div>
  );
}
