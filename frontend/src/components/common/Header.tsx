/**
 * @file Header.tsx
 * @description Top navigation bar component displaying search, global controls, and active user authentication details.
 * 
 * PURPOSE:
 * Integrates `AuthContext` to display the authenticated developer's full name, role badge,
 * real-time API health status, and exposes a sign-out trigger.
 * 
 * ROLE IN FRONTEND:
 * Rendered at the top of the dashboard views within `DashboardLayout.tsx`.
 */

import React, { useState } from 'react';
import { Activity, Bell, Search, Terminal, User, LogOut, ChevronDown } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../../api/axiosClient';
import { ApiResponse, HealthCheckData } from '../../types/api.types';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Query backend health check endpoint to check API connection status
  const { data: healthResp, isError, isLoading } = useQuery<ApiResponse<HealthCheckData>>({
    queryKey: ['system-health'],
    queryFn: async () => {
      const res = await axiosClient.get<ApiResponse<HealthCheckData>>('/health');
      return res.data;
    },
    refetchInterval: 30000, // Poll every 30 seconds
  });

  const isHealthy = healthResp?.data?.status === 'UP';

  return (
    <header className="h-16 border-b border-dark-border/80 glass-panel sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Search Input */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects, tasks, sessions, or AI insights... (Press '/' to focus)"
            className="w-full bg-dark-bg/60 border border-dark-border/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
      </div>

      {/* Profile & Health telemetries */}
      <div className="flex items-center gap-4">
        {/* Realtime API status indicator */}
        <div className="flex items-center gap-2 text-xs border border-dark-border/80 rounded-full px-3 py-1 bg-dark-bg/40">
          <Activity className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
          <span className="text-gray-400 font-mono">Backend API:</span>
          {isLoading ? (
            <Badge variant="neutral" size="sm">Checking...</Badge>
          ) : isHealthy ? (
            <Badge variant="success" size="sm">ONLINE (DB Connected)</Badge>
          ) : (
            <Badge variant="error" size="sm">{isError ? 'OFFLINE' : 'DEGRADED'}</Badge>
          )}
        </div>

        {/* Notifications Icon */}
        <button className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 rounded-lg transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full"></span>
        </button>

        {/* User Identity context dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 pl-3 border-l border-dark-border/80 text-left hover:opacity-90 transition-opacity focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-gray-200">{user?.fullName || 'Developer Account'}</p>
              <p className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                <Terminal className="w-2.5 h-2.5 text-emerald-400" /> {user?.role || 'DEVELOPER'}
              </p>
            </div>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {/* User Signout dropdown panel */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2.5 w-48 rounded-xl border border-dark-border bg-dark-card shadow-2xl p-1 z-50">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
