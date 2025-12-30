
import React, { useState, useEffect } from 'react';
import { LocalDB } from '../services/db';
import { Resident, UserAccount } from '../types';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [residentInfo, setResidentInfo] = useState<Partial<Resident>>({});
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const currentUser = LocalDB.getCurrentUser();
    setUser(currentUser);

    // 👉 Nếu là admin thì KHÔNG map sang Resident
    if (!currentUser || currentUser.role === 'admin') {
      return;
    }

    const allResidents = LocalDB.getResidents();
    const info =
      allResidents.find(r => r.email === currentUser.email) || {
        name: currentUser.name,
        email: currentUser.email,
        apartmentId: currentUser.apartmentId || '',
        memberCount: 1,
        phone: '',
        status: 'active'
      };

    setResidentInfo(info);
  }, []);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allResidents = LocalDB.getResidents();
    const index = allResidents.findIndex(r => r.email === residentInfo.email);
    
    let updatedResidents = [...allResidents];
    if (index > -1) {
      updatedResidents[index] = { ...allResidents[index], ...residentInfo } as Resident;
    } else {
      updatedResidents.push({ ...residentInfo, id: Date.now().toString() } as Resident);
    }
    
    LocalDB.saveResidents(updatedResidents);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setResidentInfo(prev => ({ ...prev, [name]: name === 'memberCount' ? Number(value) : value }));
  };

  // ====== ADMIN VIEW ======
  if (user?.role === 'admin') {
    return (
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl p-12">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">
            Hồ sơ quản trị hệ thống
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Tên tài khoản</label>
              <input
                value={user.name}
                disabled
                className="w-full mt-2 px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
              <input
                value={user.email}
                disabled
                className="w-full mt-2 px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Vai trò</label>
              <input
                value="Cán bộ quản lý"
                disabled
                className="w-full mt-2 px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ====== RESIDENT VIEW (GIỮ NGUYÊN UI CŨ) ======
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* TOÀN BỘ JSX CŨ CỦA BẠN GIỮ NGUYÊN */}
      </div>
    </div>
  );

};

export default ProfilePage;
