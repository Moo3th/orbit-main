import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Upload } from '@/models/Upload';
import mongoose from 'mongoose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

// التخزين على GridFS (قاعدة البيانات) وليس نظام الملفات: نظام ملفات Vercel
// للقراءة فقط فالكتابة على القرص تفشل في الإنتاج. الرابط يُخدَم عبر
// /api/uploads/[filename]. المستدعون انتقلوا إلى مكتبة العميل المشتركة
// (src/lib/uploads/clientUpload.ts)، ويبقى هذا المسار متوافقاً للخلف:
// حقل "image" وشكل الرد { success, url, filename }.
export async function POST(request: Request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only image files are allowed.' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size: 10MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}-${safeName}`;

    const db = mongoose.connection.db;
    if (!db) throw new Error('Database not connected');

    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: file.type,
      metadata: { originalName: file.name, folder: 'logos', uploadedBy: 'admin' },
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

    await Upload.create({
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      folder: 'logos',
      uploadedBy: 'admin',
    });

    return NextResponse.json({
      success: true,
      url: `/api/uploads/${filename}`,
      filename,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
