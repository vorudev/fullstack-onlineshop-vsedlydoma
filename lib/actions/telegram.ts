// app/actions/telegram.js
'use server'

import { db } from '@/db/drizzle';
import { telegramSubscribers } from '@/db/schema';
import { eq } from 'drizzle-orm';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Отправка сообщения одному пользователю
export async function sendTelegramNotification(message: string, chatId: string) {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.description || 'Failed to send message');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Telegram notification error:', error);
    return { success: false, error: error as string };
  }
}

// Добавление нового подписчика
export async function addTelegramSubscriber(update: any) {
  try {
    const chatId = update.message?.chat?.id;
    const username = update.message?.chat?.username;
    const firstName = update.message?.chat?.first_name;
    
    if (!chatId) {
      return { success: false, error: 'No chat ID' };
    }

    // Проверяем, существует ли подписчик
    const existing = await db
      .select()
      .from(telegramSubscribers)
      .where(eq(telegramSubscribers.chatId, chatId.toString()))
      .limit(1);

    if (existing.length > 0) {
      // Обновляем существующего
      await db
        .update(telegramSubscribers)
        .set({
          isActive: true,
          lastActive: new Date(),
          username,
          firstName,
        })
        .where(eq(telegramSubscribers.chatId, chatId.toString()));
    } else {
      // Создаем нового
      await db.insert(telegramSubscribers).values({
        chatId: chatId.toString(),
        username,
        firstName,
        isActive: true,
      });
    }

    // Отправляем приветственное сообщение
    await sendTelegramNotification(
      `Привет, ${firstName}! 👋\n\nТы подписан на уведомления о новых заказах.`,
      chatId
    );

    return { success: true };
  } catch (error) {
    console.error('Add subscriber error:', error);
    return { success: false, error: error as string };
  }
}

// Рассылка всем активным подписчикам
export async function notifyAllSubscribers(message: string) {
  try {
    // Получаем всех активных подписчиков
    const subscribers = await db
      .select()
      .from(telegramSubscribers)
      .where(eq(telegramSubscribers.isActive, true));

    const results = [];

    for (const subscriber of subscribers) {
      try {
        const response = await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: subscriber.chatId,
              text: message,
              parse_mode: 'HTML',
            }),
          }
        );

        const data = await response.json();

        if (!data.ok) {
          // Если бот заблокирован (403), деактивируем подписчика
          if (data.error_code === 403) {
            await db
              .update(telegramSubscribers)
              .set({ isActive: false })
              .where(eq(telegramSubscribers.chatId, subscriber.chatId));
          }
          results.push({ chatId: subscriber.chatId, success: false });
        } else {
          results.push({ chatId: subscriber.chatId, success: true });
        }
      } catch (error) {
        results.push({ chatId: subscriber.chatId, success: false, error: error as string });
      }

      // Небольшая задержка, чтобы не нарушить rate limit Telegram (30 msg/sec)
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    return {
      success: true,
      total: subscribers.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
    };
  } catch (error) {
    console.error('Broadcast error:', error);
    return { success: false, error: error as string };
  }
}

// Получить количество активных подписчиков
export async function getSubscriberCount() {
  try {
    const subscribers = await db
      .select()
      .from(telegramSubscribers)
      .where(eq(telegramSubscribers.isActive, true));
    
    return { count: subscribers.length };
  } catch (error) {
    return { count: 0, error: error as string };
  }
}