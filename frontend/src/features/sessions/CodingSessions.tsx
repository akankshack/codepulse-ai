/**
 * @file CodingSessions.tsx
 * @description Telemetry console displaying developer active keyboard sessions.
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import sessionsApi from '../../api/sessions.api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { Clock, Plus, TerminalSquare, GitCommit } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const CodingSessions: React.FC = () => {
  const queryClient = useQueryClient();
  const [projectName, setProjectName] = useState('codepulse-ai');
  const [branchName, setBranchName] = useState('main');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [commitsCount, setCommitsCount] = useState(1);
  const [showForm, setShowForm] = useState(false);

  // Fetch coding sessions list
  const { data: sessionsResp, isLoading } = useQuery({
    queryKey: ['coding-sessions'],
    queryFn: sessionsApi.getSessions,
  });

  const sessions = sessionsResp?.data || [];

  // Log session mutation
  const logMutation = useMutation({
    mutationFn: sessionsApi.logSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coding-sessions'] });
      setDurationMinutes(60);
      setCommitsCount(1);
      setShowForm(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const endTime = new Date();
    const startTime = new Date();
    startTime.setMinutes(endTime.getMinutes() - durationMinutes);

    logMutation.mutate({
      projectName,
      branchName,
      durationMinutes,
      commitsCount,
      editorName: 'VS Code',
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      languages: [
        { name: 'TypeScript', minutes: Math.round(durationMinutes * 0.8) },
        { name: 'CSS', minutes: Math.round(durationMinutes * 0.2) },
      ],
    });
  };

  // Language aggregation for charts
  const langMap: Record<string, number> = {};
  sessions.forEach((s) => {
    s.languages.forEach((l) => {
      langMap[l.name] = (langMap[l.name] || 0) + l.minutes;
    });
  });
  const chartData = Object.entries(langMap).map(([name, value]) => ({
    name,
    minutes: Math.round(value),
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Panel */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-500" /> Active Session Logs
          </h2>
          <p className="text-xs text-gray-400 mt-1">Tracks IDE keyboard telemetry, active language splits, and git branch commits.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-1" /> Log Session
        </Button>
      </div>

      {/* Manual log form */}
      {showForm && (
        <Card variant="glass" className="p-6 max-w-lg mx-auto">
          <CardHeader className="p-0 pb-4 border-b-0">
            <CardTitle>Log Manual Telemetry Session</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300">Project Workspace</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-300">Active Branch</label>
                  <input
                    type="text"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-300">Session Minutes</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
                    className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300">Commits Generated</label>
                <input
                  type="number"
                  value={commitsCount}
                  onChange={(e) => setCommitsCount(parseInt(e.target.value, 10))}
                  className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" isLoading={logMutation.isPending}>
                  Save Session Log
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Analytics Graph Block */}
      {sessions.length > 0 && (
        <Card variant="glass" className="p-6">
          <CardHeader className="p-0 pb-4 border-b-0">
            <CardTitle>Total Language Development Share</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={11} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', color: '#fff', borderRadius: '8px' }}
                  />
                  <Bar dataKey="minutes" name="Minutes Logged" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Telemetry sessions list */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner size="md" className="text-brand-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sessions.map((s) => (
            <Card key={s._id} variant="glass" className="hover:border-brand-500/20 transition-all p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-100">{s.projectName}</h4>
                  <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                    <TerminalSquare className="w-3.5 h-3.5 text-brand-400" /> branch: {s.branchName}
                  </p>
                </div>
                <Badge variant="info" size="sm">
                  {s.editorName}
                </Badge>
              </div>

              {/* Session detailed info */}
              <div className="flex items-center gap-6 border-y border-dark-border/40 py-3 font-mono text-xs">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-gray-500 uppercase block leading-none">Duration</span>
                  <span className="text-gray-200 font-semibold">{s.durationMinutes} minutes</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-gray-500 uppercase block leading-none">Git Commits</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <GitCommit className="w-3.5 h-3.5" /> {s.commitsCount}
                  </span>
                </div>
              </div>

              {/* Language chips display */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {s.languages.map((l) => (
                  <Badge key={l.name} variant="neutral" size="sm">
                    {l.name}: {l.minutes}m
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodingSessions;
