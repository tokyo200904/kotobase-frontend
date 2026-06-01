import React from 'react';
import { useExam } from '../../context/ExamContext';

export const QuestionList = ({ sendAutosave }) => {
  const { sectionData, savedAnswers, wsStatus, isOverlayLoading } = useExam();

  if (!sectionData || !sectionData.questionGroups) return null;

  const isUIBlocked = isOverlayLoading || wsStatus === 'RECONNECTING' || wsStatus === 'CONNECTING';

  return (
    <div className="space-y-10 pr-2">
      {sectionData.questionGroups.map((group) => (
        <div 
          key={group.id} 
          id={`group-${group.id}`}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="mb-4 bg-gray-50 p-4 rounded-xl text-sm font-semibold text-gray-800 dark:bg-gray-800/50 dark:text-gray-200">
            {group.content}
          </div>

          {group.audioUrl && (
            <div className="mb-4 max-w-md">
              <audio src={group.audioUrl} controls className="w-full" controlsList="nodownload" />
            </div>
          )}
          
          {group.imageUrl && (
            <div className="mb-6 max-w-xl overflow-hidden rounded-xl border border-gray-100">
              <img src={group.imageUrl} alt="Exam Resource" className="h-auto w-full object-contain" />
            </div>
          )}

          <div className="space-y-6 divide-y divide-gray-50 dark:divide-gray-800">
            {group.questions?.map((question, qIdx) => (
              <div key={question.id} id={`q-${question.id}`} className={`pt-6 ${qIdx === 0 ? 'pt-0 border-none' : ''}`}>
                <p className="font-bold text-gray-900 dark:text-white">
                  Câu {question.displayOrder}: {question.content}
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {question.answers?.map((answer) => {
                    const isChecked = savedAnswers[question.id] === answer.id;
                    
                    return (
                      <label
                        key={answer.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-sm font-medium transition-all ${
                          isChecked
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-100 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-300 dark:hover:bg-gray-800'
                        } ${isUIBlocked ? 'pointer-events-none opacity-60' : ''}`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          checked={isChecked}
                          disabled={isUIBlocked}
                          onChange={() => sendAutosave(question.id, answer.id)}
                          className="h-4 w-4 accent-primary"
                        />
                        <span>{answer.content}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};