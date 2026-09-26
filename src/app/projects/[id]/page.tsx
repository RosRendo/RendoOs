'use client';

import { useEffect, useState, use, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Flame,
  CheckCircle2,
  Square,
  AlertTriangle,
  ExternalLink,
  Globe,
  FileText,
  Upload,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  Archive,
  ArchiveRestore,
  Edit2,
  Check,
  X,
  Code2,
  Server,
  Database,
  Cloud,
  Lightbulb,
  CornerDownRight,
  ShieldAlert,
  Copy,
  Terminal,
  Eye,
} from 'lucide-react';
import MermaidViewer from '@/components/MermaidViewer';
import TechIcon, { TechBadge } from '@/components/TechIcon';
import ProjectRunnerButton from '@/components/ProjectRunnerButton';
import ReadmeViewer from '@/components/ReadmeViewer';
import { getStatusBadge, getHealthBadge, formatTimeAgo, parseTechStack } from '@/lib/utils';
import { ProjectDetail, TaskItem, BlockerItem, IdeaItem, LinkItem, TaskBucket } from '@/lib/types';

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tasks' | 'overview' | 'readme' | 'flow' | 'architecture' | 'ideas'>('tasks');
  const [taskBucketFilter, setTaskBucketFilter] = useState<'ALL' | 'NOW' | 'NEXT' | 'LATER'>('ALL');

  // Quick inputs
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskBucket, setNewTaskBucket] = useState<TaskBucket>('NOW');
  const [newTaskPriority, setNewTaskPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');

  const [newBlockerTitle, setNewBlockerTitle] = useState('');
  const [newBlockerDesc, setNewBlockerDesc] = useState('');
  const [showBlockerInput, setShowBlockerInput] = useState(false);

  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaDesc, setNewIdeaDesc] = useState('');
  const [showIdeaInput, setShowIdeaInput] = useState(false);

  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkType, setNewLinkType] = useState('GITHUB');
  const [showLinkInput, setShowLinkInput] = useState(false);

  // Edit milestone / description inline
  const [isEditingMilestone, setIsEditingMilestone] = useState(false);
  const [milestoneText, setMilestoneText] = useState('');

  // Live Mermaid Architecture states
  const [architectureCode, setArchitectureCode] = useState('');
  const [isEditingArchitecture, setIsEditingArchitecture] = useState(false);
  const [savingArchitecture, setSavingArchitecture] = useState(false);
  const [copiedArchitecture, setCopiedArchitecture] = useState(false);

  // How It Works tab
  const [flowText, setFlowText] = useState('');
  const [isEditingFlow, setIsEditingFlow] = useState(false);
  const [savingFlow, setSavingFlow] = useState(false);
  const [flowMode, setFlowMode] = useState<'text' | 'diagram'>('text');

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingMobileImage, setUploadingMobileImage] = useState(false);
  const [snapshotTab, setSnapshotTab] = useState<'web' | 'mobile'>('web');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${resolvedParams.id}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
        setMilestoneText(data.currentMilestone || '');
        setArchitectureCode(data.architecture || '');
        setFlowText(data.flowExplainer || '');
      } else {
        router.push('/projects');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id, router]);

  const handleDeleteProject = async () => {
    if (!project) return;
    setDeletingProject(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/projects');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete project');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete project');
    } finally {
      setDeletingProject(false);
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // Project status change
  const handleStatusChange = async (newStatus: string) => {
    if (!project) return;
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchProject();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle primary focus
  const handleTogglePrimary = async () => {
    if (!project) return;
    try {
      if (project.isPrimary) {
        await fetch(`/api/projects/${project.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isPrimary: false }),
        });
      } else {
        await fetch(`/api/projects/${project.id}/primary`, { method: 'POST' });
      }
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  // Save current milestone
  const handleSaveMilestone = async () => {
    if (!project) return;
    try {
      await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentMilestone: milestoneText }),
      });
      setIsEditingMilestone(false);
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  // Task actions
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !newTaskTitle.trim()) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          title: newTaskTitle.trim(),
          bucket: newTaskBucket,
          priority: newTaskPriority,
        }),
      });
      if (res.ok) {
        setNewTaskTitle('');
        fetchProject();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';
    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await fetch(`/api/tasks?id=${taskId}`, { method: 'DELETE' });
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeTaskBucket = async (taskId: string, bucket: TaskBucket) => {
    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, bucket }),
      });
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  // Blocker actions
  const handleAddBlocker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !newBlockerTitle.trim()) return;

    try {
      const res = await fetch('/api/blockers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          title: newBlockerTitle.trim(),
          description: newBlockerDesc.trim(),
        }),
      });
      if (res.ok) {
        setNewBlockerTitle('');
        setNewBlockerDesc('');
        setShowBlockerInput(false);
        fetchProject();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBlocker = async (blockerId: string, currentResolved: boolean) => {
    try {
      await fetch('/api/blockers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: blockerId, resolved: !currentResolved }),
      });
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBlocker = async (blockerId: string) => {
    try {
      await fetch(`/api/blockers?id=${blockerId}`, { method: 'DELETE' });
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  // Idea actions
  const handleAddIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !newIdeaTitle.trim()) return;

    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          title: newIdeaTitle.trim(),
          description: newIdeaDesc.trim(),
        }),
      });
      if (res.ok) {
        setNewIdeaTitle('');
        setNewIdeaDesc('');
        setShowIdeaInput(false);
        fetchProject();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConvertIdeaToTask = async (idea: IdeaItem) => {
    if (!project) return;
    try {
      // 1. Create task
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          title: idea.title,
          description: idea.description,
          bucket: 'LATER',
          priority: 'LOW',
        }),
      });

      // 2. Remove idea
      await fetch(`/api/ideas?id=${idea.id}`, { method: 'DELETE' });
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  // Link actions
  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !newLinkTitle.trim() || !newLinkUrl.trim()) return;

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          title: newLinkTitle.trim(),
          url: newLinkUrl.trim(),
          type: newLinkType,
        }),
      });
      if (res.ok) {
        setNewLinkTitle('');
        setNewLinkUrl('');
        setShowLinkInput(false);
        fetchProject();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await fetch(`/api/links?id=${linkId}`, { method: 'DELETE' });
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'web' | 'mobile' = 'web') => {
    const file = e.target.files?.[0];
    if (!file || !project) return;

    if (target === 'mobile') setUploadingMobileImage(true);
    else setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      if (uploadRes.ok) {
        const { url } = await uploadRes.json();
        await fetch(`/api/projects/${project.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(target === 'mobile' ? { mobileImage: url } : { image: url }),
        });
        fetchProject();
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (target === 'mobile') setUploadingMobileImage(false);
      else setUploadingImage(false);
    }
  };

  const handleSaveArchitecture = async () => {
    if (!project) return;
    setSavingArchitecture(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ architecture: architectureCode }),
      });
      if (res.ok) {
        setIsEditingArchitecture(false);
        fetchProject();
      }
    } catch (err) {
      console.error('Failed to save architecture:', err);
    } finally {
      setSavingArchitecture(false);
    }
  };

  const handleCopyArchitecture = () => {
    if (!architectureCode) return;
    navigator.clipboard.writeText(architectureCode);
    setCopiedArchitecture(true);
    setTimeout(() => setCopiedArchitecture(false), 2000);
  };

  const handleSaveFlow = async () => {
    if (!project) return;
    setSavingFlow(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flowExplainer: flowText }),
      });
      if (res.ok) { setIsEditingFlow(false); fetchProject(); }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingFlow(false);
    }
  };

  const handleApplyTemplate = (type: string) => {
    if (type === 'marketplace') {
      setArchitectureCode(`graph TD
    subgraph Clients["Clients & Apps"]
        W["Web Portal (Next.js 15)"]
        M["Mobile App (React Native)"]
    end
    subgraph Gateway["Edge Gateway"]
        CF["Cloudflare CDN / WAF"]
        NG["Nginx Reverse Proxy"]
    end
    subgraph Backend["Core Services"]
        API["NestJS API Gateway"]
        Auth["Auth Service (JWT / OTP)"]
        Dispatch["Dispatch Engine"]
    end
    subgraph Data["Database"]
        PG[("PostgreSQL")]
        Prisma["Prisma ORM"]
    end
    W --> CF
    M --> CF
    CF --> NG
    NG --> API
    API --> Auth
    API --> Dispatch
    Auth --> Prisma
    Dispatch --> Prisma
    Prisma --> PG`);
    } else if (type === 'microservices') {
      setArchitectureCode(`graph TD
    Client(["Client App"]) --> Gateway["API Gateway"]
    Gateway --> AuthSvc["Auth Service"]
    Gateway --> OrderSvc["Order Service"]
    OrderSvc --> Kafka{{"Kafka Event Bus"}}
    Kafka --> PaymentSvc["Payment Processor"]
    Kafka --> NotificationSvc["Notification Service"]
    OrderSvc --> DB[("PostgreSQL DB")]
    PaymentSvc --> GatewayBank["Banking API"]`);
    } else if (type === 'cli') {
      setArchitectureCode(`graph LR
    User(["Terminal User"]) --> CLI["CLI Command Interface"]
    CLI --> TUI["Interactive TUI Engine"]
    TUI --> Engine["Core Business Logic"]
    Engine --> Storage[("Local SQLite / BoltDB")]
    Engine -.-> Cloud["Cloud Sync Endpoint"]`);
    }
  };

  if (loading && !project) {
    return (
      <div className="flex items-center justify-center py-24">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!project) return null;

  const statusBadge = getStatusBadge(project.status);
  const healthBadge = getHealthBadge(project.health);
  const techStack = parseTechStack(project.techStack);

  const nowTasks = project.tasks?.filter((t) => t.bucket === 'NOW') || [];
  const nextTasks = project.tasks?.filter((t) => t.bucket === 'NEXT') || [];
  const laterTasks = project.tasks?.filter((t) => t.bucket === 'LATER') || [];

  const activeBlockers = project.blockers?.filter((b) => !b.resolved) || [];
  const resolvedBlockers = project.blockers?.filter((b) => b.resolved) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Back button & quick action row */}
      <div className="flex items-center justify-between">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to projects
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <ProjectRunnerButton
            projectId={project.id}
            projectName={project.name}
            folderPath={project.folderPath}
            runScript={project.runScript}
            port={project.port}
            initialIsRunning={project.isRunning}
            backendPath={project.backendPath}
            backendScript={project.backendScript}
            backendPort={project.backendPort}
            initialIsBackendRunning={project.isBackendRunning}
            extraPath={project.extraPath}
            extraScript={project.extraScript}
            extraPort={project.extraPort}
            extraName={project.extraName}
            initialIsExtraRunning={project.isExtraRunning}
            onStatusChange={() => fetchProject()}
          />

          <button
            onClick={handleTogglePrimary}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${project.isPrimary
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800'
              }`}
          >
            <Flame
              className={`w-3.5 h-3.5 ${project.isPrimary ? 'fill-rose-500 text-rose-500' : 'text-zinc-400'
                }`}
            />
            {project.isPrimary ? 'Current Focus' : 'Set as Focus'}
          </button>

          <select
            value={project.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-xs font-mono bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="EXPERIMENT">EXPERIMENT</option>
            <option value="PAUSED">PAUSED</option>
            <option value="ARCHIVED">ARCHIVED</option>
            <option value="IDEA">IDEA</option>
          </select>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/40 transition-all cursor-pointer"
            title="Delete project"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PROJECT HEADER CARD                                            */}
      {/* ============================================================== */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Visual Snapshot – Web / Mobile tabs */}
          <div className="lg:col-span-4 space-y-2">
            {(() => {
              const ts = parseTechStack(project.techStack);
              const hasMobile = [...(ts.frontend || [])].some(t =>
                ['React Native', 'Expo', 'Flutter', 'Swift', 'Kotlin'].some(m =>
                  t.toLowerCase().includes(m.toLowerCase())
                )
              );
              const activeImage = snapshotTab === 'mobile' ? project.mobileImage : project.image;
              const isUploading = snapshotTab === 'mobile' ? uploadingMobileImage : uploadingImage;

              return (
                <>
                  {/* Tab bar — only shown when mobile platform detected */}
                  {hasMobile && (
                    <div className="flex items-center gap-1 mb-1.5">
                      <button
                        onClick={() => setSnapshotTab('web')}
                        className={`flex-1 py-1.5 text-[11px] font-mono rounded-lg border transition-colors ${
                          snapshotTab === 'web'
                            ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                            : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        🖥 Web
                      </button>
                      <button
                        onClick={() => setSnapshotTab('mobile')}
                        className={`flex-1 py-1.5 text-[11px] font-mono rounded-lg border transition-colors ${
                          snapshotTab === 'mobile'
                            ? 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                            : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        📱 Mobile
                      </button>
                    </div>
                  )}

                  {/* Image container */}
                  <div className={`relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 group ${
                    snapshotTab === 'mobile' && hasMobile ? 'aspect-[9/16] max-w-[180px] mx-auto' : 'aspect-video'
                  }`}>
                    {activeImage ? (
                      <img
                        src={activeImage}
                        alt={`${project.name} ${snapshotTab} screenshot`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600">
                        <Upload className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs font-mono text-center px-2">
                          {snapshotTab === 'mobile' ? 'No mobile screenshot' : 'No web screenshot'}
                        </span>
                      </div>
                    )}
                    {/* Hover upload overlay */}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer p-4 text-center">
                      <Upload className="w-6 h-6 mb-1 text-blue-400" />
                      <span className="text-xs font-medium">
                        {isUploading ? 'Uploading...' : `Upload ${snapshotTab === 'mobile' ? 'mobile' : 'web'} screenshot`}
                      </span>
                      <span className="text-[10px] text-zinc-400 mt-0.5">PNG, JPG, SVG</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, snapshotTab)}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>

                  {/* Footer label */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1">
                    <span>{snapshotTab === 'mobile' ? 'Mobile Screenshot' : 'Web Screenshot'}</span>
                    <label className="text-blue-500 hover:underline cursor-pointer flex items-center gap-1">
                      <Upload className="w-3 h-3" /> Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, snapshotTab)}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Details & Metadata */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {project.name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${statusBadge.bgColor} ${statusBadge.textColor}`}
                >
                  <span className={`w-1 h-1 rounded-full ${statusBadge.dotColor}`} />
                  {statusBadge.label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${healthBadge.bgColor} ${healthBadge.textColor}`}
                >
                  <span className={`w-1 h-1 rounded-full ${healthBadge.dotColor}`} />
                  {healthBadge.label}
                </span>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                Updated {formatTimeAgo(project.updatedAt)}
              </span>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {project.description || 'No description provided.'}
            </p>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500">Milestone Progress</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">
                  {project.progress}%
                </span>
              </div>
              <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full progress-bar-fill"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Current Milestone banner with inline edit */}
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between">
              <div className="flex-1 mr-3">
                <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-0.5">
                  Current Milestone
                </span>
                {isEditingMilestone ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={milestoneText}
                      onChange={(e) => setMilestoneText(e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                    <button
                      onClick={handleSaveMilestone}
                      className="p-1 rounded bg-blue-600 text-white hover:bg-blue-500"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsEditingMilestone(false)}
                      className="p-1 rounded text-zinc-400 hover:text-zinc-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                    {project.currentMilestone || 'No milestone set. Click edit to define one.'}
                  </p>
                )}
              </div>
              {!isEditingMilestone && (
                <button
                  onClick={() => setIsEditingMilestone(true)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                  title="Edit current milestone"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Project Links Row */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-sm"
                >
                  <TechIcon name="github" size={14} />
                  <span>GitHub Repository</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-blue-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Live Preview
                </a>
              )}
              {project.links?.map((link) => (
                <div key={link.id} className="group inline-flex items-center gap-1">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {link.type === 'FIGMA' || link.url.includes('figma') ? (
                      <TechIcon name="figma" size={13} />
                    ) : link.type === 'GITHUB' || link.url.includes('github') ? (
                      <TechIcon name="github" size={14} />
                    ) : (
                      <ExternalLink className="w-3 h-3 text-zinc-400" />
                    )}
                    <span>{link.title}</span>
                  </a>
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-rose-500 p-0.5 transition-opacity"
                    title="Remove link"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setShowLinkInput(!showLinkInput)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 text-xs font-mono text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Link
              </button>
            </div>

            {/* Quick Link Input Popover */}
            {showLinkInput && (
              <form
                onSubmit={handleAddLink}
                className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-wrap gap-2 items-center"
              >
                <input
                  type="text"
                  placeholder="Link Title (e.g. Figma, Docs)"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  required
                />
                <input
                  type="url"
                  placeholder="https://..."
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="flex-1 min-w-[180px] px-2.5 py-1 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  required
                />
                <select
                  value={newLinkType}
                  onChange={(e) => setNewLinkType(e.target.value)}
                  className="px-2 py-1 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-900 dark:text-zinc-100"
                >
                  <option value="GITHUB">GitHub</option>
                  <option value="FIGMA">Figma</option>
                  <option value="DOCS">Docs</option>
                  <option value="STAGING">Staging</option>
                  <option value="PROD">Production</option>
                  <option value="OTHER">Other</option>
                </select>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded font-medium"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowLinkInput(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION TABS: TASKS | OVERVIEW | ARCHITECTURE | IDEAS           */}
      {/* ============================================================== */}
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <nav className="flex space-x-6">
          {[
            { id: 'tasks', label: 'Tasks & Checklist', count: project.tasks?.length ?? 0 },
            { id: 'overview', label: 'Overview & Tech Stack' },
            { id: 'readme', label: 'README.md' },
            { id: 'flow', label: 'How It Works' },
            { id: 'architecture', label: 'Architecture' },
            { id: 'ideas', label: 'Project Ideas', count: project.ideas?.length ?? 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeTab === tab.id
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                    }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* ============================================================== */}
      {/* TAB CONTENT: TASKS & CHECKLIST                                 */}
      {/* ============================================================== */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Task List (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Quick Add Task Bar */}
            <form
              onSubmit={handleAddTask}
              className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] flex flex-wrap sm:flex-nowrap items-center gap-2 shadow-sm"
            >
              <input
                type="text"
                placeholder="Add next task... (Press Enter to save)"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 min-w-[200px] px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <select
                value={newTaskBucket}
                onChange={(e) => setNewTaskBucket(e.target.value as TaskBucket)}
                className="px-2.5 py-1.5 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 focus:outline-none"
              >
                <option value="NOW">NOW</option>
                <option value="NEXT">NEXT</option>
                <option value="LATER">LATER</option>
              </select>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 focus:outline-none"
              >
                <option value="HIGH">High P1</option>
                <option value="MEDIUM">Med P2</option>
                <option value="LOW">Low P3</option>
              </select>
              <button
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors shrink-0"
              >
                Add Task
              </button>
            </form>

            {/* Task Columns / Buckets: NOW, NEXT, LATER */}
            <div className="space-y-6">
              {/* NOW COLUMN */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3 border-b border-zinc-100 dark:border-zinc-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
                      NOW — Immediate Priority
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {nowTasks.filter((t) => t.status === 'DONE').length}/{nowTasks.length} Done
                  </span>
                </div>

                <div className="space-y-2">
                  {nowTasks.length > 0 ? (
                    nowTasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onToggle={() => handleToggleTask(task.id, task.status)}
                        onDelete={() => handleDeleteTask(task.id)}
                        onChangeBucket={(b) => handleChangeTaskBucket(task.id, b)}
                      />
                    ))
                  ) : (
                    <div className="text-center py-4 text-xs text-zinc-500 font-mono">
                      No immediate tasks queued.
                    </div>
                  )}
                </div>
              </div>

              {/* NEXT COLUMN */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3 border-b border-zinc-100 dark:border-zinc-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
                      NEXT — Coming After Current Work
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {nextTasks.filter((t) => t.status === 'DONE').length}/{nextTasks.length} Done
                  </span>
                </div>

                <div className="space-y-2">
                  {nextTasks.length > 0 ? (
                    nextTasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onToggle={() => handleToggleTask(task.id, task.status)}
                        onDelete={() => handleDeleteTask(task.id)}
                        onChangeBucket={(b) => handleChangeTaskBucket(task.id, b)}
                      />
                    ))
                  ) : (
                    <div className="text-center py-4 text-xs text-zinc-500 font-mono">
                      No follow-up tasks queued.
                    </div>
                  )}
                </div>
              </div>

              {/* LATER COLUMN */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3 border-b border-zinc-100 dark:border-zinc-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-500" />
                    <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
                      LATER — Future Enhancements
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {laterTasks.length} tasks
                  </span>
                </div>

                <div className="space-y-2">
                  {laterTasks.length > 0 ? (
                    laterTasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onToggle={() => handleToggleTask(task.id, task.status)}
                        onDelete={() => handleDeleteTask(task.id)}
                        onChangeBucket={(b) => handleChangeTaskBucket(task.id, b)}
                      />
                    ))
                  ) : (
                    <div className="text-center py-4 text-xs text-zinc-500 font-mono">
                      No future tasks parked yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Blockers & Project Health (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Blockers Widget */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-500 dark:text-rose-400 uppercase">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>BLOCKERS</span>
                </div>
                <button
                  onClick={() => setShowBlockerInput(!showBlockerInput)}
                  className="text-[11px] font-mono text-blue-500 hover:text-blue-400 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Blocker
                </button>
              </div>

              {/* Add Blocker Form */}
              {showBlockerInput && (
                <form onSubmit={handleAddBlocker} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <input
                    type="text"
                    placeholder="Blocker title (e.g. Bank approval)"
                    value={newBlockerTitle}
                    onChange={(e) => setNewBlockerTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    required
                  />
                  <textarea
                    rows={2}
                    placeholder="Notes on resolution / dependencies"
                    value={newBlockerDesc}
                    onChange={(e) => setNewBlockerDesc(e.target.value)}
                    className="w-full px-2.5 py-1 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-900 dark:text-zinc-100 focus:outline-none resize-none"
                  />
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowBlockerInput(false)}
                      className="px-2.5 py-1 text-[11px] text-zinc-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-2.5 py-1 text-[11px] font-medium bg-rose-600 hover:bg-rose-500 text-white rounded"
                    >
                      Save Blocker
                    </button>
                  </div>
                </form>
              )}

              {/* Active Blockers */}
              <div className="space-y-2">
                {activeBlockers.length > 0 ? (
                  activeBlockers.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/5 flex items-start justify-between gap-2 text-xs"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold">⚠</span>
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-zinc-200">
                            {b.title}
                          </p>
                          {b.description && (
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                              {b.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleToggleBlocker(b.id, b.resolved)}
                          className="px-2 py-0.5 text-[10px] font-mono bg-zinc-200 dark:bg-zinc-800 hover:bg-emerald-600 hover:text-white rounded transition-colors text-zinc-600 dark:text-zinc-300"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => handleDeleteBlocker(b.id)}
                          className="p-1 text-zinc-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 font-mono py-2">
                    No active blockers.
                  </p>
                )}

                {/* Resolved Blockers Collapsible */}
                {resolvedBlockers.length > 0 && (
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
                      Resolved ({resolvedBlockers.length})
                    </span>
                    <div className="space-y-1">
                      {resolvedBlockers.map((b) => (
                        <div
                          key={b.id}
                          className="flex items-center justify-between text-xs text-zinc-400 line-through py-1 px-2 rounded bg-zinc-50 dark:bg-zinc-900/40"
                        >
                          <span className="truncate">{b.title}</span>
                          <button
                            onClick={() => handleToggleBlocker(b.id, b.resolved)}
                            className="text-[9px] font-mono hover:text-zinc-200 text-zinc-500 ml-2"
                          >
                            Unresolve
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Project Summary Card */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-3">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                Quick Project Status
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-400 text-[10px] block">Tasks Left</span>
                  <span className="text-base font-bold text-zinc-800 dark:text-zinc-200">
                    {project.tasks.filter((t) => t.status === 'TODO').length}
                  </span>
                </div>
                <div className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-400 text-[10px] block">Completed</span>
                  <span className="text-base font-bold text-emerald-500">
                    {project.tasks.filter((t) => t.status === 'DONE').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB CONTENT: OVERVIEW & TECH STACK                             */}
      {/* ============================================================== */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Overview text (What is this, who is it for, why does it exist) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] space-y-4">
              <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Project Intent & Scope
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Answering: What is this? Who is it for? Why does it exist?
                </p>
              </div>

              <div className="space-y-4 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-[11px] font-mono uppercase tracking-wider mb-1 text-blue-500">
                    Overview
                  </h4>
                  <p className="whitespace-pre-line bg-zinc-50 dark:bg-zinc-900/40 p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800/80">
                    {project.overview || project.description || 'No detailed overview written yet.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack by Category */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] space-y-5">
              <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Categorized Tech Stack
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Core technologies powering this system
                </p>
              </div>

              {/* Frontend */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-sky-400">
                  <Code2 className="w-3.5 h-3.5" /> Frontend
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {techStack.frontend && techStack.frontend.length > 0 ? (
                    techStack.frontend.map((t) => (
                      <TechBadge key={t} name={t} />
                    ))
                  ) : (
                    <span className="text-xs text-zinc-500 font-mono">Not specified</span>
                  )}
                </div>
              </div>

              {/* Backend */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400">
                  <Server className="w-3.5 h-3.5" /> Backend
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {techStack.backend && techStack.backend.length > 0 ? (
                    techStack.backend.map((t) => (
                      <TechBadge key={t} name={t} />
                    ))
                  ) : (
                    <span className="text-xs text-zinc-500 font-mono">Not specified</span>
                  )}
                </div>
              </div>

              {/* Database */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-violet-400">
                  <Database className="w-3.5 h-3.5" /> Database
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {techStack.database && techStack.database.length > 0 ? (
                    techStack.database.map((t) => (
                      <TechBadge key={t} name={t} />
                    ))
                  ) : (
                    <span className="text-xs text-zinc-500 font-mono">Not specified</span>
                  )}
                </div>
              </div>

              {/* Infrastructure */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-400">
                  <Cloud className="w-3.5 h-3.5" /> Infrastructure
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {techStack.infrastructure && techStack.infrastructure.length > 0 ? (
                    techStack.infrastructure.map((t) => (
                      <TechBadge key={t} name={t} />
                    ))
                  ) : (
                    <span className="text-xs text-zinc-500 font-mono">Not specified</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB CONTENT: README.MD (LIVE DISK VIEWER & EDITOR)              */}
      {/* ============================================================== */}
      {activeTab === 'readme' && (
        <ReadmeViewer projectId={project.id} projectName={project.name} />
      )}

      {/* ============================================================== */}
      {/* TAB CONTENT: HOW IT WORKS                                       */}
      {/* ============================================================== */}
      {activeTab === 'flow' && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] overflow-hidden">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">How It Works</h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">Write or paste your explanation — plain text or a Mermaid diagram.</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Mode toggle — only visible when there's content or editing */}
              {(isEditingFlow || flowText) && (
                <div className="inline-flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden text-[11px] font-mono">
                  <button
                    onClick={() => setFlowMode('text')}
                    className={`px-3 py-1.5 transition-colors ${
                      flowMode === 'text'
                        ? 'bg-zinc-800 text-zinc-100'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    Text
                  </button>
                  <button
                    onClick={() => setFlowMode('diagram')}
                    className={`px-3 py-1.5 transition-colors border-l border-zinc-200 dark:border-zinc-700 ${
                      flowMode === 'diagram'
                        ? 'bg-zinc-800 text-zinc-100'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    Mermaid
                  </button>
                </div>
              )}
              {isEditingFlow ? (
                <>
                  <button
                    onClick={() => { setIsEditingFlow(false); setFlowText(project.flowExplainer || ''); }}
                    className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveFlow}
                    disabled={savingFlow}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {savingFlow ? 'Saving…' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingFlow(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  {flowText ? 'Edit' : 'Write'}
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          {isEditingFlow ? (
            <textarea
              autoFocus
              value={flowText}
              onChange={(e) => setFlowText(e.target.value)}
              onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSaveFlow(); } }}
              rows={20}
              placeholder={flowMode === 'diagram'
                ? `graph TD
    User(["User"]) --> App["Open App"]
    App --> Dashboard["Dashboard"]
    Dashboard --> Project["Click Project"]
    Project --> Tasks["View Tasks"]
    Project --> Runner["Run FE & BE"]
    Runner --> FE["Frontend :3010"]
    Runner --> BE["Backend :3005"]`
                : `How does this project work?\n\nUser journey:\n1. Opens the app and sees the dashboard\n2. Clicks a project to see its tasks and details\n3. Hits Run Both to start frontend and backend\n4. Uses the Architecture tab to see the service diagram\n\nKey features:\n- Real-time terminal via xterm.js\n- Telegram bot for remote commands\n- n8n for workflow automation\n\nNot finished yet:\n- Session persistence across restarts\n- Multi-user support`
              }
              className="w-full p-5 text-sm text-zinc-800 dark:text-zinc-200 bg-transparent placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none resize-none leading-relaxed font-mono border-0"
            />
          ) : flowText ? (
            flowMode === 'diagram' ? (
              <div className="p-5">
                <MermaidViewer chart={flowText} />
              </div>
            ) : (
              <pre className="p-5 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">{flowText}</pre>
            )
          ) : (
            <div
              className="flex flex-col items-center justify-center py-20 cursor-text select-none"
              onClick={() => setIsEditingFlow(true)}
            >
              <FileText className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mb-3" />
              <p className="text-sm font-medium text-zinc-500">Nothing here yet</p>
              <p className="text-xs text-zinc-400 mt-1">Click to write — paste text or a Mermaid diagram</p>
            </div>
          )}

          {isEditingFlow && (
            <div className="px-5 py-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-400">
                {flowMode === 'diagram' ? 'Mermaid diagram syntax · graph TD / flowchart LR' : 'Plain text · any format'}
              </span>
              <span className="text-[10px] font-mono text-zinc-400">Ctrl+S to save</span>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB CONTENT: ARCHITECTURE (LIVE MERMAID)                       */}
      {/* ============================================================== */}
      {activeTab === 'architecture' && (
        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] space-y-5">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  System Architecture & Data Flow
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  Live Mermaid Engine
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Dynamic visual diagram of clients, edge proxies, microservices, and database layers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyArchitecture}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Copy Mermaid code"
              >
                {copiedArchitecture ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Code
                  </>
                )}
              </button>

              <button
                onClick={() => setIsEditingArchitecture(!isEditingArchitecture)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isEditingArchitecture
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
              >
                {isEditingArchitecture ? (
                  <>
                    <Eye className="w-3.5 h-3.5" /> View Only
                  </>
                ) : (
                  <>
                    <Edit2 className="w-3.5 h-3.5" /> Edit Mermaid
                  </>
                )}
              </button>

              {isEditingArchitecture && (
                <button
                  onClick={handleSaveArchitecture}
                  disabled={savingArchitecture}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{savingArchitecture ? 'Saving...' : 'Save Diagram'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Edit Mode Toolbar with Architecture Templates */}
          {isEditingArchitecture && (
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-mono text-[11px] text-zinc-500">
                Load Architecture Preset:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('marketplace')}
                  className="px-2.5 py-1 rounded bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 font-mono text-[11px]"
                >
                  Marketplace / Multi-tier
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('microservices')}
                  className="px-2.5 py-1 rounded bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 font-mono text-[11px]"
                >
                  Event Microservices
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('cli')}
                  className="px-2.5 py-1 rounded bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 font-mono text-[11px]"
                >
                  CLI / Local Daemon
                </button>
              </div>
            </div>
          )}

          {/* Diagram Display & Editor */}
          {isEditingArchitecture ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Code Editor */}
              <div className="lg:col-span-5 flex flex-col space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5" /> Mermaid Source Code
                </label>
                <textarea
                  value={architectureCode}
                  onChange={(e) => setArchitectureCode(e.target.value)}
                  rows={18}
                  className="w-full flex-1 p-3 text-xs font-mono bg-zinc-950 text-emerald-400 border border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none shadow-inner leading-relaxed"
                  placeholder="graph TD&#10;  A --> B"
                />
              </div>

              {/* Live Preview Side */}
              <div className="lg:col-span-7 flex flex-col space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> Real-Time Live Preview
                </label>
                <div className="flex-1 min-h-[350px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950/40 dark:bg-zinc-950 flex items-center justify-center p-2 overflow-hidden shadow-inner">
                  <MermaidViewer chart={architectureCode} className="w-full" />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-950/20 dark:bg-zinc-950/50 p-4 min-h-[420px] flex items-center justify-center overflow-hidden shadow-sm">
              <MermaidViewer
                chart={
                  project.architecture ||
                  `graph TD\n  Client["Web / Mobile Clients"] --> API["API Gateway"]\n  API --> Service["Backend Service"]\n  Service --> DB[("Database")]`
                }
                className="w-full"
              />
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB CONTENT: PROJECT IDEAS                                     */}
      {/* ============================================================== */}
      {activeTab === 'ideas' && (
        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Project Ideas & Experiments
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Brainstormed features parked for this project without cluttering active tasks.
              </p>
            </div>
            <button
              onClick={() => setShowIdeaInput(!showIdeaInput)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Idea
            </button>
          </div>

          {showIdeaInput && (
            <form onSubmit={handleAddIdea} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <input
                type="text"
                placeholder="Idea title (e.g. AI smart service matching)"
                value={newIdeaTitle}
                onChange={(e) => setNewIdeaTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none"
                required
              />
              <textarea
                rows={2}
                placeholder="Details / thoughts..."
                value={newIdeaDesc}
                onChange={(e) => setNewIdeaDesc(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowIdeaInput(false)}
                  className="px-3 py-1 text-xs text-zinc-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium"
                >
                  Save Idea
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.ideas && project.ideas.length > 0 ? (
              project.ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                      <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        {idea.title}
                      </h4>
                    </div>
                    {idea.description && (
                      <p className="text-xs text-zinc-500 leading-relaxed pl-6">
                        {idea.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[10px] font-mono">
                    <span className="text-zinc-400">{formatTimeAgo(idea.createdAt)}</span>
                    <button
                      onClick={() => handleConvertIdeaToTask(idea)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 hover:bg-blue-600 hover:text-white transition-colors text-zinc-700 dark:text-zinc-300"
                      title="Promote this idea to a task in LATER bucket"
                    >
                      <CornerDownRight className="w-3 h-3" />
                      Promote to Task
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500 font-mono py-6 col-span-2 text-center">
                No ideas parked for this project yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#11131a] rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Delete Project
                </h3>
                <p className="text-xs text-zinc-500">
                  Permanent action
                </p>
              </div>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-zinc-900 dark:text-zinc-100">{project?.name}</span>? This will permanently delete all associated tasks, blockers, ideas, links, and runner configurations. This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingProject}
                className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProject}
                disabled={deletingProject}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-colors disabled:opacity-50"
              >
                {deletingProject ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Project</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponent: TaskRow
function TaskRow({
  task,
  onToggle,
  onDelete,
  onChangeBucket,
}: {
  task: TaskItem;
  onToggle: () => void;
  onDelete: () => void;
  onChangeBucket: (bucket: TaskBucket) => void;
}) {
  const isDone = task.status === 'DONE';

  return (
    <div
      className={`group flex items-start justify-between gap-3 p-3 rounded-lg border transition-colors ${isDone
          ? 'bg-zinc-50/40 dark:bg-zinc-900/20 border-zinc-200/50 dark:border-zinc-800/40 opacity-60'
          : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/70 hover:border-zinc-400 dark:hover:border-zinc-700'
        }`}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <button
          onClick={onToggle}
          className={`mt-0.5 shrink-0 transition-colors ${isDone ? 'text-emerald-500' : 'text-zinc-400 hover:text-blue-500'
            }`}
        >
          {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Square className="w-4 h-4" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`text-xs font-medium text-zinc-900 dark:text-zinc-100 ${isDone ? 'line-through text-zinc-400 dark:text-zinc-500' : ''
                }`}
            >
              {task.title}
            </span>
            {task.priority === 'HIGH' && (
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-rose-500/10 text-rose-400">
                P1
              </span>
            )}
            {task.priority === 'MEDIUM' && (
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/10 text-amber-400">
                P2
              </span>
            )}
          </div>
          {task.description && (
            <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">
              {task.description}
            </p>
          )}
          {task.notes && (
            <p className="text-[10px] font-mono text-zinc-400 mt-1 italic">
              Note: {task.notes}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <select
          value={task.bucket}
          onChange={(e) => onChangeBucket(e.target.value as TaskBucket)}
          className="text-[10px] font-mono bg-zinc-200 dark:bg-zinc-800 rounded px-1.5 py-0.5 text-zinc-700 dark:text-zinc-300 focus:outline-none"
        >
          <option value="NOW">NOW</option>
          <option value="NEXT">NEXT</option>
          <option value="LATER">LATER</option>
        </select>
        <button
          onClick={onDelete}
          className="p-1 text-zinc-400 hover:text-rose-400 transition-colors"
          title="Delete task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
