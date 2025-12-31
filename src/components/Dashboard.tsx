
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FeeItem, Resident, PaymentStatus } from '../types';

interface DashboardProps {
  fees: FeeItem[];
  residents: Resident[];
}

const STATS_COLORS = ['#cbd5e1', '#3b82f6', '#f97316', '#ef4444', '#10b981'];

const Dashboard: React.FC<DashboardProps> = ({ fees = [], residents = [] }) => {
  const now = new Date();
  const currentMonth = String(now.getMonth() + 1); // '12'
  const currentYear = now.getFullYear(); // 2025...

  const monthFees = fees.filter(
    (f) => String(f.month) === currentMonth && f.year === currentYear
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isCurrentMonth = (f: FeeItem) =>
    String(f.month) === currentMonth && f.year === currentYear;

  const isOverdue = (f: FeeItem) => f.status === PaymentStatus.OVERDUE;

  const paidCount = monthFees.filter((f) => f.status === PaymentStatus.PAID).length;
  const pendingCount = monthFees.filter((f) => f.status !== PaymentStatus.PAID && !isOverdue(f)).length;
  const overdueThisMonthCount = monthFees.filter((f) => isOverdue(f)).length;
  const overdueBacklogCount = fees.filter((f) => !isCurrentMonth(f) && isOverdue(f)).length;
  const overdueCount = overdueThisMonthCount + overdueBacklogCount;

  const totalCount = monthFees.length;
  const completionPct = totalCount ? (paidCount / totalCount) * 100 : 0;

  const chartPaidCount = fees.filter((f) => f.status === PaymentStatus.PAID).length;
  const chartPendingCount = fees.filter((f) => f.status === PaymentStatus.PENDING).length;
  const chartOverdueCount = fees.filter((f) => f.status === PaymentStatus.OVERDUE).length;

  const chartTotal = chartPaidCount + chartPendingCount + chartOverdueCount || 1;


  const totalCollected = monthFees
    .filter((f) => f.status === PaymentStatus.PAID)
    .reduce((sum, item) => sum + item.total, 0);

  const overdueApartmentCount = new Set(
    fees.filter((f) => f.status === PaymentStatus.OVERDUE).map((f) => f.apartmentId)
  ).size;



  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const formatShortDate = (iso: string) => {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  };


  const paymentChartData = [
    { key: 'pending', name: 'Chờ nộp', value: chartPendingCount },
    { key: 'paid', name: 'Đã hoàn thành', value: chartPaidCount },
    { key: 'overdue', name: 'Quá hạn', value: chartOverdueCount },
  ] as const;


  const PAYMENT_COLORS: Record<(typeof paymentChartData)[number]['key'], string> = {
    pending: '#f59e0b',
    paid: '#10b981',    
    overdue: '#ef4444', 
  };

  const thisMonthResidents = residents.filter((r) => {
    const d = new Date(r.entryDate);
    return d.getFullYear() === currentYear && String(d.getMonth() + 1) === currentMonth;
  });

  const newestResidents = (thisMonthResidents.length ? thisMonthResidents : residents)
    .slice()
    .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime())
    .slice(0, 3);

  const topUnpaidFees = fees
    .filter((f) => f.status !== PaymentStatus.PAID)
    .slice()
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500 transition-colors">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Hóa đơn tháng này" 
          value={`${paidCount} / ${totalCount}`} 
          color="bg-blue-500" 
          progress={completionPct}
        />

        <SummaryCard 
          title="Tỷ lệ hoàn thành" 
          value={`${Math.round(completionPct)}%`} 
          color="bg-emerald-500" 
          progress={completionPct}
        />

        <SummaryCard 
          title="Tổng đã thu tháng này (VNĐ)" 
          value={formatCurrency(totalCollected).replace('₫', '').trim()} 
          color="bg-indigo-600" 
          progress={completionPct}
        />

        <SummaryCard 
          title="Căn hộ quá hạn" 
          value={`${overdueApartmentCount} Căn`} 
          color="bg-rose-500" 
          progress={0}
        />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight">Hàng chờ báo cáo mới</h3>
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-[10px] font-bold">4 Đang chờ</span>
            </div>
            <div className="p-0">
               <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3 font-bold uppercase">Căn hộ / Loại báo cáo</th>
                    <th className="px-6 py-3 font-bold uppercase">Thời gian</th>
                    <th className="px-6 py-3 font-bold uppercase text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <PendingReportRow apt="A-201" type="Sự cố điện" time="15:30 Hôm nay" status="pending" />
                  <PendingReportRow apt="B-504" type="Báo rò nước" time="14:20 Hôm nay" status="reviewing" />
                  <PendingReportRow apt="C-102" type="Góp ý bảo vệ" time="Hôm qua" status="pending" />
                </tbody>
               </table>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-700 dark:bg-slate-800">
              <h3 className="text-sm font-bold text-white uppercase">Tình trạng thu phí toàn dự án</h3>
            </div>
            <div className="p-6">
               <div className="flex flex-wrap justify-center gap-6 mb-6">
                  {paymentChartData.map((item, idx) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: PAYMENT_COLORS[item.key] }}
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">{item.name}</span>
                    </div>
                  ))}
               </div>



               <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      content={<PaymentTooltip total={chartTotal} />}
                      cursor={false}
                    />
                    <Pie
                      data={paymentChartData}
                      cx="50%"
                      cy="100%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={80}
                      outerRadius={140}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {paymentChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[entry.key]} />
                      ))}
                    </Pie>
                  </PieChart>

                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-700 dark:bg-slate-800">
              <h3 className="text-sm font-bold text-white uppercase">Cư dân mới nhất</h3>
            </div>
            <div className="p-0">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-bold uppercase">Căn hộ</th>
                    <th className="px-4 py-3 font-bold uppercase">Họ tên</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {newestResidents.map((r) => (
                    <ResidentRow
                      key={r.id}
                      apt={r.apartmentId}
                      name={r.name}
                      date={formatShortDate(r.entryDate)}
                    />
                  ))}
                </tbody>

              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-700 dark:bg-slate-800">
              <h3 className="text-sm font-bold text-white uppercase">Top hóa đơn lớn nhất chưa đóng</h3>
            </div>
            <div className="p-0">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-bold uppercase">Căn hộ</th>
                    <th className="px-4 py-3 font-bold uppercase text-right">Số tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {topUnpaidFees.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-bold">{item.apartmentId}</td>
                      <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400 font-bold">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, color, progress }: { title: string; value: string; color: string; progress: number }) => (
  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
    <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center font-bold mb-1 uppercase tracking-wider">{title}</p>
    <h4 className="text-2xl font-black text-slate-800 dark:text-white text-center mb-4">{value}</h4>
    <div className="absolute bottom-0 left-0 h-1.5 w-full bg-slate-100 dark:bg-slate-800">
      <div 
        className={`h-full ${color} transition-all duration-1000 ease-out`} 
        style={{ width: `${Math.min(100, progress)}%` }}
      ></div>
    </div>
  </div>
);

const ResidentRow = ({ apt, name, date }: { apt: string; name: string; date: string }) => (
  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
    <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-[10px] font-bold">{apt}</span>
    </td>
    <td className="px-4 py-3">
        <p className="text-slate-700 dark:text-slate-300 font-semibold">{name}</p>
        <p className="text-[9px] text-slate-400 dark:text-slate-600">Vào ngày {date}</p>
    </td>
  </tr>
);

const PendingReportRow = ({ apt, type, time, status }: { apt: string; type: string; time: string; status: 'pending' | 'reviewing' }) => (
  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
    <td className="px-6 py-4">
        <p className="text-slate-800 dark:text-white font-bold">{apt}</p>
        <p className="text-slate-400 mt-0.5">{type}</p>
    </td>
    <td className="px-6 py-4 text-slate-500 dark:text-slate-500 font-medium">
        {time}
    </td>
    <td className="px-6 py-4 text-right">
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
            {status === 'pending' ? 'Đang chờ' : 'Đang duyệt'}
        </span>
    </td>
  </tr>
);

const PaymentTooltip = ({ active, payload, total }: any) => {
  if (!active || !payload || !payload.length) return null;

  const item = payload[0]?.payload as { key: 'pending' | 'paid' | 'overdue'; name: string; value: number };
  const val = item?.value ?? 0;
  const denom = total || 1;
  const pct = Math.round((val / denom) * 100);

  const label =
    item.key === 'paid' ? 'Đã nộp' : item.key === 'pending' ? 'Chờ nộp' : 'Quá hạn';

  return (
    <div className="rounded-xl bg-slate-900/95 border border-slate-700 px-4 py-3 shadow-xl">
      <div className="text-sm font-extrabold text-white mb-2">
        Trạng thái: {item.name}
      </div>

      <div className="text-xs text-slate-200 space-y-1">
        <div>
          <span className="text-slate-400">Số lượng:</span>{' '}
          <span className="font-bold text-white">{val}</span>
        </div>

        <div>
          <span className="text-slate-400">{label}:</span>{' '}
          <span className="font-bold text-white">
            {val}/{denom}
          </span>
        </div>

        <div>
          <span className="text-slate-400">Tỷ lệ:</span>{' '}
          <span className="font-bold text-white">{pct}%</span>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
