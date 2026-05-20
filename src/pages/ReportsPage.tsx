import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { Card } from '../components/ui';
import { dailyRevenue, weeklySales, paymentMethods } from '../data/mockData';
import { TrendingUp, Users, DollarSign, Package } from 'lucide-react';

const COLORS = ['#0891b2', '#06b6d4', '#22d3ee'];

const monthlyData = [
  { month: 'Jan', sales: 12000, customers: 45 },
  { month: 'Feb', sales: 15000, customers: 52 },
  { month: 'Mar', sales: 18000, customers: 61 },
  { month: 'Apr', sales: 16500, customers: 58 },
  { month: 'May', sales: 21000, customers: 72 },
];

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Reports & Analytics</h2>
        <p className="text-sm text-slate-500">Business insights and performance metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl text-white">
          <DollarSign className="w-6 h-6 mb-2" />
          <p className="text-xs text-emerald-100">Total Revenue</p>
          <p className="text-2xl font-bold">GHS 82,500</p>
          <p className="text-xs text-emerald-100 mt-1">+18% this month</p>
        </div>
        <div className="bg-gradient-to-br from-sky-500 to-cyan-600 p-4 rounded-2xl text-white">
          <Users className="w-6 h-6 mb-2" />
          <p className="text-xs text-sky-100">Active Customers</p>
          <p className="text-2xl font-bold">287</p>
          <p className="text-xs text-sky-100 mt-1">+12 new</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-4 rounded-2xl text-white">
          <Package className="w-6 h-6 mb-2" />
          <p className="text-xs text-violet-100">Units Sold</p>
          <p className="text-2xl font-bold">8,250</p>
          <p className="text-xs text-violet-100 mt-1">bags</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-2xl text-white">
          <TrendingUp className="w-6 h-6 mb-2" />
          <p className="text-xs text-amber-100">Growth Rate</p>
          <p className="text-2xl font-bold">+24%</p>
          <p className="text-xs text-amber-100 mt-1">vs last month</p>
        </div>
      </div>

      <Card title="Monthly Performance" subtitle="Sales and customer growth over 5 months">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
            <YAxis yAxisId="left" stroke="#0891b2" fontSize={12} />
            <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#0891b2" strokeWidth={3} name="Sales (GHS)" />
            <Line yAxisId="right" type="monotone" dataKey="customers" stroke="#8b5cf6" strokeWidth={3} name="Customers" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Revenue by Day" subtitle="This week">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="revenue" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Weekly Comparison" subtitle="4-week trend">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="sales" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Payment Method Distribution" subtitle="Customer preferences">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={paymentMethods}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {paymentMethods.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3">
            {paymentMethods.map((method, i) => (
              <div key={method.name} className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="font-semibold text-slate-900">{method.name}</span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">{method.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
