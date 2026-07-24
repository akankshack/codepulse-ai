/**
 * @file AppRoutes.tsx
 * @description Master routing table configuration for the CodePulse AI frontend app.
 * 
 * PURPOSE:
 * Defines navigation pathways, mapping user views. Wraps authenticated layout structures
 * inside the `ProtectedRoute` gate, and defines `/auth/login` and `/auth/register` routes.
 * 
 * ROLE IN FRONTEND:
 * Loaded inside `App.tsx`.
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { Login } from '../features/auth/Login';
import { Register } from '../features/auth/Register';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../api/axiosClient';
import { ApiResponse, HealthCheckData } from '../types/api.types';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  Server,
  Database,
  Layers,
  Cpu,
  ShieldCheck,
  Code2,
  Terminal,
  Activity,
  Sparkles,
  UserCheck
} from 'lucide-react';

/**
 * Module 2 Workspace overview screen.
 */
const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const { data: healthResp, isLoading, refetch } = useQuery<ApiResponse<HealthCheckData>>({
    queryKey: ['system-health-dashboard'],
    queryFn: async () => {
      const res = await axiosClient.get<ApiResponse<HealthCheckData>>('/health');
      return res.data;
    },
  });

  const health = healthResp?.data;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Dynamic welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-brand-900/40 via-dark-card to-accent-violet/10 border border-brand-500/20 glass-panel">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="success" size="sm">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Module 2 Authentication Active
            </Badge>
            <span className="text-xs font-mono text-gray-400">Session Securely established</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Welcome back, <span className="text-brand-400">{user?.fullName || 'Developer'}</span>!
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
            You are logged in as a <strong className="text-gray-200">{user?.role}</strong> (account ID: <code className="text-accent-cyan">{user?.id}</code>). The backend router has successfully validated your JWT credentials, authorizing secure data layer communications.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" size="sm" onClick={() => refetch()} isLoading={isLoading}>
            <Activity className="w-4 h-4 mr-1 text-brand-400" /> Ping Health API
          </Button>
        </div>
      </div>

      {/* Realtime API status indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Backend API Status */}
        <Card variant="glass" className="hover:border-brand-500/30 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Express Server</p>
              <h4 className="text-lg font-bold text-gray-100 mt-1 flex items-center gap-2">
                {isLoading ? 'Connecting...' : health?.status === 'UP' ? 'ONLINE (Port 5000)' : 'DEGRADED'}
              </h4>
              <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3 h-3" /> REST Router Ready
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <Server className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Database Connection */}
        <Card variant="glass" className="hover:border-accent-cyan/30 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">MongoDB Database</p>
              <h4 className="text-lg font-bold text-gray-100 mt-1">
                {isLoading ? 'Connecting...' : health?.database.status === 'CONNECTED' ? 'CONNECTED' : 'DISCONNECTED'}
              </h4>
              <p className="text-[10px] text-accent-cyan mt-1 flex items-center gap-1 font-mono">
                <Database className="w-3 h-3" /> Pool Size: 10
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan">
              <Database className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Session Security */}
        <Card variant="glass" className="hover:border-accent-violet/30 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Session Auth</p>
              <h4 className="text-lg font-bold text-gray-100 mt-1 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" /> SECURE
              </h4>
              <p className="text-[10px] text-accent-violet mt-1 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3 h-3" /> Role: {user?.role}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet">
              <Cpu className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* System Uptime */}
        <Card variant="glass" className="hover:border-accent-emerald/30 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Server Uptime</p>
              <h4 className="text-lg font-bold text-gray-100 mt-1 font-mono">
                {health ? `${health.uptime}s` : '0s'}
              </h4>
              <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                <Activity className="w-3 h-3" /> Memory: {health?.system.memoryUsageMB || 0} MB
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module 2 Architecture overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Token and Middleware architecture explanation */}
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-brand-400" /> Session Token Lifecycle (Access + Refresh)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-dark-bg/60 border border-dark-border/80 space-y-2">
                <h5 className="font-semibold text-brand-400 flex items-center gap-1.5 text-sm">
                  Access Token (Bearer Header)
                </h5>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Short-lived JWT (15-minute lifespan) containing user identity details. Retained in frontend memory. Automatically appended inside client Axios request headers for auth routing.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-dark-bg/60 border border-dark-border/80 space-y-2">
                <h5 className="font-semibold text-accent-cyan flex items-center gap-1.5 text-sm">
                  Refresh Token (HttpOnly Cookie)
                </h5>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Long-lived session token (7-day lifespan) stored as a secure browser cookie. Unreadable by JavaScript, shielding the platform from credential-harvesting XSS attacks.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-brand-950/30 border border-brand-500/20 font-mono text-[11px] text-brand-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Protected Identity Route: <code className="text-white">GET /api/v1/auth/me</code></span>
              </div>
              <Badge variant="success" size="sm">200 Authorized</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Roadmap tracker */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-violet" /> Module Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-dark-bg/60 border border-dark-border/80 flex items-center justify-between opacity-70">
              <div>
                <span className="text-xs font-semibold text-gray-300">Module 1: Setup</span>
                <p className="text-[10px] text-gray-400">Foundation & Clean Config</p>
              </div>
              <Badge variant="success" size="sm">DONE</Badge>
            </div>

            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-400">Module 2: Authentication</span>
                <p className="text-[10px] text-gray-400">JWT, bcrypt & Protected Routes</p>
              </div>
              <Badge variant="success" size="sm">DONE</Badge>
            </div>

            <div className="p-3 rounded-lg bg-dark-bg/60 border border-dark-border/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-300">Module 3: Dashboard</span>
                <p className="text-[10px] text-gray-400">Main Metrics & Summary</p>
              </div>
              <Badge variant="neutral" size="sm">READY</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Authenticated Dashboard Shell Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="tasks" element={<DashboardHome />} />
        <Route path="goals" element={<DashboardHome />} />
        <Route path="sessions" element={<DashboardHome />} />
        <Route path="github" element={<DashboardHome />} />
        <Route path="analytics" element={<DashboardHome />} />
        <Route path="ai-coach" element={<DashboardHome />} />
      </Route>

      {/* Auth Shell Layout (Unauthenticated) */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="/auth/login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
