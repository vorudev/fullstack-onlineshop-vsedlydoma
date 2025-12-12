'use server';
import { Resend } from "resend";
import { OrderConfirmationEmail } from '@/components/email/order-conformation';
import OrderNotificationAdmin from '@/components/email/order-notification-admin';
import type { OrderItem, Order} from '@/db/schema';
import { getAdminEmails } from "./admin";
const resend = new Resend(process.env.RESEND_API_KEY as string);
interface SendOrderEmailsParams {
  order: Order;
  items: OrderItem[];

}

export async function sendOrderEmails(params: SendOrderEmailsParams) {
  const fromEmail = 'noreply@updates.vsedlyadomasantehnika.by'
const adminEmailsRaw = await getAdminEmails();
const adminEmails = adminEmailsRaw.map((email) => email.email);

  const results = {
    customerEmail: { success: false, id: null as string | null, error: null as string | null },
    adminEmail: { success: false, id: null as string | null, error: null as string | null },
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
    console.error('Failed to send admin email:', error);
    results.adminEmail.error = error instanceof Error ? error.message : 'Unknown error';
  }
  try {
    const adminEmailResult = await resend.emails.send({
      from: fromEmail,
      to: adminEmails,
      subject: `Новый заказ ${params.order?.sku}`,
      react: OrderNotificationAdmin({
        sku: params.order?.sku,
        customerName: params.order?.customerName,
        customerEmail: params.order?.customerEmail || '',
        customerPhone: params.order?.customerPhone || '',
        notes: params.order?.notes || '',
        items: params.items,
        total: params.order.total,
        createdAt: params.order.createdAt.toISOString(),
      }),
    });
    if (adminEmailResult.data) {
      results.adminEmail.success = true;
      results.adminEmail.id = adminEmailResult.data.id;
    }
  } catch (error) {
    console.error('Failed to send admin email:', error);
    results.adminEmail.error = error instanceof Error ? error.message : 'Unknown error';
  }


  return results;
}