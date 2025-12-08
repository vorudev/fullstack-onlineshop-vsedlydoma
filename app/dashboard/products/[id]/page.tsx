'use server';
import { getProductsBySlug } from "@/lib/actions/product";
import { getProductAttributesWithCategories } from "@/lib/actions/attributes";
import AttributesTable from "@/components/attributes-table";
import AttributeForm from "@/components/forms/attributes-form";
import Image from "next/image";
import { getCategories } from "@/lib/actions/product-categories";
import { getProductImages } from "@/lib/actions/image-actions";
import {CreateImagesToProductForm} from "@/components/forms/create-images-to-product-form";
import { Button } from "@/components/ui/button";
import { ReviewsTableAdmin } from "@/components/reviews-table-admin";
import { Pencil, Plus } from "lucide-react";
import { getAllManufacturers } from "@/lib/actions/manufacturer";
import AdminProductPage  from "@/components/product-admin-page";
import ImagesSlider from "@/components/images/images-slider-product";
import Link from "next/link";
import { getProductsWithDetailsAdmin } from "@/lib/actions/product";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getApprovedReviewsByProductId } from "@/lib/actions/reviews";
import { getProductWithCategoryChain } from "@/lib/actions/product-categories";
import { ProductForm } from "@/components/forms/product-form";
import { ImageIcon, FileText, DollarSign, Tag } from "lucide-react";
export default async function ProductPage({ params, searchParams }:{ 
  params: Promise<{ id: string }>; 
  searchParams: Promise<{ reviewsLimit?: string }>;
}) {
  // Ожидаем params перед использованием
  const { id } = await params;
  const { reviewsLimit: reviewsLimitParam } = await searchParams;
  const reviewsLimit = parseInt(reviewsLimitParam || '5');
const productDetails = await getProductsWithDetailsAdmin(id, reviewsLimit);
  if (!productDetails) {
    return <div>Товар не найден</div>
  }


  return (
  
    <AdminProductPage productDetails={productDetails} reviewsLimit={reviewsLimit} />
     
    
  );
}