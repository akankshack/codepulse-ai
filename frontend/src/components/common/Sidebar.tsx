/**
 * @file Sidebar.tsx
 * @description Primary left sidebar navigation component detailing CodePulse AI core modules (GitHub, Linear, WakaTime, AI Coach).
 * 
 * PURPOSE:
 * Provides accessible navigation routes mapped across all 10 project modules.
 * 
 * ROLE IN FRONTEND:
 * Embedded in `DashboardLayout.tsx`.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  Clock,
  GitBranch,
  BarChart3,
  Bot,
  Settings,
  Zap,
  Sparkles
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  module: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, module: 'Module 3' },
  { name: 'Tasks (Jira/Linear)', path: '/tasks', icon: CheckSquare, module: 'Module 4' },
  { name: 'Goals & Milestones', path: '/goals', icon: Target, module: 'Module 5' },
  { name: 'Coding Sessions', path: '/sessions', icon: Clock, module: 'Module 6' },
  { name: 'GitHub Intelligence', path: '/github', icon: GitBranch, module: 'Module 7' },
  { name: 'Engineering Analytics', path: '/analytics', icon: BarChart3, module: 'Module 8' },
  { name: 'AI Productivity Coach', path: '/ai-coach', icon: Bot, module: 'Module 9' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 border-r border-dark-border/80 glass-panel flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Brand Logo Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-dark-border/80">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-accent-cyan to-accent-violet flex items-center justify-center shadow-lg shadow-brand-600/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              CodePulse <span className="text-xs px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 font-mono">AI</span>
            </h1>
            <p className="text-[10px] text-gray-400 tracking-wide font-medium">Developer Intelligence</p>
          </div>
        </div>

        {/* Module Navigation List */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider font-mono">
            Platform Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group',
                    isActive
                      ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30 shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-transparent'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{item.name}</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-dark-bg/60 text-gray-500 border border-dark-border">
                  {item.module}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Banner & Settings */}
      <div className="p-4 border-t border-dark-border/80 space-y-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-brand-900/40 via-dark-card to-accent-violet/10 border border-brand-500/20">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-300 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-accent-cyan" /> Enterprise Ready
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Module 1 Project Setup active. All systems configured for Clean Architecture.
          </p>
        </div>

        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-colors">
          <Settings className="w-4 h-4" />
          <span>System Settings</span>
        </button>
      </div>
    </aside>
  );
};
