'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronDown, ChevronRight, Pencil } from 'lucide-react';

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
  const searchParams = useSearchParams();
  const router = useRouter();

  // Получаем развернутые категории из URL параметров
  const expandedParam = searchParams.get('expanded');
  const expandedCategories = expandedParam ? new Set(expandedParam.split(',')) : new Set<string>();

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

  // Переключение раскрытия категории
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }

    // Обновляем URL с новыми параметрами
    const params = new URLSearchParams(searchParams.toString());
    if (newExpanded.size > 0) {
      params.set('expanded', Array.from(newExpanded).join(','));
    } else {
      params.delete('expanded');
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Рекурсивный рендеринг категорий
  const renderCategory = (category: Category, level: number = 0) => {
    const children = buildCategoryTree(categories, category.id);
    const isExpanded = expandedCategories.has(category.id);
    const hasSubcategories = hasChildren(category.id);

    return (
      <div key={category.id}>
        <TableRow>
          <TableCell className="font-medium">
            <div
              className="flex items-center gap-2"
              style={{ paddingLeft: `${level * 24}px` }}
            >
              {hasSubcategories ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => toggleCategory(category.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              ) : (
                <span className="w-6" />
              )}
              <span>{category.name}</span>
            </div>
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogDescription>
                      Edit a category in the Database
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
                </Dialog>
            </div>
          </TableCell>
        </TableRow>
        {isExpanded &&
          children.map((child) => renderCategory(child, level + 1))}
      </div>
    );
  };

  // Получаем корневые категории (без родителя)
  const rootCategories = buildCategoryTree(categories, null);

  return (
    <Table>
      <TableCaption>A list of your categories</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead className="text-right">Controls</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rootCategories.map((category) => renderCategory(category))}
      </TableBody>
    </Table>
  );
}