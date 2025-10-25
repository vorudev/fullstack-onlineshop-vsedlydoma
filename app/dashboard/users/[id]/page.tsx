import { getUserById } from "@/lib/actions/admin";
import { getOrderByUserId } from "@/lib/actions/orders";
import AdminOrdersTable from "./order-history";

export default async function UsersPage({ params }: { params: Promise<{ id: string }> }) {
  // Ожидаем params перед использованием 
  const { id } = await params;
  const orders = await getOrderByUserId(id);
  return ( 
    <div>

      <AdminOrdersTable orders={orders} />
    </div>
  )
}