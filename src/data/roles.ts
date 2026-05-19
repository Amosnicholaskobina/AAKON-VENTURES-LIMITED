export type Role = 'ceo' | 'admin' | 'manager' | 'supervisor' | 'cashier' | 'worker' | 'quality_lab' | 'operator';

export interface RoleConfig {
  key: Role;
  label: string;
  color: string;
  gradient: string;
  permissions: string[];
  description: string;
}

export const roles: RoleConfig[] = [
  {
    key: 'ceo',
    label: 'CEO',
    color: 'from-purple-600 to-indigo-700',
    gradient: 'bg-gradient-to-br from-purple-600 to-indigo-700',
    permissions: ['all'],
    description: 'Executive overview & strategic insights',
  },
  {
    key: 'admin',
    label: 'Administrator',
    color: 'from-sky-600 to-cyan-700',
    gradient: 'bg-gradient-to-br from-sky-600 to-cyan-700',
    permissions: ['all'],
    description: 'Full system access & management',
  },
  {
    key: 'manager',
    label: 'Manager',
    color: 'from-emerald-600 to-teal-700',
    gradient: 'bg-gradient-to-br from-emerald-600 to-teal-700',
    permissions: ['dashboard', 'customers', 'sales', 'payments', 'inventory', 'supply', 'receipts', 'reports'],
    description: 'Operations & team management',
  },
  {
    key: 'supervisor',
    label: 'Supervisor',
    color: 'from-amber-600 to-orange-700',
    gradient: 'bg-gradient-to-br from-amber-600 to-orange-700',
    permissions: ['dashboard', 'sales', 'payments', 'inventory', 'supply', 'receipts'],
    description: 'Daily operations oversight',
  },
  {
    key: 'cashier',
    label: 'Cashier',
    color: 'from-rose-600 to-pink-700',
    gradient: 'bg-gradient-to-br from-rose-600 to-pink-700',
    permissions: ['sales', 'payments', 'receipts'],
    description: 'Sales transactions & payments',
  },
  {
    key: 'worker',
    label: 'Worker',
    color: 'from-slate-600 to-gray-700',
    gradient: 'bg-gradient-to-br from-slate-600 to-gray-700',
    permissions: ['timeclock', 'tasks'],
    description: 'Time tracking & task management',
  },
  {
    key: 'quality_lab',
    label: 'Quality Lab',
    color: 'from-teal-600 to-emerald-700',
    gradient: 'bg-gradient-to-br from-teal-600 to-emerald-700',
    permissions: ['quality', 'inventory'],
    description: 'Quality control & inventory tracking',
  },
  {
    key: 'operator',
    label: 'Operator',
    color: 'from-indigo-600 to-blue-700',
    gradient: 'bg-gradient-to-br from-indigo-600 to-blue-700',
    permissions: ['dashboard', 'operator'],
    description: 'Machine operations & water level checks',
  },
];

export const rolePermissions = {
  ceo: ['dashboard', 'customers', 'sales', 'payments', 'inventory', 'supply', 'receipts', 'reports', 'settings', 'users'],
  admin: ['dashboard', 'customers', 'sales', 'payments', 'inventory', 'supply', 'receipts', 'reports', 'settings', 'users'],
  manager: ['dashboard', 'customers', 'sales', 'payments', 'inventory', 'supply', 'receipts', 'reports'],
  supervisor: ['dashboard', 'sales', 'payments', 'inventory', 'supply', 'receipts'],
  cashier: ['sales', 'payments', 'receipts'],
  worker: ['timeclock', 'tasks'],
  quality_lab: ['quality', 'inventory'],
  operator: ['dashboard', 'operator'],
};

export function hasPermission(role: Role, page: string): boolean {
  const permissions = rolePermissions[role];
  return permissions.includes(page) || permissions.includes('all');
}

export function getRoleByKey(key: string): RoleConfig | undefined {
  return roles.find((r) => r.key === key);
}
