import Link from "next/link";
import HomePage from "@/components/frontend/home";

import { getCategories } from "@/lib/actions/product-categories";
export default async function Home() {
 const categories = await getCategories();
  return (
     <HomePage categories={categories} />
  );
}
