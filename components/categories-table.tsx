'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Pencil, Trash2, Plus, Filter } from 'lucide-react';
import { CategoryForm } from "./forms/category-form";
import  DeleteCategoryButton  from "./delete-category-button";
import { FilterCategoryForm } from "./forms/filter-category-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogTitle, DialogDescription, DialogHeader, } from './ui/dialog';
import { DialogContent } from './ui/dialog';
// Типы (замените на ваши импорты)
type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

interface CategoriesTableProps {
  categories: Category[];
}

export default function CategoriesTable({ categories }: CategoriesTableProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Построение дерева категорий
  const buildCategoryTree = (
    categories: Category[],
    parentId: string | null = null
  ): Category[] => {
    return categories
      .filter((cat) => cat.parentId === parentId)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  // Проверка наличия дочерних категорий
  const hasChildren = (categoryId: string): boolean => {
    return categories.some((cat) => cat.parentId === categoryId);
  };

  // Переключение раскрытия категории
  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Получение уровня вложенности
  const getCategoryLevel = (categoryId: string, level = 0): number => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category || !category.parentId) return level;
    return getCategoryLevel(category.parentId, level + 1);
  };

  // Рендеринг строки категории
  const renderCategoryRow = (category: Category, level: number = 0) => {
    const hasSubcategories = hasChildren(category.id);
    const isExpanded = expandedCategories.has(category.id);
    const children = buildCategoryTree(categories, category.id);
    const isSelected = selectedCategory === category.id;

    return (
      <React.Fragment key={category.id}>
        <tr 
          className={`border-b  transition-colors ${
            isSelected ? 'bg-neutral-900' : 'bg-neutral-950'
          }`}
          onClick={() => setSelectedCategory(category.id)}
        >
          {/* Название с отступом по уровню */}
          <td className="px-4 py-3">
            <div 
              className="flex items-center gap-2"
              style={{ paddingLeft: `${level * 24}px` }}
            >
              {hasSubcategories ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(category.id);
                  }}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 " />
                  ) : (
                    <ChevronRight className="h-4 w-4 " />
                  )}
                </button>
              ) : (
                <div className="w-6" />
              )}
              <Link href={`/dashboard/categories/${category.slug}`}>
              <span className={`${level === 0 ? 'font-bold text-gray-200' : ''}`}>
                 {category.name}
              </span>
              </Link>
            </div>
          </td>

          {/* Slug */}
          <td className="px-4 py-3 text-sm ">
            {category.slug}
          </td>

          {/* Уровень */}
          <td className="px-4 py-3 text-center">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium  ">
              {level}
            </span>
          </td>

          {/* Количество подкатегорий */}
          <td className="px-4 py-3 text-center text-sm ">
            {hasSubcategories ? children.length : '-'}
          </td>

          {/* Действия */}
          <td className="px-4 py-3">
            <div className="flex items-center justify-end gap-1">
              
              
               <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                  <Pencil className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Редактировать категорию</DialogTitle>
                  
                 
                </DialogHeader>
                 <CategoryForm category={category} categories={categories} />
              </DialogContent>
            </Dialog>

              <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                <Filter className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Добавить категорию фильтров</DialogTitle>


                              </DialogHeader>
 <FilterCategoryForm productCategoryId={category.id} />
                            </DialogContent>
                          </Dialog>

              <DeleteCategoryButton categoryId={category.id} />
            </div>
          </td>
        </tr>

        {/* Рекурсивный рендеринг дочерних категорий */}
        {isExpanded && children.map((child) => renderCategoryRow(child, level + 1))}
      </React.Fragment>
    );
  };

  // Получаем корневые категории
  const rootCategories = buildCategoryTree(categories, null);

  // Функция для раскрытия всех категорий
  const expandAll = () => {
    const allIds = new Set(categories.map(cat => cat.id));
    setExpandedCategories(allIds);
  };

  // Функция для сворачивания всех категорий
  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  return (
    <div className="w-full">
      {/* Заголовок и действия */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            onClick={expandAll}
            className="px-3 py-1.5 text-sm   cursor-pointer rounded transition-colors"
          >
            Развернуть все
          </Button>
          <Button
            onClick={collapseAll}
            className="px-3 py-1.5 text-sm  cursor-pointer rounded transition-colors"
          >
            Свернуть все
          </Button>
          
        </div>
      </div>

      {/* Таблица */}
      <div className="overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className=" border-b ">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold  uppercase tracking-wider">
                Название
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold  uppercase tracking-wider">
                Slug
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold  uppercase tracking-wider">
                Уровень
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold  uppercase tracking-wider">
                Подкатегорий
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold  uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="">
            {rootCategories.length > 0 ? (
              rootCategories.map((category) => renderCategoryRow(category, 0))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Категории не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Информация */}
      <div className="mt-4 text-sm text-gray-600">
        Всего категорий: <span className="font-semibold">{categories.length}</span>
        {selectedCategory && (
          <span className="ml-4">
            Выбрана: <span className="font-semibold">
              {categories.find(cat => cat.id === selectedCategory)?.name}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}