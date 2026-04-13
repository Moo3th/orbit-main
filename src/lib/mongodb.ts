import mongoose from 'mongoose';

// ORBIT Database Connection
// ⚠️ IMPORTANT: This connects to the 'orbit' database, NOT 'markline'
// Make sure your .env.local has: MONGODB_URI=.../orbit?appName=...
// The database name is specified in the connection string (last part before ?)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/orbit';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB() {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('✅ MongoDB Connected');
        return mongoose;
      }).catch((error) => {
        cached.promise = null;
        console.error('❌ MongoDB Connection Error:', error);
        throw new Error(`MongoDB connection failed: ${error.message}`);
      });
    }

    try {
      cached.conn = await cached.promise;
    } catch (e) {
      cached.promise = null;
      throw e;
    }

    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    console.error('Database connection error:', errorMessage);
    throw new Error(`Database connection failed: ${errorMessage}. Please check your MONGODB_URI in .env.local`);
  }
}
