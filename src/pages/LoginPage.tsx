import { useState } from 'react';
import { Droplet, Eye, EyeOff, UserCircle, Clock, FlaskConical, AlertCircle, Cog } from 'lucide-react';
import { roles, Role } from '../data/roles';
import { authenticate } from '../data/store';

interface LoginPageProps {
  onLogin: (role: Role, username: string) => void;
  onSwitchLogin: (type: 'worker' | 'quality' | 'operator') => void;
}

export function LoginPage({ onLogin, onSwitchLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | ''>('');
  const [error, setError] = useState('');

  const managementRoles = roles.filter(r => r.key !== 'worker' && r.key !== 'quality_lab');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!selectedRole || !username || !password) {
      setError('Please fill in all fields and select a role.');
      return;
    }
    const user = authenticate(username, password, selectedRole);
    if (user) {
      onLogin(selectedRole, username);
    } else {
      setError('Invalid username or password for the selected role.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-cyan-800 to-teal-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-600 shadow-2xl shadow-cyan-500/50 mb-4">
            <Droplet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">AAKON</h1>
          <p className="text-cyan-200 text-sm -mt-1">VENTURE LIMITED</p>
          <p className="text-cyan-200/80 text-xs mt-1">Bagged Water Management System</p>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-slate-900">Sign In</h2>
          <p className="text-sm text-slate-500 mb-6">Select your role and enter credentials</p>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Select Role</label>
              <div className="grid grid-cols-2 gap-2">
                {managementRoles.map((role) => (
                  <button
                    key={role.key}
                    type="button"
                    onClick={() => setSelectedRole(role.key)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      selectedRole === role.key
                        ? `border-transparent ${role.gradient} text-white shadow-lg`
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <p className={`text-sm font-bold ${selectedRole === role.key ? 'text-white' : 'text-slate-900'}`}>
                      {role.label}
                    </p>
                    <p className={`text-xs ${selectedRole === role.key ? 'text-white/80' : 'text-slate-500'}`}>
                      {role.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Username</label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={!selectedRole || !username || !password}
              className="w-full py-3 bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-sky-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed">
              Sign In
            </button>
          </form>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-semibold text-slate-700 mb-1">Default Accounts:</p>
            <div className="text-xs text-slate-500 space-y-0.5">
              <p>CEO: <span className="font-mono">ceo / ceo123</span></p>
              <p>Admin: <span className="font-mono">admin / admin123</span></p>
              <p>Manager: <span className="font-mono">manager / manager123</span></p>
              <p>Supervisor: <span className="font-mono">supervisor / super123</span></p>
              <p>Cashier: <span className="font-mono">cashier / cash123</span></p>
              <p>Operator: <span className="font-mono">operator1 / op123</span></p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <button onClick={() => onSwitchLogin('worker')} className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-center transition">
            <Clock className="w-5 h-5 text-white mx-auto mb-1" />
            <p className="text-xs text-white font-semibold">Worker</p>
          </button>
          <button onClick={() => onSwitchLogin('operator')} className="p-3 bg-indigo-800/50 hover:bg-indigo-800 rounded-xl text-center transition">
            <Cog className="w-5 h-5 text-white mx-auto mb-1" />
            <p className="text-xs text-white font-semibold">Operator</p>
          </button>
          <button onClick={() => onSwitchLogin('quality')} className="p-3 bg-teal-800/50 hover:bg-teal-800 rounded-xl text-center transition">
            <FlaskConical className="w-5 h-5 text-white mx-auto mb-1" />
            <p className="text-xs text-white font-semibold">Quality Lab</p>
          </button>
        </div>

        <p className="text-center text-xs text-cyan-200/70 mt-6">© 2026 AAKON VENTURE LIMITED. All rights reserved.</p>
      </div>
    </div>
  );
}
