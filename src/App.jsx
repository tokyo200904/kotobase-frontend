import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';

import { HomePage } from './pages/HomePage';
import { KanjiPage } from './pages/KanjiPage'; 
import { VocabPage } from './pages/VocabPage';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          <Route path="/kanji" element={<KanjiPage />} />
          <Route path="/vocabulary" element={<VocabPage />} />
          <Route path="/grammar" element={<HomePage />} />
          <Route path="/statistics" element={<HomePage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;