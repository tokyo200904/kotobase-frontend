import React, { useState, useEffect } from 'react';
import { Search, Loader2, Map, Edit, Trash2, PlusCircle, ArrowUpDown } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { CustomDropdown } from '../../components/common/CustomDropdown';
import { StationModal } from '../components/roadmap/StationModal';

const ITEM_TYPES = [
  { id: 'KANJI', name: 'Lộ trình Hán tự' },
  { id: 'VOCAB', name: 'Lộ trình Từ vựng' }
];

export const StationAdmin = () => {
  const [stations, setStations] = useState([]);
  const [levels, setLevels] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [filterLevel, setFilterLevel] = useState('');
  const [filterType, setFilterType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    const loadLevels = async () => {
      try { const res = await adminService.getCompactLevels(); setLevels(res.data || res || []); } 
      catch (err) { console.error(err); }
    }; loadLevels();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const loadStations = async () => {
      try {
        const response = await adminService.getStations('', filterLevel, filterType, 0, 100); 
        const sorted = (response.data || response.content || []).sort((a,b) => a.stationOrder - b.stationOrder);
        setStations(sorted);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    loadStations();
  }, [filterLevel, filterType, refreshKey]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`⚠️ Bạn có chắc muốn xóa Trạm [${title}] không?`)) {
      try { await adminService.deleteStation(id); setRefreshKey(k => k + 1); } 
      catch (err) { alert(`Lỗi: ${err.message}`); }
    }
  };

  
  const canDrag = filterLevel !== '' && filterType !== '';

  const handleDragStart = (idx) => { if (canDrag) setDraggedIndex(idx); };
  
  const handleDragEnter = (idx) => { if (canDrag && draggedIndex !== null) setDragOverIndex(idx); };

  const handleDragEnd = async () => {
    if (!canDrag || draggedIndex === null || dragOverIndex === null || draggedIndex === dragOverIndex) {
      setDraggedIndex(null); setDragOverIndex(null); return;
    }

    const newStations = [...stations];
    const draggedItem = newStations.splice(draggedIndex, 1)[0];
    newStations.splice(dragOverIndex, 0, draggedItem);
    
    setDraggedIndex(null); setDragOverIndex(null);
    setStations(newStations);

    const payloadItems = newStations.map((st, index) => ({
      id: st.id,
      newOrder: index + 1
    }));

    setIsReordering(true);
    try {
      await adminService.reorderStations(payloadItems);
    } catch (err) {
      alert("Lỗi khi lưu thứ tự: " + err.message);
      setRefreshKey(k => k + 1); 
    } finally {
      setIsReordering(false);
    }
  };


  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gradient-to-r from-indigo-900 to-indigo-800 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-sm border border-white/20"><Map size={32} strokeWidth={2.5}/></div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Gamification Roadmap</h1>
            <p className="text-sm font-bold text-indigo-200 mt-1">Xây dựng trạm học đường cho Kanji và Từ vựng</p>
          </div>
        </div>
        <button onClick={() => { setEditId(null); setIsModalOpen(true); }} className="relative z-10 flex items-center justify-center gap-2 rounded-2xl bg-white text-indigo-900 px-8 py-4 font-black shadow-lg hover:scale-105 active:scale-95 transition-all">
          <PlusCircle size={22}/> Tạo Trạm Học
        </button>
      </div>

      <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm">
        
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative z-30">
            <CustomDropdown value={filterLevel} options={levels} onChange={setFilterLevel} placeholder="Lọc theo Cấp độ JLPT" optionLabelKey="levelName" />
          </div>
          <div className="relative z-20">
            <CustomDropdown value={filterType} options={ITEM_TYPES} onChange={setFilterType} placeholder="Lọc theo Lộ trình Kỹ năng" />
          </div>
        </div>

        <div className={`mb-8 p-4 rounded-xl text-sm font-bold flex items-center justify-between transition-colors ${canDrag ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <ArrowUpDown size={18} className={isReordering ? 'animate-bounce' : ''}/>
            {isReordering ? 'Đang đồng bộ thứ tự xuống máy chủ...' : canDrag ? '✅ Đã kích hoạt chế độ Kéo & Thả. Giữ chuột vào một hàng để đổi vị trí.' : '⚠️ Vui lòng chọn cụ thể Cấp độ và Lộ trình ở trên để mở khóa tính năng Kéo Thả Trạm.'}
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          {isLoading ? (
             <div className="flex h-64 items-center justify-center"><Loader2 size={40} className="animate-spin text-indigo-600" /></div>
          ) : stations.length > 0 ? (
            <table className="w-full min-w-[1000px] text-left border-collapse select-none">
              <thead>
                <tr className="border-b-2 border-gray-100 text-gray-400">
                  <th className="pb-4 pl-4 font-black uppercase text-xs w-20 text-center">Thứ tự</th>
                  <th className="pb-4 font-black uppercase text-xs">Cấp độ & Loại</th>
                  <th className="pb-4 font-black uppercase text-xs">Thông tin Trạm</th>
                  <th className="pb-4 font-black uppercase text-xs text-center">Vật phẩm nạp</th>
                  <th className="pb-4 text-center font-black uppercase text-xs pr-4">Thao tác</th>
                </tr>
              </thead>
              <tbody className="relative">
                {stations.map((st, idx) => (
                  <tr 
                    key={st.id}
                    draggable={canDrag}
                    onDragStart={() => handleDragStart(idx)}
                    onDragEnter={() => handleDragEnter(idx)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()} 
                    className={`transition-all duration-200 border-b border-gray-50 bg-white
                      ${canDrag ? 'cursor-grab active:cursor-grabbing hover:bg-gray-50/80' : ''}
                      ${draggedIndex === idx ? 'opacity-30 scale-[0.98]' : 'opacity-100'}
                      ${dragOverIndex === idx && draggedIndex !== idx ? 'bg-indigo-50 border-t-2 border-indigo-500' : ''}
                    `}
                  >
                    <td className="py-4 pl-4 text-center">
                      <div className="h-10 w-10 mx-auto rounded-xl bg-gray-100 text-gray-600 font-black flex items-center justify-center">{st.stationOrder}</div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-black text-[10px] uppercase rounded-md">{st.levelName}</span>
                        <span className={`px-2.5 py-1 font-black text-[10px] uppercase rounded-md ${st.itemType === 'KANJI' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                          {st.itemType}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <h3 className="font-black text-gray-900 text-base">{st.title}</h3>
                      <p className="text-xs font-bold text-gray-400 mt-0.5 line-clamp-1 max-w-[300px]">{st.description}</p>
                    </td>
                    <td className="py-4 text-center">
                      <span className="px-3 py-1 bg-gray-900 text-white font-black text-xs rounded-lg shadow-sm">{st.targetItemIds?.length || 0} mục</span>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setEditId(st.id); setIsModalOpen(true); }} className="p-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm"><Edit size={16} strokeWidth={3}/></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(st.id, st.title); }} className="p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"><Trash2 size={16} strokeWidth={3}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400"><Map size={48} className="mb-4 opacity-50" /><p className="font-bold text-lg">Chưa có Trạm học nào.</p></div>
          )}
        </div>
      </div>

      <StationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} editId={editId} onSuccess={() => setRefreshKey(k=>k+1)} levels={levels} />
    </div>
  );
};