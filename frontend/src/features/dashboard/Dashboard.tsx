/**
 * @file Dashboard.tsx
 * @description Master Platform Dashboard displaying real-time developer productivity widgets, habit analytics, and AI coaching summaries.
 * 
 * PURPOSE:
 * Serves as the primary viewport for authenticated developers, consolidating metrics, goal progress, and timelines.
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import aiApi from '../../api/ai.api';
import sessionsApi from '../../api/sessions.api';
import goalsApi from '../../api/goals.api';
import activitiesApi from '../../api/activities.api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import {
  Zap,
  Flame,
  AlertTriangle,
  Clock,
  Target,
  Sparkles,
  GitCommit,
  TrendingUp,
  Activity,
  Award
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  // Query telemetry metrics
  const { data: telemetryResp, isLoading: telemetryLoading } = useQuery({
    queryKey: ['ai-telemetry'],
    queryFn: aiApi.getTelemetry,
  });

  // Query coding sessions
  const { data: sessionsResp, isLoading: sessionsLoading } = useQuery({
    queryKey: ['coding-sessions'],
    queryFn: sessionsApi.getSessions,
  });

  // Query goals list
  const { data: goalsResp, isLoading: goalsLoading } = useQuery({
    queryKey: ['goals-milestones'],
    queryFn: goalsApi.getGoals,
  });

  // Query timeline activities
  const { data: activityResp, isLoading: activityLoading } = useQuery({
    queryKey: ['activity-timeline'],
    queryFn: activitiesApi.getTimeline,
  });

  const isLoading = telemetryLoading || sessionsLoading || goalsLoading || activityLoading;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Spinner size="lg" className="text-brand-500" />
        <span className="text-xs font-mono text-gray-400">Aggregating platform intelligence...</span>
      </div>
    );
  }

  const telemetry = telemetryResp?.data;
  const sessions = sessionsResp?.data || [];
  const goals = goalsResp?.data || [];
  const activities = activityResp?.data || [];

  // Streak Calculation (mocking daily coding streak based on sessions list length)
  const streakCount = sessions.length > 0 ? 5 : 0;

  // Chart data: coding duration trend
  const trendData = [...sessions]
    .reverse()
    .slice(-7)
    .map((s) => ({
      day: new Date(s.startTime).toLocaleDateString('en-US', { weekday: 'short' }),
      minutes: s.durationMinutes,
      commits: s.commitsCount,
    }));

  // Chart data: languages breakdown aggregation
  const langMap: Record<string, number> = {};
  sessions.forEach((s) => {
    s.languages.forEach((l) => {
      langMap[l.name] = (langMap[l.name] || 0) + l.minutes;
    });
  });
  const languageChartData = Object.entries(langMap).map(([name, value]) => ({
    name,
    minutes: Math.round(value),
  }));

  const burnoutRisk = telemetry?.burnout;
  const sprintLoading = telemetry?.sprint;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Metrics overview widgets row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Productivity Score widget */}
        <Card variant="glass" className="relative overflow-hidden group hover:border-brand-500/30 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-xl pointer-events-none transition-transform group-hover:scale-125"></div>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">AI Productivity Score</p>
              <h3 className="text-3xl font-extrabold text-white tracking-tight">{telemetry?.productivity.score || 72}</h3>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono mt-1">
                <TrendingUp className="w-3 h-3" /> +{telemetry?.productivity.percentage || 8}% WoW
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        {/* Streak tracker widget */}
        <Card variant="glass" className="relative overflow-hidden group hover:border-amber-500/30 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none transition-transform group-hover:scale-125"></div>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Coding Streak</p>
              <h3 className="text-3xl font-extrabold text-white tracking-tight">{streakCount} Days</h3>
              <div className="flex items-center gap-1 text-[10px] text-amber-400 font-mono mt-1">
                <Flame className="w-3 h-3" /> Keep compiling!
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Burnout risk alert widget */}
        <Card variant="glass" className="relative overflow-hidden group hover:border-rose-500/30 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none transition-transform group-hover:scale-125"></div>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Burnout Risk</p>
              <h3 className="text-3xl font-extrabold text-white tracking-tight">{burnoutRisk?.riskLevel || 'LOW'}</h3>
              <div className="flex items-center gap-1 text-[10px] text-rose-400 font-mono mt-1">
                <AlertTriangle className="w-3 h-3" /> Score: {burnoutRisk?.burnoutScore}%
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Sprint load widget */}
        <Card variant="glass" className="relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none transition-transform group-hover:scale-125"></div>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Sprint Point Target</p>
              <h3 className="text-3xl font-extrabold text-white tracking-tight">{sprintLoading?.suggestedPointsLimit || 8} pts</h3>
              <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono mt-1">
                <Clock className="w-3 h-3" /> Focus: {sprintLoading?.focusArea.substring(0, 15)}...
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Target className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts & telemetry Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coding habits Chart */}
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-400" /> Coding Habits & Commits Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#4b5563" fontSize={11} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', color: '#fff', borderRadius: '8px' }}
                    labelStyle={{ color: '#9ca3af', fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="minutes" name="Coding Minutes" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorMinutes)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Languages distribution Chart */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-cyan" /> Tech Stack Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {languageChartData.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-xs text-gray-500">No session telemetry recorded</div>
            ) : (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={languageChartData}>
                    <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} />
                    <YAxis stroke="#4b5563" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', color: '#fff', borderRadius: '8px' }}
                    />
                    <Bar dataKey="minutes" name="Minutes" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {languageChartData.slice(0, 3).map((l) => (
                <Badge key={l.name} variant="neutral" size="sm">
                  {l.name}: {Math.round(l.minutes / 60)} hrs
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Burnout Risks, Goals and Activities Timelines row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Burnout Risk Details & Coach insights */}
        <Card variant="glass" className="border-rose-500/10">
          <CardHeader className="border-rose-500/10">
            <CardTitle className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> AI Burnout Diagnostics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Diagnostics Findings</span>
              {burnoutRisk?.findings.map((f, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-dark-bg/60 border border-dark-border/80 text-[11px] text-gray-300 leading-normal">
                  • {f}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Recommended Habits</span>
              {burnoutRisk?.recommendations.map((r, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/20 text-[11px] text-rose-300 leading-normal">
                  💡 {r}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Goals Progress list */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Active Milestones & Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {goals.length === 0 ? (
              <div className="text-center text-xs text-gray-500 py-12">No active milestones declared</div>
            ) : (
              goals.map((g) => {
                const percent = Math.min(100, Math.round((g.currentMinutes / g.targetMinutes) * 100));
                return (
                  <div key={g._id} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-gray-200">{g.title}</span>
                      <span className="font-mono text-amber-400">{percent}%</span>
                    </div>
                    {/* Goal Progress bar */}
                    <div className="w-full bg-dark-border rounded-full h-1.5 overflow-hidden">
                      <div className="bg-amber-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                      <span>{g.currentMinutes} / {g.targetMinutes} minutes logged</span>
                      <span>Target: {new Date(g.targetDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Activity Timeline List */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-cyan-400" /> Developer Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {activities.length === 0 ? (
              <div className="text-center text-xs text-gray-500 py-12">No timelines logged</div>
            ) : (
              <div className="relative border-l border-dark-border pl-4 space-y-4 font-mono text-[10.5px]">
                {activities.slice(0, 4).map((a) => (
                  <div key={a._id} className="relative">
                    <span className="absolute -left-[21px] mt-1.5 w-2 h-2 rounded-full bg-cyan-500 border border-dark-bg"></span>
                    <p className="text-gray-300 leading-normal">{a.description}</p>
                    <span className="text-[9px] text-gray-500 block mt-0.5">
                      {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {a.projectName || 'global'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
