// app/api/products/images/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { manufacturerImages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { deleteManufacturerImage } from '@/lib/actions/image-actions';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES_PER_PRODUCT = 10;
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
      
  try {
const session = await auth.api.getSession({
        headers: await headers()
    })
 if (!session || session.user.role !== 'admin') {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 } 
    const params = await context.params;
    
    // Получаем изображение
    const [image] = await db
      .select()
      .from(manufacturerImages)
      .where(eq(manufacturerImages.id, params.id));
    
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    
    // Удаляем из хранилища, если это загруженный файл
    if (image.storageType === 'upload' && image.storageKey) {
      await deleteManufacturerImage(image.storageKey);
    }
    
    // Удаляем из БД
    await db.delete(manufacturerImages).where(eq(manufacturerImages.id, params.id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }

}