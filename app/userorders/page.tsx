import { getUserOrders } from "@/lib/actions/orders";

export default async function UserOrdersPage() {
    const orders = await getUserOrders();
    return ( 
        <div>
        
        </div>
    )
}