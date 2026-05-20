import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  gradient: string;
  subtitle?: string;
}

export function StatCard({ title, value, change, changeType = 'positive', icon: Icon, gradient, subtitle }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-slate-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{value}</p>
          {change && (
            <p
              className={cn(
                'text-xs font-semibold mt-2',
                changeType === 'positive' && 'text-emerald-600',
                changeType === 'negative' && 'text-red-600',
                changeType === 'neutral' && 'text-slate-500'
              )}
            >
              {change}
            </p>
          )}
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', gradient)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

interface CardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({ title, subtitle, action, children, className }: CardProps) {
  return (
    <div className={cn('bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden', className)}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
