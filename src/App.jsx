import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';

// Import các Pages
import { HomePage } from './pages/HomePage';
// import { KanjiPage } from './pages/KanjiPage'; 
// import { VocabularyPage } from './pages/VocabularyPage';

function App() {
  return (
    <BrowserRouter>
      {/* Bọc toàn bộ Routes trong MainLayout. 
          Bất kỳ Route nào được match sẽ được truyền vào prop 'children' của MainLayout */}
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Các Route cho chức năng khác. Tạm thời map vào HomePage để demo */}
          <Route path="/kanji" element={<HomePage />} />
          <Route path="/vocabulary" element={<HomePage />} />
          <Route path="/grammar" element={<HomePage />} />
          <Route path="/statistics" element={<HomePage />} />

          {/* Route fallback (404 Not Found) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;