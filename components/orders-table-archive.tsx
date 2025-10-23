
import { TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, Table } from "./ui/table";

import { Order } from "@/db/schema";
import { OrderItem } from "@/db/schema";
import { Product } from "@/db/schema";
import Link from "next/link";

interface OrdersTableProps {
    orders: Order[]
}
export default function OrdersTable({ orders}: OrdersTableProps) {
    return (
         <div className="space-y-4">
      {/* Поле поиска */}
   
      {/* Показать количество результатов */}
 
      <Table>
        <TableCaption>A list of your orders</TableCaption>
   
        <TableBody>
            {orders.map((order) => (
              <TableRow className="flex items-center justify-center" key={order.id}>
                <TableCell className="border-r w-full">
                  <Link href={`/dashboard/order/archive/${order.id}`}>
                   ID заказа: {order.id}
                  </Link>
                </TableCell>
                <TableCell className="border-r">Cумма заказа: {order.total} руб</TableCell>
                <TableCell>{order.customerEmail}</TableCell>
                <TableCell>{order.customerPhone}</TableCell>
                <TableCell className="text-right">
                   {order.customerName}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
    )
}