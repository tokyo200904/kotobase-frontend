import { useState, useCallback } from 'react';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Trình duyệt của bạn không hỗ trợ Web Speech API.');
      return;
    }


    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP'; 
    utterance.rate = 0.85;    
    utterance.pitch = 1.0;    

    // Quản lý trạng thái UI
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak, isSpeaking };
};