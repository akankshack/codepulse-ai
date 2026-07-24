/**
 * @file DashboardLayout.tsx
 * @description Primary application shell layout rendering Sidebar, Header, and nested child route content via React Router `<Outlet />`.
 * 
 * PURPOSE:
 * Establishes a unified layout for authenticated views across CodePulse AI.
 * 
 * ROLE IN FRONTEND:
 * Configured in `AppRoutes.tsx` as the parent wrapper for main application views.
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Header } from '../components/common/Header';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-dark-bg text-gray-100 selection:bg-brand-600 selection:text-white">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
