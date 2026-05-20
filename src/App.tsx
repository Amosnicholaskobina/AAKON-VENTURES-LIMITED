import { useState } from 'react';
import { Sidebar, PageKey } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardPage } from './pages/DashboardPage';
import { CEODashboard } from './pages/CEODashboard';
import { CashierDashboard } from './pages/CashierDashboard';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { SupervisorDashboard } from './pages/SupervisorDashboard';
import { WorkerDashboard } from './pages/WorkerDashboard';
import { QualityLabDashboard } from './pages/QualityLabDashboard';
import { OperatorDashboard } from './pages/OperatorDashboard';
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
import { getRoleByKey, rolePermissions } from './data/roles';
import { UserAccount } from './data/store';

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
  const [user, setUser] = useState<UserAccount | null>(null);
  const [activePage, setActivePage] = useState<PageKey>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);

  const refresh = () => setDataVersion(v => v + 1);

  const handleLogin = (authenticatedUser: UserAccount) => {
    setUser(authenticatedUser);
    setIsLoggedIn(true);

    const permissions = rolePermissions[authenticatedUser.role];
    if (permissions.includes('dashboard') || permissions.includes('all')) {
      setActivePage('dashboard');
    } else {
      setActivePage(permissions[0] as PageKey);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  if (!isLoggedIn || !user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const userRole = user.role;
  const currentRole = getRoleByKey(userRole);
  const permissions = rolePermissions[userRole];

  // Helper to check if user has permission for a specific page
  const hasAccess = (page: PageKey) => permissions.includes(page) || permissions.includes('all');

  const renderPage = () => {
    // Permission guard
    if (!hasAccess(activePage)) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🚫</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
          <p className="text-slate-500 mt-2">You do not have permission to view this page.</p>
          <button onClick={() => setActivePage('dashboard')} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">Return to Safety</button>
        </div>
      );
    }

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
      default: return <DashboardPage key={dataVersion} role={userRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex relative overflow-hidden">
      {/* Watermark */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute w-[800px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ backgroundImage: 'url(/images/cool-pac-watermark.png)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', opacity: 0.25, filter: 'blur(12px)', animation: 'float 30s ease-in-out infinite' }} />
      </div>

      <Sidebar activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout} mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} userRole={userRole} />
      
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <TopBar title={pageTitles[activePage]} onMenuClick={() => setMobileMenuOpen(true)} role={currentRole} username={user.fullName} />
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">{renderPage()}</main>
      </div>
      
      <style>{`@keyframes float { 0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); } 25% { transform: translate(-45%, -55%) scale(1.05) rotate(2deg); } 50% { transform: translate(-55%, -45%) scale(0.98) rotate(-1deg); } 75% { transform: translate(-48%, -52%) scale(1.02) rotate(1deg); } }`}</style>
    </div>
  );
}
