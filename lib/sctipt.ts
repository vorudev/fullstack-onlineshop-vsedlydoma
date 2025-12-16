// scripts/create-index.ts
import { neon } from '@neondatabase/serverless';
import { db } from '@/db/drizzle';
const sql = neon(process.env.DATABASE_URL!);
 
async function createIndex() {
  try {
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS "product_images_unique_featured_idx" 
      ON "product_images" ("product_id") 
      WHERE "is_featured" = true
    `;
    console.log('✅ Index created successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createIndex();