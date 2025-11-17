import { useState } from "react";

interface ProductUnited {
   
  productDetails: {
    id: string;
    title: string;
    description: string;
    price: number;
    sku: string | null;
    slug: string;
    inStock: string | null;
    categoryId: string | null;
    manufacturerId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    images: {
        id: string;
        productId: string;
        imageUrl: string;
        storageType: string;
        storageKey: string | null;
        order: number | null;
        isFeatured: boolean | null;
        createdAt: Date | null;
    }[];
    reviews: {
        id: string;
        product_id: string;
        user_id: string | null;
        rating: number;
        comment: string | null;
        status: string;
        author_name: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }[];
    averageRating: number;
    reviewCount: number;
 attributes: {
            id: string | null;
            categoryId: string | null;
            name: string | null;
            value: string | null;
            order: number | null;
            slug: string | null;
        }[];
 manufacturer: {
    images: never[] | {
        id: string;
        manufacturerId: string;
        imageUrl: string;
        storageType: string;
        storageKey: string | null;
        order: number | null;
        isFeatured: boolean | null;
        createdAt: Date | null;
    }[];
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
} | null
} 


}
export default function MobileAtributes({productDetails}: ProductUnited) {
      const [maxVisible] = useState(8);
      const visibleAttributes = productDetails?.attributes.slice(0, maxVisible) || [];
      const hasMore = productDetails?.attributes.length > maxVisible;
    return (
        <div className="flex flex-col gap-3 block lg:hidden">
      <h3 className="text-sm text-gray-900 font-semibold mb-3">
        Характеристики:
      </h3>
        
        <div className="max-w-[150px]">
        <div className="">
          {visibleAttributes.map((attr, index) => (
            <div
              key={attr.id || attr.slug || index}
              className="grid grid-cols-[minmax(200px,1fr)_minmax(150px,1fr)] text-[14px]  gap-10 py-1"
            >
              <div className="text-gray-500 font-medium break-words">
                {attr.name || 'Не указано'}
              </div>
              <div className="text-black text-start text-right break-words">
                {attr.value || '—'}
              </div>
            </div>
          ))} 
          {hasMore && (
            <button className="text-blue-600 font-semibold text-[14px]">
              Показать все
            </button>
          )}
        </div>
      </div>
    </div>
    )
}