'use server';

import { db } from "@/db/drizzle";
import { orders, Order } from "@/db/schema";
import { user, User } from "@/db/schema";
import { NextResponse } from "next/server";
import { sendOrderEmails } from "./email";
import { sendTelegramNotification } from "./telegram";
import { products, Product } from "@/db/schema";
import { orderItems, OrderItem } from "@/db/schema";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { and, asc, gte, ilike, inArray, isNotNull, isNull, lte, or, relations, sql } from 'drizzle-orm';
import { desc } from "drizzle-orm";
import { rateLimitbyIp } from "./limiter";
import { eq, ne } from "drizzle-orm";
import { custom } from "zod";
type CreateOrderData = Omit<Order, "id" | "createdAt" | "updatedAt" | "userId" | "total" | "sku" | "status">;

export type CreateOrderItemData = Omit<OrderItem, "id" | "createdAt" | "updatedAt" | "orderId">;

export async function getOrderById(id: string) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true
        }
      },
      orderItems: {
        with: {
          product: true
        }
      }
    }
  });

  return order;
}
export async function getActiveOrders() {
    
  return db
    .select(
      {
        id: orders.id,
        createdAt: orders.createdAt,
        total: orders.total,
        userId: orders.userId,
        customerName: orders.customerName,
        customerEmail: orders.customerEmail,
        customerPhone: orders.customerPhone,
        sku: orders.sku
      }
    )
    .from(orders)
    .where(and
      (
        ne(orders.status, 'completed'), 
        ne(orders.status, 'cancelled')
      )
    )
    .orderBy(desc(orders.createdAt));
}


export async function getOrders() {
    try {
         const allOrders = await db
        .select()
        .from(orders)
        .where(ne(orders.status, 'completed'));
        
        const ordersWithDetails = await Promise.all(
            allOrders.map(async (order) => {
                const items = await db
                    .select()
                    .from(orderItems)
                    .where(eq(orderItems.orderId, order.id));

                const orderUser = order.userId 
                    ? await db
                        .select()
                        .from(user)
                        .where(eq(user.id, order.userId))
                        .limit(1)
                    : null;

                const itemsWithProducts = await Promise.all(
                    items.map(async (item) => {
                        const product = item.productId
                            ? await db
                                .select()
                                .from(products)
                                .where(eq(products.id, item.productId))
                                .limit(1)
                            : null;

                        return {
                            ...item,
                            product: product?.[0] || null
                        };
                    })
                );

                return {
                    ...order,
                    user: orderUser?.[0] || null,
                    orderItems: itemsWithProducts
                };
            })
        );

        return ordersWithDetails;
    } catch (error) {
        console.error("Error getting orders:", error);
        throw new Error("Failed to get orders");
    }
}

export const getAllComplitedOrders = async ({
    page = 1,
    pageSize = 20,
    search = ''
  }: GetComplitedOrdersParams = {}) => {
 
     try {
      const offset = (page - 1) * pageSize;
      const conditions = [];
      
      // Базовое условие - статус completed
      conditions.push(eq(orders.status, 'completed'));
      
      // Добавляем условия поиска если есть
      if (search) {
  const searchConditions = [
    ilike(orders.customerName, `%${search}%`),
    ilike(orders.customerEmail, `%${search}%`),
    ilike(orders.customerPhone, `%${search}%`),
    ilike(orders.sku, `%${search}%`),
    sql`CAST(${orders.id} AS TEXT) ILIKE ${`%${search}%`}` // Приводим UUID к тексту
  ];
  
  // Только если у тебя есть числовое поле, например orderNumber
  if (!isNaN(Number(search))) {
    searchConditions.push(
      eq(orders.total, Number(search)) // Замени orderNumber на реальное числовое поле
    );
  }
  
  conditions.push(or(...searchConditions));
}
      
      // Получаем общее количество для пагинации
      const [totalResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(orders)
        .where(and(...conditions));
      
      const total = Number(totalResult.count);
      
      // Получаем заказы с пагинацией
      const allOrders = await db
        .select()
        .from(orders)
        .where(and(...conditions))
        .limit(pageSize)
        .offset(offset)
        .orderBy(desc(orders.createdAt)); // Сортировка по дате создания
       
   
      
      return {
        orders: allOrders,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      };
    } catch (error) {
        console.error("Error getting orders:", error);
        throw new Error("Failed to get orders");
    }
}
export const getComplitedOrders = async ({
    page = 1,
    pageSize = 20,
    search = '', 
    sortBy = 'createdAt',
  sortOrder = 'desc',
  }: GetComplitedOrdersParams = {}) => {
 
     try {
      const offset = (page - 1) * pageSize;
      const conditions = [];
      
      // Базовое условие - статус completed
      conditions.push(eq(orders.status, 'completed'));
      
      // Добавляем условия поиска если есть
      if (search) {
  const searchConditions = [
    ilike(orders.customerName, `%${search}%`),
    ilike(orders.customerEmail, `%${search}%`),
    ilike(orders.sku, `%${search}%`),
    ilike(orders.customerPhone, `%${search}%`),
    sql`CAST(${orders.id} AS TEXT) ILIKE ${`%${search}%`}` // Приводим UUID к тексту
  ];
  
  // Только если у тебя есть числовое поле, например orderNumber
  if (!isNaN(Number(search))) {
    searchConditions.push(
      eq(orders.total, Number(search)) // Замени orderNumber на реальное числовое поле
    );
  }
  
  conditions.push(or(...searchConditions));
}
      
      // Получаем общее количество для пагинации
      const [totalResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(orders)
        .where(and(...conditions));
      
      const total = Number(totalResult.count);
      
      // Получаем заказы с пагинацией
      const allOrders = await db
        .select()
        .from(orders)
        .where(and(...conditions))
        .limit(pageSize)
        .offset(offset)
        .orderBy(desc(orders.createdAt)); // Сортировка по дате создания
       
      const ordersWithDetails = await Promise.all(
        allOrders.map(async (order) => {
          const items = await db
            .select()
            .from(orderItems)
            .where(eq(orderItems.orderId, order.id));
            
          const orderUser = order.userId
            ? await db
                .select()
                .from(user)
                .where(eq(user.id, order.userId))
                .limit(1)
            : null;
            
          const itemsWithProducts = await Promise.all(
            items.map(async (item) => {
              const product = item.productId
                ? await db
                    .select()
                    .from(products)
                    .where(eq(products.id, item.productId))
                    .limit(1)
                : null;
                
              return {
                ...item,
                product: product?.[0] || null
              };
            })
          );
          
          return {
            ...order,
            user: orderUser?.[0] || null,
            orderItems: itemsWithProducts
          };
        })
      );
      
      return {
        orders: ordersWithDetails,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      };
    } catch (error) {
        console.error("Error getting orders:", error);
        throw new Error("Failed to get orders");
    }
}
interface GetComplitedOrdersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
   sortBy?: 'createdAt' | 'total' | 'guestOrders' | 'registeredOrders'; // 👈 Поле для сортировки
  sortOrder?: 'asc' | 'desc'; // 👈 Направление сортировки
 userType?: 'all' | 'guests' | 'registered'; // 👈 Изменено на userType
 timeRange?: 'all' | 'today' | 'week' | 'month' | 'year';

  
}
export const getAllOrders = async ({
    page = 1,
    pageSize = 20,
    search = '',
    status = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    userType = 'all', // 👈 По умолчанию показываем всех
    timeRange = 'all'


    
    
  }: GetComplitedOrdersParams = {}) => {
 
     try {
      const offset = (page - 1) * pageSize;
      const conditions = [];

      conditions.push(eq(orders.status, status));

        if (userType === 'guests') {
      conditions.push(isNull(orders.userId)); // 👈 Только гостевые
    } else if (userType === 'registered') {
      conditions.push(isNotNull(orders.userId)); // 👈 Только зарегистрированные
    }
     if (timeRange !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (timeRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0)); // Начало сегодняшнего дня
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7)); // 7 дней назад
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1)); // 1 месяц назад
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1)); // 1 год назад
          break;
        default:
          startDate = new Date(0); // Все время
      }
      
      conditions.push(gte(orders.createdAt, startDate)); // createdAt >= startDate
    }
      // Добавляем условия поиска если есть
      if (search) {
  const searchConditions = [
    ilike(orders.customerName, `%${search}%`),
    ilike(orders.customerEmail, `%${search}%`),
    ilike(orders.customerPhone, `%${search}%`),
    ilike(orders.sku, `%${search}%`),
    sql`CAST(${orders.id} AS TEXT) ILIKE ${`%${search}%`}` // Приводим UUID к тексту
  ];
  
  // Только если у тебя есть числовое поле, например orderNumber
  if (!isNaN(Number(search))) {
    searchConditions.push(
      eq(orders.total, Number(search)) // Замени orderNumber на реальное числовое поле
    );
  }
  
  conditions.push(or(...searchConditions));
}
      
  // Простой switch для выбора поля
  let orderByColumn;
  
  switch (sortBy) {
    case 'total':
      orderByColumn = orders.total;
      break;
       case 'guestOrders':
    // Сортировка: сначала гостевые (userId = null), потом зарегистрированные
    orderByColumn = sql`${orders.userId} IS NULL`;
    break;
  case 'registeredOrders':
    // Сортировка: сначала зарегистрированные (userId != null), потом гостевые
    orderByColumn = sql`${orders.userId} IS NOT NULL`;
    break;
    case 'createdAt':
    default:
      orderByColumn = orders.createdAt;
      break;
  }
  const orderByClause = sortOrder === 'asc' 
    ? asc(orderByColumn) 
    : desc(orderByColumn);
      // Получаем заказы с пагинацией
      const allOrders = await db
        .select()
        .from(orders)
        .where(and(...conditions))
        .orderBy(orderByClause)
        .limit(pageSize)
        .offset(offset)
       const ordersWithDetails = await Promise.all(
            allOrders.map(async (order) => {
                const items = await db
                    .select()
                    .from(orderItems)
                    .where(eq(orderItems.orderId, order.id));

                const orderUser = order.userId 
                    ? await db
                        .select()
                        .from(user)
                        .where(eq(user.id, order.userId))
                        .limit(1)
                    : null;

                const itemsWithProducts = await Promise.all(
                    items.map(async (item) => {
                        const product = item.productId
                            ? await db
                                .select()
                                .from(products)
                                .where(eq(products.id, item.productId))
                                .limit(1)
                            : null;

                        return {
                            ...item,
                            product: product?.[0] || null
                        };
                    })
                );

                return {
                    ...order,
                    user: orderUser?.[0] || null,
                    orderItems: itemsWithProducts
                };
            })
        );
   
const [statsResult] = await db
  .select({ 
    count: sql<number>`count(*)`,
    totalRevenue: sql<number>`coalesce(sum(${orders.total}), 0)`,
    totalUsers: sql<number>`count(distinct ${orders.userId})`,
    guestOrders: sql<number>`count(*) filter (where ${orders.userId} is null)`, // 👈 Гостевые заказы
  })
  .from(orders)
  .where(and(...conditions));

const totalOrders = Number(statsResult?.count);
const totalRevenue = Number(statsResult?.totalRevenue);
const totalUsers = Number(statsResult?.totalUsers);
const guestOrders = Number(statsResult?.guestOrders);
   
      
      return {
        ordersWithDetails,
        pagination: {
          page,
          pageSize,
          totalOrders,
          totalUsers,
          totalRevenue,
          guestOrders,
          totalPages: Math.ceil(totalOrders / pageSize)
        }
      };
    } catch (error) {
        console.error("Error getting orders:", error);
        throw new Error("Failed to get orders");
    }
}
function sanitizeString(str: string | null): string {
  if (!str) return '';
  return str
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '') 
    .trim();
}
export async function createOrder(orderInput: CreateOrderData, orderItemsInput: CreateOrderItemData[]) {
    // Получаем сессию, но не требуем её обязательно
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    // userId будет либо ID пользователя, либо null для гостевых заказов
    const userId = session?.user?.id ?? null;
   // await rateLimitbyIp(5, 15 * 60 * 1000);
    
    try { 
        const total = orderItemsInput.reduce((acc, item) => acc + item.price * item.quantity, 0);
        
        
        const order = await db.insert(orders).values({
          customerName: orderInput.customerName,
          customerEmail: orderInput.customerEmail,
          customerPhone: orderInput.customerPhone,
          notes: orderInput.notes,
          status: 'pending',
            total,
            userId // может быть null для гостей
        }).returning();

        const orderItemsWithOrderId = orderItemsInput.map((item) => ({
            ...item,
            orderId: order[0].id
        }));
        
        const orderItem = await db.insert(orderItems).values(orderItemsWithOrderId).returning();
        try{ await sendOrderEmails({ order: order[0], items: orderItem }); 
      } catch(mailError) { 
 console.error("failed to send notitfications", mailError);
      }

          try {
    await sendTelegramNotification(`
 🎉 <b>НОВЫЙ ЗАКАЗ!</b>

📋 <b>Информация о заказе:</b>
🆔 Номер заказа: <code>${order[0].sku}</code>
💰 Сумма: <b>${order[0].total} ₽</b>

 👤 <b>Клиент:</b>
━━━━━━━━━━━━━━━━━━
- Имя: ${order[0].customerName}
- Email: ${order[0].customerEmail}
- Телефон: ${order[0].customerPhone}

🛒 <b>Товары:</b>
${orderItem.map(item => `• ${item.title} x ${item.quantity} — ${item.price} руб (SKU: ${item.productSku})`).join('\n')}

📝 <b>Комментарий:</b>
${order[0].notes || 'Нет комментария'}

🕐 <b>Дата:</b> ${order[0].createdAt?.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'

 })}
━━━━━━━━━━━━━━━━━━
`.trim());
  } catch (telegramError) {
    console.error("Failed to send Telegram notification:", telegramError);
    // Продолжаем работу, заказ уже создан
  }

   
        return { order, orderItem, orderId: order[0].id || '' };
    } catch (error) {
        console.error("Error creating order:", error);
        throw new Error("Failed to create order");
    }
}

interface GetUserOrdersParams {
    page?: number;
    pageSize?: number;
    status?: string;
    search?: string;
}
  export async function getUserOrders(
  {page = 1, pageSize = 20, search = '', status = ''}: GetUserOrdersParams = {}
) {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  if (!session) {
    throw new Error("Unauthorized");
  }
  
  try {
    const offset = (page - 1) * pageSize;
    const conditions = [];
    
    // Базовые условия
    conditions.push(eq(orders.userId, session.user.id));
    
    // ❌ ОШИБКА: если status пустая строка, это условие сломает запрос
    if (status) {
      conditions.push(eq(orders.status, status));
    }
    
    // ❌ ОШИБКА: нельзя искать по date полям через ilike
    // ❌ ОШИБКА: orderItems недоступны в этом запросе без JOIN
    if (search) {
      const searchConditions = [
        // Поиск по строковым полям заказа
        ilike(orders.customerName, `%${search}%`),
        ilike(orders.customerEmail, `%${search}%`),
        ilike(orders.customerPhone, `%${search}%`),
        ilike(orders.sku, `%${search}%`),
        sql`CAST(${orders.id} AS TEXT) ILIKE ${`%${search}%`}`
      ];
      
      // Поиск по числовым полям
      if (!isNaN(Number(search))) {
        searchConditions.push(eq(orders.total, Number(search)));
      }
      
      conditions.push(or(...searchConditions));
    }
    
    // Получаем общее количество
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(and(...conditions));
    
    const total = Number(totalResult.count);
    
    // Получаем заказы
    const userOrders = await db
      .select()
      .from(orders)
      .where(and(...conditions))
      .limit(pageSize)
      .offset(offset)
      .orderBy(desc(orders.createdAt));
    
    // Если заказов нет
    if (userOrders.length === 0) {
      return {
        orders: [],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: 0
        }
      };
    }
    
    // ✅ ОПТИМИЗАЦИЯ: Получаем все товары одним запросом
    const orderIds = userOrders.map(o => o.id);
    
    const allOrderItems = await db
      .select()
      .from(orderItems)
      .where(inArray(orderItems.orderId, orderIds));
    
    // Группируем товары по заказам
    const itemsByOrder = allOrderItems.reduce((acc, item) => {
      if (!acc[item.orderId!]) {
        acc[item.orderId!] = [];
      }
      acc[item.orderId!].push(item);
      return acc;
    }, {} as Record<string, typeof allOrderItems>);
    
    // Формируем результат
    const ordersWithItems = userOrders.map(order => ({
      ...order,
      orderItems: itemsByOrder[order.id] || []
    }));
    
    return {
      orders: ordersWithItems,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
    
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}
export async function getOrderByUserId(userId: string) {
    try {
        const userOrders = await db
            .select()
            .from(orders)
            .where(eq(orders.userId, userId))
            .orderBy(desc(orders.createdAt));

            const ordersWithItems = await Promise.all(
                userOrders.map(async (order) => {
                    const items = await db
                        .select()
                        .from(orderItems)
                        .where(eq(orderItems.orderId, order.id));
                    const userInfo = await db 
                        .select()
                        .from(user)
                        .where(eq(user.id, userId));
                    
                    return {
                        ...order,
                        orderItems: items,
                        userInfo: userInfo[0]
                    };
                })
            )

        return ordersWithItems;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Failed to fetch orders");
    }
}

export async function updateOrder(order: Omit<Order, "createdAt" | "updatedAt" | "userId" | "sku">) {
try { 
  const session = await auth.api.getSession({
        headers: await headers()
      })
      if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
await db.update(orders).set(order).where(eq(orders.id, order.id));
} catch (error) {
    console.error("Error updating order:", error);
    throw new Error("Failed to update order");
}
}

export async function addItemsToOrder(
  orderId: string,
  newItems: CreateOrderItemData[]
) {
  try {
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    // Проверяем заказ
    const [existingOrder] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!existingOrder) {
      throw new Error("Order not found");
    }

    // Получаем существующие товары в заказе
    const existingItems = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    const addedItems = [];
    let addedTotal = 0;

    for (const newItem of newItems) {
      // Ищем существующий товар с таким же productId (или другим уникальным идентификатором)
      const existingItem = existingItems.find(
        (item) => item.productId === newItem.productId
      );

      if (existingItem) {
        // Если товар уже есть - обновляем количество
        const newQuantity = existingItem.quantity + newItem.quantity;
        const [updatedItem] = await db
          .update(orderItems)
          .set({ quantity: newQuantity })
          .where(eq(orderItems.id, existingItem.id))
          .returning();
        
        addedItems.push(updatedItem);
        addedTotal += newItem.price * newItem.quantity;
      } else {
        // Если товара нет - создаем новый
        const [insertedItem] = await db
          .insert(orderItems)
          .values({
            ...newItem,
            orderId: orderId
          })
          .returning();
        
        addedItems.push(insertedItem);
        addedTotal += newItem.price * newItem.quantity;
      }
    }

    // Обновляем total заказа
    const [updatedOrder] = await db
      .update(orders)
      .set({ total: existingOrder.total + addedTotal })
      .where(eq(orders.id, orderId))
      .returning();

    return { order: updatedOrder, addedItems };
  } catch (error) {
    console.error("Error adding items to order:", error);
    throw new Error("Failed to add items to order");
  }
}

export async function deleteItemFromOrder(orderId: string, itemId: string) {
  try {
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    const [deletedItem] = await db
      .delete(orderItems)
      .where(and(eq(orderItems.orderId, orderId), eq(orderItems.id, itemId)))
      .returning();
    
    // Проверка: была ли удалена запись
    if (!deletedItem) {
      throw new Error("Item not found in order");
    }
    
    return deletedItem;
  } catch (error) {
    console.error("Error deleting item from order:", error);
    throw new Error("Failed to delete item from order");
  }
}
export async function getMonthlyOrderStats(year: number, month: number) {
  // Определяем границы текущего месяца
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  // Определяем границы предыдущего месяца
  const previousMonth = month === 1 ? 12 : month - 1;
  const previousYear = month === 1 ? year - 1 : year;
  const previousStartDate = new Date(previousYear, previousMonth - 1, 1);
  const previousEndDate = new Date(previousYear, previousMonth, 0, 23, 59, 59);

  // Один запрос для обоих месяцев с условной агрегацией
  const stats = await db
    .select({
      // Текущий месяц
      currentTotalOrders: sql<number>`count(*) filter (where ${orders.createdAt} >= ${startDate} and ${orders.createdAt} <= ${endDate})::int`,
      currentTotalRevenue: sql<number>`sum(case when ${orders.createdAt} >= ${startDate} and ${orders.createdAt} <= ${endDate} and ${orders.status} not in ('cancelled', 'pending') then ${orders.total} else 0 end)::float`,
      currentAverageOrderValue: sql<number>`avg(case when ${orders.createdAt} >= ${startDate} and ${orders.createdAt} <= ${endDate} and ${orders.status} not in ('cancelled', 'pending') then ${orders.total} else null end)::float`,
      currentCompletedOrders: sql<number>`count(*) filter (where ${orders.createdAt} >= ${startDate} and ${orders.createdAt} <= ${endDate} and ${orders.status} = 'completed')::int`,
      currentPendingOrders: sql<number>`count(*) filter (where ${orders.createdAt} >= ${startDate} and ${orders.createdAt} <= ${endDate} and ${orders.status} = 'pending')::int`,
      currentCancelledOrders: sql<number>`count(*) filter (where ${orders.createdAt} >= ${startDate} and ${orders.createdAt} <= ${endDate} and ${orders.status} = 'cancelled')::int`,
      
      // Предыдущий месяц
      previousTotalOrders: sql<number>`count(*) filter (where ${orders.createdAt} >= ${previousStartDate} and ${orders.createdAt} <= ${previousEndDate})::int`,
      previousTotalRevenue: sql<number>`sum(case when ${orders.createdAt} >= ${previousStartDate} and ${orders.createdAt} <= ${previousEndDate} and ${orders.status} not in ('cancelled', 'pending') then ${orders.total} else 0 end)::float`,
      previousAverageOrderValue: sql<number>`avg(case when ${orders.createdAt} >= ${previousStartDate} and ${orders.createdAt} <= ${previousEndDate} and ${orders.status} not in ('cancelled', 'pending') then ${orders.total} else null end)::float`,
      previousCompletedOrders: sql<number>`count(*) filter (where ${orders.createdAt} >= ${previousStartDate} and ${orders.createdAt} <= ${previousEndDate} and ${orders.status} = 'completed')::int`,
      previousPendingOrders: sql<number>`count(*) filter (where ${orders.createdAt} >= ${previousStartDate} and ${orders.createdAt} <= ${previousEndDate} and ${orders.status} = 'pending')::int`,
      previousCancelledOrders: sql<number>`count(*) filter (where ${orders.createdAt} >= ${previousStartDate} and ${orders.createdAt} <= ${previousEndDate} and ${orders.status} = 'cancelled')::int`,
    })
    .from(orders)
    .where(
      and(
        gte(orders.createdAt, previousStartDate),
        lte(orders.createdAt, endDate)
      )
    );

  const result = stats[0];

  // Функция для безопасного расчета процента изменения
  const calculateGrowth = (current: number, previous: number): number | null => {
    if (!previous || previous === 0) return current > 0 ? 100 : 0;
    return Number(((current - previous) / previous * 100).toFixed(2));
  };

  return {
    current: {
      totalOrders: result.currentTotalOrders,
      totalRevenue: result.currentTotalRevenue || 0,
      averageOrderValue: result.currentAverageOrderValue || 0,
      completedOrders: result.currentCompletedOrders,
      pendingOrders: result.currentPendingOrders,
      cancelledOrders: result.currentCancelledOrders,
    },
    previous: {
      totalOrders: result.previousTotalOrders,
      totalRevenue: result.previousTotalRevenue || 0,
      averageOrderValue: result.previousAverageOrderValue || 0,
      completedOrders: result.previousCompletedOrders,
      pendingOrders: result.previousPendingOrders,
      cancelledOrders: result.previousCancelledOrders,
    },
    growth: {
      totalOrders: calculateGrowth(result.currentTotalOrders, result.previousTotalOrders),
      totalRevenue: calculateGrowth(result.currentTotalRevenue || 0, result.previousTotalRevenue || 0),
      averageOrderValue: calculateGrowth(result.currentAverageOrderValue || 0, result.previousAverageOrderValue || 0),
      completedOrders: calculateGrowth(result.currentCompletedOrders, result.previousCompletedOrders),
      pendingOrders: calculateGrowth(result.currentPendingOrders, result.previousPendingOrders),
      cancelledOrders: calculateGrowth(result.currentCancelledOrders, result.previousCancelledOrders),
    }
  };
}
