
import { getComplitedOrders } from "@/lib/actions/orders";
import ExportToExcel from "@/components/exceljs-download";
import { getProducts } from "@/lib/actions/product";


export default async function OrderPage() {
    const orders = await getComplitedOrders();
    const products = await getProducts();

    return (
        <div>
            {orders.map((order) => (
                <div key={order.id} className="bg-white p-4 text-black border border-gray-300">
                    <h2>Order ID: {order.id}</h2>
                    <p>User ID: {order.userId}</p>
                    <p>Status: {order.status}</p>
                    <p>customer name: {order.customerName}</p>
                    <p>customer email: {order.customerEmail}</p>
                    <p>customer phone: {order.customerPhone}</p>
                    <p>notes: {order.notes}</p>
                    <ExportToExcel  orders={[order]}
                    fileName={`order_${order.id}`} buttonText={"Скачать Excel"}/>

                    <p>Total: ${order.total}</p>
                    {order.orderItems.map((orderItem) => (
                        <div key={orderItem.id}>
                            <p>Product ID: {orderItem.productId}</p>
                            <p>Product Name: {orderItem.title}</p>
                            <p>Quantity: {orderItem.quantity}</p>
                            <p>Price: ${orderItem.price}</p>

                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}