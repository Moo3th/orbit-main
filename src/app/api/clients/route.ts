import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Client } from '@/models/Client';
import { requireAdmin } from '@/lib/auth';

// GET all clients - ROBUST: Returns only active clients
export async function GET() {
  try {
    await connectDB();
    // Only return active clients for frontend display
    const clients = await Client.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    
    console.log(`[API] Found ${clients.length} active clients`); // Debug log
    
    return NextResponse.json({ clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new client (Admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    
    // Auto-generate slug if not provided
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    await connectDB();
    
    const client = await Client.create(body);
    return NextResponse.json({ client }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized - Admin access required' ? 401 : 500 }
    );
  }
}

