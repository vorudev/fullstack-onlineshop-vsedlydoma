import { getCategoryBySlug } from "@/lib/actions/product-categories";
import { getFilterCategoriesByProductCategory } from "@/lib/actions/filter-categories";
import { FilterForm } from "@/components/forms/filter-form";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FiltersTable } from "@/components/filters-table";
import { CategoryForm } from "@/components/forms/category-form";
import { FilterCategoryForm } from "@/components/forms/filter-category-form";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // Ожидаем params перед использованием
  const { slug } = await params;
  // Получаем продукт по slug
    const category = await getCategoryBySlug(slug);
    const filterCategories = await getFilterCategoriesByProductCategory(category?.id || "");
return ( 
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Категория {slug}</h1>
      <p className="mb-4"> {category.description}</p>
      <h2 className="text-2xl font-bold mb-4">Фильтры для {slug}</h2>
      <Dialog>
        <DialogTrigger asChild><Button>Добавить Категорию фильтра<PlusIcon /></Button></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить Категорию фильтра</DialogTitle>


          </DialogHeader>
                            <FilterCategoryForm productCategoryId={category.id} />
        </DialogContent>
      </Dialog>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
          {filterCategories.map((filterCategory) => (
            <div key={filterCategory.id} className="border p-4  rounded-lg">
              <h3 className="text-lg font-semibold mb-3">{filterCategory.name}</h3>
             <Dialog>
  <DialogTrigger asChild><Button>Добавить фильтр<PlusIcon /></Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Добавить фильтр</DialogTitle>


    </DialogHeader>
          <FilterForm categoryId={filterCategory.id} />
  </DialogContent>
</Dialog>
              <FiltersTable categoryId={filterCategory.id} />
            </div>
          ))}
        </div>
    </div>  
)
}