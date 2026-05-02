import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Shuffle } from 'lucide-react';
import { VERB_CONJUGATION, ADJ_CONJUGATION } from '../../constants/conjugation';

export const ConjugationPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('verbs');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-gray-100 pb-4 dark:border-gray-800">
        <button 
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <Shuffle className="text-primary" /> Bảng chia Động / Tính từ
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tài liệu tra cứu nhanh quy tắc biến đổi thể trong tiếng Nhật.
          </p>
        </div>
      </div>

      <div className="flex rounded-2xl bg-gray-100/80 p-1.5 shadow-inner dark:bg-gray-800/80 w-fit">
        <button
          onClick={() => setActiveTab('verbs')}
          className={`rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
            activeTab === 'verbs' 
              ? 'bg-white text-primary shadow-sm dark:bg-gray-900 dark:text-white scale-100' 
              : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white scale-95 hover:scale-100'
          }`}
        >
          Động từ (Verbs)
        </button>
        <button
          onClick={() => setActiveTab('adjectives')}
          className={`rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
            activeTab === 'adjectives' 
              ? 'bg-white text-primary shadow-sm dark:bg-gray-900 dark:text-white scale-100' 
              : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white scale-95 hover:scale-100'
          }`}
        >
          Tính từ / Danh từ
        </button>
      </div>

      <div className="animate-fade-in rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        
        {activeTab === 'verbs' && (
          <div className="space-y-8">
            {VERB_CONJUGATION.map((groupData, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="bg-primary/10 px-5 py-3 dark:bg-primary/20">
                  <h3 className="font-bold text-primary dark:text-primary-400">
                    {groupData.group}
                  </h3>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                      <tr>
                        <th className="px-6 py-4 font-bold">Thể Từ điển (Vる)</th>
                        <th className="px-6 py-4 font-bold">Thể Lịch sự (Vます)</th>
                        <th className="px-6 py-4 font-bold">Thể Te (Vて)</th>
                        <th className="px-6 py-4 font-bold">Thể Quá khứ (Vた)</th>
                        <th className="px-6 py-4 font-bold">Thể Phủ định (Vない)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {groupData.rules.map((rule, rIdx) => (
                        <tr key={rIdx} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{rule.ending}</td>
                          <td className="px-6 py-4 text-blue-600 dark:text-blue-400">{rule.masu}</td>
                          <td className="px-6 py-4 text-orange-600 dark:text-orange-400">{rule.te}</td>
                          <td className="px-6 py-4 text-green-600 dark:text-green-400">{rule.ta}</td>
                          <td className="px-6 py-4 text-red-600 dark:text-red-400">{rule.nai}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'adjectives' && (
          <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-bold">Loại từ</th>
                    <th className="px-6 py-4 font-bold">Khẳng định (Hiện tại)</th>
                    <th className="px-6 py-4 font-bold">Phủ định (Hiện tại)</th>
                    <th className="px-6 py-4 font-bold">Khẳng định (Quá khứ)</th>
                    <th className="px-6 py-4 font-bold">Phủ định (Quá khứ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {ADJ_CONJUGATION.map((adj, idx) => (
                    <tr key={idx} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{adj.type}</td>
                      <td className="px-6 py-4 text-blue-600 dark:text-blue-400">{adj.present}</td>
                      <td className="px-6 py-4 text-red-600 dark:text-red-400">{adj.presentNegative}</td>
                      <td className="px-6 py-4 text-orange-600 dark:text-orange-400">{adj.past}</td>
                      <td className="px-6 py-4 text-rose-600 dark:text-rose-400">{adj.pastNegative}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Lời khuyên (Note) */}
            <div className="m-4 flex items-start gap-3 rounded-xl bg-blue-50 p-4 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              <BookOpen size={20} className="mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-bold">Lưu ý đối với Tính từ đuôi いい (Tốt):</p>
                <p className="mt-1">
                  Tính từ <strong>いい</strong> (Tốt) là trường hợp đặc biệt. Khi chia sang phủ định hoặc quá khứ, nó biến thành <strong>よい (yoi)</strong>.<br/>
                  Ví dụ: よくありません (Không tốt), よかったです (Đã tốt).
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};