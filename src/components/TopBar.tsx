import { Bell, Menu, Search, User } from 'lucide-react';
import { RoleConfig } from '../data/roles';

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
  role?: RoleConfig;
  username?: string;
}

export function TopBar({ title, onMenuClick, role, username }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-500 hidden sm:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-64">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm flex-1 text-slate-700"
            />
          </div>

          <button className="relative p-2 rounded-lg hover:bg-slate-100">
            <Bell className="w-5 h-5 text-slate-700" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-sky-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">{username || 'User'}</p>
              <p className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 ${role?.gradient || 'bg-slate-200'} text-white`}>
                {role?.label || 'User'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
