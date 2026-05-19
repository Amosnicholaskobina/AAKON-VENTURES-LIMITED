import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  CreditCard,
  Package,
  Truck,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Droplet,
  X,
  Clock,
  ListTodo,
  ClipboardCheck,
  Cog,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { Role, rolePermissions } from '../data/roles';

export type PageKey =
  | 'dashboard'
  | 'customers'
  | 'sales'
  | 'payments'
  | 'inventory'
  | 'supply'
  | 'receipts'
  | 'reports'
  | 'settings'
  | 'timeclock'
  | 'tasks'
  | 'quality'
  | 'operator'
  | 'users';

interface SidebarProps {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  userRole: Role;
}

const allNavItems: { key: PageKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'customers', label: 'Customers', icon: Users },
  { key: 'sales', label: 'Sales', icon: ShoppingCart },
  { key: 'payments', label: 'Payments', icon: CreditCard },
  { key: 'inventory', label: 'Inventory', icon: Package },
  { key: 'supply', label: 'Supply Check-In', icon: Truck },
  { key: 'receipts', label: 'Receipts', icon: FileText },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
  { key: 'users', label: 'Staff Management', icon: Users },
  { key: 'timeclock', label: 'Time Clock', icon: Clock },
  { key: 'tasks', label: 'My Tasks', icon: ListTodo },
  { key: 'quality', label: 'Quality Control', icon: ClipboardCheck },
  { key: 'operator', label: 'Operator Panel', icon: Cog },
];

export function Sidebar({ activePage, onNavigate, onLogout, mobileOpen, onCloseMobile, userRole }: SidebarProps) {
  const permissions = rolePermissions[userRole];
  const navItems = allNavItems.filter((item) => permissions.includes(item.key) || permissions.includes('all'));
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen w-64 bg-gradient-to-b from-sky-900 via-sky-800 to-cyan-900 text-white flex flex-col z-50 transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-400/20 flex items-center justify-center">
              <Droplet className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">AAKON</h1>
              <p className="text-[10px] text-cyan-200/70 -mt-0.5">VENTURE LIMITED</p>
            </div>
          </div>
          <button className="lg:hidden text-white/70 hover:text-white" onClick={onCloseMobile}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.key;
              return (
                <li key={item.key}>
                  <button
                    onClick={() => {
                      onNavigate(item.key);
                      onCloseMobile();
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                      isActive
                        ? 'bg-cyan-500/30 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/30'
                        : 'text-cyan-100/80 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-cyan-100/80 hover:bg-red-500/20 hover:text-red-200 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
