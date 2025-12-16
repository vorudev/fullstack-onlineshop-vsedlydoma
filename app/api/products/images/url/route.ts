// app/api/products/images/url/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { productImages } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { productId, imageUrl, order, isFeatured } = body;

    // ✅ Если это featured фото, сбрасываем флаг у других фото этого продукта
    if (isFeatured) {
      await db
        .update(productImages)
        .set({ isFeatured: false })
        .where(
          and(
            eq(productImages.productId, productId),
            eq(productImages.isFeatured, true)
          )
        );
    }

    const [image] = await db.insert(productImages).values({
      productId,
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