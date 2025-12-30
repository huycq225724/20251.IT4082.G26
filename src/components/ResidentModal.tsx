import React, { useEffect, useState } from 'react';
import { Resident } from '../types';
import { LocalDB } from '../services/db';


interface ResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (resident: Resident) => void;
  resident?: Resident | null; 
}

const BUILDINGS = ['A', 'B', 'C'] as const;

const getRoomsByBuilding = (building?: string) => {
  if (!building) return [];

  if (building === 'A') {
    // 101 → 310
    return Array.from({ length: 210 }, (_, i) => 101 + i);
  }

  // B, C: 101 → 410
  return Array.from({ length: 310 }, (_, i) => 101 + i);
};


const ResidentModal: React.FC<ResidentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  resident
}) => {
  const [formData, setFormData] = useState<Partial<Resident>>({
    status: 'active',
    memberCount: 1,
    entryDate: new Date().toISOString().split('T')[0]
  });

  const [building, setBuilding] = useState<string>('');
  const [room, setRoom] = useState<string>('');

  const residents = LocalDB.getResidents();


  useEffect(() => {
    if (isOpen) {
      if (resident) {
        // EDIT MODE
        setFormData(resident);

        if (resident.apartmentId) {
          const [b, r] = resident.apartmentId.split('-');
          setBuilding(b);
          setRoom(r);
        }
      } else {
        // ADD MODE
        setFormData({
          status: 'active',
          role: 'member',
          entryDate: new Date().toISOString().split('T')[0]
        });
        setBuilding('');
        setRoom('');
      }
    }
  }, [isOpen, resident]);



  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'memberCount' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ===== RULE: mỗi căn hộ chỉ có 1 chủ hộ =====
    if (formData.role === 'owner') {
      const hasOwner = residents.some(
        r =>
          r.apartmentId === formData.apartmentId &&
          r.role === 'owner' &&
          r.id !== resident?.id // 👈 BỎ QUA CHÍNH NÓ
      );


      if (hasOwner) {
        alert('Căn hộ này đã có chủ hộ. Vui lòng chọn vai trò là thành viên.');
        return;
      }
    }

    onSave(formData as Resident);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in">

        {/* HEADER */}
        <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <h2 className="text-2xl font-black text-white">
            Thêm Cư Dân Mới
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Họ tên */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Họ và tên
              </label>
              <input
                name="name"
                value={formData.name || ''}
                required
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Email
              </label>
              <input
                name="email"
                value={formData.email || ''}
                required
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            {/* Điện thoại */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Số điện thoại
              </label>
              <input
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            {/* Vai trò trong hộ */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Vai trò trong hộ
                </label>
                <select
                  name="role"
                  value={formData.role || 'member'}
                  onChange={handleChange}
                  className="w-full px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white"
                  required
                >
                  <option value="owner">Chủ hộ</option>
                  <option value="member">Thành viên</option>
                </select>
              </div>

            {/* Tòa nhà */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Tòa nhà
              </label>
              <select
                value={building}
                onChange={(e) => {
                  const b = e.target.value;
                  setBuilding(b);
                  setRoom('');
                  setFormData(prev => ({
                    ...prev,
                    apartmentId: undefined
                  }));
                }}
                className="w-full px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white"
                required
              >
                <option value="">-- Chọn tòa --</option>
                {BUILDINGS.map(b => (
                  <option key={b} value={b}>Tòa {b}</option>
                ))}
              </select>
            </div>

            {/* Căn hộ */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Căn hộ
              </label>
              <select
                value={room}
                onChange={(e) => {
                  const r = e.target.value;
                  setRoom(r);
                  setFormData(prev => ({
                    ...prev,
                    apartmentId: `${building}-${r}`
                  }));
                }}
                disabled={!building}
                className="w-full px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white disabled:opacity-50"
                required
              >
                <option value="">-- Chọn căn hộ --</option>
                {getRoomsByBuilding(building).map(room => (
                  <option key={room} value={room}>
                    {building}-{room}
                  </option>
                ))}

              </select>
            </div>

          {/* Ngày vào ở */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
              Ngày vào ở
            </label>
            <input
              type="date"
              name="entryDate"
              value={formData.entryDate || ''}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white"
              required
            />
          </div>


          {/* Trạng thái */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
              Tình trạng cư trú
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white"
            >
              <option value="active">Thường trú</option>
              <option value="temporary">Tạm trú</option>
              <option value="absent">Vắng mặt</option>
            </select>
          </div>

        </div>

      {/* FOOTER */}
      <div className="flex justify-end gap-4 pt-8">
        <button
          type="button"
          onClick={onClose}
          className="px-8 py-3.5 font-bold rounded-2xl text-slate-400 hover:bg-slate-800"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-10 py-3.5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20"
        >
          Lưu Cư Dân
        </button>
      </div>
    </form>
      </div >
    </div >
  );
};

export default ResidentModal;
