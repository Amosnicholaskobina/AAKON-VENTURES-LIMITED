import { useState } from 'react';
import { Cog, Eye, EyeOff, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { authenticateOperator } from '../data/store';

interface OperatorLoginPageProps {
  onLogin: (username: string) => void;
  onBack: () => void;
}

export function OperatorLoginPage({ onLogin, onBack }: OperatorLoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [opId, setOpId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!opId || !password) { setError('Please enter Operator ID and password.'); return; }
    const user = authenticateOperator(opId, password);
    if (user) { onLogin(opId); }
    else { setError('Invalid Operator ID or password.'); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-40 h-40 border-4 border-white rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-56 h-56 border-4 border-white rounded-full"></div>
      </div>

      <div className="relative w-full max-w-md">
        <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to main login
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-2xl shadow-indigo-500/50 mb-4">
            <Cog className="w-10 h-10 text-white animate-[spin_8s_linear_infinite]" />
          </div>
          <h1 className="text-3xl font-bold text-white">Operator Portal</h1>
          <p className="text-indigo-200 text-sm mt-1">AAKON VENTURE LIMITED</p>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-slate-900">Operator Login</h2>
          <p className="text-sm text-slate-500 mb-6">Machine operations & water level monitoring</p>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Operator ID</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" value={opId} onChange={(e) => setOpId(e.target.value)} placeholder="e.g. operator1"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={!opId || !password}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <Cog className="w-4 h-4" /> Access Operator Panel
            </button>
          </form>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500">Default: <span className="font-mono">operator1 / op123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
