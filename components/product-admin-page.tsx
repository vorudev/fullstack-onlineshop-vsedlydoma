'use client'
import { useState } from 'react';

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DeleteProductButtonPage } from '@/components/delete-product-button';
import AttributeForm from '@/components/forms/attributes-form';
import { DeleteReviewButton } from '@/components/delete-review-button';
import {DeleteImageFromProductButton} from "@/components/images/delete-image-from-product";
import {CreateImagesToProductForm} from "@/components/forms/create-images-to-product-form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DeleteAttributeButton from '@/components/delete-attribute-button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ProductForm } from "@/components/forms/product-form";
// Иконки
import {
  Upload,
  Image as ImageIcon,
  Plus,
  X,
  Trash2,
  Star,
  Eye,
  Check,
  XCircle,
  MessageSquare,
  AlertCircle,
  Download,
  Copy,
  Grid,
  List,
  Settings,
  Tag,
  Package,
  DollarSign,
  BarChart3,
  Layers,
  Calendar,
  Shield,
  Heart,
  ShoppingCart,
  TrendingUp,
  MoreVertical,
  Edit,
  Save,
  RotateCcw,
  ExternalLink,
  Filter,
  HelpCircle,
} from 'lucide-react';

interface ProductImage {
  id: string;
  url: string;
  isMain: boolean;
}

interface Characteristic {
  id: string;
  name: string;
  value: string;
}

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
}
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
      isActive: boolean | null;
      keywords: string | null;
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
  breadcrumbs: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
} | null
  } 
  reviewsLimit: number;
}

interface Manufacturers {
  manufacturers: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}[];
}
interface Categories { 
  categories: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}[];
}

const AdminProductPage = ({ productDetails, reviewsLimit, categories, manufacturers }: ProductUnited & Categories & Manufacturers ) => {
  // Состояния основной информации
  const [productName, setProductName] = useState<string>('iPhone 15 Pro Max');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [mainImage, setMainImage] = useState<string>('');

  const router = useRouter();
  const searchParams = useSearchParams();

  const showMoreItems = (limit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('reviewsLimit', limit.toString());
    router.push(`?${params.toString()}`);
}


  const [activeTab, setActiveTab] = useState('general');
  const [showCharacteristicsHelp, setShowCharacteristicsHelp] = useState(false);


  
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getStatusBadge = (status: Review['status']) => {
    const config = {
      approved: { label: 'Одобрен', variant: 'default' as const, icon: <Check className="h-3 w-3" /> },
      pending: { label: 'На модерации', variant: 'outline' as const, icon: <AlertCircle className="h-3 w-3" /> },
      rejected: { label: 'Отклонен', variant: 'destructive' as const, icon: <XCircle className="h-3 w-3" /> },
    };
    return config[status];
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Хлебные крошки и заголовок */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/products">Товары</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{productDetails.title || 'Новый товар'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Основной контент */}
        <div className="flex-1">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                {productDetails.title}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant={productDetails.inStock === "В наличии" ? "default" : "secondary"} className="gap-1">
                    {productDetails.inStock}
                  </Badge>
                  <span className="text-muted-foreground text-sm">
                    
                    Артикул: {productDetails.sku}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
              
              </div>
            </div>
          </div>

          {/* Табы */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 lg:w-auto">
              <TabsTrigger value="general" className="gap-2">
                <Settings className="h-4 w-4" />
                Основное
              </TabsTrigger>
              <TabsTrigger value="characteristics" className="gap-2">
                <Tag className="h-4 w-4" />
                Характеристики
              </TabsTrigger>
              <TabsTrigger value="images" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Изображения
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Отзывы
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {productDetails.reviewCount}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Вкладка: Основное */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
                  <CardDescription>
                    Название, описание и основные параметры товара
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <ProductForm product={productDetails} categories={categories} manufacturers={manufacturers} />
                  

                 
                    
                  
                </CardContent>
              </Card>

              {/* Производитель */}
              <Card>
                <CardHeader>
                  <CardTitle>Производитель</CardTitle>
                  <CardDescription>
                    Бренд или производитель товара
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 border rounded-lg flex items-center justify-center bg-muted overflow-hidden">
                      {productDetails.manufacturer?.images[0]?.imageUrl ? (
                        <img
                          src={productDetails.manufacturer?.images[0]?.imageUrl}
                          alt={productDetails.manufacturer?.name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <Package className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{productDetails.manufacturer?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Производитель товара
                      </p>
                    </div>
                   <Button variant="outline" className="justify-start gap-2" onClick={() => router.push(`/dashboard/manufacturers/${productDetails.manufacturer?.slug}`)}>
                    <Edit className="h-4 w-4" />
                    Редактировать производителя
                  </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Вкладка: Характеристики */}
            <TabsContent value="characteristics">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Характеристики товара</CardTitle>
                      <CardDescription>
                        Свойства товара, которые используются для фильтрации
                        <Button
                          variant="link"
                          className="ml-2 p-0 h-auto"
                          onClick={() => setShowCharacteristicsHelp(true)}
                        >
                          Как это работает?
                        </Button>
                      </CardDescription>
                    </div>
                    <Alert className="sm:hidden">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Важно!</AlertTitle>
                      <AlertDescription className="text-xs">
                        Названия характеристик должны совпадать с названиями фильтров в категории
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="space-y-4">
                        {productDetails.attributes.length > 0 ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium">Список характеристик</Label>
                              <span className="text-sm text-muted-foreground">
                                {productDetails.attributes.length} шт.
                              </span>
                            </div>
                            <div className="border rounded-lg overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-1/2">Название характеристики</TableHead>
                                    <TableHead className="w-1/2">Значение</TableHead>
                                    <TableHead className="w-10"></TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {productDetails.attributes.map((char) => (
                                    <TableRow key={char.id}>
                                      <TableCell>
                                      <p>
                                        {char.name || ''}
                                       </p>
                                      </TableCell>
                                      <TableCell>
                                       <p>
                                        {char.value || ''}
                                       </p>
                                      </TableCell>
                                      <TableCell>
                                        <DeleteAttributeButton attributeId={char?.id || ''} />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        ) : (
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Нет характеристик</AlertTitle>
                            <AlertDescription>
                              Добавьте характеристики товара, чтобы покупатели могли фильтровать товары
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Форма добавления новой характеристики */}
                        <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-4">Добавить новую характеристику</h4>
                          <AttributeForm attribute={undefined} product={productDetails}  />
                          
                          
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Alert className="hidden sm:block">
                        <AlertTitle>Важно для фильтрации</AlertTitle>
                        <AlertDescription className="text-sm">
                          Название характеристики (например, "Цвет") должно точно совпадать
                          с названием фильтра в категории, чтобы товар появлялся в фильтрах.
                        </AlertDescription>
                      </Alert>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Примеры характеристик</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-500" />
                              <span>Цвет: Черный</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-500" />
                              <span>Диагональ экрана: 6.7"</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-500" />
                              <span>Память: 256 ГБ</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-500" />
                              <span>Процессор: A17 Pro</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Вкладка: Изображения */}
            <TabsContent value="images">
              <Card>
                <CardHeader>
                  <CardTitle>Изображения товара</CardTitle>
                  <CardDescription>
                      Загрузите фотографии товара с разных ракурсов
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Главное изображение */}
                    
                    <div className="space-y-2">
                      <Label>Главное изображение</Label>
                      <div className="border-2 border-dashed rounded-xl p-8 text-center bg-muted/50">
                        {mainImage || productDetails.images?.find(img => img.isFeatured)?.imageUrl ? (
                          <div className="relative max-w-md mx-auto">
                            <img
                              src={mainImage || productDetails.images?.find(img => img.isFeatured)?.imageUrl}
                              alt="Главное изображение"
                              className="rounded-lg object-contain h-64 w-full" 
                            />
                          
                          </div>
                       
                        ) : (
                          <div className="text-center">
                            <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-2">
                              Нет главного изображения
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Первое загруженное изображение станет главным
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Галерея изображений */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Галерея изображений</Label>
                        <span className="text-sm text-muted-foreground">
                          {productDetails.images.length} изображений
                        </span>
                      </div>
                      
                      {productDetails.images.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {productDetails.images.map((image) => (
                            <div
                              key={image.id}
                              onClick={() => setMainImage(image.imageUrl)}
                              className={`relative border rounded-lg overflow-hidden group ${
                                image.imageUrl === mainImage ? 'ring-2 ring-primary ring-offset-2' : ''
                              }`}
                            >
                              <div className="aspect-square hover:cursor-pointer hover:opacity-50 transition-opacity bg-muted flex items-center justify-center" >
                                <img
                                  src={image.imageUrl}
                                  alt={`Изображение товара ${image.id}`}
                                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                                />
                                
                           
                              </div>
                              {image.isFeatured && <div className="absolute top-2 left-2">
                                  <Badge className="gap-1">
                                    <Star className="h-3 w-3 fill-white" />
                                    Главное
                                  </Badge>
                                </div>}
                               <DeleteImageFromProductButton image={image} />
                             
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border-2 border-dashed rounded-lg p-12 text-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground mb-2">
                            Нет загруженных изображений
                          </p>
                        
                        </div>
                      )}
                    </div>

                    {/* Загрузка изображений */}
                    <div className="space-y-2">
                      <Label>Загрузить новые изображения</Label>
                      <CreateImagesToProductForm product={productDetails} images={productDetails.images} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Вкладка: Отзывы */}
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <CardTitle>Отзывы покупателей</CardTitle>
                      <CardDescription>
                        Управление отзывами о товаре (отображаются только одобренные отзывы)
                      </CardDescription>
                      <p className="text-sm text-muted-foreground">Средний рейтинг: {productDetails.averageRating.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Всего отзывов: {productDetails.reviewCount}</p>
                    </div>
              
                  </div>
                </CardHeader>
                <CardContent>
                  {productDetails.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {productDetails.reviews.map((review) => {
                        const statusBadge = getStatusBadge(review.status as Review['status']);
                        return (
                          <div key={review.id} className="border rounded-lg p-4">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold">{review.author_name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="flex">
                                        {renderStars(review.rating)}
                                      </div>
                                      <span className="text-sm text-muted-foreground">
                                        {review.createdAt?.toLocaleDateString("ru-RU", { year: 'numeric', month: 'long', day: 'numeric' })}
                                      </span>
                                    </div>
                                  </div>
                                  <Badge
                                    variant={statusBadge.variant}
                                    className="gap-1"
                                  >
                                    {statusBadge.icon}
                                    {statusBadge.label}
                                  </Badge>
                                </div>
                                <p className="mt-3 text-sm">{review.comment}</p>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row gap-2 sm:w-auto w-full">
                          
                               
                                 <DeleteReviewButton reviewId={review.id} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <Alert>
                      <MessageSquare className="h-4 w-4" />
                      <AlertTitle>Нет отзывов</AlertTitle>
                      <AlertDescription>
                        У этого товара пока нет отзывов от покупателей
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter className="flex-col items-start gap-3">
                {productDetails?.reviews?.length >= reviewsLimit && (<Button
        onClick={() => showMoreItems(reviewsLimit + 20)}
                  variant="outline"
      >
        Показать ещё
      </Button>
              )}
                </CardFooter>
              </Card>
            </TabsContent>
            
          </Tabs>
        </div>

        {/* Боковая панель */}
        <div className="lg:w-80 space-y-6">
          {/* Карточка статуса */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Статус товара</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="active-status-sidebar">{productDetails.inStock}</Label>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Категория товара:</Label>
                <div className="space-y-1">
                  <Badge variant="secondary" className="w-full justify-start gap-2">
                    <Layers className="h-3 w-3" />
                    {productDetails.breadcrumbs?.name}
                  </Badge>
                  
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2" onClick={() => router.push(`/dashboard/categories/${productDetails.categoryId}`)}>
                <Layers className="h-4 w-4" />
                Управление категорией товара
              </Button>
            </CardFooter>
          </Card>

          {/* Карточка мета-данных */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Мета-данные</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Создан</span>
                  <span className="text-sm font-medium">{productDetails.createdAt?.toLocaleDateString("ru-RU", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Обновлен</span>
                  <span className="text-sm font-medium">{productDetails.updatedAt?.toLocaleDateString("ru-RU", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Артикул товара</span>
                  <span className="text-sm font-medium">{productDetails.sku}</span>
                </div>
                <div className="flex flex-col ">
                  <span className="text-sm text-muted-foreground">Теги для браузера:</span>
                  <span className="text-sm font-medium">{productDetails.keywords}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Карточка быстрых действий */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => router.push(`/product/${productDetails.slug}`)}>
                <ExternalLink className="h-4 w-4" />
                Открыть на сайте
              </Button>
              <DeleteProductButtonPage productId={productDetails.id} />
            </CardContent>
          </Card>

          {/* Карточка SEO */}
         
        </div>
      </div>

      {/* Модальное окно помощи по характеристикам */}
      <Dialog open={showCharacteristicsHelp} onOpenChange={setShowCharacteristicsHelp}>
        <DialogContent className="min-w-2xl">
          <DialogHeader>
            <DialogTitle>Как работают характеристики и фильтры?</DialogTitle>
            <DialogDescription>
              Связь между характеристиками товара и фильтрами на сайте
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-2">Вы добавляете характеристику товару</h4>
                <div className="p-3 border rounded-lg bg-muted/50 space-y-2">
                  <div className="flex items-center ">
                    <div className="w-1/2 flex flex-col gap-1">
                      <span className="text-sm font-medium">Название:</span>
                      <p className="text-sm font-medium">Цвет</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Значение:</span>
                      <p className="text-sm font-medium">Черный</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-2">В категории настроен фильтр с таким же названием</h4>
                <div className="p-3 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>Фильтр</Badge>
                    <span className="font-medium">Цвет</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">Черный</Badge>
                    <Badge variant="outline">Белый</Badge>
                    <Badge variant="outline">Синий</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-2">На сайте появляется автоматический фильтр</h4>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="space-y-2">
                    <p className="font-medium text-sm">Фильтр: Цвет</p>
                    
                  </div>
                </div>
              </div>
            </div>

            <Alert className="bg-red-600/10 border-red-600">
              <AlertTitle className="text-red-600 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Важное правило
              </AlertTitle>
              <AlertDescription className="text-white">
                Система связывает характеристики товара с фильтрами по точному совпадению
                названий. Если в фильтрах категории есть "Цвет" и значение "Черный", а у товара характеристика
                "цвет" и "черный" (с маленькой буквы), фильтрация НЕ будет работать! Обязательно проверяйте заглавные буквы!
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowCharacteristicsHelp(false)}>
              Понятно
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProductPage;