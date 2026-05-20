import { useState } from 'react';
import { Clock, Eye, EyeOff, User, BadgeCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { authenticateWorker } from '../data/store';

interface WorkerLoginPageProps {
  onLogin: (username: string) => void;
  onBack: () => void;
}

export function WorkerLoginPage({ onLogin, onBack }: WorkerLoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [workerId, setWorkerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!workerId || !password) { setError('Please enter Worker ID and password.'); return; }
    const user = authenticateWorker(workerId, password);
    if (user) { onLogin(workerId); }
    else { setError('Invalid Worker ID or password.'); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 border-4 border-white rounded-full"></div>
      </div>

      <div className="relative w-full max-w-md">
        <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to main login
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-600 to-gray-700 shadow-2xl mb-4">
            <Clock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Worker Portal</h1>
          <p className="text-slate-400 text-sm mt-1">AAKON VENTURE LIMITED</p>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-slate-900">Worker Login</h2>
          <p className="text-sm text-slate-500 mb-6">Enter your credentials to clock in</p>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Worker ID</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" value={workerId} onChange={(e) => setWorkerId(e.target.value)} placeholder="e.g. worker1"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-100 outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-100 outline-none text-sm pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={!workerId || !password}
              className="w-full py-3 bg-gradient-to-r from-slate-600 to-gray-700 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <BadgeCheck className="w-4 h-4" /> Clock In & Login
            </button>
          </form>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500">Default: <span className="font-mono">worker1 / work123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
