import { getAllCategories } from "@/lib/actions/product-categories";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
 const searchParams = req.nextUrl.searchParams;
 const search = searchParams.get('search') || '';
 const { categories } = await getAllCategories({
   page: 1,
   pageSize: 20, // достаточно для выпадающего списка
   search,
 });
 
 return Response.json(categories);
}