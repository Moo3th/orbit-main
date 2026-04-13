import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Solution } from '@/models/Solution';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET all solutions (admin sees all, public sees only active)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Check if this is an admin request (from admin panel)
    const url = new URL(request.url);
    const isAdminRequest = url.searchParams.get('admin') === 'true';
    
    const query = isAdminRequest ? {} : { isActive: true };
    const solutions = await Solution.find(query).sort({ order: 1 });
    return NextResponse.json({ solutions });
  } catch (error) {
    console.error('Error fetching solutions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new solution (Admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const body = await request.json();
    const solution = await Solution.create(body);

    return NextResponse.json({ solution }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating solution:', error);
    
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create solution', details: error.message },
      { status: 500 }
    );
  }
}

