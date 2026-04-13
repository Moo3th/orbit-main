import mongoose from 'mongoose';

export const LEGACY_COLLECTIONS = [
  'mainpagesettings',
  'categories',
  'clients',
  'clientinquiries',
  'contacts',
  'offers',
  'packages',
  'pagecontents',
  'partners',
  'solutions',
] as const;

export interface LegacyCleanupEntry {
  collection: string;
  existingCount: number;
  deletedCount: number;
  skipped: boolean;
}

export interface LegacyCleanupResult {
  entries: LegacyCleanupEntry[];
  totalDeleted: number;
}

export async function cleanupLegacyCollections(
  collections: readonly string[] = LEGACY_COLLECTIONS
): Promise<LegacyCleanupResult> {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('MongoDB connection is not ready');
  }

  const existingCollections = new Set(
    (await db.listCollections({}, { nameOnly: true }).toArray()).map((item) => item.name)
  );

  const entries: LegacyCleanupEntry[] = [];
  let totalDeleted = 0;

  for (const collection of collections) {
    if (!existingCollections.has(collection)) {
      entries.push({
        collection,
        existingCount: 0,
        deletedCount: 0,
        skipped: true,
      });
      continue;
    }

    const target = db.collection(collection);
    const existingCount = await target.countDocuments({});
    const result = existingCount > 0 ? await target.deleteMany({}) : { deletedCount: 0 };
    const deletedCount = typeof result.deletedCount === 'number' ? result.deletedCount : 0;
    totalDeleted += deletedCount;

    entries.push({
      collection,
      existingCount,
      deletedCount,
      skipped: false,
    });
  }

  return { entries, totalDeleted };
}
