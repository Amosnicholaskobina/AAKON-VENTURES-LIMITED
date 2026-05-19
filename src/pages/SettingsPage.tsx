import { Card } from '../components/ui';
import { User, Building2, Bell, Shield, Smartphone, Globe, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../utils/cn';
import { getSettings, saveSettings } from '../data/store';

export function SettingsPage() {
  const [settings, setSettingsState] = useState(getSettings());
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const [tab, setTab] = useState<'profile' | 'business' | 'notifications' | 'security'>('profile');

  const tabs = [
    { key: 'profile' as const, label: 'Profile', icon: User },
    { key: 'business' as const, label: 'Business', icon: Building2 },
    { key: 'notifications' as const, label: 'Notifications', icon: Bell },
    { key: 'security' as const, label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500">Configure your account and preferences</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap',
                tab === t.key
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              )}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'profile' && (
        <Card title="Profile Information" subtitle="Manage your personal details">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-sky-600 flex items-center justify-center text-white font-bold text-2xl">
              AU
            </div>
            <div>
              <button className="px-4 py-2 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700">Change Photo</button>
              <p className="text-xs text-slate-500 mt-2">JPG, PNG. Max 2MB</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingField label="Full Name" value="Admin User" />
            <SettingField label="Email" value="admin@aquaflow.com" />
            <SettingField label="Phone" value="+233 24 000 0000" />
            <SettingField label="Role" value="Administrator" />
          </div>
          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg">Save Changes</button>
          </div>
        </Card>
      )}

      {tab === 'business' && (
        <Card title="Business Information" subtitle="Configure your business profile">
          {saved && <div className="flex items-center gap-2 p-3 mb-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm"><CheckCircle className="w-4 h-4" /> Settings saved successfully!</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingField label="Business Name" value={settings.businessName} onChange={v => setSettingsState({ ...settings, businessName: v })} />
            <SettingField label="Business Phone" value={settings.phone} onChange={v => setSettingsState({ ...settings, phone: v })} />
            <SettingField label="Business Email" value={settings.email} onChange={v => setSettingsState({ ...settings, email: v })} />
            <SettingField label="Tax ID" value={settings.taxId} onChange={v => setSettingsState({ ...settings, taxId: v })} />
            <SettingField label="Price per Bag (GHS)" value={String(settings.pricePerBag)} onChange={v => setSettingsState({ ...settings, pricePerBag: parseFloat(v) || 0 })} />
            <div className="md:col-span-2">
              <SettingField label="Address" value={settings.address} onChange={v => setSettingsState({ ...settings, address: v })} />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={handleSaveSettings} className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg">Save Settings</button>
          </div>
        </Card>
      )}

      {tab === 'notifications' && (
        <Card title="Notification Preferences" subtitle="Choose how you want to be notified">
          <div className="space-y-3">
            <ToggleRow icon={Smartphone} title="SMS Notifications" desc="Get SMS alerts for new sales and deliveries" defaultOn />
            <ToggleRow icon={Bell} title="Push Notifications" desc="Browser push notifications" defaultOn />
            <ToggleRow icon={Globe} title="Email Updates" desc="Weekly reports and summaries" />
            <ToggleRow icon={Shield} title="Security Alerts" desc="Login attempts and password changes" defaultOn />
          </div>
        </Card>
      )}

      {tab === 'security' && (
        <Card title="Security Settings" subtitle="Protect your account">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-semibold text-slate-900">Change Password</h4>
              <p className="text-xs text-slate-500 mb-3">Update your password regularly for security</p>
              <div className="space-y-2 max-w-md">
                <input type="password" placeholder="Current password" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                <input type="password" placeholder="New password" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                <input type="password" placeholder="Confirm new password" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
              </div>
              <button className="mt-3 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg">Update Password</button>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">Two-Factor Authentication</h4>
                  <p className="text-xs text-slate-600">Add an extra layer of security to your account</p>
                </div>
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg">Enable</button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-semibold text-slate-900">Active Sessions</h4>
              <p className="text-xs text-slate-500 mb-2">Devices currently logged in</p>
              <div className="text-sm text-slate-700">✓ Chrome on Windows - Current session</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function SettingField({ label, value, onChange }: { label: string; value: string; onChange?: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-700 block mb-1">{label}</label>
      <input value={value} onChange={e => onChange?.(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm" />
    </div>
  );
}

function ToggleRow({ icon: Icon, title, desc, defaultOn = false }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-sky-600" />
        </div>
        <div>
          <p className="font-semibold text-slate-900 text-sm">{title}</p>
          <p className="text-xs text-slate-500">{desc}</p>
        </div>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={cn(
          'relative w-11 h-6 rounded-full transition',
          on ? 'bg-sky-600' : 'bg-slate-300'
        )}
      >
        <span className={cn(
          'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all',
          on ? 'left-5' : 'left-0.5'
        )} />
      </button>
    </div>
  );
}
