import {
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  BarChart3,
  Award,
  Target,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { StatCard, Card } from '../components/ui';
import { getLeakageStats, getTodayBaggerTotal, getLoaderDeliveries, getOperatorStats } from '../data/store';
import { cn } from '../utils/cn';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

const financialData = [
  { month: 'Jan', revenue: 45000, profit: 14500, expenses: 30500 },
  { month: 'Feb', revenue: 52000, profit: 17200, expenses: 34800 },
  { month: 'Mar', revenue: 61000, profit: 20100, expenses: 40900 },
  { month: 'Apr', revenue: 58000, profit: 18900, expenses: 39100 },
  { month: 'May', revenue: 72000, profit: 24500, expenses: 47500 },
];

const regionalData = [
  { region: 'Accra', sales: 35 },
  { region: 'Kumasi', sales: 25 },
  { region: 'Tema', sales: 20 },
  { region: 'Takoradi', sales: 12 },
  { region: 'Other', sales: 8 },
];

export function CEODashboard() {
  const leakage = getLeakageStats();
  const todayBagged = getTodayBaggerTotal();
  const todayDeliveries = getLoaderDeliveries().filter(d => d.date === new Date().toISOString().slice(0, 10));
  const opStats = getOperatorStats();

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Revenue"
          value="GHS 72,000"
          change="+18.5% vs last month"
          icon={DollarSign}
          gradient="bg-gradient-to-br from-purple-500 to-indigo-600"
        />
        <StatCard
          title="Profit Margin"
          value="34.2%"
          change="+3.2% improvement"
          icon={Eye}
          gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Growth Rate"
          value="+24%"
          change="YoY comparison"
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-amber-500 to-orange-600"
        />
        <StatCard
          title="Market Share"
          value="18.5%"
          change="+2.1% this quarter"
          icon={Target}
          gradient="bg-gradient-to-br from-sky-500 to-cyan-600"
        />
      </div>

      {/* Financial Performance */}
      <Card title="Financial Performance" subtitle="Revenue, Profit & Expenses Trend">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={financialData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
            <Legend />
            <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fill="url(#revGrad)" name="Revenue" />
            <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} fill="url(#profitGrad)" name="Profit" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Regional Performance */}
        <Card title="Regional Sales Distribution" subtitle="By location">
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={260}>
              <PieChart>
                <Pie
                  data={regionalData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="sales"
                >
                  {regionalData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {regionalData.map((item, i) => (
                <div key={item.region} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-sm font-medium text-slate-700">{item.region}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{item.sales}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* KPIs */}
        <Card title="Key Performance Indicators" subtitle="Business health metrics">
          <div className="space-y-4">
            <KPIRow icon={Award} label="Customer Satisfaction" value="94%" trend="up" color="emerald" />
            <KPIRow icon={Activity} label="Operational Efficiency" value="87%" trend="up" color="sky" />
            <KPIRow icon={BarChart3} label="Sales Target Achievement" value="112%" trend="up" color="purple" />
            <KPIRow icon={Users} label="Customer Retention" value="89%" trend="stable" color="amber" />
          </div>
        </Card>
      </div>

      {/* ═══ Leakage & Production Report ═══ */}
      <Card title="Production & Leakage Report" subtitle="Bagger output and delivery leakage tracking">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-center">
            <p className="text-xs text-sky-600 font-semibold">Bags Produced Today</p>
            <p className="text-2xl font-bold text-sky-800 mt-1">{todayBagged}</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <p className="text-xs text-amber-600 font-semibold">Deliveries Today</p>
            <p className="text-2xl font-bold text-amber-800 mt-1">{todayDeliveries.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center">
            <p className="text-xs text-red-600 font-semibold">Leakages Reported</p>
            <p className="text-2xl font-bold text-red-800 mt-1">{leakage.leakageCount}</p>
          </div>
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-center">
            <p className="text-xs text-rose-600 font-semibold">Total Bags Leaked</p>
            <p className="text-2xl font-bold text-rose-800 mt-1">{leakage.totalLeakedBags}</p>
          </div>
          <div className={cn('p-4 rounded-xl border text-center', leakage.leakageRate > 5 ? 'bg-red-50 border-red-300' : 'bg-emerald-50 border-emerald-200')}>
            <p className={cn('text-xs font-semibold', leakage.leakageRate > 5 ? 'text-red-600' : 'text-emerald-600')}>Leakage Rate</p>
            <p className={cn('text-2xl font-bold mt-1', leakage.leakageRate > 5 ? 'text-red-800' : 'text-emerald-800')}>{leakage.leakageRate.toFixed(1)}%</p>
          </div>
        </div>

        {leakage.recentLeakages.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Recent Leakage Incidents</h4>
            <div className="space-y-2">
              {leakage.recentLeakages.map(d => (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{d.bagCount} bags → {d.destination}</p>
                      <p className="text-xs text-slate-500">{d.leakageNotes || 'No notes'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600">{d.leakageCount} leaked</p>
                    <p className="text-xs text-slate-500">{d.date} {d.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {leakage.recentLeakages.length === 0 && (
          <p className="text-center text-slate-500 py-4">No leakage incidents recorded yet.</p>
        )}
      </Card>

      {/* Operator Machine Status */}
      <Card title="Machine Operations (Operators)" subtitle={`${opStats.totalLoadsToday} loads • ${opStats.totalChecksToday} checks today`}>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
            <p className="text-xs text-indigo-600 font-semibold">Supply Loads</p>
            <p className="text-2xl font-bold text-indigo-800 mt-1">{opStats.totalLoadsToday}</p>
          </div>
          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-center">
            <p className="text-xs text-sky-600 font-semibold">Water Checks</p>
            <p className="text-2xl font-bold text-sky-800 mt-1">{opStats.totalChecksToday}</p>
          </div>
          <div className={cn('p-4 rounded-xl border text-center', opStats.criticalAlerts > 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200')}>
            <p className={cn('text-xs font-semibold', opStats.criticalAlerts > 0 ? 'text-red-600' : 'text-emerald-600')}>Critical Alerts</p>
            <p className={cn('text-2xl font-bold mt-1', opStats.criticalAlerts > 0 ? 'text-red-800' : 'text-emerald-800')}>{opStats.criticalAlerts}</p>
          </div>
        </div>
        {opStats.criticalLevels.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-red-700 mb-2">⚠ Critical Water Levels</h4>
            <div className="space-y-2">{opStats.criticalLevels.slice(-5).reverse().map(w => (
              <div key={w.id} className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-200">
                <div className="flex items-center gap-3"><AlertTriangle className="w-4 h-4 text-red-600" /><div><p className="text-sm font-semibold text-slate-900">{w.machineName}</p><p className="text-xs text-slate-500">{w.hour} • {w.date}</p></div></div>
                <div className="text-right"><p className="font-bold text-red-600">{w.levelPercent}%</p><p className="text-xs text-slate-500">{w.temperature}°C</p></div>
              </div>
            ))}</div>
          </div>
        )}
      </Card>

      {/* Strategic Insights */}
      <Card title="Strategic Insights" subtitle="AI-powered recommendations">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InsightCard
            type="opportunity"
            title="Expansion Opportunity"
            description="Tema region shows 45% growth potential. Consider increasing supply capacity."
          />
          <InsightCard
            type="alert"
            title="Cost Optimization"
            description="Transportation costs increased 12%. Review delivery routes for efficiency."
          />
          <InsightCard
            type="success"
            title="Revenue Milestone"
            description="On track to exceed Q2 targets by 15%. Maintain current sales momentum."
          />
        </div>
      </Card>
    </div>
  );
}

function KPIRow({ icon: Icon, label, value, trend, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; trend: 'up' | 'down' | 'stable'; color: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl bg-${color}-100 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-slate-900">{value}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          trend === 'up' ? 'bg-emerald-100 text-emerald-700' :
          trend === 'down' ? 'bg-red-100 text-red-700' :
          'bg-slate-200 text-slate-600'
        }`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
        </span>
      </div>
    </div>
  );
}

function InsightCard({ type, title, description }: { type: 'opportunity' | 'alert' | 'success'; title: string; description: string }) {
  const colors = {
    opportunity: 'from-sky-50 to-cyan-50 border-sky-200',
    alert: 'from-amber-50 to-orange-50 border-amber-200',
    success: 'from-emerald-50 to-teal-50 border-emerald-200',
  };
  const icons = {
    opportunity: '💡',
    alert: '⚠️',
    success: '🎯',
  };

  return (
    <div className={`p-4 rounded-xl border bg-gradient-to-br ${colors[type]}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icons[type]}</span>
        <h4 className="font-semibold text-slate-900">{title}</h4>
      </div>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}
