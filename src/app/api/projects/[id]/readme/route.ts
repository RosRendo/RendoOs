import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function findProjectReadme(folderPath: string | null, slug: string): string | null {
  const candidates: string[] = [];

  // 1. Highest priority: Known project root paths
  const workspaceRoot = 'D:\\FOR RENDO (ONLY )\\Personal Project';
  const slugFolders: Record<string, string[]> = {
    'orchestrator': [path.join(workspaceRoot, 'Orchestrator', 'README.md')],
    'journex': [path.join(workspaceRoot, 'Dashboard', 'README.md')],
    'service-finder': [path.join(workspaceRoot, 'Service_Finder', 'README.md')],
    'stackgen': [path.join(workspaceRoot, 'Stackgen', 'README.md')],
    'cv-gen': [path.join(workspaceRoot, 'CV-Gen', 'README.md')],
    'pos-system': [path.join(workspaceRoot, 'POS_SYSTEM', 'README.md')],
    'private-tutor': [path.join(workspaceRoot, 'PrivateTutor', 'README.md')],
    'ai-command-agent': [path.join(workspaceRoot, 'AI-Command-Agent', 'README.md')],
    'estatex': [path.join(workspaceRoot, 'Real-Estate', 'README.md')],
    'jarvis': ['D:\\FOR RENDO (ONLY )\\JARVIS\\README.md'],
    'portfolio': ['D:\\FOR RENDO (ONLY )\\Portfolio\\README.md'],
    'atelier-ecommerce': ['D:\\FOR RENDO (ONLY )\\Ecommerce\\Ecommerce\\README.md'],
    'techtune-healer': ['D:\\CamtechUniversity\\ProgrammingYearIII\\techtune-healer\\README.md'],
  };

  if (slugFolders[slug]) {
    candidates.push(...slugFolders[slug]);
  }

  // 2. Parent directory of folderPath (if folderPath is inside frontend, admin-web, etc.)
  if (folderPath) {
    const parent = path.dirname(folderPath);
    candidates.push(path.join(parent, 'README.md'));
    candidates.push(path.join(parent, 'readme.md'));

    const grandParent = path.dirname(parent);
    candidates.push(path.join(grandParent, 'README.md'));

    // 3. folderPath itself
    candidates.push(path.join(folderPath, 'README.md'));
    candidates.push(path.join(folderPath, 'readme.md'));
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const readmePath = findProjectReadme(project.folderPath, project.slug);

    if (readmePath && fs.existsSync(readmePath)) {
      const content = fs.readFileSync(readmePath, 'utf8');
      return NextResponse.json({
        content,
        filePath: readmePath,
        exists: true,
      });
    }

    // Fallback: Generate a clean markdown based on project info
    const fallbackMarkdown = `# ${project.name}

> ${project.description || 'No description provided.'}

---

## ⚡ Overview
${project.overview || project.description || 'Project managed within RendoOs.'}

---

## 🚀 Current Milestone
- **Milestone**: ${project.currentMilestone || 'Under active development'}
- **Status**: ${project.status} (${project.progress}%)
- **Health**: ${project.health}

---

## 🔗 Links & Resources
- **GitHub Repository**: ${project.repoUrl || 'Local project'}
- **Directory Path**: \`${project.folderPath || 'Not set'}\`
`;

    return NextResponse.json({
      content: fallbackMarkdown,
      filePath: null,
      exists: false,
    });
  } catch (error) {
    console.error('Error reading README:', error);
    return NextResponse.json({ error: 'Failed to read README' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { content } = body;

    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    let readmePath = findProjectReadme(project.folderPath, project.slug);

    if (!readmePath) {
      // Determine default save path
      const baseDir = project.folderPath
        ? (project.folderPath.endsWith('frontend') ? path.dirname(project.folderPath) : project.folderPath)
        : null;

      if (!baseDir || !fs.existsSync(baseDir)) {
        return NextResponse.json(
          { error: 'Cannot determine project directory on disk to save README' },
          { status: 400 }
        );
      }
      readmePath = path.join(baseDir, 'README.md');
    }

    fs.writeFileSync(readmePath, content, 'utf8');

    return NextResponse.json({
      success: true,
      content,
      filePath: readmePath,
      exists: true,
    });
  } catch (error) {
    console.error('Error writing README:', error);
    return NextResponse.json({ error: 'Failed to save README' }, { status: 500 });
  }
}
