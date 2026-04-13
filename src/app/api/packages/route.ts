import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Package } from '@/models/Package';

export async function GET() {
  try {
    await connectDB();
    
    const packages = await Package.find({}).sort({ order: 1, createdAt: -1 });

    return NextResponse.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    // Get the highest order number and increment
    const lastPackage = await Package.findOne().sort({ order: -1 });
    const order = lastPackage ? lastPackage.order + 1 : 1;

    const newPackage = await Package.create({
      ...data,
      order,
    });

    return NextResponse.json(newPackage, { status: 201 });
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json(
      { error: 'Failed to create package' },
      { status: 500 }
    );
  }
}

