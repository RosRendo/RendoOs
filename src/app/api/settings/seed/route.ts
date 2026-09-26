import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST() {
  try {
    const { stdout, stderr } = await execPromise('node prisma/seed.js', {
      cwd: process.cwd(),
    });
    return NextResponse.json({ success: true, message: 'Database reseeded successfully', stdout });
  } catch (error: any) {
    console.error('Reseed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
