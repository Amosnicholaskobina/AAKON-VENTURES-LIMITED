export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
}

export interface Sale {
  id: string;
  customer_id: string;
  customer_name: string;
  quantity: number;
  total_amount: number;
  payment_status: 'paid' | 'pending' | 'partial';
  payment_method: string;
  created_at: string;
}

export interface Payment {
  id: string;
  sale_id: string;
  customer_name: string;
  amount_paid: number;
  payment_reference: string;
  payment_date: string;
}

export interface Inventory {
  id: string;
  product_name: string;
  quantity_available: number;
  reorder_level: number;
  updated_at: string;
}

export interface SupplyCheckIn {
  id: string;
  supplier_name: string;
  quantity_supplied: number;
  payment_reference: string;
  checkin_time: string;
  status: 'delivered' | 'in-transit' | 'pending';
}

export interface Receipt {
  id: string;
  sale_id: string;
  receipt_number: string;
  customer_name: string;
  amount: number;
  sent_status: boolean;
  created_at: string;
}

export const customers: Customer[] = [
  { id: '1', name: 'John Doe', phone: '+233 24 123 4567', email: 'john@example.com', address: '123 Main St, Accra', created_at: '2026-01-15' },
  { id: '2', name: 'Jane Smith', phone: '+233 20 987 6543', email: 'jane@example.com', address: '456 Oak Ave, Kumasi', created_at: '2026-02-20' },
  { id: '3', name: 'Michael Brown', phone: '+233 55 111 2222', email: 'michael@example.com', address: '789 Pine Rd, Tema', created_at: '2026-03-10' },
  { id: '4', name: 'Sarah Johnson', phone: '+233 27 333 4444', email: 'sarah@example.com', address: '321 Elm St, Cape Coast', created_at: '2026-03-25' },
  { id: '5', name: 'David Wilson', phone: '+233 50 555 6666', email: 'david@example.com', address: '654 Maple Dr, Takoradi', created_at: '2026-04-05' },
];

export const sales: Sale[] = [
  { id: '1', customer_id: '1', customer_name: 'John Doe', quantity: 20, total_amount: 200, payment_status: 'paid', payment_method: 'Mobile Money', created_at: '2026-05-15' },
  { id: '2', customer_id: '2', customer_name: 'Jane Smith', quantity: 15, total_amount: 150, payment_status: 'paid', payment_method: 'Cash', created_at: '2026-05-15' },
  { id: '3', customer_id: '3', customer_name: 'Michael Brown', quantity: 30, total_amount: 300, payment_status: 'pending', payment_method: 'Bank Transfer', created_at: '2026-05-14' },
  { id: '4', customer_id: '4', customer_name: 'Sarah Johnson', quantity: 10, total_amount: 100, payment_status: 'paid', payment_method: 'Mobile Money', created_at: '2026-05-14' },
  { id: '5', customer_id: '5', customer_name: 'David Wilson', quantity: 25, total_amount: 250, payment_status: 'partial', payment_method: 'Cash', created_at: '2026-05-13' },
];

export const payments: Payment[] = [
  { id: '1', sale_id: '1', customer_name: 'John Doe', amount_paid: 200, payment_reference: 'PAY-001', payment_date: '2026-05-15 10:30' },
  { id: '2', sale_id: '2', customer_name: 'Jane Smith', amount_paid: 150, payment_reference: 'PAY-002', payment_date: '2026-05-15 11:45' },
  { id: '3', sale_id: '4', customer_name: 'Sarah Johnson', amount_paid: 100, payment_reference: 'PAY-003', payment_date: '2026-05-14 14:20' },
  { id: '4', sale_id: '5', customer_name: 'David Wilson', amount_paid: 125, payment_reference: 'PAY-004', payment_date: '2026-05-13 16:10' },
];

export const inventory: Inventory[] = [
  { id: '1', product_name: 'Pure Spring Water (500ml)', quantity_available: 150, reorder_level: 100, updated_at: '2026-05-15' },
  { id: '2', product_name: 'Crystal Clear Water (1L)', quantity_available: 80, reorder_level: 50, updated_at: '2026-05-15' },
  { id: '3', product_name: 'Mountain Fresh Water (2L)', quantity_available: 45, reorder_level: 60, updated_at: '2026-05-15' },
  { id: '4', product_name: 'Premium Aqua (5L)', quantity_available: 30, reorder_level: 40, updated_at: '2026-05-15' },
];

export const supplyCheckIns: SupplyCheckIn[] = [
  { id: '1', supplier_name: 'AquaSource Ltd', quantity_supplied: 500, payment_reference: 'SUP-001', checkin_time: '2026-05-15 09:00', status: 'delivered' },
  { id: '2', supplier_name: 'Pure Water Co', quantity_supplied: 300, payment_reference: 'SUP-002', checkin_time: '2026-05-15 14:30', status: 'in-transit' },
  { id: '3', supplier_name: 'Crystal Springs', quantity_supplied: 400, payment_reference: 'SUP-003', checkin_time: '2026-05-14 11:15', status: 'delivered' },
  { id: '4', supplier_name: 'Fresh Flow Inc', quantity_supplied: 250, payment_reference: 'SUP-004', checkin_time: '2026-05-16 08:00', status: 'pending' },
];

export const receipts: Receipt[] = [
  { id: '1', sale_id: '1', receipt_number: 'BW-1001', customer_name: 'John Doe', amount: 200, sent_status: true, created_at: '2026-05-15' },
  { id: '2', sale_id: '2', receipt_number: 'BW-1002', customer_name: 'Jane Smith', amount: 150, sent_status: true, created_at: '2026-05-15' },
  { id: '3', sale_id: '4', receipt_number: 'BW-1003', customer_name: 'Sarah Johnson', amount: 100, sent_status: false, created_at: '2026-05-14' },
  { id: '4', sale_id: '5', receipt_number: 'BW-1004', customer_name: 'David Wilson', amount: 250, sent_status: true, created_at: '2026-05-13' },
];

export const dailyRevenue = [
  { day: 'Mon', revenue: 450 },
  { day: 'Tue', revenue: 520 },
  { day: 'Wed', revenue: 380 },
  { day: 'Thu', revenue: 620 },
  { day: 'Fri', revenue: 750 },
  { day: 'Sat', revenue: 680 },
  { day: 'Sun', revenue: 590 },
];

export const weeklySales = [
  { week: 'Week 1', sales: 2400 },
  { week: 'Week 2', sales: 2800 },
  { week: 'Week 3', sales: 3200 },
  { week: 'Week 4', sales: 2900 },
];

export const paymentMethods = [
  { name: 'Mobile Money', value: 45 },
  { name: 'Cash', value: 30 },
  { name: 'Bank Transfer', value: 25 },
];

export const deliveryStatus = [
  { status: 'Delivered', count: 45 },
  { status: 'In Transit', count: 12 },
  { status: 'Pending', count: 8 },
];
