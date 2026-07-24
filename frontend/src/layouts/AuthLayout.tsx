/**
 * @file AuthLayout.tsx
 * @description Layout container for authentication routes (Login, Register, Password Reset).
 * 
 * PURPOSE:
 * Provides a clean glassmorphism card layout for unauthenticated flows (used in Module 2).
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Zap } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Radial Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-violet/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-accent-cyan to-accent-violet flex items-center justify-center shadow-lg shadow-brand-600/30">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          CodePulse <span className="text-brand-500 font-mono">AI</span>
        </h1>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-2xl border border-dark-border relative z-10">
        <Outlet />
      </div>
    </div>
  );
};
