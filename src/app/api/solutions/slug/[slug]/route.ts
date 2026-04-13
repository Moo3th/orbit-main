import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Solution } from '@/models/Solution';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET solution by slug (public, only returns active solutions)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    
    const { slug } = await params;
    
    const solution = await Solution.findOne({ 
      slug: slug,
      isActive: true 
    });

    if (!solution) {
      return NextResponse.json(
        { success: false, error: 'Solution not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, solution });
  } catch (error) {
    console.error('Error fetching solution:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
