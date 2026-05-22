import { useState } from 'react';
import { Droplet, Eye, EyeOff, UserCircle, AlertCircle } from 'lucide-react';
import { Role } from '../data/roles';
import { authenticate, generateOTP, verifyOTP, resendOTP, getClientDeviceId, setRememberDevice, isDeviceRemembered, UserAccount } from '../data/store';

interface LoginPageProps {
  onLogin: (user: UserAccount) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [pendingUser, setPendingUser] = useState<UserAccount | null>(null);
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [rememberDevice, setRememberDeviceState] = useState(false);
  const [error, setError] = useState('');
  const [otpMessage, setOtpMessage] = useState('');

  const managementOtpRoles = new Set<Role>(['ceo', 'admin', 'manager', 'supervisor']);

  const maskPhone = (phone: string) => phone.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/, '$1***$3***');

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOtpMessage('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    const user = authenticate(email.trim().toLowerCase(), password);
    if (!user) {
      setError('Invalid email or password.');
      return;
    }

    if (managementOtpRoles.has(user.role)) {
      const deviceId = getClientDeviceId();
      if (isDeviceRemembered(user.email, deviceId)) {
        // device trusted — bypass OTP
        onLogin(user);
        return;
      }

      setPendingUser(user);
      const phoneMask = maskPhone(user.phoneNumber);
      generateOTP(user.email);
      setOtpMessage(`One-time code sent to ${phoneMask}.`);
      setStep('otp');
      return;
    }

    onLogin(user);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otpCode.trim() || !pendingUser) {
      setError('Enter the verification code sent to your phone.');
      return;
    }

    if (!verifyOTP(pendingUser.email, otpCode.trim())) {
      setError('Invalid or expired verification code.');
      return;
    }

    // remember device if requested
    try {
      const deviceId = getClientDeviceId();
      if (rememberDevice) setRememberDevice(pendingUser.email, deviceId, 30);
    } catch {}

    onLogin(pendingUser);
  };

  const handleBackToCredentials = () => {
    setStep('credentials');
    setOtpCode('');
    setOtpMessage('');
    setPendingUser(null);
    setPassword('');
  };

  const handleResend = () => {
    if (!pendingUser) return;
    const res = resendOTP(pendingUser.email);
    if (!res.ok) {
      setError(res.message || 'Unable to resend code yet.');
    } else {
      setOtpMessage(res.message || 'Code resent.');
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-900 via-cyan-800 to-teal-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-cyan-400 to-sky-600 shadow-2xl shadow-cyan-500/50 mb-4">
            <Droplet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">AAKON</h1>
          <p className="text-cyan-200 text-sm -mt-1">VENTURE LIMITED</p>
          <p className="text-cyan-200/80 text-xs mt-1">Bagged Water Management System</p>
        </div>

        <div className="mb-6 rounded-4xl bg-slate-950/90 border border-white/10 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_30%)] pointer-events-none" />
          <div className="relative p-4">
            <div className="flex items-center justify-between mb-4 gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Voltic Cool Pac</p>
                <h2 className="text-xl font-bold text-white">Automated Sachet Production Line</h2>
              </div>
              <span className="text-[10px] uppercase tracking-[0.36em] bg-cyan-500/20 text-cyan-100 px-3 py-1 rounded-full">Live Preview</span>
            </div>

            <div className="relative h-56 rounded-3xl bg-slate-900/80 border border-cyan-500/10 p-4 overflow-hidden">
              <div className="absolute left-5 top-6 w-20 h-28 rounded-3xl bg-slate-800/90 border border-slate-700 shadow-inner">
                <div className="absolute inset-x-2 top-2 h-12 rounded-2xl bg-slate-700" />
                <div className="absolute inset-x-4 top-16 h-16 rounded-2xl bg-cyan-400/20 border border-cyan-500/30" />
                <div className="absolute left-1/2 top-14 w-2 h-14 bg-cyan-300 rounded-full animate-voltic-drop" />
                <div className="absolute left-1/2 top-32 w-3 h-3 bg-cyan-100 rounded-full shadow-[0_0_25px_rgba(56,189,248,0.6)] animate-pulse" />
              </div>

              <div className="absolute left-[24%] top-8 w-1 h-40 bg-slate-700 rounded-full" />
              <div className="absolute right-[19%] top-12 w-1 h-32 bg-slate-700 rounded-full" />
              <div className="absolute left-0 right-0 top-[58%] h-12 bg-slate-800/80 border-t border-slate-700" />

              <div className="absolute left-10 top-[54%] w-24 h-8 rounded-full bg-slate-800 border border-slate-700" />
              <div className="absolute left-[32%] top-[54%] w-28 h-8 rounded-full bg-slate-800 border border-slate-700" />
              <div className="absolute right-10 top-[54%] w-24 h-8 rounded-full bg-slate-800 border border-slate-700" />

              <div className="absolute left-14 top-[58%] flex gap-2 animate-sachet-slide">
                <div className="w-10 h-14 rounded-2xl bg-white/90 border border-slate-300 shadow-lg flex items-center justify-center text-[10px] font-semibold text-slate-700">Voltic</div>
                <div className="w-10 h-14 rounded-2xl bg-white/90 border border-slate-300 shadow-lg flex items-center justify-center text-[10px] font-semibold text-slate-700">Cool</div>
                <div className="w-10 h-14 rounded-2xl bg-white/90 border border-slate-300 shadow-lg flex items-center justify-center text-[10px] font-semibold text-slate-700">Pac</div>
              </div>

              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center animate-spin-slow">
                  <div className="w-3 h-3 rounded-full bg-cyan-300" />
                </div>
                <div>
                  <p className="text-xs text-cyan-300 uppercase tracking-[0.25em]">Filling</p>
                  <p className="text-[11px] text-slate-300">Water injection nozzles feed sachets</p>
                </div>
              </div>

              <div className="absolute bottom-6 right-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center animate-pulse-slow">
                  <div className="w-3 h-3 rounded-full bg-cyan-300" />
                </div>
                <div>
                  <p className="text-xs text-cyan-300 uppercase tracking-[0.25em]">Sealing</p>
                  <p className="text-[11px] text-slate-300">Heat seals each packet as it exits</p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-white text-xs">
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-3">
                <p className="font-semibold text-cyan-300 mb-1">1. Purification</p>
                <p className="text-slate-300">Filtered water enters the filling chamber.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-3">
                <p className="font-semibold text-cyan-300 mb-1">2. Filling</p>
                <p className="text-slate-300">Automated nozzles fill Voltic Cool Pac sachets.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-3">
                <p className="font-semibold text-cyan-300 mb-1">3. Sealing</p>
                <p className="text-slate-300">Sachets are heat-sealed and moved toward packaging.</p>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes volticDrop {
              0%, 20% { transform: translate(-50%, 0) scale(0.75); opacity: 0.8; }
              40% { transform: translate(-50%, 10px) scale(1); opacity: 1; }
              60% { transform: translate(-50%, 22px) scale(0.85); opacity: 0.65; }
              100% { transform: translate(-50%, 0) scale(0.75); opacity: 0.8; }
            }
            @keyframes sachetSlide {
              0% { transform: translateX(0); }
              50% { transform: translateX(18px); }
              100% { transform: translateX(0); }
            }
            @keyframes spinSlow {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes pulseSlow {
              0%, 100% { transform: scale(1); opacity: 0.75; }
              50% { transform: scale(1.2); opacity: 1; }
            }
            .animate-voltic-drop { animation: volticDrop 2s ease-in-out infinite; }
            .animate-sachet-slide { animation: sachetSlide 2.5s ease-in-out infinite; }
            .animate-spin-slow { animation: spinSlow 4s linear infinite; }
            .animate-pulse-slow { animation: pulseSlow 2.5s ease-in-out infinite; }
          `}</style>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-slate-900">Sign In</h2>
          <p className="text-sm text-slate-500 mb-2">Authentication is based on your email and password. Management accounts require an OTP for extra security.</p>
          <p className="text-xs text-slate-400 mb-6">Route access will be granted automatically based on your account permissions.</p>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email</label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={!email || !password}
                className="w-full py-3 bg-linear-to-r from-sky-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-sky-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed">
                Continue
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <p>{otpMessage || 'A one-time verification code was sent to your registered phone number.'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Verification Code</label>
                <input type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="Enter OTP"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm" />
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={rememberDevice} onChange={(e) => setRememberDeviceState(e.target.checked)} className="w-4 h-4" />
                  <span className="text-xs text-slate-600">Remember this device for 30 days</span>
                </label>
                <button type="button" onClick={handleResend} className="text-xs text-sky-600 hover:underline">Resend code</button>
              </div>

              <button type="submit" disabled={!otpCode}
                className="w-full py-3 bg-linear-to-r from-sky-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-sky-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed">
                Verify OTP
              </button>
              <button type="button" onClick={handleBackToCredentials}
                className="w-full py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition">
                Back to Email Login
              </button>
            </form>
          )}

          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-semibold text-slate-700 mb-1">Default Accounts</p>
            <div className="text-xs text-slate-500 space-y-0.5">
              <p>CEO: <span className="font-mono">ceo@aakon.com / password123</span></p>
              <p>Admin: <span className="font-mono">admin@aakon.com / password123</span></p>
              <p>Manager: <span className="font-mono">manager@aakon.com / password123</span></p>
              <p>Supervisor: <span className="font-mono">supervisor@aakon.com / password123</span></p>
              <p>Cashier: <span className="font-mono">cashier@aakon.com / password123</span></p>
              <p>Operator: <span className="font-mono">operator@aakon.com / password123</span></p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-cyan-200/70 mt-6">© 2026 AAKON VENTURE LIMITED. All rights reserved.</p>
      </div>
    </div>
  );
}
