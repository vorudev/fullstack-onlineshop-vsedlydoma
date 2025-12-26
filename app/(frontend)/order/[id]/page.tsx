import { getOrderById } from "@/lib/actions/orders";
import OrderSuccess from "@/components/frontend/order-success";
import { Metadata } from "next";
export async function generateMetadata({ params  }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
    const id = await params;
    const order = await getOrderById(id.id);
  
  const canonicalUrl = `https://fullstack-onlineshop-vsedlydoma.vercel.app/order/${id.id}`;
  return {
    title:  `Заказ: ${order?.sku}`, // или productDetails.title
    description: `Заказ ${order?.sku} - ${ 'В магазине Все для дома в Минске'}`,
    keywords: `Заказ все для дома, все для дома, сантехника, товары для дома минск`,
    alternates: {
      canonical: canonicalUrl, // ← Вот это нужно добавить
    },
    openGraph: {
      type: 'website', 
      url: canonicalUrl, // Тоже хорошо для соцсетей
      title: `Заказ: ${order?.sku}`,
      description: `Заказывайте в магазине Все для дома сантехника`,
      siteName: 'Магазин Всё для дома',
      locale: 'ru_RU',

    },
    robots: { 
        index: true,
        follow: true, 
        nocache: false,
        googleBot: { 
            index: true, 
            follow: true, 
            "max-snippet": -1, 
            "max-image-preview": "large",
            "max-video-preview": "large"
        }
    }
  };
}
export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
    const id = await params;
    const order = await getOrderById(id.id);
    return (
        <main>
<OrderSuccess order={order} />
        </main>
    );
}
