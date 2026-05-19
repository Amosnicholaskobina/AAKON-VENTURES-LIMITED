import { useState } from 'react';
import { FlaskConical, Eye, EyeOff, User, Shield, AlertCircle, ArrowLeft } from 'lucide-react';
import { authenticateLab } from '../data/store';

interface QualityLabLoginPageProps {
  onLogin: (username: string) => void;
  onBack: () => void;
}

export function QualityLabLoginPage({ onLogin, onBack }: QualityLabLoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [labId, setLabId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!labId || !password) { setError('Please enter Lab ID and password.'); return; }
    const user = authenticateLab(labId, password);
    if (user) { onLogin(labId); }
    else { setError('Invalid Lab ID or password.'); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-emerald-900 to-cyan-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-lg">
        <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to main login
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-2xl shadow-teal-500/50 mb-4">
            <FlaskConical className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Quality Lab Portal</h1>
          <p className="text-teal-200 text-sm mt-1">AAKON VENTURE LIMITED</p>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-teal-600" />
            <h2 className="text-xl font-bold text-slate-900">Lab Access</h2>
          </div>
          <p className="text-sm text-slate-500 mb-6">Authorized personnel only</p>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Lab ID</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" value={labId} onChange={(e) => setLabId(e.target.value)} placeholder="e.g. lab1"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none text-sm pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={!labId || !password}
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" /> Access Lab System
            </button>
          </form>

          <div className="mt-4 p-3 bg-teal-50 rounded-lg border border-teal-200">
            <p className="text-xs text-teal-800 font-semibold mb-1">⚠️ Security Notice</p>
            <p className="text-xs text-teal-600">All inventory movements are logged. Unauthorized access is prohibited.</p>
          </div>
          <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500">Default: <span className="font-mono">lab1 / lab123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
