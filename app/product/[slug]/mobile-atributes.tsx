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


export default function MobileAtributes({attributes}: Product) {
  const [maxVisible, setMaxVisible] = useState(8);
  
  const visibleAttributes = attributes.slice(0, maxVisible) || [];
  const hasMore = attributes.length > maxVisible;
  
  const showAll = () => {
    setMaxVisible(attributes.length || 1);
  };
  
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
<button 
  onClick={showAll}
  className="text-blue-600 font-semibold text-[14px]">
              Показать все
</button>
          )}
</div>
</div>
    </div>
  );
}