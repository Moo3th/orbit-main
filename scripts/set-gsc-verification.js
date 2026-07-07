/**
 * One-off: set the Google Search Console verification token in the DB.
 * Writes SeoSettings(key:'primary').analytics.gscVerification — the exact field
 * that src/app/layout.tsx renders as <meta name="google-site-verification" ...>.
 *
 * Usage:
 *   node scripts/set-gsc-verification.js            # uses DEFAULT_TOKEN below
 *   node scripts/set-gsc-verification.js <token>    # override (token OR full <meta> tag)
 *
 * Reads MONGODB_URI from .env.local (Next.js convention), falling back to .env.
 * Run this against the PRODUCTION connection to make the tag live on corbit.sa.
 */
const mongoose = require('mongoose');
const path = require('path');

// .env.local first (takes precedence — dotenv never overrides an already-set var), then .env.
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
require('dotenv').config();

const DEFAULT_TOKEN = 'CjcO9Z1bKSrEBXFlhva2M8yHhW_4Mx04AOAvnzIUxeo';

let token = (process.argv[2] || DEFAULT_TOKEN).trim();
// Accept a pasted full <meta ...> tag too, mirroring layout.tsx's extraction.
const contentMatch = token.match(/content="([^"]+)"/);
if (contentMatch) token = contentMatch[1];

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set (checked .env.local and .env). Aborting.');
  process.exit(1);
}

// Loose schema + identical model name => Mongoose derives the SAME collection the app
// uses, so we read/write the real document. strict:false guarantees we never strip or
// clobber sibling fields; the $set below touches only the single dotted path.
const SeoSettings =
  mongoose.models.SeoSettings ||
  mongoose.model('SeoSettings', new mongoose.Schema({}, { strict: false, timestamps: true }));

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`✅ Connected   host=${mongoose.connection.host}   db=${mongoose.connection.name}`);

    const before = await SeoSettings.findOne({ key: 'primary' }).lean();
    if (!before) {
      console.error("❌ No SeoSettings document (key:'primary') found — aborting to avoid creating a partial doc.");
      console.error("   Open the site once (GET /api/seo/settings auto-creates it) or seed the CMS, then re-run.");
      await mongoose.disconnect();
      process.exit(1);
    }

    const prev = before?.analytics?.gscVerification || '(empty)';
    console.log(`ℹ️  Before   gscVerification = ${prev}`);

    if (prev === token) {
      console.log('✅ Already set to the requested token — nothing to change.');
      await mongoose.disconnect();
      process.exit(0);
    }

    const after = await SeoSettings.findOneAndUpdate(
      { key: 'primary' },
      { $set: { 'analytics.gscVerification': token } },
      { new: true }
    ).lean();

    console.log(`✅ After    gscVerification = ${after?.analytics?.gscVerification}`);
    console.log('ℹ️  The live site caches SEO settings (unstable_cache, revalidate: 60s),');
    console.log('   so the <meta> tag appears within ~60s. To force it now: re-save the SEO');
    console.log('   page in the admin panel, or redeploy.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed:', err?.message || err);
    try { await mongoose.disconnect(); } catch {}
    process.exit(1);
  }
})();
