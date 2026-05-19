import { useState } from 'react';
import { UserPlus, Shield, Trash2, Key, UserCircle, BadgeCheck } from 'lucide-react';
import { Card } from '../components/ui';
import { cn } from '../utils/cn';
import { getUsers, addUser, deleteUser } from '../data/store';
import { roles, Role } from '../data/roles';

export function UsersPage({ onDataChange }: { onDataChange: () => void }) {
  const [userList, setUserList] = useState(getUsers());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', fullName: '', role: 'operator' as Role });

  const reload = () => { setUserList(getUsers()); onDataChange(); };

  const handleAddUser = () => {
    if (!form.username || !form.password || !form.fullName) return;
    addUser(form);
    setForm({ username: '', password: '', fullName: '', role: 'operator' });
    setShowForm(false);
    reload();
  };

  const handleDelete = (id: string, username: string) => {
    if (username === 'admin' || username === 'ceo') {
      alert('Cannot delete root system accounts.');
      return;
    }
    if (confirm(`Are you sure you want to delete user "${username}"?`)) {
      deleteUser(id);
      reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <p className="text-sm text-slate-500">Create and manage accounts for operators, baggers, and more.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 transition">
          {showForm ? 'Cancel' : <><UserPlus className="w-4 h-4" /> Add New User</>}
        </button>
      </div>

      {showForm && (
        <Card title="Register New Account" subtitle="Fill in details for the new staff member">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
              <input type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} placeholder="e.g. John Operator" className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm focus:ring-2 focus:ring-indigo-100" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Username (Login ID)</label>
              <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="e.g. joperator" className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm focus:ring-2 focus:ring-indigo-100" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Initial Password</label>
              <input type="text" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Set password" className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm focus:ring-2 focus:ring-indigo-100" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">System Role</label>
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value as Role})} className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm focus:ring-2 focus:ring-indigo-100">
                {roles.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={handleAddUser} disabled={!form.username || !form.password} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold disabled:opacity-50">Create Account</button>
          </div>
        </Card>
      )}

      <Card title="Current Users" subtitle="Staff with system access">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userList.map(user => {
            const roleConfig = roles.find(r => r.key === user.role);
            return (
              <div key={user.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold", roleConfig?.gradient || "bg-slate-400")}>
                      {user.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user.fullName}</p>
                      <p className="text-xs text-slate-500 font-mono">ID: {user.username}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(user.id, user.username)} className="text-slate-300 hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full text-white", roleConfig?.gradient || "bg-slate-400")}>
                    {roleConfig?.label || user.role}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <Key className="w-3 h-3" />
                    <span>Active</span>
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
