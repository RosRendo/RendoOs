import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const notes = await (prisma as any).note.findMany({
      where: projectId ? { projectId } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, title, content } = body;

    if (!title && !content) {
      return NextResponse.json({ error: 'title or content is required' }, { status: 400 });
    }

    const noteTitle = (title || content.slice(0, 40)).trim();

    const note = await (prisma as any).note.create({
      data: {
        projectId: projectId || null,
        title: noteTitle,
        content: content ? content.trim() : '',
      },
      include: {
        project: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    // Log activity
    await (prisma as any).activity.create({
      data: {
        projectId: projectId || null,
        type: 'NOTE_CREATED',
        title: `Logged note: ${noteTitle}`,
      },
    }).catch(() => {});

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 });
    }

    await (prisma as any).note.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
