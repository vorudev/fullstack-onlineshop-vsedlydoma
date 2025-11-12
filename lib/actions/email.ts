'use server';
import { Resend } from "resend";
import { OrderConfirmationEmail } from '@/components/email/order-conformation';
import type { OrderItem, Order} from '@/db/schema';

const resend = new Resend(process.env.RESEND_API_KEY as string);
interface SendOrderEmailsParams {
  order: Order;
  items: OrderItem[];

}

export async function sendOrderEmails(params: SendOrderEmailsParams) {
  const fromEmail = 'onboarding@resend.dev'

  const results = {
    customerEmail: { success: false, id: null as string | null, error: null as string | null },
  };
if (!params.order.customerEmail || !params.order.customerName || !params.order.createdAt || !params.order.sku) {
  throw new Error('Customer email is missing');
}

  // Отправка письма клиенту
  try {
    const customerEmailResult = await resend.emails.send({
      from: fromEmail,
      to: params.order.customerEmail,
      subject: `Заказ ${params.order?.sku} успешно оформлен`,
      react: OrderConfirmationEmail({
        sku: params.order?.sku,
        customerName: params.order?.customerName,
        items: params.items,
        total: params.order.total,
        createdAt: params.order.createdAt.toISOString(),
      }),
    });

    if (customerEmailResult.data) {
      results.customerEmail.success = true;
      results.customerEmail.id = customerEmailResult.data.id;
    }
  } catch (error) {
    console.error('Failed to send customer email:', error);
    results.customerEmail.error = error instanceof Error ? error.message : 'Unknown error';
  }


  return results;
}