export type ProjectStatus = 'ACTIVE' | 'EXPERIMENT' | 'PAUSED' | 'ARCHIVED' | 'IDEA';
export type TaskBucket = 'NOW' | 'NEXT' | 'LATER';
export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskStatus = 'TODO' | 'DONE';
export type HealthStatus = 'HEALTHY' | 'ATTENTION' | 'BLOCKED' | 'INACTIVE';

export interface TechStackData {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  infrastructure?: string[];
  ai?: string[];
  services?: string[];
  [category: string]: string[] | undefined;
}

export interface RecentActivityData {
  projects: Array<{
    id: string;
    name: string;
    slug: string;
    status: ProjectStatus;
    progress: number;
    updatedAt: string;
    currentMilestone?: string | null;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    bucket: TaskBucket;
    priority: TaskPriority;
    updatedAt: string;
    project: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  ideas: Array<{
    id: string;
    title: string;
    description?: string | null;
    createdAt: string;
    project?: {
      id: string;
      name: string;
      slug: string;
    } | null;
  }>;
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

export interface MilestoneItem {
  id: string;
  projectId: string;
  title: string;
  progress: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  order: number;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  projectId?: string | null;
  type: string;
  title: string;
  description?: string | null;
  createdAt: string;
  project?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface NoteItem {
  id: string;
  projectId?: string | null;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    name: string;
    slug: string;
  } | null;
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
  databaseDesign?: string | null;
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
  milestones?: MilestoneItem[];
  activities?: ActivityItem[];
  notes?: NoteItem[];
}
