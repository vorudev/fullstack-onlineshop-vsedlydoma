// app/api/products/images/url/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { newsImages } from '@/db/schema';

export async function POST(req: NextRequest) {
  try {
        const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    const body = await req.json();
    const { newsId, imageUrl, order, isFeatured } = body;

    const [image] = await db.insert(newsImages).values({
      newsId,
      imageUrl,
      storageType: 'url',
      storageKey: null,
      order: order || 0,
      isFeatured: isFeatured || false,
    }).returning();

    return NextResponse.json(image);
  } catch (error) {
    console.error('URL save error:', error);
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}