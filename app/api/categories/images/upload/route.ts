// app/api/products/images/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { categoryImages } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { uploadCategoryImage } from '@/lib/actions/image-actions';

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
    const categoryId = formData.get('categoryId') as string;
    const order = parseInt(formData.get('order') as string) || 0;
    const isFeatured = formData.get('isFeatured') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' }, 
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
    // Загружаем файл
    const { url, storageKey } = await uploadCategoryImage(file);

    // Сохраняем в БД
    const [image] = await db.insert(categoryImages).values({
      categoryId,
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