import { getCategoryById } from "@/lib/actions/product-categories";

import AdminCategoryPage from "../../../../components/admin-categories";
import { getFilterCategoriesWithFiltersByProductCategory } from "@/lib/actions/filter-categories";

import {getCategoryImages} from "@/lib/actions/image-actions";

import { getAllCategories } from "@/lib/actions/product-categories";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // Ожидаем params перед использованием
  const { id } = await params;
  // Получаем продукт по slug
   
  const [category, images, filtersWIthCategories ] = await Promise.all([
    getCategoryById(id),
    getCategoryImages(id),
    getFilterCategoriesWithFiltersByProductCategory(id)
  ]);
  const { categories, pagination } = await getAllCategories(
    {
    }
  ); // Fetch categories
return ( 
    <div className="p-6 max-w-full">
     
     <AdminCategoryPage filtersWithCategory={filtersWIthCategories} category={category} categories={categories} images={images}/>
    </div>  
)
}