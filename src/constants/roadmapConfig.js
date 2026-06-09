export const COLORS = { NEW: '#3b82f6', LEARNING: '#f59e0b', MASTERED: '#10b981' };

// ĐÃ SỬA KEY LẠI THÀNH: 1=N5, 2=N4, 3=N3, 4=N2, 5=N1 
export const LEVEL_CONFIGS = {
  1: { name: 'Sơ Cấp N5', badge: 'N5', bg: 'bg-emerald-500', from: 'from-emerald-400 to-green-600', text: 'text-emerald-500', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/10', track: 'border-emerald-200 dark:border-emerald-950/40', btnShadow: 'shadow-[0_8px_0_#059669]', activeBtnShadow: 'active:shadow-[0_0px_0_#059669]' },
  2: { name: 'Sơ Trung N4', badge: 'N4', bg: 'bg-blue-500', from: 'from-blue-400 to-blue-600', text: 'text-blue-500', border: 'border-blue-500/20', glow: 'shadow-blue-500/10', track: 'border-blue-200 dark:border-blue-950/40', btnShadow: 'shadow-[0_8px_0_#2563eb]', activeBtnShadow: 'active:shadow-[0_0px_0_#2563eb]' },
  3: { name: 'Trung Cấp N3', badge: 'N3', bg: 'bg-orange-500', from: 'from-orange-400 to-amber-600', text: 'text-orange-500', border: 'border-orange-500/20', glow: 'shadow-orange-500/10', track: 'border-orange-200 dark:border-orange-950/40', btnShadow: 'shadow-[0_8px_0_#ea580c]', activeBtnShadow: 'active:shadow-[0_0px_0_#ea580c]' },
  4: { name: 'Cao Trung N2', badge: 'N2', bg: 'bg-pink-500', from: 'from-pink-400 to-rose-600', text: 'text-pink-500', border: 'border-pink-500/20', glow: 'shadow-pink-500/10', track: 'border-pink-200 dark:border-pink-950/40', btnShadow: 'shadow-[0_8px_0_#db2777]', activeBtnShadow: 'active:shadow-[0_0px_0_#db2777]' },
  5: { name: 'Thượng Cấp N1', badge: 'N1', bg: 'bg-purple-500', from: 'from-purple-400 to-violet-600', text: 'text-purple-500', border: 'border-purple-500/20', glow: 'shadow-purple-500/10', track: 'border-purple-200 dark:border-purple-950/40', btnShadow: 'shadow-[0_8px_0_#7c3aed]', activeBtnShadow: 'active:shadow-[0_0px_0_#7c3aed]' }
};

export const getZigZagTransform = (index) => {
  const offsets = [0, -60, -95, -60, 0, 60, 95, 60]; 
  return `translateX(${offsets[index % 8]}px)`;
};