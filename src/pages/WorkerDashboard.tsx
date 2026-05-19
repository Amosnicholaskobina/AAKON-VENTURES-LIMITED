import { useState, useEffect } from 'react';
import { Clock, CheckCircle, Package, Truck, Timer, Play, Pause, StopCircle, Plus, AlertTriangle, Droplets } from 'lucide-react';
import { Card } from '../components/ui';
import { cn } from '../utils/cn';
import {
  getBaggerProductions, addBaggerProduction, getTodayBaggerTotal, getAvailableBagsForDelivery,
  getLoaderDeliveries, addLoaderDelivery, updateDeliveryLeakage, updateDeliveryStatus, getLeakageStats,
} from '../data/store';

export function WorkerDashboard({ onDataChange }: { onDataChange?: () => void }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [shiftStart, setShiftStart] = useState('8:00 AM');
  const [timerRunning, setTimerRunning] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [workerType, setWorkerType] = useState<'bagger' | 'loader'>('bagger');

  // Bagger state
  const [bagInput, setBagInput] = useState('');
  const [productions, setProductions] = useState(getBaggerProductions());
  const todayProduced = getTodayBaggerTotal();
  const availableForDelivery = getAvailableBagsForDelivery();

  // Loader state
  const [deliveries, setDeliveries] = useState(getLoaderDeliveries());
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState({ bagCount: '', destination: '' });
  const leakageStats = getLeakageStats();

  const reload = () => {
    setProductions(getBaggerProductions());
    setDeliveries(getLoaderDeliveries());
    onDataChange?.();
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timerRunning && isClockedIn) {
      const interval = setInterval(() => setElapsedTime(e => e + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timerRunning, isClockedIn]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClockAction = () => {
    if (isClockedIn) { setIsClockedIn(false); setTimerRunning(false); }
    else { setIsClockedIn(true); setShiftStart(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })); setElapsedTime(0); }
  };

  const handleAddProduction = () => {
    const count = parseInt(bagInput);
    if (!count || count <= 0) return;
    addBaggerProduction({ workerId: 'current', workerName: 'Worker', bagCount: count, timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) });
    setBagInput('');
    reload();
  };

  const handleAddDelivery = () => {
    const count = parseInt(deliveryForm.bagCount);
    if (!count || !deliveryForm.destination) return;
    const result = addLoaderDelivery({ workerId: 'current', workerName: 'Worker', bagCount: count, destination: deliveryForm.destination, hasLeakage: false, leakageCount: 0, leakageNotes: '', timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), status: 'pending', sourceBaggerId: '' });
    if (!result) { alert(`Not enough bags available! Only ${getAvailableBagsForDelivery()} bags available from baggers.`); return; }
    setDeliveryForm({ bagCount: '', destination: '' });
    setShowDeliveryForm(false);
    reload();
  };

  const handleLeakageToggle = (id: string, checked: boolean) => {
    if (checked) {
      const count = prompt('How many bags leaked?', '1');
      const notes = prompt('Describe the leakage:', '');
      updateDeliveryLeakage(id, true, parseInt(count || '0') || 0, notes || '');
    } else {
      updateDeliveryLeakage(id, false, 0, '');
    }
    reload();
  };

  const todayDeliveries = deliveries.filter(d => d.date === new Date().toISOString().slice(0, 10));

  return (
    <div className="space-y-6">
      {/* Worker Type Selector */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <button onClick={() => setWorkerType('bagger')} className={cn('px-6 py-2.5 rounded-xl font-semibold transition flex items-center gap-2', workerType === 'bagger' ? 'bg-sky-600 text-white shadow-lg' : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-sky-300')}>
          <Package className="w-4 h-4" /> Bagger
        </button>
        <button onClick={() => setWorkerType('loader')} className={cn('px-6 py-2.5 rounded-xl font-semibold transition flex items-center gap-2', workerType === 'loader' ? 'bg-amber-600 text-white shadow-lg' : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-amber-300')}>
          <Truck className="w-4 h-4" /> Loader
        </button>
      </div>

      {/* Time Clock Header */}
      <div className={cn('rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden transition-all', isClockedIn ? workerType === 'bagger' ? 'bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600' : 'bg-gradient-to-r from-amber-600 via-orange-600 to-red-600' : 'bg-gradient-to-r from-slate-600 via-gray-600 to-slate-700')}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-white/80 text-sm">Current Time</p>
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold', workerType === 'bagger' ? 'bg-sky-400/30 text-sky-100' : 'bg-amber-400/30 text-amber-100')}>
                {workerType === 'bagger' ? 'BAGGER' : 'LOADER'}
              </span>
            </div>
            <p className="text-4xl sm:text-5xl font-bold mt-1">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
            <p className="text-white/70 text-sm mt-1">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="text-center">
            <div className={cn('inline-flex items-center gap-3 px-6 py-3 rounded-full text-lg font-bold', isClockedIn ? 'bg-white/20 backdrop-blur' : 'bg-rose-500/30 backdrop-blur')}>
              <Clock className={cn('w-6 h-6', isClockedIn ? 'animate-pulse' : '')} />
              {isClockedIn ? 'CLOCKED IN' : 'CLOCKED OUT'}
            </div>
            <p className="text-white/70 text-sm mt-2">Shift started: {isClockedIn ? shiftStart : '--:--'}</p>
          </div>
          <div className="text-center">
            <div className="inline-block bg-black/20 backdrop-blur rounded-xl px-6 py-4 mb-3">
              <p className="text-white/70 text-xs">Time on Task</p>
              <p className="text-3xl font-mono font-bold">{formatTime(elapsedTime)}</p>
            </div>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setTimerRunning(!timerRunning)} disabled={!isClockedIn} className={cn('p-2 rounded-lg transition', timerRunning ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white', !isClockedIn && 'opacity-50 cursor-not-allowed')}>
                {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button onClick={handleClockAction} className={cn('px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2', isClockedIn ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white')}>
                {isClockedIn ? <><StopCircle className="w-4 h-4" /> Clock Out</> : <><Play className="w-4 h-4" /> Clock In</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ BAGGER VIEW ═══════════ */}
      {workerType === 'bagger' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatBox icon={<Package className="w-5 h-5 text-sky-600" />} bg="bg-sky-100" label="Bags Produced Today" value={String(todayProduced)} />
            <StatBox icon={<Truck className="w-5 h-5 text-emerald-600" />} bg="bg-emerald-100" label="Available for Delivery" value={String(availableForDelivery)} />
            <StatBox icon={<CheckCircle className="w-5 h-5 text-violet-600" />} bg="bg-violet-100" label="Production Entries" value={String(productions.filter(p => p.date === new Date().toISOString().slice(0, 10)).length)} />
            <StatBox icon={<Timer className="w-5 h-5 text-amber-600" />} bg="bg-amber-100" label="Deliveries Enabled" value={String(todayDeliveries.length)} />
          </div>

          {/* Add Production */}
          <Card title="Record Production" subtitle="Enter the number of bags you've bagged">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-700 block mb-1">Number of Bags *</label>
                <input type="number" min="1" value={bagInput} onChange={e => setBagInput(e.target.value)} placeholder="e.g. 100" className="w-full px-3 py-2.5 rounded-lg border border-slate-300 outline-none text-sm" />
              </div>
              <button onClick={handleAddProduction} disabled={!bagInput || parseInt(bagInput) <= 0} className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50 transition">
                <Plus className="w-4 h-4" /> Add Production
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">These bags become available for loaders to deliver.</p>
          </Card>

          {/* Production Log */}
          <Card title="Today's Production Log" subtitle={`Total: ${todayProduced} bags`}>
            {productions.filter(p => p.date === new Date().toISOString().slice(0, 10)).length === 0 ? (
              <p className="text-center text-slate-500 py-6">No production recorded today. Start bagging!</p>
            ) : (
              <div className="space-y-2">
                {productions.filter(p => p.date === new Date().toISOString().slice(0, 10)).reverse().map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-sky-50 border border-sky-200">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-sky-600" />
                      <div>
                        <p className="font-semibold text-slate-900">{p.bagCount} bags</p>
                        <p className="text-xs text-slate-500">{p.timestamp}</p>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      {/* ═══════════ LOADER VIEW ═══════════ */}
      {workerType === 'loader' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatBox icon={<Package className="w-5 h-5 text-emerald-600" />} bg="bg-emerald-100" label="Bags Available" value={String(availableForDelivery)} />
            <StatBox icon={<Truck className="w-5 h-5 text-amber-600" />} bg="bg-amber-100" label="Deliveries Today" value={String(todayDeliveries.length)} />
            <StatBox icon={<Droplets className="w-5 h-5 text-red-600" />} bg="bg-red-100" label="Leakages Reported" value={String(leakageStats.todayLeakage)} />
            <StatBox icon={<AlertTriangle className="w-5 h-5 text-rose-600" />} bg="bg-rose-100" label="Bags Leaked Today" value={String(leakageStats.todayLeakedBags)} />
          </div>

          {/* Bags Available Notice */}
          <div className={cn('p-4 rounded-xl border flex items-center gap-3', availableForDelivery > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200')}>
            {availableForDelivery > 0 ? <CheckCircle className="w-6 h-6 text-emerald-600" /> : <AlertTriangle className="w-6 h-6 text-red-600" />}
            <div>
              <p className="font-semibold text-slate-900">{availableForDelivery > 0 ? `${availableForDelivery} bags available from baggers` : 'No bags available — baggers have not produced enough'}</p>
              <p className="text-xs text-slate-500">Deliveries are limited to what baggers have produced today</p>
            </div>
          </div>

          {/* New Delivery Form */}
          <Card title="Create Delivery" subtitle="Assign bags for delivery">
            {showDeliveryForm ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Bags to Load * (Max: {availableForDelivery})</label>
                    <input type="number" min="1" max={availableForDelivery} value={deliveryForm.bagCount} onChange={e => setDeliveryForm({ ...deliveryForm, bagCount: e.target.value })} placeholder="0" className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Destination *</label>
                    <input value={deliveryForm.destination} onChange={e => setDeliveryForm({ ...deliveryForm, destination: e.target.value })} placeholder="e.g. Accra Branch" className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddDelivery} disabled={!deliveryForm.bagCount || !deliveryForm.destination || parseInt(deliveryForm.bagCount) > availableForDelivery} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50 text-sm"><Plus className="w-4 h-4" /> Create Delivery</button>
                  <button onClick={() => setShowDeliveryForm(false)} className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowDeliveryForm(true)} disabled={availableForDelivery === 0} className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50 transition">
                <Plus className="w-4 h-4" /> New Delivery
              </button>
            )}
          </Card>

          {/* Delivery List with Leakage Checkboxes */}
          <Card title="Today's Deliveries" subtitle={`${todayDeliveries.length} deliveries • ${leakageStats.todayLeakedBags} bags leaked`}>
            {todayDeliveries.length === 0 ? (
              <p className="text-center text-slate-500 py-6">No deliveries today. Create one above when bags are available.</p>
            ) : (
              <div className="space-y-3">
                {todayDeliveries.slice().reverse().map(d => (
                  <div key={d.id} className={cn('p-4 rounded-xl border transition', d.hasLeakage ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white')}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', d.hasLeakage ? 'bg-red-100' : d.status === 'delivered' ? 'bg-emerald-100' : 'bg-amber-100')}>
                          {d.hasLeakage ? <Droplets className="w-5 h-5 text-red-600" /> : <Truck className="w-5 h-5 text-amber-600" />}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{d.bagCount} bags → {d.destination}</p>
                          <p className="text-xs text-slate-500">{d.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        {/* Status */}
                        {d.status !== 'delivered' && (
                          <button onClick={() => { updateDeliveryStatus(d.id, 'delivered'); reload(); }} className="px-3 py-1.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200">Mark Delivered</button>
                        )}
                        <span className={cn('text-xs font-semibold px-3 py-1.5 rounded-full capitalize', d.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : d.status === 'in-transit' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700')}>{d.status}</span>
                      </div>
                    </div>

                    {/* ─── LEAKAGE CHECKBOX ─── */}
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={d.hasLeakage}
                          onChange={e => handleLeakageToggle(d.id, e.target.checked)}
                          className="w-5 h-5 rounded border-2 border-red-300 text-red-600 focus:ring-red-500 cursor-pointer"
                        />
                        <span className={cn('text-sm font-semibold', d.hasLeakage ? 'text-red-700' : 'text-slate-600')}>
                          {d.hasLeakage ? `⚠ LEAKAGE REPORTED — ${d.leakageCount} bags` : 'Report Leakage'}
                        </span>
                      </label>
                      {d.hasLeakage && d.leakageNotes && (
                        <p className="text-xs text-red-600 mt-1 ml-8">Note: {d.leakageNotes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

function StatBox({ icon, bg, label, value }: { icon: React.ReactNode; bg: string; label: string; value: string }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200">
      <div className="flex items-center gap-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', bg)}>{icon}</div>
        <div><p className="text-xs text-slate-500">{label}</p><p className="text-xl font-bold text-slate-900">{value}</p></div>
      </div>
    </div>
  );
}
