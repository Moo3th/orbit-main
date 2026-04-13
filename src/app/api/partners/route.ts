import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Partner } from '@/models/Partner';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET all partners (admin sees all, public sees only active)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const url = new URL(request.url);
    const isAdminRequest = url.searchParams.get('admin') === 'true';
    
    const query = isAdminRequest ? {} : { isActive: true };
    const partners = await Partner.find(query).sort({ order: 1 });
    
    // If no partners, return default ones
    if (partners.length === 0 && !isAdminRequest) {
      return NextResponse.json({ 
        success: true,
        partners: [
          {
            name: 'National Water Company',
            logo: '/trustedby/National_Water_Company_Logo_2021.png',
            isActive: true,
            order: 1
          },
          {
            name: 'Saudi Aramco',
            logo: '/trustedby/salogos.org-logo-1.svg',
            isActive: true,
            order: 2
          },
          {
            name: 'Water Company',
            logo: '/trustedby/salogos.org-شركة-المياه.svg',
            isActive: true,
            order: 3
          }
        ]
      });
    }
    
    return NextResponse.json({ success: true, partners });
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new partner (Admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const body = await request.json();
    const partner = await Partner.create(body);

    return NextResponse.json({ success: true, partner }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating partner:', error);
    
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create partner', details: error.message },
      { status: 500 }
    );
  }
}

