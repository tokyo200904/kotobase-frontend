import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useExam } from '../context/ExamContext';

export const useExamWebSocket = (onCommandReceived) => {
  const { attemptId, setWsStatus, wsStatus, updateSavedAnswer } = useExam();
  const stompClientRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const connectWebSocket = () => {
    if (!attemptId) return;

    if (stompClientRef.current && stompClientRef.current.connected) return;

    setWsStatus(prev => prev === 'DISCONNECTED' ? 'CONNECTING' : 'RECONNECTING');

    const socket = new SockJS('http://localhost:8080/ws-exam');
    const client = Stomp.over(socket);
    
    client.debug = null;

    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    client.connect(headers, 
      (frame) => {
        setWsStatus('CONNECTED');
        stompClientRef.current = client;

        client.subscribe(`/topic/exam/${attemptId}`, (message) => {
          if (message.body) {
            const payload = JSON.parse(message.body);
            onCommandReceived(payload);
          }
        });
      }, 
      (error) => {
        console.error("WebSocket Error, chuẩn bị luồng kết nối lại tự động:", error);
        setWsStatus('RECONNECTING');
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 4000);
      }
    );
  };

  const sendAutosave = (questionId, selectedAnswerId) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      updateSavedAnswer(questionId, selectedAnswerId);

      stompClientRef.current.send(
        '/app/exam/autosave',
        {},
        JSON.stringify({
          attemptId,
          questionId,
          selectedAnswerId
        })
      );
    } else {
      console.warn("WebSocket ngắt kết nối! Chặn gửi đáp án ngầm.");
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [attemptId]);

  return { sendAutosave };
};