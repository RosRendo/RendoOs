export type ProjectStatus = 'ACTIVE' | 'EXPERIMENT' | 'PAUSED' | 'ARCHIVED' | 'IDEA';
export type TaskBucket = 'NOW' | 'NEXT' | 'LATER';
export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskStatus = 'TODO' | 'DONE';
export type HealthStatus = 'HEALTHY' | 'ATTENTION' | 'BLOCKED';

export interface TechStackData {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  infrastructure?: string[];
  [category: string]: string[] | undefined;
}

export interface TaskItem {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  bucket: TaskBucket;
  priority: TaskPriority;
  dueDate?: string | null;
  order: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlockerItem {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IdeaItem {
  id: string;
  title: string;
  description?: string | null;
  projectId?: string | null;
  project?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LinkItem {
  id: string;
  projectId: string;
  title: string;
  url: string;
  type: 'GITHUB' | 'FIGMA' | 'PROD' | 'STAGING' | 'DOCS' | 'OTHER' | string;
  createdAt: string;
}

export interface ProjectDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: ProjectStatus;
  isPrimary: boolean;
  progress: number;
  image?: string | null;
  mobileImage?: string | null;
  currentMilestone?: string | null;
  overview?: string | null;
  techStack?: string | null;
  architecture?: string | null;
  flowExplainer?: string | null;
  repoUrl?: string | null;
  liveUrl?: string | null;
  folderPath?: string | null;
  runScript?: string | null;
  port?: number | null;
  isRunning?: boolean;
  backendPath?: string | null;
  backendScript?: string | null;
  backendPort?: number | null;
  isBackendRunning?: boolean;
  extraPath?: string | null;
  extraScript?: string | null;
  extraPort?: number | null;
  extraName?: string | null;
  isExtraRunning?: boolean;
  health: HealthStatus;
  createdAt: string;
  updatedAt: string;
  tasks: TaskItem[];
  blockers: BlockerItem[];
  ideas: IdeaItem[];
  links: LinkItem[];
}
