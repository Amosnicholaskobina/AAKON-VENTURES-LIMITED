import { Role } from './roles';

export interface SeedUser {
  email: string;
  password: string;
  fullName: string;
  role: Role;
  phoneNumber: string;
}

export const seedUsers: SeedUser[] = [
  { email: 'ceo@aakon.com', password: 'password123', fullName: 'Nana Agyeman', role: 'ceo', phoneNumber: '+233240000001' },
  { email: 'admin@aakon.com', password: 'password123', fullName: 'Kofi Mensah', role: 'admin', phoneNumber: '+233240000002' },
  { email: 'manager@aakon.com', password: 'password123', fullName: 'Ama Boateng', role: 'manager', phoneNumber: '+233240000003' },
  { email: 'supervisor@aakon.com', password: 'password123', fullName: 'Kwame Asante', role: 'supervisor', phoneNumber: '+233240000004' },
  { email: 'cashier@aakon.com', password: 'password123', fullName: 'Abena Osei', role: 'cashier', phoneNumber: '+233240000005' },
  { email: 'worker@aakon.com', password: 'password123', fullName: 'Yaw Addo', role: 'worker', phoneNumber: '+233240000006' },
  { email: 'lab@aakon.com', password: 'password123', fullName: 'Efua Mensah', role: 'quality_lab', phoneNumber: '+233240000007' },
  { email: 'operator@aakon.com', password: 'password123', fullName: 'Kwesi Appiah', role: 'operator', phoneNumber: '+233240000008' },
];
