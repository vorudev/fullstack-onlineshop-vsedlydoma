'use client'
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { ApproveReviewButton } from './approve-review-button';
import { DeleteReviewButton } from './delete-review-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { MoreVertical, Check, X, Trash, Eye, Filter } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
interface SearchParamsProps {
    rating: string;
    date: string;
}
interface ReviewTableProps {
  reviews: {
    user: {
        id: string;
        name: string;
        role: "admin" | "user";
        email: string;
        emailVerified: boolean;
        phoneNumber: string | null;
        phoneNumberVerified: boolean;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
        twoFactorEnabled: boolean;
        banned: boolean;
    } | undefined;
    product: {
        sku: string | null;
        id: string;
        title: string;
    } | undefined;
    images: {
        imageUrl: string;
        productId: string;
        id: string;
        isFeatured: boolean | null;
    }[];
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
}

export function ReviewModerationTable({ reviews }: ReviewTableProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  

  // Фильтрация отзывов
  const ratingFilter = (rating: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('rating', rating.toString());
    // Все остальные параметры (search, category) сохраняются автоматически!
    router.push(`?${params.toString()}`);
  };
  const clearAllParams = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('rating');
    params.delete('date');
    params.delete('search');
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

 const clearRatingFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('rating');
    router.push(`?${params.toString()}`);
  };
  const dateFilter = (date: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('date', date);
    router.push(`?${params.toString()}`);
  };

  // Групповой выбор
  const handleSelectAll = (checked: boolean) => {
    setSelectedReviews(checked ? reviews.map(r => r.id) : []);
  };

  const handleSelectReview = (reviewId: string, checked: boolean) => {
    setSelectedReviews(prev => 
      checked ? [...prev, reviewId] : prev.filter(id => id !== reviewId)
    );
  };

  // Быстрые действия
  // const handleQuickAction = (reviewId: string, action: 'approve' | 'reject') => {
  //  if (action === 'approve') onApprove(reviewId);
   // if (action === 'reject') onReject(reviewId);
 // };

  // Форматирование даты
  const formatDate = (date: Date | null) => {
    if (!date) return 'Нет даты';
    const d = new Date(date);
    return d.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Получение изображения товара
  const getProductImage = (images: typeof reviews[0]['images']) => {
    const featured = images.find(img => img.isFeatured);
    return featured?.imageUrl || images[0]?.imageUrl || null;
  };

  return (
    <div className="space-y-4 px-4">
      {/* Панель управления */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-card border rounded-lg">
        <div className="flex items-center gap-4">
     

       
          
          {selectedReviews.length > 0 && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 hover:text-green-700"
                
              >
                <Check className="mr-2 h-4 w-4" />
                Одобрить все
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
                
              >
                <X className="mr-2 h-4 w-4" />
                Отклонить все
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-5">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-[180px]">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Фильтр по рейтингу
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-2">
              <Button onClick={() => clearRatingFilter()} variant="outline">Все рейтинги</Button>
              <Button onClick={() => ratingFilter(5)} variant="outline">⭐⭐⭐⭐⭐ 5 звезд</Button>
              <Button onClick={() => ratingFilter(4)} variant="outline">⭐⭐⭐⭐ 4 звезды</Button>
              <Button onClick={() => ratingFilter(3)} variant="outline">⭐⭐⭐ 3 звезды</Button>
             <Button onClick={() => ratingFilter(2)} variant="outline">⭐⭐ 2 звезды</Button>
          <Button onClick={() => ratingFilter(1)} variant="outline">⭐ 1 звезда</Button>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="w-[180px]">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Фильтр по дате
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-2">
            <Button onClick={() => dateFilter('newest')} variant="outline">Сначала новые</Button>
            <Button onClick={() => dateFilter('oldest')} variant="outline">Сначала старые</Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Таблица */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
            
              <TableHead className="w-[250px]">Товар</TableHead>
              <TableHead className="w-[150px]">Пользователь</TableHead>
              <TableHead className="w-[100px]">Рейтинг</TableHead>
              <TableHead>Отзыв</TableHead>
              <TableHead className="w-[120px]">Дата</TableHead>
              <TableHead className="w-[100px]">Статус</TableHead>
              <TableHead className="text-right w-[140px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Filter className="h-8 w-8" />
                    <p>Нет отзывов, соответствующих фильтрам</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        dateFilter('newest');
                        clearAllParams();
                      }}
                    >
                      Сбросить фильтры
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow 
                  key={review.id} 
                  className={`group hover:bg-muted/50 ${expandedReview === review.id ? 'bg-muted/30' : ''}`}
                >
                  {/* Чекбокс выбора */}
                  
                  
                  {/* Товар */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border">
                        {getProductImage(review.images) ? (
                          <Image
                            src={getProductImage(review.images)!}
                            alt={review.product?.title || 'Товар'}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            <span className="text-xs text-muted-foreground">Нет фото</span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="truncate font-medium text-sm hover:text-primary cursor-help">
                                {review.product?.title || 'Товар удален'}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{review.product?.title || 'Товар удален'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        {review.product?.sku && (
                          <p className="text-xs text-muted-foreground truncate">
                            Арт: {review.product.sku}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Пользователь */}
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">
                        {review.author_name || 'Аноним'}
                      </p>
                      {review.createdAt && (
                        <p className="text-xs text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  
                  {/* Рейтинг */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {review.rating}/5
                      </span>
                    </div>
                  </TableCell>
                  
                  {/* Отзыв */}
                  <TableCell className="max-w-[300px]">
                    <div className="space-y-1">
                      <p className={`text-sm ${expandedReview !== review.id ? 'line-clamp-2' : ''}`}>
                        {review.comment || 'Без комментария'}
                      </p>
                      {review.comment && review.comment.length > 100 && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={() => setExpandedReview(
                            expandedReview === review.id ? null : review.id
                          )}
                        >
                          {expandedReview === review.id ? 'Свернуть' : 'Читать полностью'}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  
                  {/* Дата создания */}
                  <TableCell>
                    {review.createdAt ? (
                      <div className="space-y-1">
                        <p className="text-sm">
                          {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  
                  {/* Статус */}
                  <TableCell>
                    <Badge 
                      variant={
                        review.status === 'pending' ? 'secondary' :
                        review.status === 'approved' ? 'default' :
                        review.status === 'rejected' ? 'destructive' : 'outline'
                      }
                      className="capitalize"
                    >
                      {review.status === 'pending' && 'Ожидает'}
                      {review.status === 'approved' && 'Одобрен'}
                      {review.status === 'rejected' && 'Отклонен'}
                      {!['pending', 'approved', 'rejected'].includes(review.status) && review.status}
                    </Badge>
                  </TableCell>
                  
                  {/* Действия */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Быстрое одобрение */}
                      <ApproveReviewButton reviewId={review.id} />
                      
                      {/* Быстрое отклонение */}
                      <DeleteReviewButton reviewId={review.id} />
                      
                      {/* Подробный просмотр */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Детали отзыва #{review.id.slice(0, 8)}</DialogTitle>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            {/* Информация о товаре */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Товар</h4>
                                  <div className="flex items-center gap-3">
                                    {getProductImage(review.images) && (
                                      <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                                        <Image
                                          src={getProductImage(review.images)!}
                                          alt={review.product?.title || 'Товар'}
                                          fill
                                          className="object-cover"
                                          sizes="64px"
                                        />
                                      </div>
                                    )}
                                    <div>
                                      <p className="font-medium">{review.product?.title || 'Товар удален'}</p>
                                      {review.product?.sku && (
                                        <p className="text-sm text-muted-foreground">
                                          Артикул: {review.product.sku}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold mb-2">Пользователь</h4>
                                  <p className="font-medium">{review.author_name || 'Аноним'}</p>
                                  <p className="text-sm text-muted-foreground">
                                   <span>Имя аккаунта: </span> {review.user?.name}
                                 
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                   <span>Почта: </span> {review.user?.email}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                   <span>Телефон: </span> {review.user?.phoneNumber || 'Не указан'}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Рейтинг</h4>
                                  <div className="flex items-center gap-2">
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <span
                                          key={i}
                                          className={`text-2xl ${
                                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                          }`}
                                        >
                                          ★
                                        </span>
                                      ))}
                                    </div>
                                    <span className="text-lg font-semibold">{review.rating}/5</span>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold mb-2">Даты</h4>
                                  <div className="space-y-1 text-sm">
                                    <p>Создан: {formatDate(review.createdAt)}</p>
                                    <p>Обновлен: {formatDate(review.updatedAt)}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Комментарий */}
                            <div>
                              <h4 className="font-semibold mb-2">Комментарий</h4>
                              <div className="bg-muted/30 p-4 rounded-lg whitespace-pre-wrap min-h-[100px]">
                                {review.comment || 'Без комментария'}
                              </div>
                            </div>
                          </div>
                          
                          <DialogFooter className="gap-2">
                            <Button
                              variant="outline"
                              onClick={() => navigator.clipboard.writeText(review.comment || '')}
                              disabled={!review.comment}
                            >
                              Копировать текст
                            </Button>
                            <ApproveReviewButton reviewId={review.id} />
                            <DeleteReviewButton reviewId={review.id} />
                              
                            
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Статистика */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="font-medium">Всего:</span>
          <span>{reviews.length} отзывов</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium">На странице:</span>
          <span>{reviews.length} отзывов</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium">Выбрано:</span>
          <span>{selectedReviews.length} отзывов</span>
        </div>
      </div>
    </div>
  );
}