'use client';
import Link from 'next/link';


export default function SideBar() {
  return (
    <div className="w-64 p-4 border-r">
      <ul>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/dashboard/products">Products</Link>
        </li>
        <li>
          <Link href="/dashboard/orders">Orders</Link>
        </li>
        <li>
          <Link href="/dashboard/users">Customers</Link>
        </li>
      </ul>
    </div>
  );
}