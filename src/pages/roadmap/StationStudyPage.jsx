import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';

import { useStationFlow } from '../../hooks/useStationFlow';

import { StudyPhase } from '../../components/roadmap/StudyPhase';
import { TestPhase } from '../../components/roadmap/TestPhase'; 
import { ResultPhase } from '../../components/roadmap/ResultPhase';

/**
 * @page 
 * @description 
 */
export const StationStudyPage = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();
  
  const { 
    phase, setPhase, 
    stationData, testResult, error, 
    handleSubmitTest 
  } = useStationFlow(stationId);

  if (phase === 'LOADING') {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#f8fafc] dark:bg-gray-950">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (phase === 'ERROR') {
    return (
      <div className="flex h-screen flex-col items-center justify-center px-4 text-center bg-gray-50 dark:bg-gray-950">
        <AlertCircle size={48} className="mb-4 text-red-500" />
        <h2 className="text-xl font-black text-gray-900 dark:text-white">Có lỗi xảy ra</h2>
        <p className="mt-2 text-gray-500">{error}</p>
        <button onClick={() => navigate('/dashboard')} className="mt-6 rounded-xl bg-primary px-6 py-3 font-bold text-white">
          Quay lại Lộ trình
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8fafc] dark:bg-gray-950 overflow-hidden">
      
      <header className="relative z-50 flex h-16 items-center justify-between bg-white px-6 shadow-sm dark:bg-gray-900 dark:border-b dark:border-gray-800">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
        
        {phase !== 'RESULT' && (
          <div className="flex-1 px-8 max-w-md hidden sm:block">
            <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-700 ease-out rounded-full" 
                style={{ width: phase === 'STUDY' ? '33%' : phase === 'TEST' ? '66%' : '100%' }}
              ></div>
            </div>
          </div>
        )}
        <div className="w-8"></div> 
      </header>

      <main className="flex-1 overflow-y-auto">
        
        {phase === 'STUDY' && (
          <StudyPhase 
            stationData={stationData} 
            onComplete={() => setPhase('TEST')} 
          />
        )}

        {phase === 'TEST' && (
          <TestPhase 
            stationData={stationData} 
            onSubmitTest={handleSubmitTest} 
          />
        )}

        {phase === 'RESULT' && (
          <ResultPhase 
            testResult={testResult}
            onRetry={() => setPhase('STUDY')}
            onBackToMap={() => navigate('/dashboard')}
          />
        )}

      </main>
    </div>
  );
};