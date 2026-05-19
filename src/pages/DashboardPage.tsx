import {
  DollarSign,
  Users,
  Truck,
  Clock,
  Package,
  AlertTriangle,
  TrendingUp,
  FileText,
  PlusCircle,
  BarChart3,
  Eye,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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
import {
  dailyRevenue,
  weeklySales,
  paymentMethods,
  deliveryStatus,
  payments,
  supplyCheckIns,
  customers,
  receipts,
} from '../data/mockData';
import { cn } from '../utils/cn';
import { Role } from '../data/roles';
import { getTodayRevenue, getCustomers, getPendingSalesCount, getTotalStock, getLowStockCount, getSupplyCheckIns } from '../data/store';

interface DashboardPageProps {
  role: Role;
}

const COLORS = ['#0891b2', '#06b6d4', '#22d3ee', '#67e8f9'];

export function DashboardPage({ role }: DashboardPageProps) {
  const isExecutive = role === 'ceo' || role === 'admin';
  const isOperational = role === 'manager' || role === 'supervisor';
  const isCashier = role === 'cashier';
  const totalSalesToday = getTodayRevenue();
  const totalCustomers = getCustomers().length;
  const allSupply = getSupplyCheckIns();
  const totalDeliveries = allSupply.filter(s => s.status === 'delivered').length;
  const pendingPayments = getPendingSalesCount();
  const availableStock = getTotalStock();
  const lowStockItems = getLowStockCount();
  void 0; // use live data below

  return (
    <div className="space-y-6">
      {/* Role-specific Hero banner */}
      <div className={`bg-gradient-to-r rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden ${
        role === 'ceo' ? 'from-purple-700 via-indigo-700 to-violet-800' :
        role === 'admin' ? 'from-sky-700 via-cyan-700 to-teal-800' :
        role === 'manager' ? 'from-emerald-700 via-teal-700 to-cyan-800' :
        role === 'supervisor' ? 'from-amber-700 via-orange-700 to-red-800' :
        'from-rose-700 via-pink-700 to-purple-800'
      }`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2"></div>
        <div className="relative">
          <p className="text-white/80 text-sm font-medium">
            {role === 'ceo' && 'Executive Overview 👔'}
            {role === 'admin' && 'System Administration ⚙️'}
            {role === 'manager' && 'Operations Management 📊'}
            {role === 'supervisor' && 'Daily Operations 📋'}
            {role === 'cashier' && 'Sales Terminal 💰'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">
            AAKON VENTURE LIMITED
          </h1>
          <p className="text-white/60 text-sm">
            {role === 'ceo' && 'CEO Dashboard'}
            {role === 'admin' && 'Admin Dashboard'}
            {role === 'manager' && 'Manager Dashboard'}
            {role === 'supervisor' && 'Supervisor Dashboard'}
            {role === 'cashier' && 'Cashier Dashboard'}
          </p>
          <p className="text-white/70 mt-2 max-w-xl text-sm sm:text-base">
            {role === 'ceo' && 'Strategic insights, financial performance, and business growth metrics at a glance.'}
            {role === 'admin' && 'Full system control, user management, and comprehensive business oversight.'}
            {role === 'manager' && 'Team performance, inventory levels, and operational efficiency tracking.'}
            {role === 'supervisor' && 'Monitor daily operations, deliveries, and staff performance.'}
            {role === 'cashier' && 'Quick access to sales, payments, and receipt generation.'}
          </p>
          {!isCashier && (
            <div className="flex flex-wrap gap-3 mt-5">
              <button className="bg-white text-sky-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-cyan-50 transition flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> New Sale
              </button>
              <button className="bg-white/15 backdrop-blur border border-white/30 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/25 transition flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> View Reports
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stat cards - Role specific */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {(isExecutive || isOperational) && (
          <>
            <StatCard
              title="Sales Today"
              value={`GHS ${totalSalesToday}`}
              change="+12.5% from yesterday"
              icon={DollarSign}
              gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
            />
            <StatCard
              title="Total Customers"
              value={totalCustomers}
              change="+3 this week"
              icon={Users}
              gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
            />
          </>
        )}
        {isExecutive && (
          <>
            <StatCard
              title="Monthly Revenue"
              value="GHS 82.5K"
              change="+18% vs last month"
              icon={TrendingUp}
              gradient="bg-gradient-to-br from-purple-500 to-indigo-600"
            />
            <StatCard
              title="Profit Margin"
              value="32.5%"
              change="+2.1% improvement"
              icon={Eye}
              gradient="bg-gradient-to-br from-amber-500 to-orange-600"
            />
          </>
        )}
        {(isExecutive || isOperational) && (
          <>
            <StatCard
              title="Total Deliveries"
              value={totalDeliveries}
              change="+8 today"
              icon={Truck}
              gradient="bg-gradient-to-br from-sky-500 to-cyan-600"
            />
            <StatCard
              title="Pending Payments"
              value={pendingPayments}
              change="Needs follow-up"
              changeType="negative"
              icon={Clock}
              gradient="bg-gradient-to-br from-amber-500 to-orange-600"
            />
          </>
        )}
        {isOperational && (
          <>
            <StatCard
              title="Available Stock"
              value={`${availableStock}`}
              subtitle="bags"
              icon={Package}
              gradient="bg-gradient-to-br from-violet-500 to-purple-600"
            />
            <StatCard
              title="Low Stock Alerts"
              value={lowStockItems}
              change="Reorder needed"
              changeType="negative"
              icon={AlertTriangle}
              gradient="bg-gradient-to-br from-rose-500 to-red-600"
            />
          </>
        )}
        {isCashier && (
          <>
            <StatCard
              title="Sales Today"
              value={`GHS ${totalSalesToday}`}
              change="+12.5% from yesterday"
              icon={DollarSign}
              gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
            />
            <StatCard
              title="Transactions"
              value={payments.length}
              change="Today"
              icon={FileText}
              gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
            />
            <StatCard
              title="Receipts Generated"
              value={receipts.length}
              change="This week"
              icon={FileText}
              gradient="bg-gradient-to-br from-sky-500 to-cyan-600"
            />
            <StatCard
              title="Avg. Transaction"
              value="GHS 175"
              change="Per sale"
              icon={TrendingUp}
              gradient="bg-gradient-to-br from-violet-500 to-purple-600"
            />
          </>
        )}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Daily Revenue" subtitle="This week's performance" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dailyRevenue}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                formatter={(value) => [`GHS ${value}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#0891b2" strokeWidth={3} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Payment Methods" subtitle="Breakdown">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={paymentMethods}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {paymentMethods.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Weekly Sales Trend" subtitle="Last 4 weeks">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                formatter={(value) => [`GHS ${value}`, 'Sales']}
              />
              <Bar dataKey="sales" fill="#0891b2" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Supply Delivery Status" subtitle="Current operations">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={deliveryStatus} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis type="category" dataKey="status" stroke="#64748b" fontSize={12} width={90} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {deliveryStatus.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card
          title="Recent Payments"
          subtitle="Latest transactions"
          action={
            <span className="text-xs text-sky-600 font-semibold cursor-pointer hover:underline">View all</span>
          }
        >
          <div className="space-y-3">
            {payments.slice(0, 4).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{payment.customer_name}</p>
                    <p className="text-xs text-slate-500">{payment.payment_reference} • {payment.payment_date}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-emerald-600">GHS {payment.amount_paid}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Latest Deliveries"
          subtitle="Supply check-ins"
          action={
            <span className="text-xs text-sky-600 font-semibold cursor-pointer hover:underline">View all</span>
          }
        >
          <div className="space-y-3">
            {supplyCheckIns.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.supplier_name}</p>
                    <p className="text-xs text-slate-500">{item.quantity_supplied} bags • {item.checkin_time}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    'text-xs font-semibold px-2.5 py-1 rounded-full',
                    item.status === 'delivered' && 'bg-emerald-100 text-emerald-700',
                    item.status === 'in-transit' && 'bg-amber-100 text-amber-700',
                    item.status === 'pending' && 'bg-slate-100 text-slate-700'
                  )}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom row: new customers and recent receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="New Customers" subtitle="Recently joined">
          <div className="space-y-3">
            {customers.slice(0, 4).map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{customer.name}</p>
                    <p className="text-xs text-slate-500">{customer.phone}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-500">{customer.created_at}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Receipts" subtitle="Latest generated">
          <div className="space-y-3">
            {receipts.slice(0, 4).map((receipt) => (
              <div key={receipt.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{receipt.receipt_number}</p>
                    <p className="text-xs text-slate-500">{receipt.customer_name} • GHS {receipt.amount}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    'text-xs font-semibold px-2.5 py-1 rounded-full',
                    receipt.sent_status ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  )}
                >
                  {receipt.sent_status ? 'Sent' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
