/**
 * @file main.tsx
 * @description React 18 DOM entry point configuring TanStack React Query QueryClientProvider and importing global styles.
 * 
 * PURPOSE:
 * Mounts the root React component tree into `index.html`'s `<div id="root"></div>`.
 * Initializes the global `QueryClient` for server state caching and optimistic updates.
 * 
 * ROLE IN FRONTEND:
 * Initial bundle entry point loaded by Vite.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

// Initialize global TanStack React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes stale time
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
