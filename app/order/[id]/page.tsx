import { getOrderById } from "@/lib/actions/orders";
import OrderSuccess from "@/components/frontend/order-success";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
    const id = await params;
    const order = await getOrderById(id.id);
    return (
        <main>
<OrderSuccess order={order} />
        </main>
    );
}
