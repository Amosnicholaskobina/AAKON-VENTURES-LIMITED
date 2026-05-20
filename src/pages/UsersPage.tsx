import { useState } from 'react';
import { UserPlus, Trash2, Key, Mail, Phone, User as UserIcon } from 'lucide-react';
import { Card } from '../components/ui';
import { cn } from '../utils/cn';
import { getUsers, addUser, deleteUser } from '../data/store';
import { roles, Role } from '../data/roles';

export function UsersPage({ onDataChange }: { onDataChange: () => void }) {
  const [userList, setUserList] = useState(getUsers());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', fullName: '', role: 'operator' as Role, phoneNumber: '' });

  const reload = () => { setUserList(getUsers()); onDataChange(); };

  const handleAddUser = () => {
    if (!form.email || !form.password || !form.fullName) return;
    addUser(form);
    setForm({ email: '', password: '', fullName: '', role: 'operator', phoneNumber: '' });
    setShowForm(false);
    reload();
  };

  const handleDelete = (id: string, email: string) => {
    if (email === 'admin@aakon.com' || email === 'ceo@aakon.com') {
      alert('Cannot delete root system accounts.');
      return;
    }
    if (confirm(`Are you sure you want to delete user "${email}"?`)) {
      deleteUser(id);
      reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Staff Management</h2>
          <p className="text-sm text-slate-500">Secure staff identity and permission control</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-800 transition shadow-lg">
          {showForm ? 'Cancel' : <><UserPlus className="w-4 h-4" /> Add New Staff</>}
        </button>
      </div>

      {showForm && (
        <Card title="Register New Staff Member" subtitle="Credentials will be used for secure OTP login">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
              <input type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} placeholder="Staff Name" className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm focus:ring-2 focus:ring-indigo-100" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Work Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@aakon.com" className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm focus:ring-2 focus:ring-indigo-100" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number (for OTP)</label>
              <input type="text" value={form.phoneNumber} onChange={e => setForm({...form, phoneNumber: e.target.value})} placeholder="+233..." className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm focus:ring-2 focus:ring-indigo-100" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm focus:ring-2 focus:ring-indigo-100" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Access Role</label>
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value as Role})} className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm focus:ring-2 focus:ring-indigo-100">
                {roles.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={handleAddUser} disabled={!form.email || !form.password} className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold disabled:opacity-50">Create Identity</button>
          </div>
        </Card>
      )}

      <Card title="Authenticated Staff" subtitle="Manage permissions and identities">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userList.map(user => {
            const roleConfig = roles.find(r => r.key === user.role);
            return (
              <div key={user.id} className="p-5 rounded-2xl border border-slate-100 bg-white hover:shadow-lg transition-all group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-inner", roleConfig?.gradient || "bg-slate-400")}>
                      <UserIcon className="w-6 h-6 text-white/50" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user.fullName}</p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <Mail className="w-3 h-3" /> {user.email}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(user.id, user.email)} className="text-slate-200 hover:text-red-500 transition-colors p-1 group-hover:text-slate-400"><Trash2 className="w-4 h-4" /></button>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg text-white shadow-sm", roleConfig?.gradient || "bg-slate-400")}>
                    {roleConfig?.label || user.role}
                  </span>
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <Phone className="w-3 h-3" />
                    <span className="font-medium">{user.phoneNumber}</span>
                    <Key className="w-3 h-3 ml-2 text-emerald-500" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
