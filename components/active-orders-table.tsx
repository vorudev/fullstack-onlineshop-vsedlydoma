'use client';
import { useState, useMemo, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ExportToExcel from './exceljs-download';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SetOrderCompButton, SetOrderCancButton } from './set-order-completed';
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger, DialogFooter, 
  DialogDescription
} from "@/components/ui/dialog";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MoreVertical, Eye, Check, X, Truck, Package, 
  CreditCard, User, Mail, Phone, Calendar, DollarSign,
  ShoppingCart, UserCheck, ShieldAlert, AlertCircle,
  MapPin, MessageSquare, Hash, Tag, BarChart3,
  Search,
  UserX,
  Link2, 
  
} from "lucide-react";
import Pagination  from "@/components/frontend/pagination-admin";
import { useSearchParams, useRouter } from 'next/navigation';


interface OrderTableProps {
  orders: {
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
    } | null;
    orderItems: {
      product: {
        id: string;
        categoryId: string | null;
        inStock: string | null;
        price: number;
        slug: string;
        title: string;
        description: string;
        manufacturerId: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
        sku: string | null;
      } | null;
      id: string;
      orderId: string | null;
      productId: string | null;
      productSku: string | null;
      price: number;
      title: string;
      quantity: number;
      createdAt: Date | null;
      updatedAt: Date | null;
    }[];
    id: string;
    userId: string | null;
    status: string;
    notes: string | null;
    total: number;
    customerName: string | null;
    customerEmail: string | null;
    customerPhone: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    sku: string | null;
  }[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  totalRevenue: number;
  guestOrders:number;
  total: number;
  limit: number;
  userType?: 'all' | 'guests' | 'registered'; 
  timeRange?: 'all' | 'today' | 'week' | 'month' | 'year';

}

export function OrdersTable({ 
  orders, 
  currentPage, 
  totalPages, 
  total,
  limit,
  totalRevenue,
  totalUsers,
  guestOrders, 
  timeRange,
  userType
}: OrderTableProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [customerType, setCustomerType] = useState<'all' | 'registered' | 'guest'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'total' | 'customer'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [notes, setNotes] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
 
 const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
    
    const [searchValue, setSearchValue] = useState(
      searchParams.get('search') || ''
    );
  
    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      
      const params = new URLSearchParams(searchParams.toString());
      
      if (searchValue.trim()) {
        params.set('search', searchValue.trim());
        params.set('page', '1'); // Сбрасываем на первую страницу
      } else {
        params.delete('search');
      }
      
      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    };
  
    const handleClear = () => {
      setSearchValue('');
      const params = new URLSearchParams(searchParams.toString());
      params.delete('search');
      params.set('page', '1');
      
      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    // Все остальные параметры (search, category) сохраняются автоматически!
    router.push(`?${params.toString()}`);
  };
const showMoreItems = (limit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', limit.toString());
    router.push(`?${params.toString()}`);
}
   const handleUserFilter = (field: 'all' | 'guests' | 'registered') => { 
     const params = new URLSearchParams(searchParams);
    params.set('userType', field);
    router.push(`?${params.toString()}`);
   };
   const handleTimeRange = (range: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('timeRange', range);
    params.set('page', '1'); // Сбрасываем на первую страницу
    router.push(`?${params.toString()}`);
  };
  

   const handleSort = (field: string, order: 'asc' | 'desc') => {
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', field);
    params.set('sortOrder', order);
    router.push(`?${params.toString()}`);
  };

  const currentSortBy = searchParams.get('sortBy') || 'createdAt';
  const currentOrder = searchParams.get('sortOrder') || 'desc';


  // Статусы в зависимости от типа таблицы


  // Фильтрация и сортировка заказов


  // Статистика
  const stats = useMemo(() => {
    const totalAmount = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrder = orders.length > 0 ? totalAmount / orders.length : 0;
    
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const registeredUsers = orders.filter(order => order.user !== null).length;
    const guestUsers = orders.length - registeredUsers;

    const totalItems = orders.reduce((sum, order) => 
      sum + order.orderItems.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    const uniqueProducts = new Set(
      orders.flatMap(order => 
        order.orderItems.map(item => item.productId).filter(Boolean)
      )
    ).size;

    return {
      totalOrders: orders.length,
      totalAmount,
      averageOrder,
      registeredUsers,
      guestUsers,
      totalItems,
      uniqueProducts,
      statusCounts
    };
  }, [orders]);

  // Групповые действия
 

  // Форматирование
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '—';
    const d = new Date(date);
    return d.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (date: Date | null) => {
    if (!date) return '—';
    const d = new Date(date);
    return d.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Получение информации о заказе
  const getOrderSummary = (order: typeof orders[0]) => {
    const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const uniqueItems = order.orderItems.length;
    
    return {
      totalItems,
      uniqueItems,
      itemsText: `${totalItems} шт. (${uniqueItems} поз.)`
    };
  };

  // Получение информации о покупателе
  const getCustomerInfo = (order: typeof orders[0]) => {
    if (order.user) {
      return {
        name: order.user.name,
        email: order.user.email,
        phone: order.user.phoneNumber,
        isRegistered: true,
        isVerified: order.user.emailVerified,
        isBanned: order.user.banned,
        userId: order.user.id
      };
    }
    
    return {
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone,
      isRegistered: false,
      isVerified: false,
      isBanned: false,
      userId: null
    };
  };

  return (
    <div className="space-y-6 px-4">
      {/* Заголовок и статистика */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Заказы в обработке</h1>
          <p className="text-muted-foreground">
          {total} заказов • {totalRevenue.toFixed(2)} руб
          </p>
        </div>
        
       
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-card border rounded-lg p-3">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Заказы</span>
          </div>
          <p className="text-xl font-bold mt-1">{total}</p>
        </div>
        
        <div className="bg-card border rounded-lg p-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Сумма</span>
          </div>
          <p className="text-xl font-bold mt-1">{totalRevenue.toFixed(2)}</p>
        </div>
        
        <div className="bg-card border rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Товары</span>
          </div>
          <p className="text-xl font-bold mt-1">{stats.totalItems}</p>
        </div>
        
        <div className="bg-card border rounded-lg p-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Покупатели</span>
          </div>
          <p className="text-xl font-bold mt-1">{totalUsers}</p>
        </div>
        
        <div className="bg-card border rounded-lg p-3">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Гости</span>
          </div>
          <p className="text-xl font-bold mt-1">{stats.guestUsers}</p>
        </div>
        
        <div className="bg-card border rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Уник. товары</span>
          </div>
          <p className="text-xl font-bold mt-1">{stats.uniqueProducts}</p>
        </div>
      </div>

      {/* Панель фильтров */}
      <div className="flex-row flex gap-4  justify-between">
        <form onSubmit={handleSearch} className="w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Поиск"
           
          />
          
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        
        <Button
          type="submit"
          disabled={isPending}
          variant='outline'
      
        >
          {isPending ? (
            <>
              Поиск...
            </>
          ) : (
            <>
              Найти
            </>
          )}
        </Button>
      </div>
    </form>
        
        
       <div className="flex "> <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="">
                Покупатели
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60">
              <DropdownMenuLabel>Фильтр по</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem  
        onClick={() => handleUserFilter('all')}>
                <User className="mr-2 h-4 w-4" />
                Все пользователи
              </DropdownMenuItem>
              <DropdownMenuItem  onClick={() => handleUserFilter('registered')}>
                <UserCheck className="mr-2 h-4 w-4" />
                Зарегистрированные
              </DropdownMenuItem>
             <DropdownMenuItem  onClick={() => handleUserFilter('registered')}>
                <UserX className="mr-2 h-4 w-4" />
                Гости
              </DropdownMenuItem>
             
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        
        <div className="flex "> <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="">
                Период
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60">
              <DropdownMenuLabel>Фильтр по периоду</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem  
        onClick={() => handleTimeRange('all')}>
                <Calendar className="mr-2 h-4 w-4" />
                Все время
              </DropdownMenuItem>
              <DropdownMenuItem  
              onClick={() => handleTimeRange('today')}>
                <Calendar  className="mr-2 h-4 w-4" />
                Сегодня
              </DropdownMenuItem>
             <DropdownMenuItem  onClick={() => handleTimeRange('week')}>
                <Calendar  className="mr-2 h-4 w-4" />
                Неделя
              </DropdownMenuItem>
              <DropdownMenuItem  onClick={() => handleTimeRange('month')}>
                <Calendar  className="mr-2 h-4 w-4" />
                Месяц
              </DropdownMenuItem>
              <DropdownMenuItem  onClick={() => handleTimeRange('year')}>
                <Calendar className="mr-2 h-4 w-4" />
                Год
              </DropdownMenuItem>
             
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                Сортировка
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>Сортировать по</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem  
        onClick={() => handleSort('createdAt', 'desc')}>
                <Calendar className="mr-2 h-4 w-4" />
                Дате (новые)
              </DropdownMenuItem>
              <DropdownMenuItem  onClick={() => handleSort('createdAt', 'asc')}>
                <Calendar className="mr-2 h-4 w-4" />
                Дате (старые)
              </DropdownMenuItem>
              <DropdownMenuItem  onClick={() => handleSort('total', 'desc')}>
                <DollarSign className="mr-2 h-4 w-4" />
                Сумме (убыв.)
              </DropdownMenuItem>
              <DropdownMenuItem  onClick={() => handleSort('total', 'asc')}>
                <DollarSign className="mr-2 h-4 w-4" />
                Сумме (возр.)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy('customer'); setSortDirection('asc'); }}>
                <User className="mr-2 h-4 w-4" />
                Имени А-Я
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

     

      {/* Таблица заказов */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
             
              <TableHead className="w-[120px]">Номер заказа</TableHead>
              <TableHead className="w-[200px]">Покупатель</TableHead>
              <TableHead className="w-[150px]">Товары</TableHead>
              <TableHead className="w-[100px]">Сумма</TableHead>
              <TableHead className="w-[120px]">Дата</TableHead>
              
              <TableHead className="text-right w-[100px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-12 w-12 text-muted-foreground" />
                    <p className="text-lg font-medium">Заказы не найдены</p>
                    <p className="text-muted-foreground">
                      Попробуйте изменить параметры фильтрации
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const customer = getCustomerInfo(order);
                const orderSummary = getOrderSummary(order);
               
                
                return (
                  <TableRow 
                    key={order.id} 
                    className="group hover:bg-muted/50"
                  >
                    {/* Чекбокс */}
                  
                    
                    {/* ID заказа */}
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <code className="relative rounded bg-muted px-2 py-1 font-mono text-sm font-medium cursor-help">
                              {order.sku}
                            </code>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>ID: {order.id}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    
                    {/* Покупатель */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={customer.isRegistered && order.user?.image || ''} />
                            <AvatarFallback>
                              {order?.customerName?.[0]?.toUpperCase() || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium truncate max-w-[120px]">
                                {order.customerName || 'Без имени'}
                              </span>
                              {customer.isRegistered && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Badge variant="outline" className="h-4 px-1">
                                        <UserCheck className="h-3 w-3" />
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Зарегистрированный пользователь</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              {customer.isBanned && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Badge variant="destructive" className="h-4 px-1">
                                        <ShieldAlert className="h-3 w-3" />
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Пользователь заблокирован</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            {order.customerEmail && (
                              <p className="text-xs text-muted-foreground truncate">
                                {order.customerEmail}
                              </p>
                            )}
                            {order.customerPhone && (
                               <p className="text-xs text-muted-foreground truncate">
                                {order.customerPhone}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    {/* Товары */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <ShoppingCart className="h-3 w-3 text-muted-foreground" />
                          <span>{orderSummary.itemsText}</span>
                        </div>
                        {order.orderItems.length > 0 && (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                           onClick={() => setSelectedOrder(order)}
                          >
                           Показать список
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    
                    {/* Сумма */}
                    <TableCell>
                      <div className="font-semibold">
                        {order.total.toFixed(2)} руб
                      </div>
                    </TableCell>
                    
                    {/* Дата */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {formatDate(order.createdAt)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.createdAt && new Date(order.createdAt).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </TableCell>
                    
                    {/* Статус */}
                   
                    
                    {/* Действия */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-3 mr-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Link href={`/dashboard/order/${order.id}`} className="flex hover flex-rpw items-center gap-2">
                      
                             <Link2 className="size-4"></Link2></Link>
                      </div>
                    </TableCell>
                    
                    {/* Развернутая информация о товарах */}
                    
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Пагинация */}
      <div className="max-w-[600px] mx-auto"><Pagination
        totalPages={totalPages}
        total={total}
        limit={limit}
        currentPage={currentPage}
      /></div>

      {/* Модальное окно деталей заказа */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto min-w-4xl">
          {selectedOrder && (() => {
            const customer = getCustomerInfo(selectedOrder);
            const orderSummary = getOrderSummary(selectedOrder);
            
            
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="h-5 w-5" />
                      <span>Заказ {selectedOrder.sku}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                  
                    >
                     
                    </Badge>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="grid gap-6">
                  {/* Основная информация */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Информация о заказе */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Package className="h-4 w-4" />
                         Заказ
                        </h3>
                        <div className="space-y-3 bg-muted/30 text-[13px] p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground ">Номер заказа:</span>
                            <code className="font-mono bg-background px-2 py-1 rounded">
                              {selectedOrder.sku}
                            </code>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Дата создания:</span>
                            <span className="font-medium">{formatDateTime(selectedOrder.createdAt)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Дата обновления:</span>
                            <span className="font-medium">{formatDateTime(selectedOrder.updatedAt)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Общая сумма:</span>
                            <span className="text-[] font-bold">{formatCurrency(selectedOrder.total)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Примечания */}
                      {selectedOrder.notes && (
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Примечания
                          </h3>
                          <div className="border bg-gray-800/40 border-gray-600 p-4 rounded-lg">
                            <p className="whitespace-pre-wrap text-[13px]">{selectedOrder.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Информация о покупателе */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Аккаунт покупателя
                        </h3>
                        {selectedOrder.user ? (<div className="space-y-3 text-[13px] bg-muted/30 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={customer.isRegistered && selectedOrder.user?.image || ''} />
                              <AvatarFallback className="">
                                {selectedOrder?.user?.name?.[0]?.toUpperCase() || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-lg">{selectedOrder?.user?.name || 'Без имени'}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {customer.isRegistered && (
                                  <Badge variant="default" className="text-xs">
                                    <UserCheck className="h-3 w-3 mr-1" />
                                    Зарегистрирован
                                  </Badge>
                                )}
                                {customer.isVerified && (
                                  <Badge variant="outline" className="text-xs">
                                    ✓ Email подтвержден
                                  </Badge>
                                )}
                                {customer.isBanned && (
                                  <Badge variant="destructive" className="text-xs">
                                    <ShieldAlert className="h-3 w-3 mr-1" />
                                    Заблокирован
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {selectedOrder?.user?.email && (
                            <div className="flex items-center gap-2 pt-2 border-t">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{selectedOrder?.user?.email}</span>
                            </div>
                          )}
                          
                          {selectedOrder?.user?.phoneNumber && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{selectedOrder?.user?.phoneNumber}</span>
                            </div>
                          )}
                          
                          {customer.userId && (
                            <div className="flex items-center gap-2">
                              <Hash className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">ID: </span>
                              <code className="text-xs bg-background px-2 py-1 rounded">
                                {customer.userId.slice(0, 8)}...
                              </code>
                            </div>
                          )}
                          
                          {customer.userId && (
                            <div className="pt-2">
                              <Button asChild variant="outline" size="sm" className="w-full">
                                <Link href={`/dashboard/users/${customer.userId}`} target='_blank'>
                                  <User className="mr-2 h-4 w-4" />
                                  Перейти в профиль 
                                </Link>
                              </Button>
                            </div>
                          )}
                        </div>
                        ) : <div className="space-y-3 text-[13px] bg-muted/30 p-4 rounded-lg">
                          У покупателя нет аккаунта.
                          </div>}
                         <h3 className="font-semibold my-3 text-[14px] flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Данные пользователя в заказе
                        </h3>
                        <div className="space-y-3 text-[13px] bg-muted/30 p-4 rounded-lg">
                         {selectedOrder?.customerName && (
                            <div className="flex items-center gap-2 ">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{selectedOrder?.customerName}</span>
                            </div>
                          )}
                          {selectedOrder?.customerPhone && (
                            <div className="flex items-center gap-2 ">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{selectedOrder?.customerPhone}</span>
                            </div>
                          )}
                         {selectedOrder?.customerEmail && (
                            <div className="flex items-center gap-2 ">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{selectedOrder?.customerEmail}</span>
                            </div>
                          )}
                           
                         
                          </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Таблица товаров */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Товары в заказе ({orderSummary.uniqueItems} позиций, {orderSummary.totalItems} шт.)
                    </h3>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[300px]">Товар</TableHead>
                            <TableHead className="text-right">Цена</TableHead>
                            <TableHead className="text-right">Кол-во</TableHead>
                            <TableHead className="text-right">Сумма</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedOrder.orderItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{item.title}</p>
                                  {item.productSku && (
                                    <p className="text-sm text-muted-foreground">
                                      Артикул: {item.productSku}
                                    </p>
                                  )}
                                  {item.product?.slug && (
                                    <Link 
                                      href={`/product/${item.product.slug}`}
                                      className="text-sm text-blue-600 hover:underline"
                                      target="_blank"
                                    >
                                      Страница товара →
                                    </Link>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                {item.price.toFixed(2)} руб
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="font-medium">{item.quantity}</span>
                                  <span className="text-muted-foreground">шт.</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                {(item.price * item.quantity).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-muted/50">
                            <TableCell colSpan={3} className="text-right font-semibold">
                              Итого:
                            </TableCell>
                            <TableCell className="text-right font-bold text-lg">
                              {formatCurrency(selectedOrder.total)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  {/* Изменение статуса */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Изменить статус заказа</h3>
                    <div className="space-y-4">
                      
                      
                      <div className="flex flex-wrap justify-end gap-2">
                      
                        
                        
                       <Dialog> 
                        <DialogTrigger>
                          <Button variant='default' className="bg-green-500/80 hover:bg-green-600 text-white">Заказ выполнен</Button>
                        </DialogTrigger>
                       
                       <DialogContent>
                      
                       <DialogTitle>
                        Вы уверенны?
                       </DialogTitle>
                       <DialogDescription>
 Это действие отменить невозможно
                       </DialogDescription>
                        <SetOrderCompButton order={selectedOrder} />
                       </DialogContent>
                       </Dialog>
                        <Dialog> 
                        <DialogTrigger>
                          <Button variant='destructive' className="text-white">Отменить заказ</Button>
                        </DialogTrigger>
                       
                       <DialogContent>
                     
                       <DialogTitle>
                        Вы уверенны?
                       </DialogTitle>
                       <DialogDescription>
 Это действие отменить невозможно
                       </DialogDescription>
                        <SetOrderCancButton order={selectedOrder}  />
                       </DialogContent>
                       </Dialog>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                    Закрыть
                  </Button>
              <Button onClick={() => navigator.clipboard.writeText(selectedOrder.sku || "")}>
                    Копировать Номер
                  </Button>
                  <ExportToExcel 
                      orders={[selectedOrder]} 
                      fileName={`Счёт-справка`} 
                      buttonText="Скачать Excel"
                    />
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Пример использования с вашим поиском и пагинацией
export function OrderManagementPage({ 
  orders, 
  currentPage, 
  totalPages, 
  total,
  limit,
  totalRevenue,
  totalUsers,
  guestOrders, 
  userType
}: OrderTableProps & { searchValue: string; handleSearch: (e: React.FormEvent) => void; handleClear: () => void; }) {

   const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
    
    const [searchValue, setSearchValue] = useState(
      searchParams.get('search') || ''
    );
  
    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      
      const params = new URLSearchParams(searchParams.toString());
      
      if (searchValue.trim()) {
        params.set('search', searchValue.trim());
        params.set('page', '1'); // Сбрасываем на первую страницу
      } else {
        params.delete('search');
      }
      
      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    };
  
    const handleClear = () => {
      setSearchValue('');
      const params = new URLSearchParams(searchParams.toString());
      params.delete('search');
      params.set('page', '1');
      
      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    // Все остальные параметры (search, category) сохраняются автоматически!
    router.push(`?${params.toString()}`);
  };
const showMoreItems = (limit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', limit.toString());
    router.push(`?${params.toString()}`);
}

  // Здесь используем ваши обработчики поиска
  // const { searchValue, handleSearch, handleClear } = ...;

  return (
    <div className="space-y-6">
      {/* Поисковая строка */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Поиск по ID заказа, email, телефону или имени..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Поиск...' : 'Найти'}
        </Button>
        {searchValue && (
          <Button type="button" variant="outline" onClick={handleClear}>
            Очистить
          </Button>
        )}
      </form>
      
      {/* Таблица заказов */}
      <OrdersTable
        orders={orders}
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        totalRevenue={totalRevenue}
        limit={limit}
        totalUsers={totalUsers}
        guestOrders={guestOrders}
        userType={userType}
        
      />
    </div>
  );
}