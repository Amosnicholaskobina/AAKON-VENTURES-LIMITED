import {
  DollarSign, Truck, Clock, Package, AlertTriangle, TrendingUp, FileText, PlusCircle, BarChart3, Eye, Users, Cog, Droplets
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { StatCard, Card } from '../components/ui';
import { dailyRevenue, weeklySales, paymentMethods, deliveryStatus } from '../data/mockData';
import { cn } from '../utils/cn';
import { Role } from '../data/roles';
import { 
  getTodayRevenue, getCustomers, getPendingSalesCount, getTotalStock, 
  getLowStockCount, getSupplyCheckIns, getPayments, getReceipts,
  getOperatorStats, getTodayBaggerTotal, getLeakageStats
} from '../data/store';

interface DashboardPageProps {
  role: Role;
}

const COLORS = ['#0891b2', '#06b6d4', '#22d3ee', '#67e8f9'];

export function DashboardPage({ role }: DashboardPageProps) {
  const isExecutive = role === 'ceo' || role === 'admin';
  const isOperational = role === 'manager' || role === 'supervisor';
  const isCashier = role === 'cashier';
  
  const totalSalesToday = getTodayRevenue();
  const allCustomers = getCustomers();
  const allSupply = getSupplyCheckIns();
  const allPayments = getPayments();
  const allReceipts = getReceipts();
  
  const totalDeliveries = allSupply.filter(s => s.status === 'delivered').length;
  const pendingPayments = getPendingSalesCount();
  const availableStock = getTotalStock();
  const lowStockItems = getLowStockCount();

  // Operational Data for Admin Overview
  const opStats = getOperatorStats();
  const baggerTotal = getTodayBaggerTotal();
  const leakage = getLeakageStats();

  return (
    <div className="space-y-6">
      {/* Dynamic Header */}
      <div className={`bg-gradient-to-r rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden ${
        role === 'ceo' ? 'from-purple-700 via-indigo-700 to-violet-800' :
        role === 'admin' ? 'from-sky-700 via-cyan-700 to-teal-800' :
        role === 'manager' ? 'from-emerald-700 via-teal-700 to-cyan-800' :
        role === 'supervisor' ? 'from-amber-700 via-orange-700 to-red-800' :
        'from-rose-700 via-pink-700 to-purple-800'
      }`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative">
          <p className="text-white/80 text-sm font-medium">Security Identity Verified ✓</p>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">AAKON VENTURE LIMITED</h1>
          <p className="text-white/60 text-sm uppercase tracking-widest font-bold">{role} Control Center</p>
          {!isCashier && (
            <div className="flex flex-wrap gap-3 mt-5">
              <button className="bg-white text-sky-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-cyan-50 transition flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> New Sale
              </button>
              <button className="bg-white/15 backdrop-blur border border-white/30 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/25 transition flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> View Full Reports
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {(isExecutive || isOperational || isCashier) && (
          <StatCard title="Sales Today" value={`GHS ${totalSalesToday}`} change="+12.5%" icon={DollarSign} gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
        )}
        
        {/* Production & Machines (Management only) */}
        {isExecutive && (
          <>
            <StatCard title="Total Bagged" value={baggerTotal} change="Today's production" icon={Package} gradient="bg-gradient-to-br from-blue-500 to-blue-700" />
            <StatCard title="Leakage Rate" value={`${leakage.leakageRate.toFixed(1)}%`} change={`${leakage.todayLeakedBags} bags leaked`} changeType={leakage.leakageRate > 5 ? 'negative' : 'positive'} icon={Droplets} gradient="bg-gradient-to-br from-rose-500 to-red-600" />
            <StatCard title="Machine Checks" value={opStats.totalChecksToday} change={`${opStats.criticalAlerts} alerts`} changeType={opStats.criticalAlerts > 0 ? 'negative' : 'positive'} icon={Cog} gradient="bg-gradient-to-br from-indigo-500 to-indigo-700" />
          </>
        )}

        {isExecutive && (
          <>
            <StatCard title="Monthly Revenue" value="GHS 82.5K" change="+18%" icon={TrendingUp} gradient="bg-gradient-to-br from-purple-500 to-indigo-600" />
            <StatCard title="Profit Margin" value="32.5%" icon={Eye} gradient="bg-gradient-to-br from-teal-500 to-teal-700" />
          </>
        )}

        {(isExecutive || isOperational) && (
          <>
            <StatCard title="Total Customers" value={allCustomers.length} icon={Users} gradient="bg-gradient-to-br from-sky-500 to-sky-700" />
            <StatCard title="Pending Payments" value={pendingPayments} changeType="negative" icon={Clock} gradient="bg-gradient-to-br from-amber-500 to-orange-600" />
            <StatCard title="Available Stock" value={`${availableStock}`} subtitle="bags" icon={Package} gradient="bg-gradient-to-br from-violet-500 to-purple-600" />
            <StatCard title="Low Stock Alerts" value={lowStockItems} changeType="negative" icon={AlertTriangle} gradient="bg-gradient-to-br from-rose-500 to-red-600" />
          </>
        )}
      </div>

      {/* Primary Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Daily Revenue Flow" subtitle="Performance over current week" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dailyRevenue}>
              <defs><linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06b6d4" stopOpacity={0.5} /><stop offset="100%" stopColor="#06b6d4" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="day" stroke="#64748b" fontSize={12} /><YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} formatter={(value) => [`GHS ${value}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#0891b2" strokeWidth={3} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Payment Preferences" subtitle="Customer choice breakdown">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={paymentMethods} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">{paymentMethods.map((_, index) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}</Pie>
              <Tooltip formatter={(value) => `${value}%`} /><Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Transaction & Supply Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Latest Verified Payments" subtitle="Recently reconciled" action={<span className="text-xs text-sky-600 font-semibold cursor-pointer hover:underline">View all</span>}>
          <div className="space-y-3">
            {allPayments.slice(-4).reverse().map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-emerald-600" /></div>
                  <div><p className="text-sm font-semibold text-slate-900">{payment.customer_name}</p><p className="text-xs text-slate-500">{payment.payment_reference} • {payment.payment_date}</p></div>
                </div>
                <p className="text-sm font-bold text-emerald-600">GHS {payment.amount_paid}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Live Supply Pipeline" subtitle="Material and production status">
          <div className="space-y-3">
            {allSupply.slice(-4).reverse().map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center"><Truck className="w-5 h-5 text-sky-600" /></div>
                  <div><p className="text-sm font-semibold text-slate-900">{item.supplier_name}</p><p className="text-xs text-slate-500">{item.quantity_supplied} bags • {item.checkin_time}</p></div>
                </div>
                <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', item.status === 'delivered' && 'bg-emerald-100 text-emerald-700', item.status === 'in-transit' && 'bg-amber-100 text-amber-700', item.status === 'pending' && 'bg-slate-100 text-slate-700')}>{item.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="New Registered Customers" subtitle="Added this week">
          <div className="space-y-3">
            {allCustomers.slice(-4).reverse().map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">{customer.name.charAt(0)}</div>
                  <div><p className="text-sm font-semibold text-slate-900">{customer.name}</p><p className="text-xs text-slate-500">{customer.phone}</p></div>
                </div>
                <span className="text-xs text-slate-500">{customer.created_at}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Live Receipt Feed" subtitle="Recently generated tokens">
          <div className="space-y-3">
            {allReceipts.slice(-4).reverse().map((receipt) => (
              <div key={receipt.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center"><FileText className="w-5 h-5 text-cyan-600" /></div>
                  <div><p className="text-sm font-semibold text-slate-900">{receipt.receipt_number}</p><p className="text-xs text-slate-500">{receipt.customer_name} • GHS {receipt.amount}</p></div>
                </div>
                <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', receipt.sent_status ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>{receipt.sent_status ? 'Sent' : 'Pending'}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
