import { Customer, Sale, Payment, Inventory, Receipt } from './mockData';
import { Role } from './roles';
import { seedUsers as usersSeed } from './db';

// ─── HELPERS ───────────────────────────────────────────────────────────
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

// ─── STORAGE ENGINE (LOCALSTORAGE) ───────────────────────────────────
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

// ─── USER & AUTH MODELS ──────────────────────────────────────────────
export interface UserAccount {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: Role;
  phoneNumber: string;
}

const seedUsers: UserAccount[] = usersSeed.map((user) => ({
  ...user,
  id: uid(),
}));

function seedUsersOnce() {
  const existing = load<UserAccount[]>('users');
  if (!existing || !existing.find(u => u.email === 'ceo@aakon.com')) {
    save('users', seedUsers);
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
  save('users', getUsers().filter(u => u.id !== id));
}

// Current OTP storage
let activeOTP: { email: string; code: string; expires: number } | null = null;

export function generateOTP(email: string): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  activeOTP = { email, code, expires: Date.now() + 300000, lastSent: Date.now() } as any;
  sendMockSMS(email, code);
  return code;
}

export function verifyOTP(email: string, code: string): boolean {
  if (activeOTP && activeOTP.email === email && activeOTP.code === code && activeOTP.expires > Date.now()) {
    activeOTP = null;
    return true;
  }
  return false;
}

// Simple mocked SMS provider (logs to console). In production replace with real SMS gateway.
export function sendMockSMS(email: string, code: string) {
  console.log(`[MOCK SMS] To: ${email} — Your verification code is: ${code}`);
  // store last sent timestamp in localStorage for rate limiting visibility
  try {
    const key = `aakon_otp_last_${email}`;
    localStorage.setItem(key, String(Date.now()));
  } catch {}
}

export function resendOTP(email: string): { ok: boolean; message?: string } {
  // rate limit: don't resend more than once per 20 seconds
  try {
    const key = `aakon_otp_last_${email}`;
    const last = parseInt(localStorage.getItem(key) || '0', 10);
    if (Date.now() - last < 20000) {
      return { ok: false, message: 'Please wait before requesting another code.' };
    }
  } catch {}
  const code = generateOTP(email);
  return { ok: true, message: 'Verification code resent.' };
}

// Remember device support
export function getClientDeviceId(): string {
  try {
    const k = 'aakon_device_id';
    let id = localStorage.getItem(k);
    if (!id) {
      id = uid();
      localStorage.setItem(k, id);
    }
    return id;
  } catch { return uid(); }
}

export function setRememberDevice(email: string, deviceId: string, days = 30) {
  try {
    const key = 'aakon_remembered_devices';
    const raw = localStorage.getItem(key);
    const map = raw ? JSON.parse(raw) : {};
    map[email.toLowerCase()] = { deviceId, expires: Date.now() + days * 24 * 3600 * 1000 };
    localStorage.setItem(key, JSON.stringify(map));
  } catch {}
}

export function isDeviceRemembered(email: string, deviceId: string): boolean {
  try {
    const key = 'aakon_remembered_devices';
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const map = JSON.parse(raw);
    const rec = map[email.toLowerCase()];
    if (!rec) return false;
    if (rec.deviceId !== deviceId) return false;
    if (rec.expires <= Date.now()) return false;
    return true;
  } catch { return false; }
}

export function findUserByEmail(email: string): UserAccount | null {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function authenticateUser(email: string, password: string): UserAccount | null {
  const user = findUserByEmail(email);
  if (user && user.password === password) return user;
  return null;
}

export const authenticate = authenticateUser;

// ─── OPERATOR: MACHINE LOADS & WATER LEVELS ─────────────────────────
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

export function addMachineLoad(m: Omit<MachineSupplyLoad, 'id' | 'date'>) {
  const list = load<MachineSupplyLoad[]>('machine_loads') ?? [];
  const n = { ...m, id: uid(), date: today() };
  list.push(n);
  save('machine_loads', list);
  return n;
}

export function addWaterLevelCheck(w: Omit<WaterLevelCheck, 'id' | 'date'>) {
  const list = load<WaterLevelCheck[]>('water_levels') ?? [];
  const n = { ...w, id: uid(), date: today() };
  list.push(n);
  save('water_levels', list);
  return n;
}

export function getOperatorStats() {
  const t = today();
  const loads = load<MachineSupplyLoad[]>('machine_loads') ?? [];
  const levels = load<WaterLevelCheck[]>('water_levels') ?? [];
  const todayLoads = loads.filter(m => m.date === t);
  const todayLevels = levels.filter(w => w.date === t);
  const criticalLevels = todayLevels.filter(w => w.status === 'critical' || w.status === 'low');
  return {
    totalLoadsToday: todayLoads.length,
    totalChecksToday: todayLevels.length,
    criticalAlerts: criticalLevels.length,
    todayLoads,
    todayLevels,
    criticalLevels,
  };
}

// ─── PRODUCTION PIPELINE: BAGGER → LOADER ───────────────────────────
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
}

export function getBaggerProductions() { return load<BaggerProduction[]>('bagger_productions') ?? []; }
export function addBaggerProduction(p: Omit<BaggerProduction, 'id' | 'date'>) {
  const list = getBaggerProductions();
  const n = { ...p, id: uid(), date: today() };
  list.push(n);
  save('bagger_productions', list);
  return n;
}

export function getTodayBaggerTotal() {
  const t = today();
  return getBaggerProductions().filter(p => p.date === t).reduce((sum, p) => sum + p.bagCount, 0);
}

export function getAvailableBagsForDelivery() {
  const t = today();
  const produced = getTodayBaggerTotal();
  const loaded = (load<LoaderDelivery[]>('loader_deliveries') ?? []).filter(d => d.date === t).reduce((sum, d) => sum + d.bagCount, 0);
  return Math.max(0, produced - loaded);
}

export function getLoaderDeliveries() { return load<LoaderDelivery[]>('loader_deliveries') ?? []; }
export function addLoaderDelivery(d: Omit<LoaderDelivery, 'id' | 'date'>) {
  if (d.bagCount > getAvailableBagsForDelivery()) return null;
  const list = getLoaderDeliveries();
  const n = { ...d, id: uid(), date: today() };
  list.push(n);
  save('loader_deliveries', list);
  return n;
}

export function updateDeliveryLeakage(id: string, hasLeakage: boolean, leakageCount: number, leakageNotes: string) {
  const list = getLoaderDeliveries();
  const d = list.find(i => i.id === id);
  if (d) { d.hasLeakage = hasLeakage; d.leakageCount = leakageCount; d.leakageNotes = leakageNotes; }
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
  const withLeakage = deliveries.filter(d => d.hasLeakage);
  const totalLeakedBags = withLeakage.reduce((sum, d) => sum + d.leakageCount, 0);
  const totalDeliveredBags = deliveries.reduce((sum, d) => sum + d.bagCount, 0);
  const leakageRate = totalDeliveredBags > 0 ? ((totalLeakedBags / totalDeliveredBags) * 100) : 0;
  return { 
    leakageCount: withLeakage.length, 
    totalLeakedBags, 
    leakageRate, 
    todayLeakage: deliveries.filter(d => d.date === today() && d.hasLeakage).length,
    todayLeakedBags: deliveries.filter(d => d.date === today() && d.hasLeakage).reduce((s, d) => s + d.leakageCount, 0),
    recentLeakages: withLeakage.slice(-10).reverse() 
  };
}

// ─── RECEIPTS ─────────────────────────────────────────────────────────
export function getReceipts(): Receipt[] {
  return load<Receipt[]>('receipts') ?? [];
}

export function markReceiptSent(id: string): void {
  const list = getReceipts();
  const r = list.find(r => r.id === id);
  if (r) r.sent_status = true;
  save('receipts', list);
}

// ─── QUALITY LAB ──────────────────────────────────────────────────────
export interface LabItemIn { id: string; product: string; supplier: string; qty: number; status: 'approved' | 'pending' | 'rejected'; time: string; batch: string; }
export interface LabItemOut { id: string; product: string; destination: string; qty: number; status: 'dispatched' | 'pending'; time: string; order: string; }
export interface QualityCheck { id: string; batch: string; product: string; pH: number; turbidity: string; result: 'pass' | 'fail'; inspector: string; }

export function getLabItemsIn(): LabItemIn[] { return load<LabItemIn[]>('lab_in') ?? []; }
export function addLabItemIn(i: Omit<LabItemIn, 'id'>) {
  const list = getLabItemsIn();
  const n = { ...i, id: `IN-${String(list.length + 1).padStart(3, '0')}` };
  list.push(n);
  save('lab_in', list);
  return n;
}

export function getLabItemsOut(): LabItemOut[] { return load<LabItemOut[]>('lab_out') ?? []; }
export function addLabItemOut(i: Omit<LabItemOut, 'id'>) {
  const list = getLabItemsOut();
  const n = { ...i, id: `OUT-${String(list.length + 1).padStart(3, '0')}` };
  list.push(n);
  save('lab_out', list);
  return n;
}

export function getQualityChecks(): QualityCheck[] { return load<QualityCheck[]>('lab_checks') ?? []; }
export function addQualityCheck(c: Omit<QualityCheck, 'id'>) {
  const list = getQualityChecks();
  const n = { ...c, id: `QC-${String(list.length + 1).padStart(3, '0')}` };
  list.push(n);
  save('lab_checks', list);
  return n;
}

// ─── BUSINESS MODELS ───────────────────────────────────────────
export function getCustomers() { return load<Customer[]>('customers') ?? []; }
export function addCustomer(c: Omit<Customer, 'id' | 'created_at'>) {
  const list = getCustomers();
  const n = { ...c, id: uid(), created_at: today() };
  list.push(n);
  save('customers', list);
  return n;
}

export function deleteCustomer(id: string): void {
  save('customers', getCustomers().filter(c => c.id !== id));
}

export function getInventory() { return load<Inventory[]>('inventory') ?? []; }
export function addInventoryItem(item: Omit<Inventory, 'id' | 'updated_at'>) {
  const list = getInventory();
  const n = { ...item, id: uid(), updated_at: today() };
  list.push(n);
  save('inventory', list);
  return n;
}

export function deleteInventoryItem(id: string): void {
  save('inventory', getInventory().filter(i => i.id !== id));
}

export function getSales() { return load<Sale[]>('sales') ?? []; }
export function addSale(s: any) {
  const sales = getSales();
  const sale = { ...s, id: uid(), created_at: now() };
  sales.push(sale);
  save('sales', sales);

  const receipts = getReceipts();
  receipts.push({ id: uid(), sale_id: sale.id, receipt_number: nextReceiptNo(), customer_name: sale.customer_name, amount: sale.total_amount, sent_status: false, created_at: today() });
  save('receipts', receipts);

  return sale;
}

export function deleteSale(id: string): void {
  save('sales', getSales().filter(s => s.id !== id));
}

export function getPayments() { return load<Payment[]>('payments') ?? []; }
export function addPayment(p: Omit<Payment, 'id'>) {
  const list = getPayments();
  const newP = { ...p, id: uid() };
  list.push(newP);
  save('payments', list);
  const sales = getSales();
  const sale = sales.find(s => s.id === p.sale_id);
  if (sale) { sale.payment_status = 'paid'; save('sales', sales); }
  return newP;
}

// ─── SETTINGS ───────────────────────────────────────────────────────
export function getSettings() {
  return load<any>('settings') ?? { businessName: 'AAKON VENTURE LIMITED', phone: '+233 24 000 0000', email: 'info@aakonventure.com', address: 'Accra, Ghana', pricePerBag: 10 };
}
export function saveSettings(s: any) { save('settings', s); }

// ─── ANALYTICS ─────────────────────────────────────────────
export function getTodayRevenue() {
  const t = today();
  return getSales().filter(s => s.created_at.startsWith(t)).reduce((sum, s) => sum + s.total_amount, 0);
}
export function getPendingSalesCount() { return getSales().filter(s => s.payment_status === 'pending').length; }
export function getTotalStock() { return getInventory().reduce((sum, i) => sum + i.quantity_available, 0); }
export function getLowStockCount() { return getInventory().filter(i => i.quantity_available < i.reorder_level).length; }

// ─── SUPPLY COMPATIBILITY ───────────────────────────────────────────
export interface SupplyCheckIn {
  id: string;
  supplier_name: string;
  quantity_supplied: number;
  payment_reference: string;
  checkin_time: string;
  status: 'delivered' | 'in-transit' | 'pending';
}

export function getSupplyCheckIns(): SupplyCheckIn[] {
  return load<SupplyCheckIn[]>('supply') ?? [];
}

export function addSupplyCheckIn(s: Omit<SupplyCheckIn, 'id'>): SupplyCheckIn {
  const list = getSupplyCheckIns();
  const n: SupplyCheckIn = { ...s, id: uid() };
  list.push(n);
  save('supply', list);
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
