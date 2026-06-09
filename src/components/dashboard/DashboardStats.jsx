import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Clock, Target, Layers, Loader2, PlayCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { COLORS } from '../../constants/roadmapConfig';

export const DashboardStats = ({ statsData, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading || !statsData) {
    return <div className="flex h-48 items-center justify-center bg-white rounded-[2rem] border"><Loader2 className="animate-spin text-primary" size={24} /></div>;
  }

  const pieData = [
    { name: 'Mới', value: statsData.statusDistribution?.NEW || 0, color: COLORS.NEW },
    { name: 'Đang học', value: statsData.statusDistribution?.LEARNING || 0, color: COLORS.LEARNING },
    { name: 'Đã thuộc', value: statsData.statusDistribution?.MASTERED || 0, color: COLORS.MASTERED }
  ].filter(d => d.value > 0);

  const totalVocab = pieData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col items-center">
        <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">Kho Từ Vựng Thu Thập</h3>
        <div className="relative h-32 w-full mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={58} paddingAngle={4} dataKey="value" stroke="none">
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xl font-black text-gray-900 dark:text-white">{totalVocab}</span>
          </div>
        </div>
        <button onClick={() => navigate('/collection')} className="mt-5 w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 py-3 text-xs font-black uppercase tracking-widest text-gray-500 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all active:scale-95">
          Mở Kho Tàng Chi Tiết
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: Flame, label: 'Streak', value: `${statsData.currentStreak} ngày`, color: 'text-orange-500 bg-orange-50' },
          { icon: Target, label: 'Chính xác', value: `${statsData.accuracyPercentage}%`, color: 'text-green-500 bg-green-50' },
          { icon: Clock, label: 'Thời gian', value: `${statsData.minutesSpentToday} p`, color: 'text-blue-500 bg-blue-50' },
          { icon: Layers, label: 'Hôm nay', value: `${statsData.totalReviewedToday} mục`, color: 'text-purple-500 bg-purple-50' },
        ].map((stat, idx) => (
          <div key={idx} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm flex items-center gap-3 dark:border-gray-800 dark:bg-gray-900">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase text-gray-400">{stat.label}</span>
              <span className="text-base font-black text-gray-900 dark:text-white">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <span className="block text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Nhiệm Vụ Đến Hạn</span>
        
        <div className="group flex items-center justify-between rounded-2xl bg-gradient-to-br from-gray-900 to-black p-5 shadow-md border border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-xl font-black text-orange-500">🈴</div>
            <div>
              <h4 className="text-sm font-black text-white">Ôn Tập Kanji</h4>
              <p className="text-[11px] font-bold text-gray-400 mt-0.5"><b className="text-orange-400">{statsData.kanjiDueToday}</b> chữ cần ôn</p>
            </div>
          </div>
          <button onClick={() => navigate(`/quiz?type=KANJI&total=${statsData.kanjiDueToday}`)} disabled={statsData.kanjiDueToday === 0} className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-[0_3px_0_#c2410c] hover:brightness-110 disabled:opacity-30">
            <PlayCircle size={18} />
          </button>
        </div>

        <div className="group flex items-center justify-between rounded-2xl bg-gradient-to-br from-gray-900 to-black p-5 shadow-md border border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl font-black text-blue-500">📚</div>
            <div>
              <h4 className="text-sm font-black text-white">Ôn Tập Từ Vựng</h4>
              <p className="text-[11px] font-bold text-gray-400 mt-0.5"><b className="text-blue-400">{statsData.vocabDueToday}</b> từ cần ôn</p>
            </div>
          </div>
          <button onClick={() => navigate(`/quiz?type=VOCAB&total=${statsData.vocabDueToday}`)} disabled={statsData.vocabDueToday === 0} className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white shadow-[0_3px_0_#1d4ed8] hover:brightness-110 disabled:opacity-30">
            <PlayCircle size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};