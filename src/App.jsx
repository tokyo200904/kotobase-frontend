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

import { OAuth2RedirectHandler } from './pages/auth/OAuth2RedirectHandler';
function App() {
  return (
  <AuthProvider>
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/kanji" element={<KanjiPage />} />

          <Route path="/vocabulary" element={<VocabLevelsPage />} />
          <Route path="/vocabulary/level/:levelId"element={<VocabLessonsPage />}/>
          <Route path="/vocabulary/topic/:topicId"element={<VocabListPage />}/>

          <Route path="/grammar" element={<GrammarLevelsPage />} />
          <Route path="/grammar/level/:levelId" element={<GrammarLessonsPage />} />
          <Route path="/grammar/lesson/:lessonId"element={<GrammarListPage />}/>
          <Route path="/grammar/conjugation" element={<ConjugationPage />} />

          <Route path="/statistics" element={<HomePage />} />

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </MainLayout>
    </BrowserRouter>
  </AuthProvider>
  );
}

export default App;
