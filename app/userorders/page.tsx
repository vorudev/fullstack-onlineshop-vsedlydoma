import { getUserOrders } from "@/lib/actions/orders";

export default async function UserOrdersPage() {
    const orders = await getUserOrders();
    return ( 
        <div>
            {orders.map((order) => (
                <div key={order.id} className="bg-white p-4 text-black border border-gray-300 mb-4">
                    <h2 className="text-xl font-bold mb-2">Order ID: {order.id}</h2>
                    <p className="mb-1">Status: {order.status}</p>
                    <p className="mb-1">Customer Name: {order.customerName}</p>
                    <p className="mb-1">Customer Email: {order.customerEmail}</p>
                    <p className="mb-1">Customer Phone: {order.customerPhone}</p>
                    {order.notes && <p className="mb-1">Notes: {order.notes}</p>}
                    <p className="mb-2 font-semibold">Total: ${order.total.toFixed(2)}</p>
                    {order.orderItems.map((orderItem) => (
                        <div key={orderItem.id} className="border-t pt-2 mt-2">
                            <div className="flex items-center space-x-4">
                                
                                <div>
                                    <p className="font-semibold">{orderItem.title}</p>
                                    <p>Quantity: {orderItem.quantity}</p>
                                    <p>Price: ${orderItem.price.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}