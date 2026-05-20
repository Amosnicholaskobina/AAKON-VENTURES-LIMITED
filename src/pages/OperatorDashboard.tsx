import { useState, useEffect } from 'react';
import { Cog, Droplets, Plus, AlertTriangle, Package, Clock, Activity, Gauge, CheckCircle, XCircle, RefreshCw, Waves, Thermometer, ArrowDown } from 'lucide-react';
import { Card } from '../components/ui';
import { cn } from '../utils/cn';
import { addMachineLoad, addWaterLevelCheck, getOperatorStats } from '../data/store';

const MACHINES = ['Machine A - Line 1', 'Machine B - Line 2', 'Machine C - Line 3', 'Filtration Unit', 'Packaging Unit'];
const SUPPLY_TYPES = ['Raw Water', 'Chlorine', 'Filter Cartridge', 'Packaging Film', 'Seal Material', 'Lubricant'];
const UNITS = ['Liters', 'Kg', 'Units', 'Rolls', 'Packs'];

export function OperatorDashboard({ onDataChange }: { onDataChange?: () => void }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState(getOperatorStats());
  const [showLoadForm, setShowLoadForm] = useState(false);
  const [showLevelForm, setShowLevelForm] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [loadForm, setLoadForm] = useState({ machineName: MACHINES[0], supplyType: SUPPLY_TYPES[0], quantity: '', unit: UNITS[0], notes: '' });
  const [levelForm, setLevelForm] = useState({ machineName: MACHINES[0], levelPercent: '', temperature: '', pressure: '', status: 'normal' as 'normal' | 'low' | 'critical' | 'overflow', notes: '' });

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const reload = () => { setStats(getOperatorStats()); onDataChange?.(); };

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const handleAddLoad = () => {
    if (!loadForm.quantity) return;
    addMachineLoad({ operatorId: 'current', operatorName: 'Operator', machineName: loadForm.machineName, supplyType: loadForm.supplyType, quantity: parseFloat(loadForm.quantity), unit: loadForm.unit, timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), notes: loadForm.notes });
    setLoadForm({ machineName: MACHINES[0], supplyType: SUPPLY_TYPES[0], quantity: '', unit: UNITS[0], notes: '' });
    setShowLoadForm(false);
    reload();
    showSuccess(`✅ ${loadForm.supplyType} loaded to ${loadForm.machineName}`);
  };

  const handleAddLevel = () => {
    if (!levelForm.levelPercent) return;
    const now = new Date();
    addWaterLevelCheck({ operatorId: 'current', operatorName: 'Operator', machineName: levelForm.machineName, levelPercent: parseFloat(levelForm.levelPercent), temperature: parseFloat(levelForm.temperature) || 0, pressure: parseFloat(levelForm.pressure) || 0, status: levelForm.status, timestamp: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), hour: `${String(now.getHours()).padStart(2, '0')}:00`, notes: levelForm.notes });
    setLevelForm({ machineName: MACHINES[0], levelPercent: '', temperature: '', pressure: '', status: 'normal', notes: '' });
    setShowLevelForm(false);
    reload();
    showSuccess(`✅ Water level check recorded for ${levelForm.machineName}`);
  };

  const handleQuickRefill = (machine: string, supply: string) => {
    const qty = prompt(`How much ${supply} to load into ${machine}?`, '50');
    if (!qty) return;
    addMachineLoad({ operatorId: 'current', operatorName: 'Operator', machineName: machine, supplyType: supply, quantity: parseFloat(qty), unit: 'Liters', timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), notes: 'Quick refill' });
    reload();
    showSuccess(`✅ Quick refill: ${qty}L ${supply} → ${machine}`);
  };

  // Get latest water level per machine
  const latestLevels = MACHINES.map(m => {
    const checks = stats.todayLevels.filter(w => w.machineName === m);
    return { machine: m, latest: checks.length > 0 ? checks[checks.length - 1] : null, checkCount: checks.length };
  });

  // Get loads per machine today
  const loadsPerMachine = MACHINES.map(m => {
    const loads = stats.todayLoads.filter(l => l.machineName === m);
    return { machine: m, loads, totalQty: loads.reduce((s, l) => s + l.quantity, 0) };
  });

  // Hours that need checks (every hour from 6am to 6pm)
  const currentHour = currentTime.getHours();
  const checkHours = Array.from({ length: 13 }, (_, i) => i + 6); // 6:00 to 18:00
  const completedHours = new Set(stats.todayLevels.map(w => parseInt(w.hour)));

  return (
    <div className="space-y-6">
      {/* ═══ HEADER BANNER ═══ */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Cog className="w-5 h-5 animate-[spin_8s_linear_infinite]" />
              <p className="text-indigo-100 text-sm font-medium">Machine Operations</p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">Operator Dashboard</h1>
            <p className="text-indigo-100/80 mt-1 text-sm">Load supplies, monitor water levels, keep machines running.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/15 backdrop-blur rounded-xl px-5 py-3 text-center">
              <p className="text-xs text-indigo-100">Current Time</p>
              <p className="text-2xl font-bold font-mono">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl px-5 py-3 text-center">
              <p className="text-xs text-indigo-100">Next Check Due</p>
              <p className="text-2xl font-bold font-mono">
                {checkHours.find(h => h >= currentHour && !completedHours.has(h)) !== undefined
                  ? `${String(checkHours.find(h => h >= currentHour && !completedHours.has(h))).padStart(2, '0')}:00`
                  : '✓ Done'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-semibold animate-pulse">
          {successMsg}
        </div>
      )}

      {/* ═══ STATS ROW ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatBox icon={<Package className="w-5 h-5 text-indigo-600" />} bg="bg-indigo-100" label="Supplies Loaded" value={String(stats.totalLoadsToday)} />
        <StatBox icon={<Droplets className="w-5 h-5 text-sky-600" />} bg="bg-sky-100" label="Level Checks" value={String(stats.totalChecksToday)} />
        <StatBox icon={<AlertTriangle className="w-5 h-5 text-red-600" />} bg="bg-red-100" label="Critical Alerts" value={String(stats.criticalAlerts)} accent={stats.criticalAlerts > 0 ? 'text-red-600' : undefined} />
        <StatBox icon={<Activity className="w-5 h-5 text-emerald-600" />} bg="bg-emerald-100" label="Machines Online" value={`${MACHINES.length}/${MACHINES.length}`} />
        <StatBox icon={<Clock className="w-5 h-5 text-violet-600" />} bg="bg-violet-100" label="Hours Checked" value={`${completedHours.size}/${checkHours.filter(h => h <= currentHour).length}`} />
      </div>

      {/* ═══ MACHINE STATUS GRID ═══ */}
      <Card title="Machine Status Overview" subtitle="Click a machine for details">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {latestLevels.map(({ machine, latest, checkCount }) => {
            const loads = loadsPerMachine.find(l => l.machine === machine);
            const isSelected = selectedMachine === machine;
            return (
              <button key={machine} onClick={() => setSelectedMachine(isSelected ? null : machine)}
                className={cn('p-4 rounded-xl border-2 transition text-left', isSelected ? 'border-indigo-400 bg-indigo-50 shadow-lg' : 'border-slate-200 bg-white hover:border-indigo-200 hover:shadow')}>
                <div className="flex items-center justify-between mb-3">
                  <Cog className={cn('w-5 h-5', latest?.status === 'critical' ? 'text-red-500' : latest?.status === 'low' ? 'text-amber-500' : 'text-indigo-500')} />
                  {latest ? (
                    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', latest.status === 'normal' ? 'bg-emerald-100 text-emerald-700' : latest.status === 'low' ? 'bg-amber-100 text-amber-700' : latest.status === 'critical' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700')}>{latest.status}</span>
                  ) : (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">No check</span>
                  )}
                </div>
                <p className="text-sm font-bold text-slate-900 truncate">{machine}</p>

                {/* Water level gauge */}
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">Water Level</span>
                    <span className="font-bold text-slate-900">{latest ? `${latest.levelPercent}%` : '—'}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div className={cn('h-3 rounded-full transition-all', !latest ? 'bg-slate-300' : latest.levelPercent > 70 ? 'bg-emerald-500' : latest.levelPercent > 40 ? 'bg-amber-500' : 'bg-red-500')}
                      style={{ width: `${latest?.levelPercent ?? 0}%` }} />
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{checkCount} checks</span>
                  <span>{loads?.loads.length ?? 0} loads</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected machine detail */}
        {selectedMachine && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-sky-50 border border-indigo-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-2"><Cog className="w-4 h-4 text-indigo-600" /> {selectedMachine}</h4>
              <button onClick={() => handleQuickRefill(selectedMachine, 'Raw Water')} className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Quick Refill</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(() => {
                const latest = latestLevels.find(l => l.machine === selectedMachine)?.latest;
                const loads = loadsPerMachine.find(l => l.machine === selectedMachine);
                return <>
                  <MiniStat icon={<Waves className="w-4 h-4 text-sky-600" />} label="Water Level" value={latest ? `${latest.levelPercent}%` : '—'} />
                  <MiniStat icon={<Thermometer className="w-4 h-4 text-amber-600" />} label="Temperature" value={latest ? `${latest.temperature}°C` : '—'} />
                  <MiniStat icon={<Gauge className="w-4 h-4 text-violet-600" />} label="Pressure" value={latest ? `${latest.pressure} PSI` : '—'} />
                  <MiniStat icon={<ArrowDown className="w-4 h-4 text-indigo-600" />} label="Today's Loads" value={`${loads?.totalQty ?? 0}`} />
                </>;
              })()}
            </div>
            {/* Recent loads for this machine */}
            {(() => {
              const mLoads = stats.todayLoads.filter(l => l.machineName === selectedMachine);
              if (mLoads.length === 0) return <p className="text-xs text-slate-500 mt-3">No supplies loaded today.</p>;
              return (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-600 mb-1">Supply loads:</p>
                  <div className="flex flex-wrap gap-2">
                    {mLoads.map(l => (
                      <span key={l.id} className="text-xs bg-white border border-indigo-200 rounded-full px-3 py-1 text-indigo-700 font-semibold">{l.supplyType}: {l.quantity} {l.unit} @ {l.timestamp}</span>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </Card>

      {/* ═══ HOURLY CHECK TIMELINE ═══ */}
      <Card title="Hourly Check Timeline" subtitle="Water level checks due every hour (6 AM – 6 PM)">
        <div className="flex flex-wrap gap-2">
          {checkHours.map(h => {
            const done = completedHours.has(h);
            const isPast = h < currentHour;
            const isCurrent = h === currentHour;
            const check = stats.todayLevels.find(w => parseInt(w.hour) === h);
            return (
              <div key={h} className={cn('flex flex-col items-center p-2 rounded-xl border-2 min-w-[70px] transition',
                done ? 'border-emerald-300 bg-emerald-50' :
                isCurrent ? 'border-amber-400 bg-amber-50 animate-pulse' :
                isPast ? 'border-red-300 bg-red-50' :
                'border-slate-200 bg-white'
              )}>
                <p className={cn('text-xs font-bold', done ? 'text-emerald-700' : isCurrent ? 'text-amber-700' : isPast ? 'text-red-600' : 'text-slate-500')}>
                  {String(h).padStart(2, '0')}:00
                </p>
                {done ? <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" /> :
                 isPast ? <XCircle className="w-5 h-5 text-red-400 mt-1" /> :
                 isCurrent ? <Clock className="w-5 h-5 text-amber-500 mt-1" /> :
                 <div className="w-5 h-5 rounded-full border-2 border-slate-300 mt-1" />}
                {check && <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">{check.levelPercent}%</p>}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-500" /> Completed</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-500" /> Due Now</span>
          <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-400" /> Missed</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full border-2 border-slate-300" /> Upcoming</span>
        </div>
      </Card>

      {/* ═══ ACTION BUTTONS ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={() => { setShowLoadForm(!showLoadForm); setShowLevelForm(false); }}
          className={cn('p-5 rounded-2xl border-2 transition flex items-center gap-4', showLoadForm ? 'border-indigo-400 bg-indigo-50 shadow-lg' : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md')}>
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shrink-0"><Cog className="w-7 h-7 text-white" /></div>
          <div className="text-left"><p className="font-bold text-slate-900">Load Supply to Machine</p><p className="text-xs text-slate-500">Record materials loaded into production machines</p></div>
        </button>
        <button onClick={() => { setShowLevelForm(!showLevelForm); setShowLoadForm(false); }}
          className={cn('p-5 rounded-2xl border-2 transition flex items-center gap-4', showLevelForm ? 'border-sky-400 bg-sky-50 shadow-lg' : 'border-slate-200 bg-white hover:border-sky-300 hover:shadow-md')}>
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center shrink-0"><Droplets className="w-7 h-7 text-white" /></div>
          <div className="text-left"><p className="font-bold text-slate-900">Hourly Water Level Check</p><p className="text-xs text-slate-500">Record water level, temperature, and pressure readings</p></div>
        </button>
      </div>

      {/* ═══ LOAD SUPPLY FORM ═══ */}
      {showLoadForm && (
        <Card title="Load Supply to Machine" subtitle="Record supply loaded into a machine">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect label="Machine *" value={loadForm.machineName} onChange={v => setLoadForm({ ...loadForm, machineName: v })} options={MACHINES} />
            <FormSelect label="Supply Type *" value={loadForm.supplyType} onChange={v => setLoadForm({ ...loadForm, supplyType: v })} options={SUPPLY_TYPES} />
            <div><label className="text-xs font-semibold text-slate-700 block mb-1">Quantity *</label><input type="number" min="0.1" step="0.1" value={loadForm.quantity} onChange={e => setLoadForm({ ...loadForm, quantity: e.target.value })} placeholder="0" className="w-full px-3 py-2.5 rounded-lg border border-slate-300 outline-none text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></div>
            <FormSelect label="Unit" value={loadForm.unit} onChange={v => setLoadForm({ ...loadForm, unit: v })} options={UNITS} />
            <div className="md:col-span-2"><label className="text-xs font-semibold text-slate-700 block mb-1">Notes</label><input value={loadForm.notes} onChange={e => setLoadForm({ ...loadForm, notes: e.target.value })} placeholder="Optional notes..." className="w-full px-3 py-2.5 rounded-lg border border-slate-300 outline-none text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleAddLoad} disabled={!loadForm.quantity} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50 text-sm"><Plus className="w-4 h-4" /> Record Load</button>
            <button onClick={() => setShowLoadForm(false)} className="px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 rounded-lg">Cancel</button>
          </div>
        </Card>
      )}

      {/* ═══ WATER LEVEL CHECK FORM ═══ */}
      {showLevelForm && (
        <Card title="Hourly Water Level Check" subtitle="Record machine readings">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormSelect label="Machine *" value={levelForm.machineName} onChange={v => setLevelForm({ ...levelForm, machineName: v })} options={MACHINES} />
            <div><label className="text-xs font-semibold text-slate-700 block mb-1">Water Level (%) *</label><input type="number" min="0" max="100" value={levelForm.levelPercent} onChange={e => setLevelForm({ ...levelForm, levelPercent: e.target.value })} placeholder="0-100" className="w-full px-3 py-2.5 rounded-lg border border-slate-300 outline-none text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-100" /></div>
            <div><label className="text-xs font-semibold text-slate-700 block mb-1">Temperature (°C)</label><input type="number" value={levelForm.temperature} onChange={e => setLevelForm({ ...levelForm, temperature: e.target.value })} placeholder="25" className="w-full px-3 py-2.5 rounded-lg border border-slate-300 outline-none text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-100" /></div>
            <div><label className="text-xs font-semibold text-slate-700 block mb-1">Pressure (PSI)</label><input type="number" value={levelForm.pressure} onChange={e => setLevelForm({ ...levelForm, pressure: e.target.value })} placeholder="30" className="w-full px-3 py-2.5 rounded-lg border border-slate-300 outline-none text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-100" /></div>
            <FormSelect label="Status *" value={levelForm.status} onChange={v => setLevelForm({ ...levelForm, status: v as 'normal' | 'low' | 'critical' | 'overflow' })} options={['normal', 'low', 'critical', 'overflow']} displayMap={{ normal: '✅ Normal', low: '⚠️ Low', critical: '🔴 Critical', overflow: '🔵 Overflow' }} />
            <div><label className="text-xs font-semibold text-slate-700 block mb-1">Notes</label><input value={levelForm.notes} onChange={e => setLevelForm({ ...levelForm, notes: e.target.value })} placeholder="Optional..." className="w-full px-3 py-2.5 rounded-lg border border-slate-300 outline-none text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-100" /></div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleAddLevel} disabled={!levelForm.levelPercent} className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50 text-sm"><Plus className="w-4 h-4" /> Record Check</button>
            <button onClick={() => setShowLevelForm(false)} className="px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 rounded-lg">Cancel</button>
          </div>
        </Card>
      )}

      {/* ═══ TODAY'S ACTIVITY LOG ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Today's Supply Loads" subtitle={`${stats.totalLoadsToday} loads recorded`}>
          {stats.todayLoads.length === 0 ? (
            <p className="text-center text-slate-500 py-6">No supply loads recorded today. Use the button above to start.</p>
          ) : (
            <div className="space-y-2">{stats.todayLoads.slice().reverse().map(l => (
              <div key={l.id} className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center"><Cog className="w-4 h-4 text-indigo-600" /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{l.supplyType}</p>
                    <p className="text-xs text-slate-500">{l.machineName}{l.notes ? ` • ${l.notes}` : ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-indigo-700">{l.quantity} {l.unit}</p>
                  <p className="text-xs text-slate-500">{l.timestamp}</p>
                </div>
              </div>
            ))}</div>
          )}
        </Card>

        <Card title="Hourly Water Level Checks" subtitle={`${stats.totalChecksToday} checks today`}>
          {stats.todayLevels.length === 0 ? (
            <p className="text-center text-slate-500 py-6">No water level checks recorded today. Start your hourly checks.</p>
          ) : (
            <div className="space-y-2">{stats.todayLevels.slice().reverse().map(w => (
              <div key={w.id} className={cn('flex items-center justify-between p-3 rounded-xl border', w.status === 'critical' ? 'bg-red-50 border-red-200' : w.status === 'low' ? 'bg-amber-50 border-amber-200' : w.status === 'overflow' ? 'bg-blue-50 border-blue-200' : 'bg-emerald-50 border-emerald-200')}>
                <div className="flex items-center gap-3">
                  <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', w.status === 'critical' ? 'bg-red-100' : w.status === 'low' ? 'bg-amber-100' : 'bg-emerald-100')}>
                    {w.status === 'critical' ? <AlertTriangle className="w-4 h-4 text-red-600" /> : w.status === 'low' ? <AlertTriangle className="w-4 h-4 text-amber-600" /> : <Droplets className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{w.machineName}</p>
                    <p className="text-xs text-slate-500">{w.hour} check{w.notes ? ` • ${w.notes}` : ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-bold">{w.levelPercent}%</span>
                    <span>{w.temperature}°C</span>
                    <span>{w.pressure} PSI</span>
                  </div>
                  <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full capitalize inline-block mt-0.5', w.status === 'normal' ? 'bg-emerald-100 text-emerald-700' : w.status === 'low' ? 'bg-amber-100 text-amber-700' : w.status === 'critical' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700')}>{w.status}</span>
                </div>
              </div>
            ))}</div>
          )}
        </Card>
      </div>

      {/* ═══ SHIFT SUMMARY ═══ */}
      <Card title="Shift Summary" subtitle="Today's operation overview">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white text-center">
            <Package className="w-6 h-6 mx-auto mb-1" />
            <p className="text-indigo-100 text-xs">Total Supplies</p>
            <p className="text-2xl font-bold">{stats.totalLoadsToday}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 text-white text-center">
            <Droplets className="w-6 h-6 mx-auto mb-1" />
            <p className="text-sky-100 text-xs">Level Checks</p>
            <p className="text-2xl font-bold">{stats.totalChecksToday}</p>
          </div>
          <div className={cn('p-4 rounded-xl text-white text-center', stats.criticalAlerts > 0 ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600')}>
            {stats.criticalAlerts > 0 ? <AlertTriangle className="w-6 h-6 mx-auto mb-1" /> : <CheckCircle className="w-6 h-6 mx-auto mb-1" />}
            <p className="text-white/80 text-xs">{stats.criticalAlerts > 0 ? 'Alerts' : 'Status'}</p>
            <p className="text-2xl font-bold">{stats.criticalAlerts > 0 ? stats.criticalAlerts : 'OK'}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white text-center">
            <Clock className="w-6 h-6 mx-auto mb-1" />
            <p className="text-violet-100 text-xs">Checks Done</p>
            <p className="text-2xl font-bold">{completedHours.size}/{checkHours.filter(h => h <= currentHour).length}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function StatBox({ icon, bg, label, value, accent }: { icon: React.ReactNode; bg: string; label: string; value: string; accent?: string }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', bg)}>{icon}</div>
        <div><p className="text-xs text-slate-500">{label}</p><p className={cn('text-xl font-bold', accent || 'text-slate-900')}>{value}</p></div>
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-3 bg-white rounded-lg border border-slate-200 text-center">
      <div className="flex items-center justify-center mb-1">{icon}</div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}

function FormSelect({ label, value, onChange, options, displayMap }: { label: string; value: string; onChange: (v: string) => void; options: string[]; displayMap?: Record<string, string> }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-700 block mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 outline-none text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
        {options.map(o => <option key={o} value={o}>{displayMap?.[o] ?? o}</option>)}
      </select>
    </div>
  );
}
