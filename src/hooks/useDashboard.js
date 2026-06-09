import { useState, useEffect } from 'react';
import { studyService } from '../services/studyService';
import { roadmapService } from '../services/roadmapService';

export const useDashboard = (isAuthenticated, activeLevel, activeType) => {
  const [statsData, setStatsData] = useState(null);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [stations, setStations] = useState([]);
  const [isRoadmapLoading, setIsRoadmapLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchStats = async () => {
      try {
        const result = await studyService.getDashboard();
        setStatsData(result);
      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
      } finally {
        setIsStatsLoading(false);
      }
    };
    fetchStats();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchRoadmap = async () => {
      setIsRoadmapLoading(true);
      try {
        const data = await roadmapService.getRoadmapStations(activeLevel, activeType);
        setStations(data);
      } catch (error) {
        console.error("Lỗi tải roadmap:", error);
      } finally {
        setIsRoadmapLoading(false);
      }
    };
    fetchRoadmap();
  }, [activeLevel, activeType, isAuthenticated]);

  return { statsData, isStatsLoading, stations, isRoadmapLoading };
};