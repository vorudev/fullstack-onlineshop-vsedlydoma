// app/api/products/images/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { productImages } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { uploadProductImage } from '@/lib/actions/image-actions';
import { and, eq } from 'drizzle-orm';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES_PER_PRODUCT = 10;
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const productId = formData.get('productId') as string;
    const order = parseInt(formData.get('order') as string) || 0;
    const isFeatured = formData.get('isFeatured') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' }, 
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` }, 
        { status: 400 }
      );
    }

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

    // Загружаем файл
    const { url, storageKey } = await uploadProductImage(file);

    // Сохраняем в БД
    const [image] = await db.insert(productImages).values({
      productId,
      imageUrl: url,
      storageType: 'upload',
      storageKey,
      order,
      isFeatured,
    }).returning();

    return NextResponse.json(image);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}