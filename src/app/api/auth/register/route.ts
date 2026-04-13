import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // Registration is disabled for ORBIT - only admin@orbit.com.sa can access
  // New users must be created by existing admin through admin panel
  return NextResponse.json(
    { error: 'Registration is disabled. Please contact the administrator.' },
    { status: 403 }
  );
}

