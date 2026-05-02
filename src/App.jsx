import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";

import { HomePage } from "./pages/HomePage";
import { KanjiPage } from "./pages/KanjiPage";

import { VocabLevelsPage } from "./pages/vocabulary/VocabLevelsPage";
import { VocabLessonsPage } from "./pages/vocabulary/VocabLessonsPage";
import { VocabListPage } from "./pages/vocabulary/VocabListPage";

import { NotationTable } from './components/grammar/NotationTable';
import { GrammarListPage } from './pages/grammar/GrammarListPage';
import { ConjugationPage } from './pages/grammar/ConjugationPage';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/kanji" element={<KanjiPage />} />

          <Route path="/vocabulary" element={<VocabLevelsPage />} />
          <Route
            path="/vocabulary/level/:levelId"
            element={<VocabLessonsPage />}
          />
          <Route
            path="/vocabulary/topic/:topicId"
            element={<VocabListPage />}
          />

<Route 
            path="/grammar" 
            element={
              <div className="space-y-6">
                <NotationTable />
                {/* Tái sử dụng VocabLevelsPage nhưng truyền param để gọi API Ngữ pháp */}
                {/* Bạn có thể tự custom prop cho VocabLevelsPage để tái sử dụng nhé */}
                <VocabLevelsPage moduleType="grammar" /> 
              </div>
            } 
          />
          
          {/* Trang bài học Ngữ pháp */}
          <Route path="/grammar/level/:levelId" element={<VocabLessonsPage moduleType="grammar" />} />
          
          {/* Trang chi tiết Ngữ pháp Master-Detail Layout */}
          <Route path="/grammar/lesson/:lessonId" element={<GrammarListPage />} />
          
          {/* TRANG TÀI LIỆU TRA CỨU: Bảng chia Động/Tính từ */}
          <Route path="/grammar/conjugation" element={<ConjugationPage />} />

          <Route path="/statistics" element={<HomePage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
