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
import { AttributeCategoryForm } from "@/components/forms/attributes-categories-form";
import { ReviewsTableAdmin } from "@/components/reviews-table-admin";
import { Pencil, Plus } from "lucide-react";
import { getAllManufacturers } from "@/lib/actions/manufacturer";
import ImagesSlider from "@/components/images/images-slider-product";
import Link from "next/link";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { getAttributeCategories } from "@/lib/actions/attributes-categories";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getApprovedReviewsByProductId } from "@/lib/actions/reviews";
import { getProductWithCategoryChain } from "@/lib/actions/product-categories";
import { ProductForm } from "@/components/forms/product-form";
import { ImageIcon, FileText, DollarSign, Tag } from "lucide-react";
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // Ожидаем params перед использованием
  const { slug } = await params;
const data = await getProductWithCategoryChain(slug);
  if (!data) {
    return <div>Product not found</div>;
  }
const { product, categoryChain } = data;
const [attributeCategories, attributes, images, {pagination, manufacturers}, categories, reviews ] = await Promise.all([
  getAttributeCategories(),
  getProductAttributesWithCategories(product?.id || ""),
  getProductImages(product?.id || ""),
  getAllManufacturers(),
  getCategories(),
  getApprovedReviewsByProductId(product?.id || ""),
])


  if (!product) {
    return <div>Product not found</div>;
  }


  return (
    <>
     
<div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-400">Управление товаром</h1>
          <p className="text-gray-600 mt-1">Редактируйте информацию о товаре</p>
<div className="mt-2 flex items-center gap-1 text-gray-500 text-sm">
            {categoryChain.map((category, index) => (
          <span key={category.id} className="flex items-center gap-2">
            <span>/</span>
            <Link 
              href={`/category/${category.slug}`}
              className={index === categoryChain.length - 1 ? "font-bold" : ""}
            >
              {category.name}
            </Link>
          </span>
        ))}
        </div>
        </div>
<Dialog>
                  <DialogTrigger>
                    <Button variant="ghost" className="h-9 w-9 p-0">
                      <Plus className="size-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Добавить изображение</DialogTitle>
                      <CreateImagesToProductForm product={product} images={images} />
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
 
          {/* Left Column - Product Image */}
          <div className="lg:col-span-1">
                   <ImagesSlider images={images} title={product.title} />
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Info Card */}
            <div className="bg-gray-900 border-gray-800 border rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="size-5 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-400">Основная информация</h2>
                </div>
                <Dialog>
                  <DialogTrigger>
                    <Button variant="ghost" className="h-9 w-9 p-0">
                      <Pencil className="size-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Изменить товар</DialogTitle>
                       <ProductForm product={product} categories={categories} manufacturers={manufacturers} /> 
                    </DialogHeader>
                  </DialogContent>
                </Dialog> 
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-1 block">Артикул</label>
                  <p className="text-xl font-semibold text-white">{product.sku}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-1 block">Название</label>
                  <p className="text-xl font-semibold text-white">{product.title}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-1 block">Описание</label>
                  <p className="text-white leading-relaxed">{product.description}</p>
                </div>
                
                <div className="flex items-center gap-2 pt-2">

                  <span className="text-3xl font-bold text-green-600">{product.price}</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-3xl font-bold text-green-600">{product.inStock}</span>
                </div>
              </div>
            </div>

            {/* Attributes Card */}
            <div className="bg-gray-900 border-gray-800 border rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Tag className="size-5 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-400">Характеристики</h2>
                </div>
                <Dialog>
                  <DialogTrigger>
                    <Button className="h-9 w-9 p-0 cursor-pointer" variant="ghost">
                      <Pencil className="size-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Создать характеристику</DialogTitle>
<AttributeForm product={product} categories={attributeCategories} /> 
                     
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
              
                      <AttributeCategoryForm /> 
              <div className="divide-y divide-gray-600">
              </div>
              
            <AttributesTable ProductID={product} attributesID={attributes} /> 
            </div>
<div className="bg-gray-900 border-gray-800 border rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Tag className="size-5 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-400">Отзывы</h2>
                </div>
             
              </div>
              
              <div className="divide-y divide-gray-600">
              </div>
              
            <ReviewsTableAdmin reviews={reviews} />

            </div>
            {/* Action Buttons */}
            
          </div>
        </div>
      </div>
    </div>
     
     </>
    
  );
}