import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import {
  findProjectDatabaseFiles,
  parsePrismaSchema,
  parseSqlSchema,
  generateErdMermaid,
  getDatabaseTemplate,
  DatabaseDesignResult,
} from '@/lib/database-parser';
import { parseTechStack } from '@/lib/utils';

export const dynamic = 'force-dynamic';

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

    const tech = parseTechStack(project.techStack);
    const dbTechs = (tech.database || []).filter(
      (d) => !/localstorage|in-memory|content graph|none/i.test(d.toLowerCase())
    );
    const hasDbInTechStack = dbTechs.length > 0;

    // 1. Check if databaseDesign is explicitly stored in DB
    if (project.databaseDesign && project.databaseDesign.trim()) {
      const content = project.databaseDesign.trim();
      let parsed;

      if (content.includes('model ') && content.includes('{')) {
        parsed = parsePrismaSchema(content);
        return NextResponse.json({
          hasDatabase: true,
          engine: parsed.engine,
          filePath: null,
          rawContent: content,
          format: 'prisma',
          tables: parsed.tables,
          erdMermaid: parsed.erdMermaid,
          sourceType: 'database',
        } as DatabaseDesignResult);
      } else if (/CREATE\s+TABLE/i.test(content)) {
        parsed = parseSqlSchema(content);
        return NextResponse.json({
          hasDatabase: true,
          engine: parsed.engine,
          filePath: null,
          rawContent: content,
          format: 'sql',
          tables: parsed.tables,
          erdMermaid: parsed.erdMermaid,
          sourceType: 'database',
        } as DatabaseDesignResult);
      } else if (content.startsWith('erDiagram')) {
        return NextResponse.json({
          hasDatabase: true,
          engine: dbTechs[0] || 'Relational Database',
          filePath: null,
          rawContent: content,
          format: 'mermaid',
          tables: [],
          erdMermaid: content,
          sourceType: 'database',
        } as DatabaseDesignResult);
      }
    }

    // 2. Search local disk files
    const localFile = findProjectDatabaseFiles(
      project.folderPath,
      project.slug,
      project.backendPath
    );

    if (localFile) {
      if (localFile.format === 'prisma') {
        const parsed = parsePrismaSchema(localFile.content);
        return NextResponse.json({
          hasDatabase: true,
          engine: parsed.engine,
          filePath: localFile.filePath,
          rawContent: localFile.content,
          format: 'prisma',
          tables: parsed.tables,
          erdMermaid: parsed.erdMermaid,
          sourceType: 'disk',
        } as DatabaseDesignResult);
      } else if (localFile.format === 'sql') {
        const parsed = parseSqlSchema(localFile.content);
        return NextResponse.json({
          hasDatabase: true,
          engine: parsed.engine,
          filePath: localFile.filePath,
          rawContent: localFile.content,
          format: 'sql',
          tables: parsed.tables,
          erdMermaid: parsed.erdMermaid,
          sourceType: 'disk',
        } as DatabaseDesignResult);
      } else if (localFile.format === 'sqlite') {
        return NextResponse.json({
          hasDatabase: true,
          engine: 'SQLite (Local Database)',
          filePath: localFile.filePath,
          rawContent: localFile.content,
          format: 'sql',
          tables: [],
          erdMermaid: `erDiagram
    SQLITE_DATABASE {
        string file "${localFile.filePath}"
        string status "Active SQLite database file"
    }`,
          sourceType: 'disk',
        } as DatabaseDesignResult);
      }
    }

    // 3. Fallback: If techStack mentions database, provide starter schema
    if (hasDbInTechStack) {
      const defaultEngine = dbTechs.join(', ');
      const template = project.slug.includes('pos')
        ? getDatabaseTemplate('pos')
        : project.slug.includes('ecommerce') || project.slug.includes('atelier')
        ? getDatabaseTemplate('ecommerce')
        : getDatabaseTemplate('saas');

      const parsed =
        template.format === 'prisma'
          ? parsePrismaSchema(template.rawContent)
          : parseSqlSchema(template.rawContent);

      return NextResponse.json({
        hasDatabase: true,
        engine: defaultEngine,
        filePath: null,
        rawContent: template.rawContent,
        format: template.format,
        tables: parsed.tables,
        erdMermaid: parsed.erdMermaid,
        sourceType: 'generated',
      } as DatabaseDesignResult);
    }

    // No database found
    return NextResponse.json({
      hasDatabase: false,
      engine: 'None',
      filePath: null,
      rawContent: '',
      format: 'none',
      tables: [],
      erdMermaid: '',
      sourceType: 'none',
    } as DatabaseDesignResult);
  } catch (error: any) {
    console.error('Error fetching database design:', error);
    return NextResponse.json(
      { error: 'Failed to fetch database design', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { content, filePath, saveToDisk } = body;

    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Save to database
    await prisma.project.update({
      where: { id: project.id },
      data: { databaseDesign: content },
    });

    // Optionally save to disk if file path exists
    let savedToDisk = false;
    if (saveToDisk && filePath && fs.existsSync(filePath)) {
      try {
        fs.writeFileSync(filePath, content, 'utf8');
        savedToDisk = true;
      } catch (err) {
        console.error('Failed to write schema to disk:', err);
      }
    }

    return NextResponse.json({
      success: true,
      savedToDisk,
      message: 'Database design saved successfully',
    });
  } catch (error: any) {
    console.error('Error updating database design:', error);
    return NextResponse.json(
      { error: 'Failed to update database design', details: error.message },
      { status: 500 }
    );
  }
}
