import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { HealthStatus, TechStackData } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Map of known tech → category
const TECH_CATEGORIES: Record<string, keyof TechStackData> = {
  // Frontend frameworks / libraries
  'React': 'frontend', 'Next.js': 'frontend', 'Vue': 'frontend', 'Nuxt': 'frontend',
  'Svelte': 'frontend', 'SvelteKit': 'frontend', 'Angular': 'frontend', 'Remix': 'frontend',
  'Astro': 'frontend', 'Vite': 'frontend', 'Webpack': 'frontend', 'Parcel': 'frontend',
  'Tailwind CSS': 'frontend', 'TailwindCSS': 'frontend', 'Bootstrap': 'frontend',
  'Sass': 'frontend', 'SCSS': 'frontend', 'CSS': 'frontend', 'HTML': 'frontend',
  'TypeScript': 'frontend', 'JavaScript': 'frontend', 'Three.js': 'frontend',
  'GSAP': 'frontend', 'Framer Motion': 'frontend', 'Motion': 'frontend',
  'Radix UI': 'frontend', 'shadcn/ui': 'frontend', 'Lucide': 'frontend',
  'Zustand': 'frontend', 'Redux': 'frontend', 'MobX': 'frontend', 'Jotai': 'frontend',
  'React Query': 'frontend', 'SWR': 'frontend', 'Electron': 'frontend',
  'Tauri': 'frontend', 'React Native': 'frontend', 'Expo': 'frontend',
  'Figma': 'frontend', 'Storybook': 'frontend', 'styled-components': 'frontend',
  'Chakra UI': 'frontend', 'Material UI': 'frontend', 'Ant Design': 'frontend',

  // Backend frameworks / runtimes
  'Node.js': 'backend', 'NestJS': 'backend', 'Express': 'backend', 'Fastify': 'backend',
  'Koa': 'backend', 'Hapi': 'backend', 'Django': 'backend', 'Flask': 'backend',
  'FastAPI': 'backend', 'Laravel': 'backend', 'Spring Boot': 'backend', 'Rails': 'backend',
  'Ruby on Rails': 'backend', 'Go': 'backend', 'Golang': 'backend', 'Rust': 'backend',
  'Python': 'backend', 'PHP': 'backend', 'Java': 'backend', 'Kotlin': 'backend',
  'C#': 'backend', '.NET': 'backend', 'ASP.NET': 'backend', 'GraphQL': 'backend',
  'REST': 'backend', 'gRPC': 'backend', 'tRPC': 'backend', 'WebSocket': 'backend',
  'JWT': 'backend', 'OAuth': 'backend', 'Passport.js': 'backend',
  'Bull': 'backend', 'BullMQ': 'backend', 'Cron': 'backend', 'Socket.io': 'backend',
  'Prisma': 'backend', 'Drizzle': 'backend', 'TypeORM': 'backend', 'Sequelize': 'backend',
  'Mongoose': 'backend', 'Axios': 'backend', 'Zod': 'backend',

  // Databases
  'PostgreSQL': 'database', 'MySQL': 'database', 'SQLite': 'database', 'MariaDB': 'database',
  'MongoDB': 'database', 'Redis': 'database', 'DynamoDB': 'database', 'Cassandra': 'database',
  'Supabase': 'database', 'PlanetScale': 'database', 'CockroachDB': 'database',
  'Turso': 'database', 'Neon': 'database', 'Fauna': 'database', 'Firebase': 'database',
  'Firestore': 'database', 'Elasticsearch': 'database', 'ClickHouse': 'database',
  'TimescaleDB': 'database', 'Pinecone': 'database', 'Weaviate': 'database',

  // Infrastructure / DevOps / Cloud
  'Docker': 'infrastructure', 'Kubernetes': 'infrastructure', 'k8s': 'infrastructure',
  'AWS': 'infrastructure', 'GCP': 'infrastructure', 'Azure': 'infrastructure',
  'Vercel': 'infrastructure', 'Netlify': 'infrastructure', 'Railway': 'infrastructure',
  'Render': 'infrastructure', 'Fly.io': 'infrastructure', 'Heroku': 'infrastructure',
  'DigitalOcean': 'infrastructure', 'Cloudflare': 'infrastructure', 'Nginx': 'infrastructure',
  'GitHub Actions': 'infrastructure', 'GitLab CI': 'infrastructure', 'CircleCI': 'infrastructure',
  'Terraform': 'infrastructure', 'Ansible': 'infrastructure', 'Pulumi': 'infrastructure',
  'Kafka': 'infrastructure', 'RabbitMQ': 'infrastructure', 'NATS': 'infrastructure',
  'Prometheus': 'infrastructure', 'Grafana': 'infrastructure', 'Sentry': 'infrastructure',
  'Datadog': 'infrastructure', 'New Relic': 'infrastructure', 'OpenTelemetry': 'infrastructure',
  'GitHub': 'infrastructure', 'Git': 'infrastructure',

  // AI & Machine Learning
  'OpenAI': 'ai', 'Anthropic': 'ai', 'Claude': 'ai', 'Gemini': 'ai', 'ChatGPT': 'ai',
  'LangChain': 'ai', 'LlamaIndex': 'ai', 'Ollama': 'ai', 'Hugging Face': 'ai', 'HuggingFace': 'ai',
  'DeepSeek': 'ai', 'Whisper': 'ai', 'PyTorch': 'ai', 'TensorFlow': 'ai', 'vLLM': 'ai',
  'CrewAI': 'ai', 'AutoGen': 'ai', 'Transformers': 'ai', 'Vector DB': 'ai',

  // External Services & APIs
  'Stripe': 'services', 'PayPal': 'services', 'ABA PayWay': 'services', 'ABA Bank': 'services',
  'Twilio': 'services', 'SendGrid': 'services', 'Resend': 'services', 'Clerk': 'services',
  'Auth0': 'services', 'Google Maps': 'services', 'Cloudinary': 'services',
  'Pusher': 'services', 'PostHog': 'services', 'Mixpanel': 'services', 'Algolia': 'services',
};

export function parseTechStack(raw?: string | null): TechStackData {
  const empty: TechStackData = { frontend: [], backend: [], database: [], infrastructure: [], ai: [], services: [] };
  if (!raw) return empty;

  try {
    const parsed = JSON.parse(raw);

    // If it's already a categorized object, return it as-is
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return {
        frontend: parsed.frontend || [],
        backend: parsed.backend || [],
        database: parsed.database || [],
        infrastructure: parsed.infrastructure || [],
        ai: parsed.ai || parsed.AI || [],
        services: parsed.services || parsed.externalServices || [],
      };
    }

    // If it's a flat array, auto-categorize each entry
    if (Array.isArray(parsed)) {
      const result: Record<string, string[]> = { frontend: [], backend: [], database: [], infrastructure: [], ai: [], services: [] };
      for (const tech of parsed as string[]) {
        // Try exact match first, then case-insensitive
        const cat =
          TECH_CATEGORIES[tech] ??
          TECH_CATEGORIES[Object.keys(TECH_CATEGORIES).find(
            (k) => k.toLowerCase() === tech.toLowerCase()
          ) ?? ''];
        if (cat && result[cat]) {
          result[cat].push(tech);
        } else {
          // Unknown tech: default to frontend
          result['frontend'].push(tech);
        }
      }
      return result;
    }

    return empty;
  } catch {
    // Raw string fallback — treat as a single frontend tech
    return { frontend: [raw], backend: [], database: [], infrastructure: [], ai: [], services: [] };
  }
}

export function calculateProjectHealth(project: {
  status: string;
  updatedAt?: string | Date;
  blockers?: { resolved: boolean }[];
  tasks?: { status: string; dueDate?: string | Date | null }[];
}): HealthStatus {
  // If project is archived or paused
  if (project.status === 'ARCHIVED' || project.status === 'PAUSED') {
    return 'INACTIVE';
  }

  // If there are unresolved blockers -> BLOCKED
  const hasUnresolvedBlockers = project.blockers?.some((b) => !b.resolved);
  if (hasUnresolvedBlockers) return 'BLOCKED';

  // Check days since last update
  const now = Date.now();
  if (project.updatedAt) {
    const updated = new Date(project.updatedAt).getTime();
    const daysSinceUpdate = (now - updated) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate >= 21) {
      return 'INACTIVE';
    }
    if (project.status === 'ACTIVE' && daysSinceUpdate >= 7) {
      return 'ATTENTION';
    }
  }

  // Check overdue tasks -> ATTENTION
  const hasOverdueTasks = project.tasks?.some(
    (t) => t.status === 'TODO' && t.dueDate && new Date(t.dueDate).getTime() < now
  );
  if (hasOverdueTasks) {
    return 'ATTENTION';
  }

  return 'HEALTHY';
}

export function getHealthBadge(health: HealthStatus) {
  switch (health) {
    case 'BLOCKED':
      return {
        label: 'Blocked',
        dotColor: 'bg-rose-500',
        textColor: 'text-rose-400',
        bgColor: 'bg-rose-500/10 border-rose-500/20',
        indicator: '🔴',
      };
    case 'ATTENTION':
      return {
        label: 'Needs Attention',
        dotColor: 'bg-amber-400',
        textColor: 'text-amber-400',
        bgColor: 'bg-amber-400/10 border-amber-400/20',
        indicator: '🟡',
      };
    case 'INACTIVE':
      return {
        label: 'Inactive',
        dotColor: 'bg-zinc-400',
        textColor: 'text-zinc-400',
        bgColor: 'bg-zinc-500/10 border-zinc-500/20',
        indicator: '⚪',
      };
    case 'HEALTHY':
    default:
      return {
        label: 'Healthy',
        dotColor: 'bg-emerald-400',
        textColor: 'text-emerald-400',
        bgColor: 'bg-emerald-400/10 border-emerald-400/20',
        indicator: '🟢',
      };
  }
}

export function getStatusBadge(status: string) {
  switch (status) {
    case 'ACTIVE':
      return {
        label: 'ACTIVE',
        dotColor: 'bg-emerald-500',
        textColor: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10 border-emerald-500/30',
      };
    case 'EXPERIMENT':
      return {
        label: 'EXPERIMENT',
        dotColor: 'bg-violet-400',
        textColor: 'text-violet-300',
        bgColor: 'bg-violet-500/10 border-violet-500/30',
      };
    case 'PAUSED':
      return {
        label: 'PAUSED',
        dotColor: 'bg-amber-400',
        textColor: 'text-amber-300',
        bgColor: 'bg-amber-500/10 border-amber-500/30',
      };
    case 'ARCHIVED':
      return {
        label: 'ARCHIVED',
        dotColor: 'bg-zinc-500',
        textColor: 'text-zinc-400',
        bgColor: 'bg-zinc-800/60 border-zinc-700/40',
      };
    case 'IDEA':
      return {
        label: 'IDEA',
        dotColor: 'bg-sky-400',
        textColor: 'text-sky-300',
        bgColor: 'bg-sky-500/10 border-sky-500/30',
      };
    default:
      return {
        label: status,
        dotColor: 'bg-zinc-400',
        textColor: 'text-zinc-300',
        bgColor: 'bg-zinc-800 border-zinc-700',
      };
  }
}

export function formatTimeAgo(dateString?: string | Date | null) {
  if (!dateString) return 'recently';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
