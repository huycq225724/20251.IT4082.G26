
import { FeeItem, Resident, AppNotification, PaymentStatus, Activity, PoolTicket, UserAccount } from '../types';

const STORAGE_KEYS = {
  FEES: 'apt_manager_fees',
  RESIDENTS: 'apt_manager_residents',
  NOTIFS: 'apt_manager_notifications',
  ACTIVITIES: 'apt_manager_activities',
  TICKETS: 'apt_manager_pool_tickets',
  CURRENT_USER: 'apt_manager_current_user',
  DB_VERSION: 'apt_manager_db_version',
};

const CURRENT_DB_VERSION = '2025-12-31-v3'; // đổi string này mỗi khi sửa mock

const ensureSeed = () => {
  const v = localStorage.getItem(STORAGE_KEYS.DB_VERSION);
  if (v !== CURRENT_DB_VERSION) {
    localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(mockFees));
    localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(mockResidents));
    localStorage.setItem(STORAGE_KEYS.DB_VERSION, CURRENT_DB_VERSION);
  }
};

const mockFees: FeeItem[] = [
  { id: 'F-A101-102025', apartmentId: 'A-101', residentName: 'Nguyễn Văn An', month: '10', year: 2025, managementFee: 500000, electricity: 900000, water: 250000, parking: 100000, total: 1750000, status: PaymentStatus.PAID, dueDate: '2025-10-10' },
  { id: 'F-A101-112025', apartmentId: 'A-101', residentName: 'Nguyễn Văn An', month: '11', year: 2025, managementFee: 500000, electricity: 850000, water: 230000, parking: 100000, total: 1680000, status: PaymentStatus.PAID, dueDate: '2025-11-10' },
  { id: 'F-A102-102025', apartmentId: 'A-102', residentName: 'Phạm Thị Lan', month: '10', year: 2025, managementFee: 500000, electricity: 780000, water: 210000, parking: 100000, total: 1590000, status: PaymentStatus.PAID, dueDate: '2025-10-10' },
  { id: 'F-A201-112025', apartmentId: 'A-201', residentName: 'Lê Văn Hùng', month: '11', year: 2025, managementFee: 550000, electricity: 1200000, water: 300000, parking: 150000, total: 2200000, status: PaymentStatus.PAID, dueDate: '2025-11-10' },
  { id: 'F-B205-102025', apartmentId: 'B-205', residentName: 'Lê Văn Cường', month: '10', year: 2025, managementFee: 700000, electricity: 1900000, water: 420000, parking: 200000, total: 3220000, status: PaymentStatus.OVERDUE, dueDate: '2025-10-10' },
  { id: 'F-B310-112025', apartmentId: 'B-310', residentName: 'Đỗ Minh Quân', month: '11', year: 2025, managementFee: 600000, electricity: 1300000, water: 280000, parking: 150000, total: 2330000, status: PaymentStatus.OVERDUE, dueDate: '2025-11-10' },
  { id: 'F-B402-102025', apartmentId: 'B-402', residentName: 'Hoàng Thị Yến', month: '10', year: 2025, managementFee: 650000, electricity: 1400000, water: 300000, parking: 150000, total: 2500000, status: PaymentStatus.PAID, dueDate: '2025-10-10' },
  { id: 'F-C101-112025', apartmentId: 'C-101', residentName: 'Vũ Văn Nam', month: '11', year: 2025, managementFee: 500000, electricity: 950000, water: 240000, parking: 100000, total: 1790000, status: PaymentStatus.PAID, dueDate: '2025-11-10' },
  { id: 'F-C410-102025', apartmentId: 'C-410', residentName: 'Trịnh Quốc Bảo', month: '10', year: 2025, managementFee: 800000, electricity: 2200000, water: 480000, parking: 250000, total: 3730000, status: PaymentStatus.PAID, dueDate: '2025-10-10' },
  
  { id: 'F-A101-122025', apartmentId: 'A-101', residentName: 'Nguyễn Văn An', month: '12', year: 2025, managementFee: 500000, electricity: 880000, water: 240000, parking: 100000, total: 1720000, status: PaymentStatus.PAID, dueDate: '2025-12-10' },
  { id: 'F-A102-122025', apartmentId: 'A-102', residentName: 'Phạm Thị Lan', month: '12', year: 2025, managementFee: 500000, electricity: 820000, water: 220000, parking: 100000, total: 1640000, status: PaymentStatus.PENDING, dueDate: '2025-12-10' },
  { id: 'F-A201-122025', apartmentId: 'A-201', residentName: 'Lê Văn Hùng', month: '12', year: 2025, managementFee: 550000, electricity: 1180000, water: 290000, parking: 150000, total: 2170000, status: PaymentStatus.PAID, dueDate: '2025-12-10' },
  { id: 'F-B205-122025', apartmentId: 'B-205', residentName: 'Lê Văn Cường', month: '12', year: 2025, managementFee: 700000, electricity: 2100000, water: 450000, parking: 200000, total: 3450000, status: PaymentStatus.PENDING, dueDate: '2025-12-10' },
  { id: 'F-B310-122025', apartmentId: 'B-310', residentName: 'Đỗ Minh Quân', month: '12', year: 2025, managementFee: 600000, electricity: 1350000, water: 300000, parking: 150000, total: 2400000, status: PaymentStatus.PAID, dueDate: '2025-12-10' },
  { id: 'F-B402-122025', apartmentId: 'B-402', residentName: 'Hoàng Thị Yến', month: '12', year: 2025, managementFee: 650000, electricity: 1450000, water: 310000, parking: 150000, total: 2560000, status: PaymentStatus.PAID, dueDate: '2025-12-10' },
  { id: 'F-C101-122025', apartmentId: 'C-101', residentName: 'Vũ Văn Nam', month: '12', year: 2025, managementFee: 500000, electricity: 980000, water: 260000, parking: 100000, total: 1840000, status: PaymentStatus.PAID, dueDate: '2025-12-10' },
  { id: 'F-C410-122025', apartmentId: 'C-410', residentName: 'Trịnh Quốc Bảo', month: '12', year: 2025, managementFee: 800000, electricity: 2400000, water: 520000, parking: 250000, total: 3970000, status: PaymentStatus.PENDING, dueDate: '2025-12-10' },
];


const mockResidents: Resident[] = [
  { id: 'A101-1', apartmentId: 'A-101', name: 'Nguyễn Văn An', phone: '0901111111', email: 'an.nguyen@gmail.com', role: 'owner', entryDate: '2024-01-10', status: 'active', memberCount: 0 },
  { id: 'A101-2', apartmentId: 'A-101', name: 'Trần Thị Hoa', phone: '0901111112', email: 'hoa.tran@gmail.com', role: 'member', entryDate: '2024-01-10', status: 'active', memberCount: 0 },

  { id: 'A102-1', apartmentId: 'A-102', name: 'Phạm Thị Lan', phone: '0902222221', email: 'lan.pham@gmail.com', role: 'owner', entryDate: '2025-03-15', status: 'active', memberCount: 0 },
  { id: 'A102-2', apartmentId: 'A-102', name: 'Phạm Minh Tuấn', phone: '0902222222', email: 'tuan.pham@gmail.com', role: 'member', entryDate: '2025-03-15', status: 'active', memberCount: 0 },

  { id: 'A201-1', apartmentId: 'A-201', name: 'Lê Văn Hùng', phone: '0903333331', email: 'hung.le@gmail.com', role: 'owner', entryDate: '2023-06-01', status: 'active', memberCount: 0 },

  { id: 'B205-1', apartmentId: 'B-205', name: 'Lê Văn Cường', phone: '0914444441', email: 'cuong.le@gmail.com', role: 'owner', entryDate: '2022-11-20', status: 'active', memberCount: 0 },
  { id: 'B205-2', apartmentId: 'B-205', name: 'Nguyễn Thị Mai', phone: '0914444442', email: 'mai.nguyen@gmail.com', role: 'member', entryDate: '2022-11-20', status: 'temporary', memberCount: 0 },
  { id: 'B205-3', apartmentId: 'B-205', name: 'Nguyễn Văn Long', phone: '0914444443', email: 'long.nguyen@gmail.com', role: 'member', entryDate: '2024-05-01', status: 'absent', memberCount: 0 },

  { id: 'B310-1', apartmentId: 'B-310', name: 'Đỗ Minh Quân', phone: '0915555551', email: 'quan.do@gmail.com', role: 'owner', entryDate: '2025-02-01', status: 'active', memberCount: 0 },
  { id: 'B402-1', apartmentId: 'B-402', name: 'Hoàng Thị Yến', phone: '0916666661', email: 'yen.hoang@gmail.com', role: 'owner', entryDate: '2023-08-12', status: 'active', memberCount: 0 },

  { id: 'C101-1', apartmentId: 'C-101', name: 'Vũ Văn Nam', phone: '0927777771', email: 'nam.vu@gmail.com', role: 'owner', entryDate: '2023-04-04', status: 'active', memberCount: 0 },
  { id: 'C101-2', apartmentId: 'C-101', name: 'Vũ Thị Hạnh', phone: '0927777772', email: 'hanh.vu@gmail.com', role: 'member', entryDate: '2023-04-04', status: 'active', memberCount: 0 },

  { id: 'C410-1', apartmentId: 'C-410', name: 'Trịnh Quốc Bảo', phone: '0928888881', email: 'bao.trinh@gmail.com', role: 'owner', entryDate: '2021-09-09', status: 'active', memberCount: 0 },
  { id: 'C410-2', apartmentId: 'C-410', name: 'Trịnh Gia Hân', phone: '0928888882', email: 'han.trinh@gmail.com', role: 'member', entryDate: '2021-09-09', status: 'active', memberCount: 0 },
];


const mockUsers: UserAccount[] = [
  {
    id: 'admin',
    email: 'admin@apart.vn',
    name: 'admin',
    password: '123456',
    role: 'admin'
  }
];

export const LocalDB = {
  getFees: (): FeeItem[] => {
    ensureSeed();
    const data = localStorage.getItem(STORAGE_KEYS.FEES);
    return data ? JSON.parse(data) : (localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(mockFees)), mockFees);
  },
  saveFees: (fees: FeeItem[]) => localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(fees)),

  getResidents: (): Resident[] => {
    ensureSeed();
    const data = localStorage.getItem(STORAGE_KEYS.RESIDENTS);
    return data ? JSON.parse(data) : (localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(mockResidents)), mockResidents);
  },
  saveResidents: (residents: Resident[]) => localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(residents)),
  
  getCurrentUser: (): UserAccount | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },
  setCurrentUser: (user: UserAccount | null) => {
    if (user) localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

    login: (email: string, password: string): UserAccount | null => {
      const user = mockUsers.find(
        u => u.email === email && u.password === password
      );

      if (user) {
        localStorage.setItem(
          STORAGE_KEYS.CURRENT_USER,
          JSON.stringify(user)
        );
        return user;
      }

      return null;
    },


  getActivities: (): Activity[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return data ? JSON.parse(data) : [];
  },

  getNotifications: (): AppNotification[] => {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFS);
    return data ? JSON.parse(data) : [];
  },

  getPoolTickets: (): PoolTicket[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TICKETS);
    return data ? JSON.parse(data) : [];
  }



};
