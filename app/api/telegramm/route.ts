// app/api/telegram-webhook/route.js
import { addTelegramSubscriber } from '@/lib/actions/telegram';

export async function POST(request: Request) {
  try {
    const update = await request.json();
    
    // Обрабатываем команду /start
    if (update.message?.text === '/start') {
      await addTelegramSubscriber(update);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error as string }, { status: 500 });
  }
}