import { Customer, Sale, Payment, Inventory, SupplyCheckIn, Receipt } from './mockData';

// ─── helpers ───────────────────────────────────────────────────────────
function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function now(): string {
  const d = new Date();
  return `${d.toISOString().slice(0, 10)} ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
}

function nextReceiptNo(): string {
  const n = (load<Receipt[]>('receipts') ?? []).length + 1;
  return `BW-${String(1000 + n)}`;
}

// ─── generic localStorage CRUD ────────────────────────────────────────
function load<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`aakon_${key}`);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function save<T>(key: string, data: T): void {
  localStorage.setItem(`aakon_${key}`, JSON.stringify(data));
}

// ─── seed data (only written on first visit) ──────────────────────────
const seedCustomers: Customer[] = [
  { id: uid(), name: 'John Doe', phone: '+233 24 123 4567', email: 'john@example.com', address: '123 Main St, Accra', created_at: '2026-01-15' },
  { id: uid(), name: 'Jane Smith', phone: '+233 20 987 6543', email: 'jane@example.com', address: '456 Oak Ave, Kumasi', created_at: '2026-02-20' },
  { id: uid(), name: 'Michael Brown', phone: '+233 55 111 2222', email: 'michael@example.com', address: '789 Pine Rd, Tema', created_at: '2026-03-10' },
];

const seedInventory: Inventory[] = [
  { id: uid(), product_name: 'Pure Spring Water (500ml)', quantity_available: 500, reorder_level: 100, updated_at: today() },
  { id: uid(), product_name: 'Crystal Clear Water (1L)', quantity_available: 300, reorder_level: 50, updated_at: today() },
  { id: uid(), product_name: 'Mountain Fresh Water (2L)', quantity_available: 200, reorder_level: 60, updated_at: today() },
  { id: uid(), product_name: 'Premium Aqua (5L)', quantity_available: 100, reorder_level: 40, updated_at: today() },
];

function seed(): void {
  if (!load('seeded')) {
    save('customers', seedCustomers);
    save('sales', [] as Sale[]);
    save('payments', [] as Payment[]);
    save('inventory', seedInventory);
    save('supply', [] as SupplyCheckIn[]);
    save('receipts', [] as Receipt[]);
    save('seeded', true);
  }
}
seed();

// ─── Users / Auth store ───────────────────────────────────────────────
export interface UserAccount {
  id: string;
  username: string;
  password: string;
  fullName: string;
  role: string;
}

const seedUsers: UserAccount[] = [
  { id: uid(), username: 'ceo', password: 'ceo123', fullName: 'Nana Agyeman', role: 'ceo' },
  { id: uid(), username: 'admin', password: 'admin123', fullName: 'Kofi Mensah', role: 'admin' },
  { id: uid(), username: 'manager', password: 'manager123', fullName: 'Ama Boateng', role: 'manager' },
  { id: uid(), username: 'supervisor', password: 'super123', fullName: 'Kwame Asante', role: 'supervisor' },
  { id: uid(), username: 'cashier', password: 'cash123', fullName: 'Abena Osei', role: 'cashier' },
  { id: uid(), username: 'worker1', password: 'work123', fullName: 'Yaw Addo', role: 'worker' },
  { id: uid(), username: 'lab1', password: 'lab123', fullName: 'Efua Mensah', role: 'quality_lab' },
  { id: uid(), username: 'operator1', password: 'op123', fullName: 'Kwesi Appiah', role: 'operator' },
];

function seedUsersOnce() {
  const existing = load<UserAccount[]>('users');
  // Re-seed if never seeded OR if operator account is missing (old data)
  if (!existing || !existing.find(u => u.role === 'operator')) {
    // Merge: keep any custom users, add missing defaults
    const merged = existing ? [...existing] : [];
    for (const seed of seedUsers) {
      if (!merged.find(u => u.username === seed.username && u.role === seed.role)) {
        merged.push(seed);
      }
    }
    save('users', merged);
    save('users_seeded', true);
  }
}
seedUsersOnce();

export function getUsers(): UserAccount[] {
  return load<UserAccount[]>('users') ?? seedUsers;
}

export function addUser(user: Omit<UserAccount, 'id'>): UserAccount {
  const users = getUsers();
  const newUser = { ...user, id: uid() };
  users.push(newUser);
  save('users', users);
  return newUser;
}

export function deleteUser(id: string): void {
  const users = getUsers().filter(u => u.id !== id);
  save('users', users);
}

export function authenticate(username: string, password: string, role: string): UserAccount | null {
  const users = getUsers();
  return users.find(u => u.username === username && u.password === password && u.role === role) ?? null;
}

export function authenticateWorker(workerId: string, password: string): UserAccount | null {
  const users = getUsers();
  return users.find(u => u.username === workerId && u.password === password && u.role === 'worker') ?? null;
}

export function authenticateLab(labId: string, password: string): UserAccount | null {
  const users = getUsers();
  return users.find(u => u.username === labId && u.password === password && u.role === 'quality_lab') ?? null;
}

export function authenticateOperator(opId: string, password: string): UserAccount | null {
  const users = getUsers();
  return users.find(u => u.username === opId && u.password === password && u.role === 'operator') ?? null;
}

// ─── Customers ────────────────────────────────────────────────────────
export function getCustomers(): Customer[] {
  return load<Customer[]>('customers') ?? [];
}

export function addCustomer(c: Omit<Customer, 'id' | 'created_at'>): Customer {
  const list = getCustomers();
  const newC: Customer = { ...c, id: uid(), created_at: today() };
  list.push(newC);
  save('customers', list);
  return newC;
}

export function deleteCustomer(id: string): void {
  save('customers', getCustomers().filter(c => c.id !== id));
}

// ─── Inventory ────────────────────────────────────────────────────────
export function getInventory(): Inventory[] {
  return load<Inventory[]>('inventory') ?? [];
}

export function addInventoryItem(item: Omit<Inventory, 'id' | 'updated_at'>): Inventory {
  const list = getInventory();
  const n: Inventory = { ...item, id: uid(), updated_at: today() };
  list.push(n);
  save('inventory', list);
  return n;
}

export function updateInventoryQty(id: string, delta: number): void {
  const list = getInventory();
  const item = list.find(i => i.id === id);
  if (item) {
    item.quantity_available = Math.max(0, item.quantity_available + delta);
    item.updated_at = today();
  }
  save('inventory', list);
}

export function deleteInventoryItem(id: string): void {
  save('inventory', getInventory().filter(i => i.id !== id));
}

// ─── Sales + automatic receipt + inventory deduction ──────────────────
export function getSales(): Sale[] {
  return load<Sale[]>('sales') ?? [];
}

export function addSale(s: {
  customer_id: string;
  customer_name: string;
  quantity: number;
  total_amount: number;
  payment_status: 'paid' | 'pending' | 'partial';
  payment_method: string;
}): { sale: Sale; receipt: Receipt | null; payment: Payment | null } {
  const sales = getSales();
  const sale: Sale = { ...s, id: uid(), created_at: now() };
  sales.push(sale);
  save('sales', sales);

  let receipt: Receipt | null = null;
  let payment: Payment | null = null;

  // auto-generate receipt
  receipt = {
    id: uid(),
    sale_id: sale.id,
    receipt_number: nextReceiptNo(),
    customer_name: sale.customer_name,
    amount: sale.total_amount,
    sent_status: false,
    created_at: today(),
  };
  const receipts = getReceipts();
  receipts.push(receipt);
  save('receipts', receipts);

  // if paid → auto record payment
  if (sale.payment_status === 'paid') {
    payment = {
      id: uid(),
      sale_id: sale.id,
      customer_name: sale.customer_name,
      amount_paid: sale.total_amount,
      payment_reference: `PAY-${Date.now().toString(36).toUpperCase()}`,
      payment_date: now(),
    };
    const payments = getPayments();
    payments.push(payment);
    save('payments', payments);
  }

  return { sale, receipt, payment };
}

export function deleteSale(id: string): void {
  save('sales', getSales().filter(s => s.id !== id));
}

// ─── Payments ─────────────────────────────────────────────────────────
export function getPayments(): Payment[] {
  return load<Payment[]>('payments') ?? [];
}

export function addPayment(p: Omit<Payment, 'id'>): Payment {
  const list = getPayments();
  const newP: Payment = { ...p, id: uid() };
  list.push(newP);
  save('payments', list);

  // mark sale as paid
  const sales = getSales();
  const sale = sales.find(s => s.id === p.sale_id);
  if (sale) {
    sale.payment_status = 'paid';
    save('sales', sales);
  }

  return newP;
}

// ─── Supply ───────────────────────────────────────────────────────────
export function getSupplyCheckIns(): SupplyCheckIn[] {
  return load<SupplyCheckIn[]>('supply') ?? [];
}

export function addSupplyCheckIn(s: Omit<SupplyCheckIn, 'id'>): SupplyCheckIn {
  const list = getSupplyCheckIns();
  const n: SupplyCheckIn = { ...s, id: uid() };
  list.push(n);
  save('supply', list);

  // if delivered → add to first inventory product
  if (s.status === 'delivered') {
    const inv = getInventory();
    if (inv.length > 0) {
      inv[0].quantity_available += s.quantity_supplied;
      inv[0].updated_at = today();
      save('inventory', inv);
    }
  }

  return n;
}

export function updateSupplyStatus(id: string, status: 'delivered' | 'in-transit' | 'pending'): void {
  const list = getSupplyCheckIns();
  const item = list.find(s => s.id === id);
  if (item) {
    const wasPending = item.status !== 'delivered';
    item.status = status;
    save('supply', list);

    if (status === 'delivered' && wasPending) {
      const inv = getInventory();
      if (inv.length > 0) {
        inv[0].quantity_available += item.quantity_supplied;
        inv[0].updated_at = today();
        save('inventory', inv);
      }
    }
  }
}

export function deleteSupplyCheckIn(id: string): void {
  save('supply', getSupplyCheckIns().filter(s => s.id !== id));
}

// ─── Receipts ─────────────────────────────────────────────────────────
export function getReceipts(): Receipt[] {
  return load<Receipt[]>('receipts') ?? [];
}

export function markReceiptSent(id: string): void {
  const list = getReceipts();
  const r = list.find(r => r.id === id);
  if (r) r.sent_status = true;
  save('receipts', list);
}

// ─── Quality Lab Items ────────────────────────────────────────────────
export interface LabItemIn {
  id: string;
  product: string;
  supplier: string;
  qty: number;
  status: 'approved' | 'pending' | 'rejected';
  time: string;
  batch: string;
}

export interface LabItemOut {
  id: string;
  product: string;
  destination: string;
  qty: number;
  status: 'dispatched' | 'pending';
  time: string;
  order: string;
}

export interface QualityCheck {
  id: string;
  batch: string;
  product: string;
  pH: number;
  turbidity: string;
  result: 'pass' | 'fail';
  inspector: string;
}

function seedLab() {
  if (!load('lab_seeded')) {
    save('lab_in', [] as LabItemIn[]);
    save('lab_out', [] as LabItemOut[]);
    save('lab_checks', [] as QualityCheck[]);
    save('lab_seeded', true);
  }
}
seedLab();

export function getLabItemsIn(): LabItemIn[] { return load<LabItemIn[]>('lab_in') ?? []; }
export function addLabItemIn(i: Omit<LabItemIn, 'id'>): LabItemIn {
  const list = getLabItemsIn();
  const n: LabItemIn = { ...i, id: `IN-${String(list.length + 1).padStart(3, '0')}` };
  list.push(n);
  save('lab_in', list);
  return n;
}

export function getLabItemsOut(): LabItemOut[] { return load<LabItemOut[]>('lab_out') ?? []; }
export function addLabItemOut(i: Omit<LabItemOut, 'id'>): LabItemOut {
  const list = getLabItemsOut();
  const n: LabItemOut = { ...i, id: `OUT-${String(list.length + 1).padStart(3, '0')}` };
  list.push(n);
  save('lab_out', list);
  return n;
}

export function getQualityChecks(): QualityCheck[] { return load<QualityCheck[]>('lab_checks') ?? []; }
export function addQualityCheck(c: Omit<QualityCheck, 'id'>): QualityCheck {
  const list = getQualityChecks();
  const n: QualityCheck = { ...c, id: `QC-${String(list.length + 1).padStart(3, '0')}` };
  list.push(n);
  save('lab_checks', list);
  return n;
}

// ─── Worker time logs ─────────────────────────────────────────────────
export interface TimeLog {
  id: string;
  workerId: string;
  workerName: string;
  type: 'clock-in' | 'clock-out';
  timestamp: string;
  workerRole: 'bagger' | 'loader';
}

export interface WorkerTask {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  assigned: string;
  target: string;
  workerRole: 'bagger' | 'loader';
}

function seedWorker() {
  if (!load('worker_seeded')) {
    save('timelogs', [] as TimeLog[]);
    save('worker_tasks', [] as WorkerTask[]);
    save('worker_seeded', true);
  }
}
seedWorker();

export function getTimeLogs(): TimeLog[] { return load<TimeLog[]>('timelogs') ?? []; }
export function addTimeLog(t: Omit<TimeLog, 'id'>): TimeLog {
  const list = getTimeLogs();
  const n: TimeLog = { ...t, id: uid() };
  list.push(n);
  save('timelogs', list);
  return n;
}

export function getWorkerTasks(): WorkerTask[] { return load<WorkerTask[]>('worker_tasks') ?? []; }
export function addWorkerTask(t: Omit<WorkerTask, 'id'>): WorkerTask {
  const list = getWorkerTasks();
  const n: WorkerTask = { ...t, id: uid() };
  list.push(n);
  save('worker_tasks', list);
  return n;
}
export function updateWorkerTaskStatus(id: string, status: 'pending' | 'in-progress' | 'completed'): void {
  const list = getWorkerTasks();
  const t = list.find(i => i.id === id);
  if (t) t.status = status;
  save('worker_tasks', list);
}

// ─── Bagger Production & Loader Deliveries ────────────────────────────
export interface BaggerProduction {
  id: string;
  workerId: string;
  workerName: string;
  bagCount: number;
  timestamp: string;
  date: string;
}

export interface LoaderDelivery {
  id: string;
  workerId: string;
  workerName: string;
  bagCount: number;
  destination: string;
  hasLeakage: boolean;
  leakageCount: number;
  leakageNotes: string;
  timestamp: string;
  date: string;
  status: 'pending' | 'in-transit' | 'delivered';
  sourceBaggerId: string;
}

function seedProduction() {
  if (!load('production_seeded')) {
    save('bagger_productions', [] as BaggerProduction[]);
    save('loader_deliveries', [] as LoaderDelivery[]);
    save('production_seeded', true);
  }
}
seedProduction();

export function getBaggerProductions(): BaggerProduction[] { return load<BaggerProduction[]>('bagger_productions') ?? []; }
export function addBaggerProduction(p: Omit<BaggerProduction, 'id' | 'date'>): BaggerProduction {
  const list = getBaggerProductions();
  const n: BaggerProduction = { ...p, id: uid(), date: today() };
  list.push(n);
  save('bagger_productions', list);
  return n;
}

export function getTodayBaggerTotal(): number {
  const t = today();
  return getBaggerProductions().filter(p => p.date === t).reduce((sum, p) => sum + p.bagCount, 0);
}

export function getAvailableBagsForDelivery(): number {
  const t = today();
  const produced = getBaggerProductions().filter(p => p.date === t).reduce((sum, p) => sum + p.bagCount, 0);
  const loaded = getLoaderDeliveries().filter(d => d.date === t).reduce((sum, d) => sum + d.bagCount, 0);
  return Math.max(0, produced - loaded);
}

export function getLoaderDeliveries(): LoaderDelivery[] { return load<LoaderDelivery[]>('loader_deliveries') ?? []; }
export function addLoaderDelivery(d: Omit<LoaderDelivery, 'id' | 'date'>): LoaderDelivery | null {
  const available = getAvailableBagsForDelivery();
  if (d.bagCount > available) return null; // not enough bags produced
  const list = getLoaderDeliveries();
  const n: LoaderDelivery = { ...d, id: uid(), date: today() };
  list.push(n);
  save('loader_deliveries', list);
  return n;
}

export function updateDeliveryLeakage(id: string, hasLeakage: boolean, leakageCount: number, leakageNotes: string): void {
  const list = getLoaderDeliveries();
  const d = list.find(i => i.id === id);
  if (d) {
    d.hasLeakage = hasLeakage;
    d.leakageCount = leakageCount;
    d.leakageNotes = leakageNotes;
  }
  save('loader_deliveries', list);
}

export function updateDeliveryStatus(id: string, status: 'pending' | 'in-transit' | 'delivered'): void {
  const list = getLoaderDeliveries();
  const d = list.find(i => i.id === id);
  if (d) d.status = status;
  save('loader_deliveries', list);
}

export function getLeakageStats() {
  const deliveries = getLoaderDeliveries();
  const total = deliveries.length;
  const withLeakage = deliveries.filter(d => d.hasLeakage);
  const leakageCount = withLeakage.length;
  const totalLeakedBags = withLeakage.reduce((sum, d) => sum + d.leakageCount, 0);
  const totalDeliveredBags = deliveries.reduce((sum, d) => sum + d.bagCount, 0);
  const leakageRate = totalDeliveredBags > 0 ? ((totalLeakedBags / totalDeliveredBags) * 100) : 0;
  const todayLeakage = deliveries.filter(d => d.date === today() && d.hasLeakage);
  const todayLeakedBags = todayLeakage.reduce((sum, d) => sum + d.leakageCount, 0);
  return { total, leakageCount, totalLeakedBags, totalDeliveredBags, leakageRate, todayLeakage: todayLeakage.length, todayLeakedBags, recentLeakages: withLeakage.slice(-10).reverse() };
}

// ─── Operator: Machine Supply Loads & Water Level Checks ──────────────
export interface MachineSupplyLoad {
  id: string;
  operatorId: string;
  operatorName: string;
  machineName: string;
  supplyType: string;
  quantity: number;
  unit: string;
  timestamp: string;
  date: string;
  notes: string;
}

export interface WaterLevelCheck {
  id: string;
  operatorId: string;
  operatorName: string;
  machineName: string;
  levelPercent: number;
  temperature: number;
  pressure: number;
  status: 'normal' | 'low' | 'critical' | 'overflow';
  timestamp: string;
  date: string;
  hour: string;
  notes: string;
}

function seedOperator() {
  if (!load('operator_seeded')) {
    save('machine_loads', [] as MachineSupplyLoad[]);
    save('water_levels', [] as WaterLevelCheck[]);
    save('operator_seeded', true);
  }
}
seedOperator();

export function getMachineLoads(): MachineSupplyLoad[] { return load<MachineSupplyLoad[]>('machine_loads') ?? []; }
export function addMachineLoad(m: Omit<MachineSupplyLoad, 'id' | 'date'>): MachineSupplyLoad {
  const list = getMachineLoads();
  const n: MachineSupplyLoad = { ...m, id: uid(), date: today() };
  list.push(n);
  save('machine_loads', list);
  return n;
}

export function getWaterLevelChecks(): WaterLevelCheck[] { return load<WaterLevelCheck[]>('water_levels') ?? []; }
export function addWaterLevelCheck(w: Omit<WaterLevelCheck, 'id' | 'date'>): WaterLevelCheck {
  const list = getWaterLevelChecks();
  const n: WaterLevelCheck = { ...w, id: uid(), date: today() };
  list.push(n);
  save('water_levels', list);
  return n;
}

export function getTodayWaterLevels(): WaterLevelCheck[] {
  const t = today();
  return getWaterLevelChecks().filter(w => w.date === t);
}

export function getTodayMachineLoads(): MachineSupplyLoad[] {
  const t = today();
  return getMachineLoads().filter(m => m.date === t);
}

export function getOperatorStats() {
  const t = today();
  const loads = getMachineLoads();
  const levels = getWaterLevelChecks();
  const todayLoads = loads.filter(m => m.date === t);
  const todayLevels = levels.filter(w => w.date === t);
  const criticalLevels = todayLevels.filter(w => w.status === 'critical' || w.status === 'low');
  return {
    totalLoadsToday: todayLoads.length,
    totalChecksToday: todayLevels.length,
    criticalAlerts: criticalLevels.length,
    allLoads: loads,
    allLevels: levels,
    todayLoads,
    todayLevels,
    criticalLevels,
  };
}

// ─── Settings (business info) ─────────────────────────────────────────
export interface BusinessSettings {
  businessName: string;
  phone: string;
  email: string;
  address: string;
  taxId: string;
  pricePerBag: number;
}

const defaultSettings: BusinessSettings = {
  businessName: 'AAKON VENTURE LIMITED',
  phone: '+233 24 000 0000',
  email: 'info@aakonventure.com',
  address: '123 Water Street, Accra, Ghana',
  taxId: 'C1234567890',
  pricePerBag: 10,
};

export function getSettings(): BusinessSettings {
  return load<BusinessSettings>('settings') ?? defaultSettings;
}
export function saveSettings(s: BusinessSettings): void {
  save('settings', s);
}

// ─── Dashboard helpers ────────────────────────────────────────────────
export function getTodaySales(): Sale[] {
  const t = today();
  return getSales().filter(s => s.created_at.startsWith(t));
}

export function getTodayRevenue(): number {
  return getTodaySales().reduce((sum, s) => sum + s.total_amount, 0);
}

export function getPendingSalesCount(): number {
  return getSales().filter(s => s.payment_status === 'pending').length;
}

export function getTotalStock(): number {
  return getInventory().reduce((sum, i) => sum + i.quantity_available, 0);
}

export function getLowStockCount(): number {
  return getInventory().filter(i => i.quantity_available < i.reorder_level).length;
}
