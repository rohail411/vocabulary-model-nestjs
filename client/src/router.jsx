import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import Vocabulary from './Vocabulary';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/vocabulary" element={<Vocabulary />} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default AppRouter;
