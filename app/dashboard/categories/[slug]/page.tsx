import { getCategoryBySlug } from "@/lib/actions/product-categories";
import { getFilterCategoriesByProductCategory } from "@/lib/actions/filter-categories";
import { FilterForm } from "@/components/forms/filter-form";
import { PlusIcon, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteFilterCategoryButton } from "@/components/delete-filter-category-button";
import { FiltersTable } from "@/components/filters-table";
import ImagesSlider from "@/components/images/images-slider-category";
import {getCategoryImages} from "@/lib/actions/image-actions";
import { CategoryForm } from "@/components/forms/category-form";
import { FilterCategoryForm } from "@/components/forms/filter-category-form";
import { CreateImagesToCategoryForm } from "@/components/forms/add/add-image-to-category-form";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // Ожидаем params перед использованием
  const { slug } = await params;
  // Получаем продукт по slug
    const category = await getCategoryBySlug(slug);
  const [images, filterCategories] = await Promise.all([
    getCategoryImages(category?.id || ""),
    getFilterCategoriesByProductCategory(category?.id || ""),
  ]);
return ( 
    <div className="p-6 max-w-full">
      <h1 className="text-3xl font-bold mb-4">Категория {slug}</h1>
    <div className="flex flex-row items-center"> 
      <p>добавить изображение</p>
      <Dialog>
                  <DialogTrigger>
                    <Button variant="ghost" className="h-9 w-9 p-0">
                      <Plus className="size-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Добавить изображение</DialogTitle>
                      <CreateImagesToCategoryForm category={category} images={images} />
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                </div>
      <div className="grid ">
        <div className="flex flex-row items-start gap-10 ">
      <div className="mb-4  max-w-1/5">
      <ImagesSlider images={images} title={category.name} />
      </div>
        <p className="mb-4"> {category.description}</p>
      </div>

      
          
      <div className="flex flex-col gap-2 items-center"> <h2 className="text-2xl font-bold mb-4">Фильтры для {slug}</h2>
      <Dialog >
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
           <div className="flex flex-row gap-2 mb-5">  <Dialog>
  <DialogTrigger asChild><Button>Добавить фильтр<PlusIcon /></Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Добавить фильтр</DialogTitle>


    </DialogHeader>
          <FilterForm category={filterCategory} />
  </DialogContent>
</Dialog>
<Dialog>
  <DialogTrigger asChild><Button><Trash /></Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Удалить Категорию фильтра</DialogTitle>
    </DialogHeader>
    <DeleteFilterCategoryButton categoryId={filterCategory.id} />
  </DialogContent>
</Dialog>
</div>              <FiltersTable categoryId={filterCategory.id} />
            </div>
          ))}
        </div>
    </div>
      </div>
     
    </div>  
)
}