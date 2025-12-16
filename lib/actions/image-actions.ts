'use server'
import { db } from "@/db/drizzle";
import { productImages, ProductImage, categoryImages, CategoryImage, manufacturerImages, ManufacturerImage, newsImages, NewsImage} from "@/db/schema";
import { put, del } from '@vercel/blob';
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function createImage(image: Omit<ProductImage, "id" | "createdAt" | "updatedAt">) {
    try {
        await db.insert(productImages).values(image).returning();
    } catch (error) {
        console.error("Error creating image:", error);
        throw new Error("Failed to create image");
    }
}


export async function getProductImages(productId: string) {
    try {
        const images = await db.select().from(productImages).where(eq(productImages.productId, productId));
        return images;
    } catch (error) {
        console.error("Error fetching product images:", error);
        throw new Error("Failed to fetch product images");
    }
}
export async function getFeaturedImage(productId: string) {
    try {
        const image = await db.select().from(productImages).where(and(eq(productImages.productId, productId), eq(productImages.isFeatured, true))).limit(1);
        return image[0];
    } catch (error) {
        console.error("Error fetching featured image:", error);
        throw new Error("Failed to fetch featured image");
    }
}
export async function deleteImage(imageId: string) {
    try {
        await db.delete(productImages).where(eq(productImages.id, imageId));
    } catch (error) {
        console.error("Error deleting image:", error);
        throw new Error("Failed to delete image");
    }
}

export async function uploadProductImage(file: File) {
  // ✅ Проверяем права и выбрасываем ошибку
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  if (!session || session.user.role !== 'admin') {
    throw new Error('Unauthorized'); // или создайте кастомную ошибку
  }

  const blob = await put(`products/${Date.now()}-${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true,
  });
 
  return {
    url: blob.url,
    storageKey: blob.pathname,
  };
}
export async function deleteProductImage(storageKey: string) {
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
  await del(storageKey);
}
export async function uploadCategoryImage(file: File) {
    // ✅ Проверяем права и выбрасываем ошибку
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session || session.user.role !== 'admin') {
      throw new Error('Unauthorized'); // или создайте кастомную ошибку
    }
    
    const blob = await put(`categories/${Date.now()}-${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });
   
    return {
      url: blob.url,
      storageKey: blob.pathname,
    };
  }
  export async function deleteCategoryImage(storageKey: string) {
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    await del(storageKey);
      }
      export async function getCategoryImages(categoryId: string) {
        try {
            const images = await db.select().from(categoryImages).where(eq(categoryImages.categoryId, categoryId));
            return images;
        } catch (error) {
            console.error("Error fetching category images:", error);
            throw new Error("Failed to fetch category images");
        }
    }
    export async function getFeaturedCategoryImage(categoryId: string) {
        try {
            const image = await db.select().from(categoryImages).where(and(eq(categoryImages.categoryId, categoryId), eq(categoryImages.isFeatured, true))).limit(1);
            return image[0];
        } catch (error) {
            console.error("Error fetching featured category image:", error);
            throw new Error("Failed to fetch featured category image");
        }
    }
export async function uploadManufacturerImage(file: File) {
    // ✅ Проверяем права и выбрасываем ошибку
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session || session.user.role !== 'admin') {
      throw new Error('Unauthorized'); // или создайте кастомную ошибку
    }
    
    const blob = await put(`manufacturers/${Date.now()}-${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });
   
    return {
      url: blob.url,
      storageKey: blob.pathname,
    };
  }
  export async function deleteManufacturerImage(storageKey: string) {
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    await del(storageKey);
    }
    export async function getManufacturerImages(manufacturerId: string) {
        try {
            const images = await db.select().from(manufacturerImages).where(eq(manufacturerImages.manufacturerId, manufacturerId));
            return images;
        } catch (error) {
            console.error("Error fetching manufacturer images:", error);
            throw new Error("Failed to fetch manufacturer images");
        }
    }
    export async function getFeaturedManufacturerImage(manufacturerId: string) {
        try {
            const image = await db.select().from(manufacturerImages).where(and(eq(manufacturerImages.manufacturerId, manufacturerId), eq(manufacturerImages.isFeatured, true))).limit(1);
            return image[0];
        } catch (error) {
            console.error("Error fetching featured manufacturer image:", error);
            throw new Error("Failed to fetch featured manufacturer image");
        }
    }

export async function setFeaturedImage(imageId: string) {
  try {
    // ✅ Проверяем права
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || session.user.role !== 'admin') {
      return { error: 'Unauthorized' };
    }

    // ✅ Получаем информацию о выбранном изображении
    const [selectedImage] = await db
      .select()
      .from(productImages)
      .where(eq(productImages.id, imageId))
      .limit(1);

    if (!selectedImage) {
      return { error: 'Image not found' };
    }

    // ✅ Сбрасываем флаг featured у всех фото этого продукта
    await db
      .update(productImages)
      .set({ isFeatured: false })
      .where(
        and(
          eq(productImages.productId, selectedImage.productId),
          eq(productImages.isFeatured, true)
        )
      );

    // ✅ Устанавливаем новое featured фото
    const [updatedImage] = await db
      .update(productImages)
      .set({ isFeatured: true })
      .where(eq(productImages.id, imageId))
      .returning();

    return { success: true, image: updatedImage };
  } catch (error) {
    console.error('Set featured image error:', error);
    return { error: 'Failed to set featured image' };
  }
}
    export async function uploadNewsImage(file: File) {
        // ✅ Проверяем права и выбрасываем ошибку
        const session = await auth.api.getSession({
          headers: await headers()
        });
        
        if (!session || session.user.role !== 'admin') {
          throw new Error('Unauthorized'); // или создайте кастомную ошибку
        }
        
        const blob = await put(`news/${Date.now()}-${file.name}`, file, {
          access: 'public',
          addRandomSuffix: true,
        });
       
        return {
          url: blob.url,
          storageKey: blob.pathname,
        };
      }
      export async function deleteNewsImage(storageKey: string) {
        const session = await auth.api.getSession({
              headers: await headers()
            })
            if (!session || session.user.role !== 'admin') {
              return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        await del(storageKey);
        }
        export async function getNewsImages(newsId: string) {
            try {
                const images = await db.select().from(newsImages).where(eq(newsImages.newsId, newsId));
                return images;
            } catch (error) {
                console.error("Error fetching news images:", error);
                throw new Error("Failed to fetch news images");
            }
        }
        export async function getFeaturedNewsImage(newsId: string) {
            try {
                const image = await db.select().from(newsImages).where(and(eq(newsImages.newsId, newsId), eq(newsImages.isFeatured, true))).limit(1);
                return image[0];
            } catch (error) {
                console.error("Error fetching featured news image:", error);
                throw new Error("Failed to fetch featured news image");
            }
        }