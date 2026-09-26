import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Unset primary on all projects
    await prisma.project.updateMany({
      data: { isPrimary: false },
    });

    // Set this project as primary
    const updated = await prisma.project.update({
      where: { id },
      data: { isPrimary: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error setting primary project:', error);
    return NextResponse.json({ error: 'Failed to set primary project' }, { status: 500 });
  }
}
