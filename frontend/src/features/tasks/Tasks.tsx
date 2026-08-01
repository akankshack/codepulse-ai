/**
 * @file Tasks.tsx
 * @description Task and Sprint board console page.
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import tasksApi, { TaskData } from '../../api/tasks.api';
import projectsApi from '../../api/projects.api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { CheckSquare, Plus, Brain, ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-react';

export const Tasks: React.FC = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
  const [points, setPoints] = useState(1);
  const [sprint, setSprint] = useState('Sprint 1');
  const [showForm, setShowForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch my tasks list
  const { data: tasksResp, isLoading: tasksLoading } = useQuery({
    queryKey: ['my-tasks'],
    queryFn: tasksApi.getMyTasks,
  });

  // Fetch projects list (to associate task)
  const { data: projectsResp, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getProjects,
  });

  const tasks = tasksResp?.data || [];
  const projects = projectsResp?.data || [];

  // Create task mutation
  const createMutation = useMutation({
    mutationFn: tasksApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
      setTitle('');
      setDescription('');
      setProjectId('');
      setPriority('MEDIUM');
      setPoints(1);
      setShowForm(false);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Failed to create task');
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskData['status'] }) =>
      tasksApi.updateTask(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!title || !projectId) {
      setErrorMsg('Task title and target project workspace are required');
      return;
    }
    createMutation.mutate({ title, projectId, description, priority, points, sprint });
  };

  const handleStatusChange = (id: string, currentStatus: TaskData['status']) => {
    const statusMap: Record<TaskData['status'], TaskData['status']> = {
      TODO: 'IN_PROGRESS',
      IN_PROGRESS: 'REVIEW',
      REVIEW: 'DONE',
      DONE: 'TODO',
    };
    updateStatusMutation.mutate({ id, status: statusMap[currentStatus] });
  };

  const getPriorityBadgeColor = (p: string) => {
    switch (p) {
      case 'CRITICAL': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      default: return 'neutral';
    }
  };

  const getComplexityColor = (c: string) => {
    switch (c) {
      case 'HIGH': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'MEDIUM': return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
      default: return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    }
  };

  const isLoading = tasksLoading || projectsLoading;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-brand-500" /> Sprint Issues & Backlog
          </h2>
          <p className="text-xs text-gray-400 mt-1">Manage deliverables and view real-time AI prioritization weighting.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-1" /> New Task
        </Button>
      </div>

      {/* Creation form dialog toggle */}
      {showForm && (
        <Card variant="glass" className="p-6 max-w-lg mx-auto">
          <CardHeader className="p-0 pb-4 border-b-0">
            <CardTitle>Create Sprint Task</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && <p className="text-xs text-rose-400 font-mono">{errorMsg}</p>}

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300">Associated Project</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-brand-500 transition-colors"
                >
                  <option value="">Select Target Repository</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300">Task Title</label>
                <input
                  type="text"
                  placeholder="feat: add OAuth login provider"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300">Description</label>
                <textarea
                  placeholder="Task scope details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors h-16 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-300">Priority</label>
                  <select
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-brand-500 transition-colors"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-300">Story Points</label>
                  <select
                    value={points}
                    onChange={(e) => setPoints(parseInt(e.target.value, 10))}
                    className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-brand-500 transition-colors"
                  >
                    <option value="1">1 pt (Low task complexity)</option>
                    <option value="2">2 pts</option>
                    <option value="3">3 pts</option>
                    <option value="5">5 pts (Medium task complexity)</option>
                    <option value="8">8 pts (High task complexity)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" isLoading={createMutation.isPending}>
                  Create Issue
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Main Tasks Board view */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner size="md" className="text-brand-500" />
        </div>
      ) : tasks.length === 0 ? (
        <Card variant="glass" className="p-12 text-center max-w-md mx-auto">
          <CheckSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h4 className="text-sm font-semibold text-gray-300">No active tasks logged</h4>
          <p className="text-xs text-gray-500 mt-1 mb-4 leading-normal">
            Sprint backlogs are clean! Create a new issue to verify AI smart prioritization telemetry.
          </p>
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1" /> Log First Task
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tasks.map((t) => (
            <Card key={t._id} variant="glass" className="hover:border-brand-500/20 transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                {/* Task Title & Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={t.status === 'DONE' ? 'success' : 'neutral'} size="sm">
                    {t.status}
                  </Badge>
                  <Badge variant={getPriorityBadgeColor(t.priority)} size="sm">
                    {t.priority}
                  </Badge>
                  <span className="text-[10px] font-mono text-gray-500">{t.projectId?.name || 'Workspace'}</span>
                </div>
                <h4 className={`text-sm font-bold text-gray-100 ${t.status === 'DONE' ? 'line-through text-gray-500' : ''}`}>
                  {t.title}
                </h4>
                {t.description && <p className="text-xs text-gray-400 max-w-2xl leading-normal">{t.description}</p>}
              </div>

              {/* AI scoring and state changer controls */}
              <div className="flex flex-wrap items-center gap-4 shrink-0 justify-between md:justify-end">
                {/* AI prioritizer block */}
                <div className="flex items-center gap-3 border border-brand-500/20 bg-brand-500/5 rounded-xl px-4 py-2">
                  <Brain className="w-4 h-4 text-brand-400" />
                  <div>
                    <span className="text-[9px] font-mono text-brand-300 block leading-none">AI PRIORITY</span>
                    <span className="text-xs font-bold text-white font-mono mt-0.5 block">{t.aiScore || 50}/100</span>
                  </div>
                </div>

                {/* Complexity indicator */}
                <div className="text-[10px] font-mono">
                  <span className={`px-2.5 py-1 rounded-full ${getComplexityColor(t.aiComplexity)}`}>
                    Complexity: {t.aiComplexity || 'MEDIUM'}
                  </span>
                </div>

                {/* Status action toggle */}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleStatusChange(t._id, t.status)}
                  className="text-xs"
                >
                  {t.status === 'DONE' ? 'Re-open' : 'Advance'} <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
