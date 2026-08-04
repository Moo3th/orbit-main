import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    await connectDB();
    
    const { filename } = await params;
    
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
    }
    
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'uploads'
    });
    
    const cursor = bucket.find({ filename });
    const files = await cursor.toArray();
    
    if (files.length === 0) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    const file = files[0];
    
    const downloadStream = bucket.openDownloadStream(file._id as mongoose.Types.ObjectId);
    
    const chunks: Buffer[] = [];
    
    await new Promise<void>((resolve, reject) => {
      downloadStream.on('data', (chunk: Buffer) => chunks.push(chunk));
      downloadStream.on('error', reject);
      downloadStream.on('end', resolve);
    });
    
    const buffer = Buffer.concat(chunks);

    const headers: Record<string, string> = {
      'Content-Type': file.contentType || 'application/octet-stream',
      'Content-Length': buffer.length.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable',
    };

    // ‏?download=1 يجبر المتصفح على تنزيل الملف بدل عرضه (مهم لروابط PDF في
    // التذييل). نستعمل الاسم الأصلي — وترميز RFC 5987 يحفظ الأسماء العربية.
    if (request.nextUrl.searchParams.get('download') === '1') {
      const originalName = (file.metadata?.originalName as string | undefined) || filename;
      const asciiName = originalName.replace(/[^\x20-\x7E]/g, '_').replace(/["\\]/g, '_');
      headers['Content-Disposition'] =
        `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(originalName)}`;
    }

    return new NextResponse(buffer, { headers });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}
