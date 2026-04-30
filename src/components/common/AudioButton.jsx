import React from 'react';
import { Volume2 } from 'lucide-react';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';

/**
 * 
 * @param {string} text 
 * @param {string} size 
 */
export const AudioButton = ({ text, size = 20, className = '' }) => {
  const { speak, isSpeaking } = useTextToSpeech();

  if (!text) return null;

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); 
        speak(text);
      }}
      className={`rounded-full p-1.5 transition-colors focus:outline-none ${
        isSpeaking
          ? 'bg-primary/20 text-primary animate-pulse' 
          : 'text-gray-400 hover:bg-gray-100 hover:text-primary dark:text-gray-500 dark:hover:bg-gray-800'
      } ${className}`}
      title="Nghe phát âm"
    >
      <Volume2 size={size} />
    </button>
  );
};