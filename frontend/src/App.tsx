/**
 * @file App.tsx
 * @description Master App container mounting AuthProvider, BrowserRouter, and AppRoutes.
 * 
 * PURPOSE:
 * Wraps global context providers (authentication) around client-side router routing paths.
 * 
 * ROLE IN FRONTEND:
 * Loaded directly inside React DOM render tree in `main.tsx`.
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
