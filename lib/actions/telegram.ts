// app/actions/telegram.js
'use server'
import { db } from "@/db/drizzle";
import { getTelegramChatIds } from "./admin";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function sendTelegramNotification(message: string) {
  const results = [];
  const chatIds = await getTelegramChatIds();
  const ids = chatIds.map((chatId) => chatId.chatId);
  
  
  for (const chatId of ids) {
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
      
      results.push({
        chatId,
        success: data.ok,
        error: data.ok ? null : data.description,
      });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (error) {
      results.push({
        chatId,
        success: false,
        error: error as string,
      });
    }
  }
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  return {
    success: true,
    total: ids.length,
    successful,
    failed,
    results,
  };
}