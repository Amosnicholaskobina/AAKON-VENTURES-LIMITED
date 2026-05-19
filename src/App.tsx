import { useState } from 'react';
import { Sidebar, PageKey } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Clock, FlaskConical } from 'lucide-react';
import { cn } from './utils/cn';
import { DashboardPage } from './pages/DashboardPage';
import { CEODashboard } from './pages/CEODashboard';
import { CashierDashboard } from './pages/CashierDashboard';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { SupervisorDashboard } from './pages/SupervisorDashboard';
import { WorkerDashboard } from './pages/WorkerDashboard';
import { QualityLabDashboard } from './pages/QualityLabDashboard';
import { OperatorDashboard } from './pages/OperatorDashboard';
import { OperatorLoginPage } from './pages/OperatorLoginPage';
import { CustomersPage } from './pages/CustomersPage';
import { SalesPage } from './pages/SalesPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { InventoryPage } from './pages/InventoryPage';
import { SupplyPage } from './pages/SupplyPage';
import { ReceiptsPage } from './pages/ReceiptsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { UsersPage } from './pages/UsersPage';
import { LoginPage } from './pages/LoginPage';
import { WorkerLoginPage } from './pages/WorkerLoginPage';
import { QualityLabLoginPage } from './pages/QualityLabLoginPage';
import { Role, getRoleByKey, rolePermissions } from './data/roles';

const pageTitles: Record<PageKey, string> = {
  dashboard: 'Dashboard',
  customers: 'Customers',
  sales: 'Sales',
  payments: 'Payments',
  inventory: 'Inventory',
  supply: 'Supply Check-In',
  receipts: 'Receipts',
  reports: 'Reports & Analytics',
  settings: 'Settings',
  timeclock: 'Time Clock',
  tasks: 'My Tasks',
  quality: 'Quality Control',
  operator: 'Operator Panel',
  users: 'User Management',
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<Role>('admin');
  const [loggedInUser, setLoggedInUser] = useState('');
  const [activePage, setActivePage] = useState<PageKey>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginType, setLoginType] = useState<'main' | 'worker' | 'quality' | 'operator'>('main');
  // force re-render key – bumped after any data mutation
  const [dataVersion, setDataVersion] = useState(0);
  const refresh = () => setDataVersion(v => v + 1);

  const handleLogin = (role: Role, username: string) => {
    setUserRole(role);
    setLoggedInUser(username);
    setIsLoggedIn(true);
    const permissions = rolePermissions[role];
    if (!permissions.includes('dashboard') && !permissions.includes('all')) {
      setActivePage(permissions[0] as PageKey);
    } else {
      setActivePage('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginType('main');
    setLoggedInUser('');
  };

  if (!isLoggedIn) {
    if (loginType === 'worker') {
      return <WorkerLoginPage onLogin={(u) => { setUserRole('worker'); setLoggedInUser(u); setIsLoggedIn(true); setActivePage('timeclock'); }} onBack={() => setLoginType('main')} />;
    }
    if (loginType === 'quality') {
      return <QualityLabLoginPage onLogin={(u) => { setUserRole('quality_lab'); setLoggedInUser(u); setIsLoggedIn(true); setActivePage('quality'); }} onBack={() => setLoginType('main')} />;
    }
    if (loginType === 'operator') {
      return <OperatorLoginPage onLogin={(u) => { setUserRole('operator'); setLoggedInUser(u); setIsLoggedIn(true); setActivePage('operator'); }} onBack={() => setLoginType('main')} />;
    }
    return <LoginPage onLogin={handleLogin} onSwitchLogin={(t) => setLoginType(t)} />;
  }

  const currentRole = getRoleByKey(userRole);

  const renderPage = () => {
    if (userRole === 'worker') return <WorkerDashboard key={dataVersion} onDataChange={refresh} />;
    if (userRole === 'quality_lab') return <QualityLabDashboard key={dataVersion} onDataChange={refresh} />;
    if (activePage === 'dashboard') {
      if (userRole === 'ceo') return <CEODashboard key={dataVersion} />;
      if (userRole === 'cashier') return <CashierDashboard key={dataVersion} onDataChange={refresh} />;
      if (userRole === 'manager') return <ManagerDashboard key={dataVersion} />;
      if (userRole === 'supervisor') return <SupervisorDashboard key={dataVersion} />;
      if (userRole === 'operator') return <OperatorDashboard key={dataVersion} onDataChange={refresh} />;
      return <DashboardPage key={dataVersion} role={userRole} />;
    }
    switch (activePage) {
      case 'customers': return <CustomersPage key={dataVersion} onDataChange={refresh} />;
      case 'sales': return <SalesPage key={dataVersion} onDataChange={refresh} />;
      case 'payments': return <PaymentsPage key={dataVersion} onDataChange={refresh} />;
      case 'inventory': return <InventoryPage key={dataVersion} onDataChange={refresh} />;
      case 'supply': return <SupplyPage key={dataVersion} onDataChange={refresh} />;
      case 'receipts': return <ReceiptsPage key={dataVersion} onDataChange={refresh} />;
      case 'reports': return <ReportsPage key={dataVersion} />;
      case 'settings': return <SettingsPage key={dataVersion} />;
      case 'timeclock': return <WorkerDashboard key={dataVersion} onDataChange={refresh} />;
      case 'tasks': return <WorkerDashboard key={dataVersion} onDataChange={refresh} />;
      case 'quality': return <QualityLabDashboard key={dataVersion} onDataChange={refresh} />;
      case 'operator': return <OperatorDashboard key={dataVersion} onDataChange={refresh} />;
      case 'users': return <UsersPage key={dataVersion} onDataChange={refresh} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute w-[800px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ backgroundImage: 'url(/images/cool-pac-watermark.png)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', opacity: 0.45, filter: 'blur(8px)', animation: 'float 30s ease-in-out infinite' }} />
        <div className="absolute w-[400px] h-[300px] top-[20%] left-[10%]"
          style={{ backgroundImage: 'url(/images/cool-pac-watermark.png)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', opacity: 0.25, filter: 'blur(12px)', animation: 'float 25s ease-in-out infinite reverse' }} />
        <div className="absolute w-[350px] h-[260px] bottom-[15%] right-[8%]"
          style={{ backgroundImage: 'url(/images/cool-pac-watermark.png)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', opacity: 0.2, filter: 'blur(10px)', animation: 'float 35s ease-in-out infinite', animationDelay: '5s' }} />
      </div>
      <style>{`@keyframes float { 0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); } 25% { transform: translate(-45%, -55%) scale(1.05) rotate(2deg); } 50% { transform: translate(-55%, -45%) scale(0.98) rotate(-1deg); } 75% { transform: translate(-48%, -52%) scale(1.02) rotate(1deg); } }`}</style>

      {userRole === 'worker' || userRole === 'quality_lab' ? (
        <div className="flex-1 relative z-10">
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4">
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', userRole === 'worker' ? 'bg-slate-700' : 'bg-teal-600')}>
                  {userRole === 'worker' ? <Clock className="w-5 h-5 text-white" /> : <FlaskConical className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{userRole === 'worker' ? 'Worker Portal' : 'Quality Lab'}</h2>
                  <p className="text-xs text-slate-500">Logged in as: <span className="font-semibold">{loggedInUser}</span></p>
                </div>
              </div>
              <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg">Logout</button>
            </div>
          </header>
          <main className="p-4 sm:p-6">{renderPage()}</main>
        </div>
      ) : (
        <>
          <Sidebar activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout} mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} userRole={userRole} />
          <div className="flex-1 flex flex-col min-w-0 relative z-10">
            <TopBar title={pageTitles[activePage]} onMenuClick={() => setMobileMenuOpen(true)} role={currentRole} username={loggedInUser} />
            <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">{renderPage()}</main>
          </div>
        </>
      )}
    </div>
  );
}
