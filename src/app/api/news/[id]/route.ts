import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { News } from '@/models/News';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Internal server error';

// GET single news by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const news = await News.findById(id);
    
    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ news });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update news by ID (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await connectDB();
    
    const news = await News.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ news });
  } catch (error: unknown) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { error: errorMessage(error) },
      { status: 500 }
    );
  }
}

// DELETE news by ID (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const news = await News.findByIdAndDelete(id);
    
    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'News deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: errorMessage(error) },
      { status: 500 }
    );
  }
}
