import { useState } from 'react';
import { Droplet, Eye, EyeOff, Mail, Key, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { authenticateUser, generateOTP, verifyOTP, UserAccount } from '../data/store';

interface LoginPageProps {
  onLogin: (user: UserAccount) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempUser, setTempUser] = useState<UserAccount | null>(null);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const user = authenticateUser(email, password);
      if (user) {
        setTempUser(user);
        generateOTP(email);
        setStep('otp');
      } else {
        setError('Invalid email or password.');
      }
      setIsLoading(false);
    }, 800);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (verifyOTP(email, otp) && tempUser) {
      onLogin(tempUser);
    } else {
      setError('Invalid or expired OTP code.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative w-full max-w-[420px]">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[32px] bg-white/5 backdrop-blur-xl shadow-2xl mb-6 border border-white/10 group">
            <Droplet className="w-12 h-12 text-blue-400 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">AAKON</h1>
          <p className="text-blue-200/50 text-xs uppercase tracking-[0.3em] font-bold">Secure Identity Gateway</p>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/10 overflow-hidden">
          <div className="p-10">
            {step === 'credentials' ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-blue-100/40 text-sm mb-8 font-medium">Please sign in to access your secure area</p>

                {error && (
                  <div className="flex items-center gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" /> {error}
                  </div>
                )}

                <form onSubmit={handleCredentialsSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-blue-200/60 uppercase tracking-widest ml-1">Email Identity</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300/30 group-focus-within:text-blue-400 transition-colors" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@aakon.com"
                        className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-blue-200/20 focus:bg-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-blue-200/60 uppercase tracking-widest ml-1">Access Token</label>
                    <div className="relative group">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300/30 group-focus-within:text-blue-400 transition-colors" />
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-blue-200/20 focus:bg-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300/30 hover:text-blue-400 transition-colors">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={isLoading}
                    className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50">
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Request OTP'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <button onClick={() => setStep('credentials')} className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 hover:text-blue-300 flex items-center gap-1 transition-colors">
                  ← Change Identity
                </button>
                <h2 className="text-2xl font-bold text-white mb-2">MFA Required</h2>
                <p className="text-blue-100/40 text-sm mb-8 font-medium">Verify your login with the 6-digit code</p>

                {error && (
                  <div className="flex items-center gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" /> {error}
                  </div>
                )}

                <form onSubmit={handleOtpSubmit} className="space-y-8">
                  <div className="relative">
                    <input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} required placeholder="000000"
                      className="w-full text-center text-5xl font-black tracking-[0.4em] py-6 bg-white/5 border border-white/10 rounded-[32px] text-white outline-none focus:bg-white/10 focus:border-blue-500 focus:ring-8 focus:ring-blue-500/10 transition-all placeholder:text-blue-200/5" />
                  </div>

                  <div className="p-5 bg-blue-500/5 rounded-3xl border border-blue-500/10 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-100 tracking-wide">Verification Sent</p>
                      <p className="text-[10px] text-blue-200/40 leading-relaxed mt-1">For development, the code is logged in the console. Do not share your code.</p>
                    </div>
                  </div>

                  <button type="submit" 
                    className="w-full py-4 bg-white text-slate-950 font-black rounded-2xl transition-all shadow-xl hover:shadow-white/10 active:scale-[0.98]">
                    Authorize Device
                  </button>
                </form>
              </div>
            )}
          </div>
          <div className="bg-white/5 px-10 py-5 border-t border-white/10 flex justify-between items-center">
             <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">v2.0 AES Encrypted</p>
             <div className="flex gap-1">
               <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
               <div className="w-1 h-1 rounded-full bg-emerald-500/40"></div>
               <div className="w-1 h-1 rounded-full bg-emerald-500/10"></div>
             </div>
          </div>
        </div>

        <p className="text-center text-white/10 text-[10px] mt-12 font-black uppercase tracking-[0.2em]">
          AAKON Venture Ltd • Proprietary Access System
        </p>
      </div>
    </div>
  );
}
