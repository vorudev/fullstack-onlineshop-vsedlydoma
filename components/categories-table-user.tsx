
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
  const [hoveredSubcategory, setHoveredSubcategory] = useState<string | null>(null);
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
const rootCategories = buildCategoryTree(categories);
  // Рендеринг подкатегорий при hover (внуки и глубже)
  return (
    <div className="relative">
      {/* Кнопка для открытия меню */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className=" bg-[#0000CD] text-white cursor-pointer text-[14px] 2xl:text-[16px] transition duration-300 font-semibold px-4 py-2 rounded-md hover:bg-blue-600"
      >
        {isMenuOpen ? 'Закрыть' : 'Каталог'}
      </button>

      {/* Полноэкранное меню категорий */}
      {isMenuOpen && (
       <div className="flex absolute  left-0 z-50 ">
    {/* Левая панель - родительские категории */}
    <div className="w-80 border-r rounded-l-lg bg-gray-50 overflow-y-auto shadow-lg">
      {rootCategories.map((category) => (
        <div
          key={category.id}
          className={`px-6 py-4 cursor-pointer border-b transition-colors duration-300 ${
            hoveredCategory === category.id
              ? 'bg-blue-50 '
              : ''
          }`}
          onMouseEnter={() => {
            setHoveredCategory(category.id);
            setHoveredSubcategory(null);
          }}
        >
          <Link href={`/categories/${category.slug}`}>
            <h3 className={`font-semibold text-lg  ${hoveredCategory === category.id ? 'text-blue-600' : 'text-gray-800'}`}>{category.name}</h3>
          </Link>
        </div>
      ))}
    </div>

    {/* Средняя панель - дочерние категории */}
    {hoveredCategory && (
      <div 
        className="w-80 bg-white border-r shadow-xl overflow-y-auto"
        onMouseLeave={(e) => {
          // Проверяем, куда движется курсор
          const rect = e.currentTarget.getBoundingClientRect();
          if (e.clientX < rect.left) {
            // Курсор ушел влево - закрываем все
            setHoveredCategory(null);
            setHoveredSubcategory(null);
          }
        }}
      >
        <div className="p-6">
          {(() => {
            const parentCategory = rootCategories.find(c => c.id === hoveredCategory);
            const children = buildCategoryTree(categories, hoveredCategory);
            
            return (
              <>
                <div className="mb-4 pb-3 border-b">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {parentCategory?.name}
                  </h2>
                  <p className="text-gray-500 text-xs mt-1">
                    {children.length} {children.length === 1 ? 'категория' : children.length < 5 ? 'категории' : 'категорий'}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  {children.map((child) => (
                    <div 
                      key={child.id} 
                      className={`rounded-lg p-3 transition-all cursor-pointer ${
                        hoveredSubcategory === child.id
                          ? 'bg-blue-50 '
                          : 'hover:bg-blue-50'
                      }`}
                      onMouseEnter={() => setHoveredSubcategory(child.id)}
                    >
                      <Link href={`/categories/${child.slug}`}>
                        <h4 className={`font-semibold  text-base ${hoveredSubcategory === child.id ? 'text-blue-600' : 'text-gray-800'} transition duration-300`}>
                          {child.name}
                        </h4>
                      </Link>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </div>
    )}

    {/* Правая панель - внуки */}
    {hoveredCategory && hoveredSubcategory && hasChildren(hoveredSubcategory) && (
      <div 
        className="w-80 bg-white shadow-2xl overflow-y-auto"
        onMouseLeave={(e) => {
          // Проверяем, куда движется курсор
          const rect = e.currentTarget.getBoundingClientRect();
          if (e.clientX < rect.left) {
            // Курсор ушел влево - только убираем subcategory
            setHoveredSubcategory(null);
          } else {
            // Курсор ушел вправо или вниз - закрываем все
            setHoveredCategory(null);
            setHoveredSubcategory(null);
          }
        }}
      >
        <div className="p-6">
          {(() => {
            const subcategory = categories.find(c => c.id === hoveredSubcategory);
            const grandchildren = buildCategoryTree(categories, hoveredSubcategory);
            
            return (
              <>
                <div className="mb-4 pb-3 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {subcategory?.name}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">
                    {grandchildren.length} {grandchildren.length === 1 ? 'категория' : grandchildren.length < 5 ? 'категории' : 'категорий'}
                  </p>
                </div>
                
                <ul className="space-y-2">
                  {grandchildren.map((grandchild) => (
                    <li key={grandchild.id} className="hover:text-blue-600 text-gray-800">
                      <Link href={`/categories/${grandchild.slug}`}>
                        <div className="p-2 rounded-lg border hover:bg-blue-50  transition-all ">
                          <span className={`font-semibold  transition duration-300`}>
                            {grandchild.name}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            );
          })()}
        </div>
      </div>
    )}
  </div>
      )}
    </div>
  );
}