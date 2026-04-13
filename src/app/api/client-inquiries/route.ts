import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ClientInquiry from '@/models/ClientInquiry';

export async function GET() {
  try {
    await connectDB();
    const inquiries = await ClientInquiry.find().sort({ createdAt: -1 });
    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error('Error fetching client inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    // Add type if not provided
    if (!data.type) {
      data.type = 'quote'; // Default to quote for request-quote forms
    }

    const inquiry = await ClientInquiry.create(data);

    return NextResponse.json(
      { message: 'Inquiry submitted successfully', inquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating client inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}

