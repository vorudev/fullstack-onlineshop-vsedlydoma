
import { getOrders } from "@/lib/actions/orders";
import { getActiveOrders } from "@/lib/actions/orders";
import { UpdateOrderForm } from "@/components/forms/update-order-form";
import AddOrderItemForm from "@/components/forms/add/add-items-to-order-form";
import ExportToExcel from "@/components/exceljs-download";
import { getProducts } from "@/lib/actions/product";
import { ActiveOrdersTable } from "@/components/active-orders-table";
import { get } from "http";

export default async function OrderPage() {
    const orders = await getActiveOrders();
    return (
        <ActiveOrdersTable  initialOrders={orders} />
       
    );
}