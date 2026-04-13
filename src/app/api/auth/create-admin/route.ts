import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    try {
      await connectDB();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed. Please check your MongoDB connection.' },
        { status: 500 }
      );
    }

    try {
      // Check if admin already exists
      const adminExists = await User.findOne({ email: 'admin@orbit.com.sa' });
      
      if (adminExists) {
        return NextResponse.json(
          { 
            message: 'Admin user already exists',
            email: 'admin@orbit.com.sa',
            exists: true
          },
          { status: 200 }
        );
      }

      // Create admin user
      const admin = await User.create({
        email: 'admin@orbit.com.sa',
        password: 'Abd123#Abd',
        name: 'ORBIT Admin',
        role: 'admin',
      });

      return NextResponse.json({
        message: 'Admin user created successfully',
        email: admin.email,
        name: admin.name,
        password: 'Abd123#Abd', // Show password only on creation
        note: 'Please change this password after first login for security',
      });
    } catch (dbError: any) {
      console.error('Database query error:', dbError);
      
      // Handle duplicate key error
      if (dbError.code === 11000) {
        return NextResponse.json(
          { 
            error: 'Admin user already exists',
            email: 'admin@orbit.com.sa'
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to create admin user', details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Create admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to check if admin exists
export async function GET() {
  try {
    try {
      await connectDB();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed. Please check your MongoDB connection.' },
        { status: 500 }
      );
    }

    try {
      const admin = await User.findOne({ email: 'admin@orbit.com.sa' });
      
      if (admin) {
        return NextResponse.json({
          exists: true,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        });
      }

      return NextResponse.json({
        exists: false,
        message: 'Admin user does not exist. Use POST to create it.',
      });
    } catch (dbError: any) {
      console.error('Database query error:', dbError);
      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Check admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}



