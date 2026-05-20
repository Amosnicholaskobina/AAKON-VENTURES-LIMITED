import {
  Users,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  ShoppingCart,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { StatCard, Card } from '../components/ui';
import { supplyCheckIns } from '../data/mockData';
import { cn } from '../utils/cn';

const teamPerformance = [
  { name: 'John', sales: 45, target: 40 },
  { name: 'Sarah', sales: 52, target: 40 },
  { name: 'Michael', sales: 38, target: 40 },
  { name: 'Emma', sales: 48, target: 40 },
  { name: 'David', sales: 41, target: 40 },
];

const inventoryStatus = [
  { product: '500ml Pure', available: 150, min: 100, status: 'good' },
  { product: '1L Crystal', available: 80, min: 50, status: 'good' },
  { product: '2L Mountain', available: 45, min: 60, status: 'low' },
  { product: '5L Premium', available: 30, min: 40, status: 'low' },
];

export function ManagerDashboard() {
  return (
    <div className="space-y-6">
      {/* Manager Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Team Sales Today"
          value="GHS 1,250"
          change="+15% vs target"
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Active Staff"
          value="8/10"
          change="On shift"
          icon={Users}
          gradient="bg-gradient-to-br from-sky-500 to-cyan-600"
        />
        <StatCard
          title="Pending Orders"
          value="12"
          change="Needs attention"
          changeType="negative"
          icon={Clock}
          gradient="bg-gradient-to-br from-amber-500 to-orange-600"
        />
        <StatCard
          title="Stock Alerts"
          value="2"
          change="Reorder needed"
          changeType="negative"
          icon={Package}
          gradient="bg-gradient-to-br from-rose-500 to-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Team Performance */}
        <Card title="Team Performance" subtitle="Sales vs Target">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={teamPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="sales" fill="#10b981" radius={[6, 6, 0, 0]} name="Actual" />
              <Bar dataKey="target" fill="#94a3b8" radius={[6, 6, 0, 0]} name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Inventory Overview */}
        <Card title="Inventory Status" subtitle="Stock levels">
          <div className="space-y-3">
            {inventoryStatus.map((item) => (
              <div key={item.product} className="p-3 rounded-xl bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700">{item.product}</span>
                  <span className={cn(
                    'text-xs font-semibold px-2 py-0.5 rounded-full',
                    item.status === 'good' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  )}>
                    {item.status === 'good' ? '✓ Good' : '⚠ Low'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Available: {item.available}</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-500">Min: {item.min}</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-2 ml-2">
                    <div
                      className={cn('h-2 rounded-full', item.status === 'good' ? 'bg-emerald-500' : 'bg-red-500')}
                      style={{ width: `${Math.min((item.available / (item.min * 2)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Operations Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Today's Activity" subtitle="Live updates">
          <div className="space-y-3">
            <ActivityItem icon={ShoppingCart} label="New Sale" value="GHS 200" time="2 min ago" color="emerald" />
            <ActivityItem icon={Truck} label="Delivery Arrived" value="300 bags" time="15 min ago" color="sky" />
            <ActivityItem icon={CheckCircle} label="Order Completed" value="#ORD-4521" time="32 min ago" color="violet" />
            <ActivityItem icon={AlertCircle} label="Low Stock Alert" value="2L Mountain" time="1 hr ago" color="amber" />
          </div>
        </Card>

        <Card title="Pending Tasks" subtitle="Requires action">
          <div className="space-y-2">
            <TaskItem priority="high" title="Approve Purchase Order" desc="Supplier: AquaSource Ltd" />
            <TaskItem priority="high" title="Review Staff Schedule" desc="Next week roster" />
            <TaskItem priority="medium" title="Stock Reorder" desc="2L Mountain Water" />
            <TaskItem priority="low" title="Update Price List" desc="Q2 2026 revision" />
          </div>
        </Card>

        <Card title="Delivery Status" subtitle="In progress">
          <div className="space-y-3">
            {supplyCheckIns.filter(s => s.status !== 'delivered').map((delivery) => (
              <div key={delivery.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{delivery.supplier_name}</p>
                    <p className="text-xs text-slate-500">{delivery.quantity_supplied} bags</p>
                  </div>
                  <span className={cn(
                    'text-xs font-semibold px-2 py-1 rounded-full',
                    delivery.status === 'in-transit' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                  )}>
                    {delivery.status}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Expected: {delivery.checkin_time}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ActivityItem({ icon: Icon, label, value, time, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; time: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', `bg-${color}-100`)}>
        <Icon className={cn('w-4 h-4', `text-${color}-600`)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">{label}</p>
        <p className="text-xs text-slate-500">{value}</p>
      </div>
      <span className="text-xs text-slate-400">{time}</span>
    </div>
  );
}

function TaskItem({ priority, title, desc }: { priority: 'high' | 'medium' | 'low'; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
      <div className={cn(
        'w-2 h-2 rounded-full',
        priority === 'high' ? 'bg-red-500' : priority === 'medium' ? 'bg-amber-500' : 'bg-slate-400'
      )} />
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </div>
  );
}
