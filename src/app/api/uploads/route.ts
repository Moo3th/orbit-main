import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Upload } from '@/models/Upload';
import mongoose from 'mongoose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

// مستندات مسموحة لروابط «تحميل ملف» في التذييل (السياسات بصيغة PDF/Word).
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

// بعض المتصفحات ترسل نوعاً فارغاً أو عاماً — نقبل بالامتداد كخطة بديلة.
const ALLOWED_DOCUMENT_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt'];

const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const hasAllowedExtension = (name: string) =>
  ALLOWED_DOCUMENT_EXTENSIONS.some((ext) => name.toLowerCase().endsWith(ext));

const EXTENSION_CONTENT_TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.txt': 'text/plain',
};

const guessContentType = (name: string) => {
  const match = Object.entries(EXTENSION_CONTENT_TYPES).find(([ext]) => name.toLowerCase().endsWith(ext));
  return match ? match[1] : 'application/octet-stream';
};

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type) && !hasAllowedExtension(file.name || '')) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG, PDF, DOC, DOCX, TXT' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size: 10MB' }, { status: 400 });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const contentType = file.type || guessContentType(file.name || '');

    const db = mongoose.connection.db;
    if (!db) throw new Error('Database not connected');

    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'uploads'
    });

    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
      metadata: {
        originalName: file.name,
        folder,
        uploadedBy: 'admin'
      }
    });
    
    await new Promise<void>((resolve, reject) => {
      uploadStream.write(buffer, (err: Error | null | undefined) => {
        if (err) reject(err);
      });
      uploadStream.end((err: Error | null | undefined) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    const uploadDoc = await Upload.create({
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      folder,
      uploadedBy: 'admin'
    });
    
    return NextResponse.json({
      success: true,
      upload: {
        id: uploadDoc._id.toString(),
        filename,
        url: `/api/uploads/${filename}`,
        originalName: file.name,
        mimeType: file.type,
        size: file.size
      }
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    
    const uploads = await Upload.find(folder ? { folder } : {})
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      uploads: uploads.map(u => ({
        id: (u._id as mongoose.Types.ObjectId).toString(),
        filename: u.filename,
        url: `/api/uploads/${u.filename}`,
        originalName: u.originalName,
        mimeType: u.mimeType,
        size: u.size,
        folder: u.folder,
        createdAt: u.createdAt
      }))
    });
    
  } catch (error) {
    console.error('List uploads error:', error);
    return NextResponse.json({ error: 'Failed to list uploads' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename required' }, { status: 400 });
    }
    
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database not connected');
    
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'uploads'
    });
    
    const cursor = bucket.find({ filename });
    const files = await cursor.toArray();
    
    if (files.length === 0) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    await bucket.delete(files[0]._id);
    await Upload.deleteOne({ filename });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Delete upload error:', error);
    return NextResponse.json({ error: 'Failed to delete upload' }, { status: 500 });
  }
}
