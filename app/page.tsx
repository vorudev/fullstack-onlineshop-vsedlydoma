import Image from "next/image";
import { PlusIcon, UserPlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProductForm} from "@/components/forms/product-form";
import { getCategories } from "@/lib/actions/product-categories";
import ProductsTable from "@/components/products-table";
import { categories } from "@/db/schema";

import { getProducts } from "@/lib/actions/product";
import { getAttributeCategories } from "@/lib/actions/attributes-categories";
export default async function Home() {
const categories = await getCategories(); // Fetch categories 
const products = await getProducts();
  const attributeCategories = await getAttributeCategories();

  return (
     <div className="container mx-auto p-4  ">

      <h1 className="text-2xl font-bold mb-4">Dashboard</h1> 
      <div className="flex justify-end">
      <Dialog>
  <DialogTrigger asChild><Button>Add Item<PlusIcon /></Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Item</DialogTitle>
      <DialogDescription>
        Add a new item to the DataBase
      </DialogDescription>
      <ProductForm categories={categories}/>
    </DialogHeader>
  </DialogContent>
</Dialog>
 
    </div>
      <ProductsTable        initialProducts={products}
      categories={categories}
      attributeCategories={attributeCategories}
/>
    </div>
  );
}
