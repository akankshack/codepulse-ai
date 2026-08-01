/**
 * @file Projects.tsx
 * @description Engineering Project management console viewport, enabling users to create and manage repositories.
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import projectsApi, { ProjectData } from '../../api/projects.api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { FolderGit, Plus, ExternalLink, Trash2, GitBranch, Layers } from 'lucide-react';

export const Projects: React.FC = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch projects list
  const { data: projectsResp, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getProjects,
  });

  const projects = projectsResp?.data || [];

  // Create project mutation
  const createMutation = useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setName('');
      setKey('');
      setDescription('');
      setShowForm(false);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Failed to create project');
    },
  });

  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!name || !key) {
      setErrorMsg('Project Name and Key prefix are required');
      return;
    }
    createMutation.mutate({ name, key, description });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header action panel */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderGit className="w-5 h-5 text-brand-500" /> Platform Workspaces
          </h2>
          <p className="text-xs text-gray-400 mt-1">Manage, scope, and track software engineering repositories.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-1" /> New Project
        </Button>
      </div>

      {/* Creation form dialog toggle */}
      {showForm && (
        <Card variant="glass" className="p-6 max-w-lg mx-auto">
          <CardHeader className="p-0 pb-4 border-b-0">
            <CardTitle>Register Repository Workspace</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && <p className="text-xs text-rose-400 font-mono">{errorMsg}</p>}
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300">Project Name</label>
                <input
                  type="text"
                  placeholder="CodePulse App"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300">Key Prefix (Caps)</label>
                <input
                  type="text"
                  placeholder="CP"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300">Description</label>
                <textarea
                  placeholder="Details regarding repository scope..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors h-20 resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" isLoading={createMutation.isPending}>
                  Create Workspace
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Primary Projects grid */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner size="md" className="text-brand-500" />
        </div>
      ) : projects.length === 0 ? (
        <Card variant="glass" className="p-12 text-center max-w-md mx-auto">
          <FolderGit className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h4 className="text-sm font-semibold text-gray-300">No projects registered</h4>
          <p className="text-xs text-gray-500 mt-1 mb-4 leading-normal">
            To start tracking developer activity, log coding sessions, or create sprint boards, register a new workspace.
          </p>
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1" /> Create First Project
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <Card key={p._id} variant="glass" className="hover:border-brand-500/20 transition-all group relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start w-full">
                  <div className="space-y-0.5">
                    <Badge variant="info" size="sm" className="font-mono">{p.key}</Badge>
                    <CardTitle className="text-base font-bold text-gray-100 group-hover:text-brand-400 transition-colors mt-1.5">
                      {p.name}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => deleteMutation.mutate(p._id)}
                      className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-gray-400 leading-relaxed min-h-[3rem]">
                  {p.description || 'No description provided.'}
                </p>
                <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono border-t border-dark-border/60 pt-3">
                  <span className="flex items-center gap-1"><GitBranch className="w-3 h-3 text-cyan-400" /> status: {p.status}</span>
                  <span className="flex items-center gap-1"><Layers className="w-3 h-3 text-brand-400" /> {p.members.length} members</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
