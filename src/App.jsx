import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";

import { HomePage } from "./pages/HomePage";
import { KanjiPage } from "./pages/KanjiPage";

import { VocabLevelsPage } from "./pages/vocabulary/VocabLevelsPage";
import { VocabLessonsPage } from "./pages/vocabulary/VocabLessonsPage";
import { VocabListPage } from "./pages/vocabulary/VocabListPage";

import { NotationTable } from "./components/grammar/NotationTable";
import { ConjugationPage } from "./pages/grammar/ConjugationPage";
import { GrammarLevelsPage } from './pages/grammar/GrammarLevelsPage';
import { GrammarLessonsPage } from './pages/grammar/GrammarLessonsPage';
import { GrammarListPage } from './pages/grammar/GrammarListPage';
import { AuthProvider } from "./context/AuthContext";

import { ExamLevelsPage } from './pages/exam/ExamLevelsPage';
import { ExamDetailPage } from './pages/exam/ExamDetailPage';
import { ExamListPage } from './pages/exam/ExamListPage';

import { ExamReviewPage } from "./pages/exam/ExamReviewPage";
import { ExamResultPage } from "./pages/exam/ExamResultPage";
import { ExamProvider } from './context/ExamContext';
import { ExamWorkspacePage } from './pages/exam/ExamWorkspacePage';
import { OAuth2RedirectHandler } from './pages/auth/OAuth2RedirectHandler';

import { ToastProvider } from "./context/ToastContext";

import { DashboardPage } from './pages/statistics/DashboardPage';
import { QuizPage } from './pages/statistics/QuizPage';

import { StationStudyPage } from './pages/roadmap/StationStudyPage';
import { LearnedItemsPage } from './pages/statistics/LearnedItemsPage';

import { PremiumPage } from './pages/premium/PremiumPage';
import { PaymentResultPage } from './pages/premium/PaymentResultPage';

import { FlashcardPage } from './pages/practice/FlashcardPage'; 
import { QuizPage as PracticeQuizPage } from './pages/practice/QuizPage';         
import { DokkaiPage } from './pages/practice/DokkaiPage';
import { GrammarDokkaiPage } from './pages/practice/GrammarDokkaiPage';

import { AdminLayout } from './admin/layouts/AdminLayout';


import { KanjiAdmin } from './admin/pages/KanjiAdmin';
import { VocabAdmin } from './admin/pages/VocabAdmin';
import { GrammarAdmin } from './admin/pages/GrammarAdmin';
import { LevelAdmin } from './admin/pages/LevelAdmin';
import { LessonAdmin } from './admin/pages/LessonAdmin';
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/kanji" element={<KanjiPage />} />

            <Route path="/vocabulary" element={<VocabLevelsPage />} />
            <Route path="/vocabulary/level/:levelId" element={<VocabLessonsPage />}/>
            <Route path="/vocabulary/topic/:topicId" element={<VocabListPage />}/>

            <Route path="/grammar" element={<GrammarLevelsPage />} />
            <Route path="/grammar/level/:levelId" element={<GrammarLessonsPage />} />
            <Route path="/grammar/lesson/:lessonId" element={<GrammarListPage />}/>
            <Route path="/grammar/conjugation" element={<ConjugationPage />} />

            <Route path="/exam" element={<ExamLevelsPage />} />
            <Route path="/exam/level/:levelId" element={<ExamListPage />} />
            <Route path="/exam/:examId/detail" element={<ExamDetailPage />} />
            <Route path="/exam/result/:attemptId" element={<ExamResultPage />} />

            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/collection" element={<LearnedItemsPage />} />

            <Route path="/premium" element={<PremiumPage />} />

            <Route path="/practice/flashcard" element={<FlashcardPage />} />
            <Route path="/practice/quiz" element={<PracticeQuizPage />} />
            <Route path="/practice/dokkai" element={<DokkaiPage />} />
            <Route path="/practice/grammar-dokkai" element={<GrammarDokkaiPage />} />
          </Route>

          <Route path="/exam/attempt/:attemptId/section/:sectionId" element={<ExamProvider><ExamWorkspacePage /></ExamProvider> } />
          <Route path="/exam/result/:attemptId/review" element={<ExamReviewPage />} />

          <Route path="/quiz" element={<QuizPage />} />

          <Route path="/roadmap/station/:stationId" element={<StationStudyPage />} />

          <Route path="/payment-result" element={<PaymentResultPage />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />


            <Route path="/admin" element={<AdminLayout />}>
              <Route path="kanji" element={<KanjiAdmin />} />
              <Route path="vocab" element={<VocabAdmin />} />
              <Route path="grammar" element={<GrammarAdmin />} />
              <Route path="levels" element={<LevelAdmin />} />
              <Route path="lessons" element={<LessonAdmin />} />
            </Route>

        </Routes>
      </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;