import { getCategoryBySlug } from "@/lib/actions/product-categories";
import { getFilterCategoriesByProductCategory } from "@/lib/actions/filter-categories";
import { FilterForm } from "@/components/forms/filter-form";
import { PlusIcon, Trash } from "lucide-react";
import { buildCategoryPath } from "@/lib/actions/categories";
import { Button } from "@/components/ui/button";
import AdminCategoryPage from "../../../../components/admin-categories";
import { getFilterCategoriesWithFiltersByProductCategory } from "@/lib/actions/filter-categories";
import { DeleteFilterCategoryButton } from "@/components/delete-filter-category-button";
import { FiltersTable } from "@/components/filters-table";
import ImagesSlider from "@/components/images/images-slider-category";
import {getCategoryImages} from "@/lib/actions/image-actions";
import { CategoryForm } from "@/components/forms/category-form";
import { getAllCategories } from "@/lib/actions/product-categories";
import { FilterCategoryForm } from "@/components/forms/filter-category-form";
import { CreateImagesToCategoryForm } from "@/components/forms/add/add-image-to-category-form";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // Ожидаем params перед использованием
  const { slug } = await params;
  // Получаем продукт по slug
    const category = await getCategoryBySlug(slug);
  const [images, filterCategories, filtersWIthCategories ] = await Promise.all([
    getCategoryImages(category?.id || ""),
    getFilterCategoriesByProductCategory(category?.id || ""),
    getFilterCategoriesWithFiltersByProductCategory(category?.id || "")
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