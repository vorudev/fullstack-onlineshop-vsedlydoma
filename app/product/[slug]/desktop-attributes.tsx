import { useState } from "react";

interface  Product{
  product: {
    id: string;
    categoryId: string | null;
    inStock: string | null;
    price: number;
    isActive: boolean | null;
    slug: string;
    title: string;
    description: string;
    keywords: string | null;
    manufacturerId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    sku: string | null;
} 
  productImages: {
    id: string;
    productId: string;
    imageUrl: string;
    storageType: string;
    storageKey: string | null;
    order: number | null;
    isFeatured: boolean | null;
    createdAt: Date | null;
}[]
reviews: {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  status: string;
  author_name: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}[]
attributes: {
  id: string;
  productId: string;
  name: string;
  value: string;
  order: number | null;
  slug: string;
  createdAt: Date | null;
}[]
manufacturer: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
manufacturerImages: {
  id: string;
  manufacturerId: string;
  imageUrl: string;
  storageType: string;
  storageKey: string | null;
  order: number | null;
  isFeatured: boolean | null;
  createdAt: Date | null;
}[]
internals: { 
  slug: string;
  currentLimit: number;
}
}

export default function DesktopAtributes({product, attributes}: Product) {
    
    return (
        <div className=" flex-col gap-3 lg:block hidden" id="target-component">
{attributes.length > 0 ? (
  <div className="grid grid-cols-2 gap-x-8">
    <div>
      {attributes.slice(0, Math.ceil(attributes.length / 2)).map((attr, index) => (
        <div
          key={attr.id || attr.slug || index}
          className="grid grid-cols-[minmax(200px,1fr)_minmax(150px,1fr)] text-[14px] gap-10 py-1"
        >
          <div className="text-gray-500 font-medium break-words">
            {attr.name || 'Не указано'}
          </div>
          <div className="text-black text-start text-right break-words">
            {attr.value || '—'}
          </div>
        </div>
      ))}
    </div>
    <div>
      {attributes.slice(Math.ceil(attributes.length / 2)).map((attr, index) => (
        <div
          key={attr.id || attr.slug || (index + Math.ceil(attributes.length / 2))}
          className="grid grid-cols-[minmax(200px,1fr)_minmax(150px,1fr)] text-[14px] gap-10 py-1"
        >
          <div className="text-gray-500 font-medium break-words">
            {attr.name || 'Не указано'}
          </div>
          <div className="text-black text-start text-right break-words">
            {attr.value || '—'}
          </div>
        </div>
      ))}
    </div>
  </div>
) : (
  <p className="text-[14px] text-gray-600">Характеристики отсутствуют</p>
)}
</div>
    )
}