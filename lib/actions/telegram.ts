// app/actions/telegram.js
'use server'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Список Chat IDs - добавьте свои
const CHAT_IDS = [
  '941485514',  // Замените на реальные Chat IDs
  // Добавьте сюда Chat IDs тех, кому нужны уведомления
];

export async function sendTelegramNotification(message: string) {
  const results = [];
  
  for (const chatId of CHAT_IDS) {
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
      
      // Задержка чтобы не нарушить rate limit Telegram (30 msg/sec)
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
    total: CHAT_IDS.length,
    successful,
    failed,
    results,
  };
}