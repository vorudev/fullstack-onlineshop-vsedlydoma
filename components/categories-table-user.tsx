
"use client";
import React from "react";
import { useState } from "react";
import { ChevronRight, ChevronDown, Pencil } from "lucide-react";
import Link from "next/link";
import { FilterCategoryForm } from "./forms/filter-category-form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CategoryForm } from "./forms/category-form";
import  DeleteCategoryButton  from "./delete-category-button";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

type CategoriesTableProps = {
  categories: Category[];
};

export default function CategoriesTable({ categories }: CategoriesTableProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Функция для построения дерева категорий
  const buildCategoryTree = (
    categories: Category[],
    parentId: string | null = null
  ): Category[] => {
    return categories
      .filter((cat) => cat.parentId === parentId)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  // Проверка есть ли дочерние категории
  const hasChildren = (categoryId: string): boolean => {
    return categories.some((cat) => cat.parentId === categoryId);
  };

  // Рендеринг подкатегорий при hover (внуки и глубже)
  const renderHoverSubmenu = (parentId: string) => {
    const children = buildCategoryTree(categories, parentId);
    
    if (children.length === 0) return null;

    return (
      <div className="absolute left-full top-0 min-w-[250px] border border-gray-200 text-black rounded-lg shadow-xl z-[100]">
        {children.map((child) => (
          <div
            key={child.id}
            className="relative group/nested"
          >
            <Link href={`/dashboard/categories/${child.slug}`}>
              <div className="px-4 py-3 flex items-center justify-between border-b last:border-b-0 cursor-pointer">
                <span className="text-sm font-medium">{child.name}</span>
                {hasChildren(child.id) && (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </Link>
            {hasChildren(child.id) && (
              <div className="hidden group-hover/nested:block">
                {renderHoverSubmenu(child.id)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Рендеринг первого уровня детей (всегда видимых)
  const renderChildCategory = (category: Category) => {
    const hasSubcategories = hasChildren(category.id);

    return (
      <div key={category.id} className="relative group/child">
        <div 
          className="flex items-center justify-between px-4 py-3  text-black border-b border-black cursor-pointer"
          onMouseEnter={() => setHoveredCategory(category.id)}
        >
          <Link href={`/dashboard/categories/${category.slug}`} className="flex items-center gap-2 flex-1">
            <span className="text-sm ">{category.name}</span>
            {hasSubcategories && (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </Link>
          <div className="flex gap-1 ml-2">
            
          

          </div>
        </div>

        {/* Hover submenu для внуков - появляется при hover на group/child */}
        {hasSubcategories && (
          <div 
            className="hidden group-hover/child:block"
            onMouseLeave={() => setHoveredCategory(null)}
          >
            {renderHoverSubmenu(category.id)}
          </div>
        )}
      </div>
    );
  };

  // Рендеринг родительской категории с её детьми
  const renderParentCategory = (parent: Category) => {
    const children = buildCategoryTree(categories, parent.id);

    return (
      <div key={parent.id} >
        {/* Родительская категория */}
        <div className="px-4 py-3   text-black border-b-2 border-gray-300">
          <Link href={`/dashboard/categories/${parent.slug}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">{parent.name}</h3>
              <div className="flex gap-1">
                

              </div>
            </div>
          </Link>
        </div>

        {/* Дочерние категории (всегда видны) */}
        <div className=" overflow-visible">
          {children.map((child) => renderChildCategory(child))}
        </div>
      </div>
    );
  };

  // Получаем корневые категории (без родителя)
  const rootCategories = buildCategoryTree(categories, null);

  return (
    <div className="relative ">
      {/* Кнопка для открытия меню */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}

        className="mb-4 bg-blue-500 text-white cursor-pointer px-4 py-2 rounded-md hover:bg-blue-600"
      >
        {isMenuOpen ? 'Скрыть категории' : 'Показать категории'}
      </button>

      {/* Меню категорий */}
      {isMenuOpen && (
        <>
          {/* Overlay для закрытия по клику вне меню */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Само меню */}
          <div className="absolute left-0 top-full mt-2 w-full max-w-md border border-gray-200 rounded-lg overflow-visible  shadow-2xl z-50">
            
            <div className="absolute z-66">
              {rootCategories.map((category) => renderParentCategory(category))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}