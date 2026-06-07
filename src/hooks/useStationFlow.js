import { useState, useEffect } from 'react';
import { roadmapService } from '../services/roadmapService';
import { useToast } from '../context/ToastContext';

export const useStationFlow = (stationId) => {
  const { addToast } = useToast();
  
  const [phase, setPhase] = useState('LOADING');
  
  // Dữ liệu
  const [stationData, setStationData] = useState(null); 
  const [testResult, setTestResult] = useState(null);   
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await roadmapService.getStationItems(stationId);
        setStationData(data);
        setPhase('STUDY');
      } catch (err) {
        setError(err.message);
        setPhase('ERROR');
      }
    };
    if (stationId) fetchItems();
  }, [stationId]);

  const handleSubmitTest = async (timeSpent, answers) => {
    setPhase('LOADING');
    try {
      const result = await roadmapService.submitStationTest(stationId, {
        timeSpentSeconds: timeSpent,
        answers: answers
      });
      
      setTestResult(result);
      setPhase('RESULT');
      
      if (result.isPassed) {
        await roadmapService.completeStation(stationId);
        addToast('Tuyệt vời! Đã mở khóa trạm tiếp theo.', 'success');
      }
    } catch (err) {
      addToast('Lỗi nộp bài, vui lòng thử lại.', 'error');
      setPhase('TEST'); 
    }
  };

  return {
    phase, 
    setPhase, 
    stationData,
    testResult,
    error,
    handleSubmitTest
  };
};