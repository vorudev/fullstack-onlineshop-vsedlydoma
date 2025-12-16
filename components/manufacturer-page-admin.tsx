'use client';
import React, { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { CreateImagesToManufacturerForm } from './forms/add/add-image-to-manufacturer-form';
import { ManufacturerForm } from '@/components/forms/create-manufacturert-form';
import { DeleteImageFromManufacturerButton } from '@/components/images/delete-image-from-manufacturer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

// Иконки
import {
  Upload,
  Image as ImageIcon,
  Save,
  Eye,
  Globe,
  Building,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Trash2,
  RotateCcw,
  Link,
  Check,
  AlertCircle,
  Heart,
  Star,
  Package,
  ArrowLeft,
  Copy,
  Download,
} from 'lucide-react';

interface Manufacturer {
  manufacturer: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}
images: {
  id: string;
  manufacturerId: string;
  imageUrl: string;
  storageType: string;
  storageKey: string | null;
  order: number | null;
  isFeatured: boolean | null;
  createdAt: Date | null;
}[]
  
}

const AdminManufacturerPage = ({ manufacturer, images }: Manufacturer) => {
  // Состояние производителя
  

  

  // UI состояния
  const [isUploading, setIsUploading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  

  // Обработчики




  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Скопировано в буфер обмена!');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Хлебные крошки */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/manufacturers">
                <Button variant="ghost" size="sm" className="p-0 h-auto">
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Производители
                </Button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{manufacturer.name || 'Новый производитель'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Заголовок и кнопки действий */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {manufacturer.name || 'Новый производитель'}
              </h1>
              
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => window.open(`/manufacturers/${manufacturer.slug}`, '_blank')}
              >
                <Eye className="h-4 w-4" />
                Открыть на сайте
              </Button>
             
             
            </div>
          </div>

          {hasUnsavedChanges && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Есть несохраненные изменения</AlertTitle>
              <AlertDescription>
                Нажмите "Сохранить" чтобы применить изменения или "Отменить" чтобы вернуться к предыдущей версии.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка: Основная информация */}
          <div className="lg:col-span-2 space-y-6">
            {/* Карточка: Основные данные */}
            <Card>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
                <CardDescription>
                  Название, описание и статус производителя
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Название */}
                <ManufacturerForm manufacturer={manufacturer} />
               

                {/* Описание */}
                

                {/* Статус */}
                
              </CardContent>
            </Card>

            {/* Карточка: Контактная информация */}
            </div>

          {/* Правая колонка: Логотип и мета-данные */}
          <div className="space-y-6">
            {/* Карточка: Логотип */}
            <Card>
              <CardHeader>
                <CardTitle>Логотип производителя</CardTitle>
                <CardDescription>
                  Логотип будет отображаться на карточках товаров и на странице производителя
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Превью логотипа */}
                  <div className="border-2 border-dashed rounded-xl p-8 text-center bg-muted/50">
                    {images.length > 0 ? (
                      <div className="relative flex items-center flex-col justify-center">
                        <div className=" mx-auto  border rounded-lg overflow-hidden bg-white p-4">
                          <img
                            src={images[0].imageUrl}
                            alt={`Логотип ${manufacturer.name}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <DeleteImageFromManufacturerButton image={images[0]} />
                        <div className="mt-4">
                          <p className="text-sm font-medium">Текущий логотип</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">
                          Логотип не загружен
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Загрузите логотип в формате PNG, SVG или JPG
                        </p>
                        
                      </div>
                    )}
                  </div>

                  {/* Кнопки загрузки */}
                  {images.length === 0 && <div className="flex flex-col gap-2">
                  
                    
                    <CreateImagesToManufacturerForm manufacturer={manufacturer} images={images} />
                  </div>}

                  {/* Подсказки */}
                  <div className="text-sm text-muted-foreground space-y-1">
                   
                    <p className="flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Максимальный размер: 5 MB
                    </p>
                    <p className="flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Рекомендуется: квадратное изображение
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Карточка: Мета-данные */}
            

            {/* Карточка: SEO статус */}
            
          </div>
        </div>

        {/* Футер с дополнительной информацией */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                <span>Производитель</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>В каталоге с {manufacturer.createdAt?.toLocaleDateString("ru-RU")}</span>
              </div>
            </div>
            <div>
              <span>Последнее изменение: {manufacturer.updatedAt?.toLocaleDateString("ru-RU")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManufacturerPage;