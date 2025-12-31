
import React from 'react';
import { createPortal } from 'react-dom';
import { Resident } from '../types';

interface ResidentListProps {
  data: Resident[];
  onEdit: (resident: Resident) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: Resident['status']) => void;
}

const ResidentList: React.FC<ResidentListProps> = ({
  data,
  onEdit,
  onDelete,
  onChangeStatus
}) => {
  const [openStatusId, setOpenStatusId] = React.useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = React.useState<{ x: number; y: number } | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!openStatusId) return;

    const onMouseDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenStatusId(null);
        setDropdownPos(null);
      }
    };

    const onAnyScrollOrResize = () => {
      setOpenStatusId(null);
      setDropdownPos(null);
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('resize', onAnyScrollOrResize);
    window.addEventListener('scroll', onAnyScrollOrResize, true); // close khi scroll bất kỳ container nào

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('resize', onAnyScrollOrResize);
      window.removeEventListener('scroll', onAnyScrollOrResize, true);
    };
  }, [openStatusId]);

  const sortedData = [...data].sort((a, b) => {
    if (a.apartmentId !== b.apartmentId) {
      return a.apartmentId.localeCompare(b.apartmentId);
    }
    const aFirst = a.name.split(' ').slice(-1)[0];
    const bFirst = b.name.split(' ').slice(-1)[0];
    return aFirst.localeCompare(bFirst);
  });

  // đếm số người trong mỗi căn hộ
  const memberCountMap = sortedData.reduce<Record<string, number>>((acc, r) => {
    acc[r.apartmentId] = (acc[r.apartmentId] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Căn Hộ</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cư Dân</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Liên Hệ</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Số TV</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày Vào</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng Thái</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ghi chú</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedData.map((res) => (
              <tr
                key={res.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{res.apartmentId}</span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                      {res.name.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{res.name}</span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="text-slate-700 font-medium">{res.phone}</div>
                    <div className="text-slate-400 text-xs">{res.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-600">{memberCountMap[res.apartmentId]} người</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-500">{res.entryDate}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                      const nextOpen = openStatusId === res.id ? null : res.id;

                      if (nextOpen) {
                        setDropdownPos({ x: rect.left, y: rect.bottom });
                        setOpenStatusId(res.id);
                      } else {
                        setOpenStatusId(null);
                        setDropdownPos(null);
                      }
                    }}
                    className="cursor-pointer"
                  >

                    {res.status === 'active' && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase
                        bg-emerald-50 text-emerald-600 border border-emerald-100">
                        Thường trú
                      </span>
                    )}

                    {res.status === 'temporary' && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase
                        bg-amber-50 text-amber-600 border border-amber-100">
                        Tạm trú
                      </span>
                    )}

                    {res.status === 'absent' && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase
                        bg-rose-50 text-rose-600 border border-rose-100">
                        Vắng mặt
                      </span>
                    )}
                  </button>
                </td>


                <td className="px-6 py-4 whitespace-nowrap">
                  {res.role === 'owner' && (
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-600 border border-blue-100">
                      Chủ hộ
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(res)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Sửa cư dân"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11
                            a2 2 0 002 2h11
                            a2 2 0 002-2v-5
                            m-1.414-9.414
                            a2 2 0 112.828 2.828
                            L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() => onDelete(res.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title="Xóa cư dân"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M19 7l-.867 12.142
                            A2 2 0 0116.138 21H7.862
                            a2 2 0 01-1.995-1.858L5 7
                            m5 4v6m4-6v6
                            m1-10V4
                            a1 1 0 00-1-1h-4
                            a1 1 0 00-1 1v3
                            M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>


              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {openStatusId && dropdownPos && createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-[9999] w-40 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"
          style={{ left: dropdownPos.x, top: dropdownPos.y + 8 }}
        >
          {[
            { key: 'active', label: 'Thường trú', cls: 'text-emerald-600' },
            { key: 'temporary', label: 'Tạm trú', cls: 'text-amber-600' },
            { key: 'absent', label: 'Vắng mặt', cls: 'text-rose-600' },
          ].map(opt => (
            <button
              key={opt.key}
              type="button"
              onClick={() => {
                onChangeStatus(openStatusId, opt.key as Resident['status']);
                setOpenStatusId(null);
                setDropdownPos(null);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${opt.cls}`}
            >
              {opt.label}
            </button>
          ))}
        </div>,
        document.body
      )}

    </div>
  );
};

export default ResidentList;
