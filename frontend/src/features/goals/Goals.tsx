/**
 * @file Goals.tsx
 * @description Goals and milestones portal.
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import goalsApi from '../../api/goals.api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { Target, Plus, Calendar, CheckCircle } from 'lucide-react';

export const Goals: React.FC = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetMinutes, setTargetMinutes] = useState(600);
  const [targetCommits, setTargetCommits] = useState(10);
  const [targetDate, setTargetDate] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch goals list
  const { data: goalsResp, isLoading } = useQuery({
    queryKey: ['goals-milestones'],
    queryFn: goalsApi.getGoals,
  });

  const goals = goalsResp?.data || [];

  // Create goal mutation
  const createMutation = useMutation({
    mutationFn: goalsApi.createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals-milestones'] });
      setTitle('');
      setDescription('');
      setTargetMinutes(600);
      setTargetCommits(10);
      setTargetDate('');
      setShowForm(false);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Failed to create goal');
    },
  });

  // Complete goal mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'COMPLETED' | 'ACTIVE' }) =>
      goalsApi.updateGoal(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals-milestones'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!title || !targetDate) {
      setErrorMsg('Goal title and target milestone dates are required');
      return;
    }
    createMutation.mutate({
      title,
      description,
      targetMinutes,
      targetCommits,
      targetDate: new Date(targetDate).toISOString(),
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-500" /> Engineering Milestones & Goals
          </h2>
          <p className="text-xs text-gray-400 mt-1">Declare deliverables, commit frequencies, and track your active progress.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-1" /> New Goal
        </Button>
      </div>

      {/* Creation form dialog */}
      {showForm && (
        <Card variant="glass" className="p-6 max-w-lg mx-auto">
          <CardHeader className="p-0 pb-4 border-b-0">
            <CardTitle>Declare Developer Goal</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && <p className="text-xs text-rose-400 font-mono">{errorMsg}</p>}

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300">Goal Title</label>
                <input
                  type="text"
                  placeholder="Master Next.js App Router"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300">Description</label>
                <textarea
                  placeholder="Milestone achievements context..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors h-16 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-300">Target Coding Minutes</label>
                  <input
                    type="number"
                    value={targetMinutes}
                    onChange={(e) => setTargetMinutes(parseInt(e.target.value, 10))}
                    className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-300">Target Commits</label>
                  <input
                    type="number"
                    value={targetCommits}
                    onChange={(e) => setTargetCommits(parseInt(e.target.value, 10))}
                    className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300">Target Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" isLoading={createMutation.isPending}>
                  Save Milestone
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Goals lists */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner size="md" className="text-brand-500" />
        </div>
      ) : goals.length === 0 ? (
        <Card variant="glass" className="p-12 text-center max-w-md mx-auto">
          <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h4 className="text-sm font-semibold text-gray-300">No active goals declared</h4>
          <p className="text-xs text-gray-500 mt-1 mb-4 leading-normal">
            Declare target coding hours or git commit frequencies to track productivity habits.
          </p>
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1" /> Log First Goal
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {goals.map((g) => {
            const percent = Math.min(100, Math.round((g.currentMinutes / g.targetMinutes) * 100));
            return (
              <Card key={g._id} variant="glass" className="hover:border-brand-500/20 transition-all p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-gray-100">{g.title}</h4>
                    <p className="text-xs text-gray-400 leading-normal">{g.description}</p>
                  </div>
                  <Badge variant={g.status === 'COMPLETED' ? 'success' : 'neutral'} size="sm">
                    {g.status}
                  </Badge>
                </div>

                {/* Progress bars */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-300 font-mono">
                    <span>Progress: {g.currentMinutes} / {g.targetMinutes} minutes</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="w-full bg-dark-border rounded-full h-1.5 overflow-hidden">
                    <div className="bg-brand-500 h-1.5 rounded-full transition-all" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>

                {/* Info and action buttons */}
                <div className="flex justify-between items-center border-t border-dark-border/40 pt-3">
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-brand-400" /> Target: {new Date(g.targetDate).toLocaleDateString()}
                  </span>

                  {g.status === 'ACTIVE' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatusMutation.mutate({ id: g._id, status: 'COMPLETED' })}
                      className="text-xs py-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Complete
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Goals;
