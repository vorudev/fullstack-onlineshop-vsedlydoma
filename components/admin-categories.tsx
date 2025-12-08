'use client'
import React, { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { DeleteImageFromCategoryButton } from '@/components/images/delete-image-from-category';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

// Иконки (предполагается использование react-icons или lucide-react)
import {
  Upload,
  Image as ImageIcon,
  Plus,
  X,
  Trash2,
  HelpCircle,
  Lightbulb,
  Info,
  GripVertical,
  Eye,
  ChevronRight,
  PlusIcon,
  Trash,
} from 'lucide-react';
import { DeleteFilterCategoryButton } from '@/components/delete-filter-category-button';
import { FilterCategoryForm } from '@/components/forms/filter-category-form';
import { FilterForm } from '@/components/forms/filter-form';
import { CategoryForm } from '@/components/forms/category-form';
import { DeleteFilterButton } from '@/components/delete-filter-button';
import { CreateImagesToCategoryForm } from '@/components/forms/add/add-image-to-category-form';
import Image from 'next/image';
import Link from 'next/link';
interface Filter {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
}
interface ImagesProps { 
    id: string;
    categoryId: string;
    imageUrl: string;
    storageType: string;
    storageKey: string | null;
    order: number | null;
    isFeatured: boolean | null;
    createdAt: Date | null;
}
interface FilterCategoryWithFilters {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  productCategory: string;
  filters: Filter[];
}
interface CategoryProps {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}
interface CategoriesProps { 
id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}
interface Filters{ 
filtersWithCategory: FilterCategoryWithFilters[];
category: CategoryProps
categories: CategoriesProps[]
images: ImagesProps[]
}
interface FilterValue {
  id: string;
  name: string;
}

interface FilterCategory {
  id: string;
  name: string;
  values: FilterValue[];
}

const AdminCategoryPage = ({filtersWithCategory, category, categories, images} : Filters) => {
  // Состояния для основной информации
  const [categoryName, setCategoryName] = useState<string>('Смартфоны');
  const [categoryDescription, setCategoryDescription] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Состояния для фильтров
  const [filterCategories, setFilterCategories] = useState<FilterCategory[]>([
    { id: '1', name: 'Цвет', values: [{ id: '1-1', name: 'Красный' }, { id: '1-2', name: 'Синий' }] },
    { id: '2', name: 'Диагональ экрана', values: [{ id: '2-1', name: '6.1"' }, { id: '2-2', name: '6.7"' }] },
  ]);
  const [newValueInputs, setNewValueInputs] = useState<Record<string, string>>({});

  // Состояние для модального окна с инструкцией
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  // Обработчик загрузки изображения
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };



  return (
    <div className="min-h-screen bg-background p-6">
      {/* Хлебные крошки */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/categories">Категории</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Заголовок и кнопки действий */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
            {category.name}
            </h1>
            <p className="text-muted-foreground mt-2">
              Управление данными категории и её фильтрами
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link  href={`/categories/${category.slug}`} className="gap-2 flex-row flex items-center bg-white text-black p-2 rounded-md">
              <Eye className="h-4 w-4" />
              Предпросмотр на сайте
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 max-w-4xl">
        {/* Секция 1: Основные данные */}
        <Card>
          <CardHeader>
            <CardTitle>Основные данные</CardTitle>
            <CardDescription>
              Название, описание и изображение категории
            </CardDescription>
          </CardHeader>
         
          <CardContent className="space-y-6">
             <CategoryForm category={category} categories={categories}/>
            {/* Поле названия */}
            

            {/* Поле описания */}
            

            {/* Загрузка изображения */}
            <div className="space-y-2">
              <Label>Изображение категории</Label>
             {!images &&  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="border-2 border-dashed rounded-lg w-full sm:w-48 h-48 flex items-center justify-center bg-muted overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Превью категории"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Изображение категории
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                 <div className="flex flex-col sm:flex-row gap-2">
                    <Dialog>
                                      <DialogTrigger>
                                        <Button variant="outline" className="">
                                         Добавить изображение <Plus className="size-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Добавить изображение</DialogTitle>
                                          <CreateImagesToCategoryForm category={category} />
                                        </DialogHeader>
                                      </DialogContent>
                                    </Dialog> 
                   
               
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Будет отображаться в шапке страницы категории.
                    Поддерживаются форматы JPG, PNG, WebP.
                  </p>
                </div>
              </div>
}
{images && images.length > 0 ? <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
    <div className="border-2 relative border-dashed rounded-lg w-full sm:w-64 h-48 flex items-center justify-center bg-muted overflow-hidden">
                  
                    <Image
                      src={images[0]?.imageUrl}
                      alt="Превью категории"
                      fill
                      className="w-full h-full object-contain"
                    />
                  
                </div>
                <div className="flex-1 space-y-3">
                 <div className="flex flex-col sm:flex-row gap-2">
                   
                                          <DeleteImageFromCategoryButton image={images[0]} />
                                       
                   
               
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Будет отображаться в шапке страницы категории.
                    Поддерживаются форматы JPG, PNG, WebP.
                  </p>
                </div>
                </div> : <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="border-2 border-dashed rounded-lg w-full sm:w-48 h-48 flex items-center justify-center bg-muted overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Превью категории"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Изображение категории
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                 <div className="flex flex-col sm:flex-row gap-2">
                    <Dialog>
                                      <DialogTrigger>
                                        <Button variant="outline" className="">
                                         Добавить изображение <Plus className="size-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Добавить изображение</DialogTitle>
                                          <CreateImagesToCategoryForm category={category} />
                                        </DialogHeader>
                                      </DialogContent>
                                    </Dialog> 
                   
               
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Будет отображаться в шапке страницы категории.
                    Поддерживаются форматы JPG, PNG, WebP.
                  </p>
                </div>
              </div>}
            </div> 

          </CardContent>
        </Card>

        {/* Секция 2: Управление фильтрами */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Фильтры для покупателей</CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-1">
                  Добавьте свойства, по которым покупатели будут отбирать товары в этой категории.
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-500"
                    onClick={() => setShowInstructions(true)}
                  >
                    Как это работает?
                  </Button>
                </CardDescription>
              </div>
              <Dialog >
                      <DialogTrigger asChild><Button>Добавить Категорию фильтра<PlusIcon /></Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Добавить Категорию фильтра</DialogTitle>
              
              
                        </DialogHeader>
                                          <FilterCategoryForm productCategoryId={category.id} />
                      </DialogContent>
                    </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {/* Сообщение, если фильтров нет */}
            {filterCategories.length === 0 && (
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Фильтры не настроены</AlertTitle>
                <AlertDescription>
                  Добавьте хотя бы одну категорию фильтра (например, "Цвет" или "Диагональ экрана"),
                  а затем её значения. Они автоматически появятся на сайте.
                </AlertDescription>
              </Alert>
            )}

            {/* Список категорий фильтров */}
            <Accordion type="multiple" className="w-full">
              {filtersWithCategory.map((category) => (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="hover:no-underline px-4">
                    <div className="flex items-center justify-between flex-1 pr-4">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-move flex-shrink-0" />
                        <span className="font-semibold text-left">
                          {category.name || 'Новая категория'}
                        </span>
                        <Badge variant="outline" className="flex-shrink-0">
                          {category.filters.length} значений
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="space-y-6 pl-8 pr-2 py-2">
                      {/* Редактирование названия категории фильтра */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label>Название категории фильтра:</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                Это название увидят покупатели (например, "Цвет").
                                Оно должно совпадать с названием характеристики у товара.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                       </div>

                      {/* Список значений фильтра */}
                      <div className="space-y-3">
                        <Label>Значения фильтра:</Label>
                        
                        {category.filters.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {category.filters.map((value) => (
                              <Badge
                                key={value.id}
                                variant="secondary"
                                className="pl-3 pr-2 py-1 flex items-center gap-1"
                              >
                                {value.name}
                               <Dialog>
                                <DialogTrigger>
                                <button

                                  className="ml-1 mt-1 text-muted-foreground hover:text-foreground rounded-sm"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>
                                        Вы уверены что хотите удалить фильтр "{value.name}"
                                    </DialogTitle>
                                    <DialogDescription>
                                        Это действие невозможно отменить, оно навсегда удалит фильтр {value.name}
                                    </DialogDescription>
                                    <DeleteFilterButton filterId={value.id} />
                                </DialogContent>
                                </Dialog>
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mb-4">
                            Нет добавленных значений. Добавьте хотя бы одно значение для фильтра.
                          </p>
                        )}

                        {/* Форма добавления нового значения */}
                        <FilterForm category={category} />
                       
                        <p className="text-sm text-muted-foreground">
                          Эти значения будут отображаться как чекбоксы или кнопки на сайте.
                          Убедитесь, что в характеристиках товаров используются точно такие же значения.
                        </p>
                      </div>

                      {/* Кнопка удаления категории */}
                      <div className="pt-2">
                     <Dialog>  
                        <DialogTrigger>
                         <Button
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Удалить эту категорию фильтра
                        </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>
                                Вы уверенны что хотите удалить "{category.name}"?
                            </DialogTitle>
                            <DialogDescription>
                                Это действие не отменить, это навсегда удалить категорию "{category.name}" из датабазы
                            </DialogDescription>
                             <DeleteFilterCategoryButton categoryId={category.id} />
                        </DialogContent>
                        </Dialog>
                       
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Визуальный пример */}
            <Separator className="my-6" />
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Как это будет выглядеть на сайте?</AlertTitle>
              <AlertDescription className="space-y-3 mt-2">
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>в боковой панели фильтров автоматически появится блок:</span>
                  </div>
                  <div className="border rounded-md p-4 bg-muted/50 max-w-xs">
                 {filtersWithCategory.length > 0 ? (
  <>
    {filtersWithCategory.map((category) => (
      <div key={category.id}> 
        <p className="font-medium my-3">{category.name}</p>
        {category.filters.length > 0 ? (
          <div className="space-y-2">
            {category.filters.map((value) => (
              <div className="flex items-center gap-2" key={value.id}>
                <Checkbox id={`filter-${value.id}`} />
                <Label htmlFor={`filter-${value.id}`} className="cursor-pointer">
                  {value.name}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">
            Нет добавленных значений
          </p>
        )}
      </div>
    ))}
  </>
) : (
  <div>Пока фильтров нет, попробуйте их создать и увидете здесь!</div>
)}
                    <p className="text-xs text-muted-foreground mt-3">
                      Покупатель выбирает значение — товары фильтруются автоматически
                    </p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Модальное окно с инструкцией */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Как работают фильтры?</DialogTitle>
            <DialogDescription>
              Визуальное объяснение связи между настройками здесь, характеристиками товара и сайтом
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Шаг 1 */}
            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-lg">
                  Вы создаёте категорию фильтра и её значения здесь
                </h4>
                <p className="text-muted-foreground">
                  Например, создаёте категорию: <strong>"Цвет"</strong> и добавляете значения:
                </p>
                <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className="text-sm px-3 py-1">Цвет</Badge>
                    <span className="text-sm text-muted-foreground">(категория фильтра)</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="text-sm">
                      Красный
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      Синий
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      Чёрный
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Шаг 2 */}
            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-lg">
                  У товара указываете характеристику
                </h4>
                <p className="text-muted-foreground">
                  В админке товара, в разделе "Характеристики", добавляете поле с такими же названиями:
                </p>
                <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-medium">Название характеристики:</Label>
                      <Input value="Цвет" readOnly className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-medium">Значение:</Label>
                      <Input value="Красный" readOnly className="bg-background" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    * Можно создать несколько характеристик с разными значениями
                  </p>
                </div>
              </div>
            </div>

            {/* Шаг 3 */}
            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-lg">
                  Фильтры автоматически появляются на сайте
                </h4>
                <p className="text-muted-foreground">
                  Когда покупатель заходит в эту категорию, он видит блок фильтров:
                </p>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h5 className="font-medium">Цвет</h5>
                      
                      <div className="space-y-2">
                        
                        <div className="flex items-center gap-2">
                          <Checkbox id="demo-red" />
                          <Label htmlFor="demo-red" className="cursor-pointer">
                            Красный <span className="text-muted-foreground text-sm">(12 товаров)</span>
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="demo-blue" />
                          <Label htmlFor="demo-blue" className="cursor-pointer">
                            Синий <span className="text-muted-foreground text-sm">(8 товаров)</span>
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="demo-black" />
                          <Label htmlFor="demo-black" className="cursor-pointer">
                            Чёрный <span className="text-muted-foreground text-sm">(15 товаров)</span>
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground p-2 bg-background rounded">
                      Покупатель выбирает нужные значения — система автоматически показывает только
                      подходящие товары
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Важное предупреждение */}
            <Alert className="bg-red-500/20 border-red-900">
              <AlertTitle className="text-amber-800 flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Важно!
              </AlertTitle>
              <AlertDescription className="text-white ">
 <span className=""> Название категории фильтра (например, <span className="font-bold">"Цвет"</span>) и название характеристики у товара <strong>должны совпадать дословно</strong>. Система связывает их по точному текстовому совпадению. Если в фильтрах категории есть "Цвет" и значение "Черный", а у товара характеристика
 "цвет" и "черный" (с маленькой буквы), фильтрация НЕ будет работать! Обязательно проверяйте заглавные буквы!</span>
</AlertDescription>

            </Alert>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowInstructions(false)} size="lg" className="w-full sm:w-auto">
              Понятно, спасибо!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategoryPage;