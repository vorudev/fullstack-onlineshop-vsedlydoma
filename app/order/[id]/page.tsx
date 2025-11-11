import { getOrderById } from "@/lib/actions/orders";
import OrderSuccess from "@/components/frontend/order-success";

export default async function OrderPage({ params }: { params: { id: string } }) {
    const order = await getOrderById(params.id);
    return (
        <main>
<OrderSuccess order={order} />
        </main>
    );
}
