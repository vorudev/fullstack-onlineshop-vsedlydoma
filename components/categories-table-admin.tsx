'use client'
import { useState, useMemo, useEffect, useTransition } from 'react';
import Link from 'next/link';
import DeleteCategoryButton from './delete-category-button';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryForm } from './forms/category-form';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger, DialogFooter, DialogDescription 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  MoreVertical, Eye, Edit, Trash2, Plus, Folder, FolderOpen,
  FolderTree, Hash, Calendar, ArrowRight, ChevronRight, ChevronDown,
  Copy, ExternalLink, Layers, Tag, FileText, Grid3X3, 
  MoveUp, MoveDown, Archive, Activity,
  Pencil
} from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';

interface CategoryTableProps {
  categories: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  }[];

}

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  level: number;
  children: CategoryNode[];
  hasChildren: boolean;
  isExpanded?: boolean;
}

export function CategoriesTable({ 
  categories, 
 
}: CategoryTableProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());


  const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
      
      const [searchValue, setSearchValue] = useState(
        searchParams.get('search') || ''
      );
    
      const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        
        const params = new URLSearchParams(searchParams.toString());
        
        if (searchValue.trim()) {
          params.set('search', searchValue.trim());
          params.set('page', '1'); // Сбрасываем на первую страницу
        } else {
          params.delete('search');
        }
        
        startTransition(() => {
          router.push(`?${params.toString()}`);
        });
      };
    
      const handleClear = () => {
        setSearchValue('');
        const params = new URLSearchParams(searchParams.toString());
        params.delete('search');
        params.set('page', '1');
        
        startTransition(() => {
          router.push(`?${params.toString()}`);
        });
      };

  // Правильное построение дерева категорий
  const categoryTree = useMemo(() => {
    // Создаем карту для быстрого доступа
    const categoryMap = new Map<string, CategoryNode>();
    
    // Сначала создаем все узлы без детей
    categories.forEach(category => {
      categoryMap.set(category.id, {
        ...category,
        level: 0,
        children: [],
        hasChildren: false
      });
    });

    // Теперь строим связи между родителями и детьми
    const rootCategories: CategoryNode[] = [];
    
    // Проходим по всем категориям и распределяем по родителям
    categories.forEach(category => {
      const node = categoryMap.get(category.id)!;
      
      if (category.parentId && categoryMap.has(category.parentId)) {
        const parent = categoryMap.get(category.parentId)!;
        parent.children.push(node);
        parent.hasChildren = parent.children.length > 0;
        node.level = (parent.level || 0) + 1;
      } else {
        rootCategories.push(node);
      }
    });

    // Рекурсивно сортируем детей по имени
    const sortChildren = (node: CategoryNode) => {
      node.children.sort((a, b) => a.name.localeCompare(b.name));
      node.children.forEach(sortChildren);
    };
    
    rootCategories.sort((a, b) => a.name.localeCompare(b.name));
    rootCategories.forEach(sortChildren);

    return rootCategories;
  }, [categories]);

  // Разворачиваем дерево в плоский список с сохранением иерархии
  const flattenedCategories = useMemo(() => {
    const result: CategoryNode[] = [];
    
    const traverse = (node: CategoryNode, parentExpanded: boolean = true) => {
      const isRoot = node.level === 0;
      const isExpanded = expandedCategories.has(node.id);
      const shouldShow = parentExpanded || isRoot;
      
      if (shouldShow) {
        result.push(node);
        
        // Если категория развернута и имеет детей, показываем детей
        if (isExpanded && node.children.length > 0) {
          node.children.forEach(child => traverse(child, true));
        }
      }
    };
    
    categoryTree.forEach(node => traverse(node, true));
    
    // Применяем фильтры
    let filtered = result;

    
    return filtered;
  }, [
    categoryTree, 
    expandedCategories, 
  ]);

  // Автоматически разворачиваем все категории при первом рендере
  useEffect(() => {
    // Развернем только корневые категории по умолчанию
    const rootIds = categoryTree.map(cat => cat.id);
    setExpandedCategories(new Set(rootIds));
  }, [categoryTree]);

  // Статистика
  const stats = useMemo(() => {
    let totalLevel0 = 0;
    let totalLevel1 = 0;
    let totalLevel2 = 0;
    let totalWithChildren = 0;
    let totalWithoutDescription = 0;
    
    const countCategories = (nodes: CategoryNode[]) => {
      nodes.forEach(node => {
        switch (node.level) {
          case 0: totalLevel0++; break;
          case 1: totalLevel1++; break;
          case 2: totalLevel2++; break;
        }
        
        if (node.hasChildren) totalWithChildren++;
        if (!node.description) totalWithoutDescription++;
        
        if (node.children.length > 0) {
          countCategories(node.children);
        }
      });
    };
    
    countCategories(categoryTree);
    
    return {
      totalCategories: categories.length,
      totalLevel0,
      totalLevel1,
      totalLevel2,
      totalWithChildren,
      totalWithoutDescription,
      expandedCount: expandedCategories.size
    };
  }, [categories, categoryTree, expandedCategories]);

  // Управление раскрытием/свертыванием
  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    
    const collectIds = (nodes: CategoryNode[]) => {
      nodes.forEach(node => {
        allIds.add(node.id);
        if (node.children.length > 0) {
          collectIds(node.children);
        }
      });
    };
    
    collectIds(categoryTree);
    setExpandedCategories(allIds);
  };

  const collapseAll = () => {
    const rootIds = new Set(categoryTree.map(cat => cat.id));
    setExpandedCategories(rootIds);
  };

  const expandLevel = (level: number) => {
    const newSet = new Set(expandedCategories);
    
    const traverse = (nodes: CategoryNode[], currentLevel: number) => {
      nodes.forEach(node => {
        if (currentLevel <= level) {
          newSet.add(node.id);
        }
        if (node.children.length > 0) {
          traverse(node.children, currentLevel + 1);
        }
      });
    };
    
    traverse(categoryTree, 0);
    setExpandedCategories(newSet);
  };

  // Групповые действия
  const handleSelectAll = (checked: boolean) => {
    setSelectedCategories(checked ? flattenedCategories.map(cat => cat.id) : []);
  };

  const handleSelectCategory = (categoryId: string, checked: boolean) => {
    setSelectedCategories(prev => 
      checked ? [...prev, categoryId] : prev.filter(id => id !== categoryId)
    );
  };

  // Получение полного пути категории
  const getCategoryPath = (categoryId: string): {id: string, name: string}[] => {
    const path: {id: string, name: string}[] = [];
    
    const findPath = (nodes: CategoryNode[], targetId: string): boolean => {
      for (const node of nodes) {
        if (node.id === targetId) {
          path.unshift({ id: node.id, name: node.name });
          return true;
        }
        
        if (node.children.length > 0) {
          if (findPath(node.children, targetId)) {
            path.unshift({ id: node.id, name: node.name });
            return true;
          }
        }
      }
      return false;
    };
    
    findPath(categoryTree, categoryId);
    return path;
  };

  // Получение родительской категории
  const getParentCategory = (categoryId: string): CategoryNode | null => {
    for (const node of categoryTree) {
      if (node.id === categoryId) {
        return null; // Это корневая категория
      }
      
      const findParent = (parent: CategoryNode, targetId: string): CategoryNode | null => {
        for (const child of parent.children) {
          if (child.id === targetId) {
            return parent;
          }
          if (child.children.length > 0) {
            const found = findParent(child, targetId);
            if (found) return found;
          }
        }
        return null;
      };
      
      const parent = findParent(node, categoryId);
      if (parent) return parent;
    }
    
    return null;
  };

  // Получение всех возможных родителей для перемещения
  const getAvailableParents = (categoryId: string): CategoryNode[] => {
    const result: CategoryNode[] = [];
    
    const isDescendant = (parentId: string, childId: string): boolean => {
      const category = categoryTree.flatMap(cat => getAllDescendants(cat)).find(cat => cat.id === childId);
      if (!category) return false;
      
      const checkParent = (node: CategoryNode, targetId: string): boolean => {
        if (node.id === targetId) return true;
        return node.children.some(child => checkParent(child, targetId));
      };
      
      const parentNode = categoryTree.find(cat => cat.id === parentId);
      return parentNode ? checkParent(parentNode, childId) : false;
    };
    
    const getAllDescendants = (node: CategoryNode): CategoryNode[] => {
      const descendants = [node];
      node.children.forEach(child => {
        descendants.push(...getAllDescendants(child));
      });
      return descendants;
    };
    
    // Добавляем корневые категории
    categoryTree.forEach(node => {
      // Нельзя сделать родителем самого себя или своего потомка
      if (node.id !== categoryId && !isDescendant(categoryId, node.id)) {
        result.push(node);
      }
    });
    
    // Добавляем null option для перемещения в корень
    result.unshift({
      id: 'null',
      name: 'Корень (без родителя)',
      slug: '',
      description: null,
      parentId: null,
      createdAt: null,
      updatedAt: null,
      level: -1,
      children: [],
      hasChildren: false
    });
    
    return result;
  };

  // Форматирование даты
  const formatDate = (date: Date | null) => {
    if (!date) return '—';
    const d = new Date(date);
    return d.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Получение иконки для уровня вложенности
  const getLevelIcon = (level: number, hasChildren: boolean, isExpanded: boolean) => {
    if (hasChildren) {
      return isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />;
    }
    
    switch (level) {
      case 0: return <Folder className="h-4 w-4" />;
      case 1: return <FolderOpen className="h-4 w-4" />;
      case 2: return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  // Получение цвета для уровня
  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'text-blue-600';
      case 1: return 'text-green-600';
      case 2: return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  // Получение бейджа для уровня
  const getLevelBadge = (level: number) => {
    switch (level) {
      case 0: return <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">Основная</Badge>;
      case 1: return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-100">Подкатегория</Badge>;
      case 2: return <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-100">Вложенная</Badge>;
      default: return <Badge variant="outline">Уровень {level}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и статистика */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Управление категориями</h1>
          <p className="text-muted-foreground">
            {stats.totalCategories} категорий • {stats.expandedCount} развернуто
          </p>
        </div>
        
        
      </div>

    

    <form onSubmit={handleSearch} className="w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Поиск"
           
          />
          
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        
        <Button
          type="submit"
          disabled={isPending}
          variant='outline'
      
        >
          {isPending ? (
            <>
              Поиск...
            </>
          ) : (
            <>
              Найти
            </>
          )}
        </Button>
      </div>
    </form>

      {/* Фильтры */}
      
      

      {/* Таблица категорий */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              
              <TableHead className="w-[350px]">Название и структура</TableHead>
              <TableHead className="w-[150px]">Slug</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead className="w-[120px]">Дата</TableHead>
              <TableHead className="w-[120px]">Статус</TableHead>
              <TableHead className="text-right w-[140px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {flattenedCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <FolderTree className="h-12 w-12 text-muted-foreground" />
                    <p className="text-lg font-medium">Категории не найдены</p>
                    <p className="text-muted-foreground">
                    
                    </p>
                   
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              flattenedCategories.map((category) => {
                const path = getCategoryPath(category.id);
                const isExpanded = expandedCategories.has(category.id);
                
                return (
                  <TableRow 
                    key={category.id} 
                    className={`group hover:bg-muted/50 ${
                      category.level > 0 ? 'bg-muted/5' : ''
                    } ${
                      category.level === 1 ? 'border-l-2 ' : 
                      category.level === 2 ? 'border-l-4 ' : ''
                    }`}
                  >
                    {/* Чекбокс */}
                   
                    
                    {/* Название и структура */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Отступы для вложенности */}
                        <div 
                          className="flex items-center min-w-0"
                          style={{ 
                            paddingLeft: `${category.level * 24}px`,
                            maxWidth: '100%'
                          }}
                        >
                          {/* Кнопка раскрытия/свертывания */}
                          {category.hasChildren && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 mr-1 flex-shrink-0"
                              onClick={() => toggleExpand(category.id)}
                            >
                              {getLevelIcon(category.level, true, isExpanded)}
                            </Button>
                          )}
                          
                          {!category.hasChildren && (
                            <div className="h-6 w-6 mr-1 flex items-center justify-center flex-shrink-0">
                              {getLevelIcon(category.level, false, false)}
                            </div>
                          )}
                          
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium truncate text-white`}>
                                {category.name}
                              </span>
                              {category.hasChildren && (
                                <Badge variant="outline" className="h-5 text-xs">
                                  {category.children.length}
                                </Badge>
                              )}
                            </div>
                            
                            {/* Путь категории */}
                            {path.length > 1 && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                                {path.slice(0, -1).map((segment, idx) => (
                                  <div key={segment.id} className="flex items-center">
                                    <span className="truncate">{segment.name}</span>
                                    {idx < path.length - 2 && (
                                      <ArrowRight className="h-3 w-3 mx-1 flex-shrink-0" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    {/* Slug */}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <code className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[120px]">
                          {category.slug}
                        </code>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 flex-shrink-0"
                                onClick={() => navigator.clipboard.writeText(category.slug)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Копировать slug</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    
                    {/* Описание */}
                    <TableCell>
                      {category.description ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="line-clamp-2 text-sm cursor-help truncate">
                                {category.description}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="whitespace-pre-wrap">{category.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">—</span>
                      )}
                    </TableCell>
                    
                    {/* Дата создания */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {formatDate(category.createdAt)}
                        </div>
                        {category.updatedAt && (
                          <div className="text-xs text-muted-foreground">
                            Обновлен
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    {/* Статус */}
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getLevelBadge(category.level)}
                       
                      </div>
                    </TableCell>
                    
                    {/* Действия */}
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-1">
                        
                        <Dialog>
                                <DialogTrigger>
                                    <Pencil className="w-4 h-4"></Pencil>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>Редактировать категорию "{category.name}"</DialogTitle>
                                    <CategoryForm category={category} categories={categories} />
                                </DialogContent>
                             </Dialog>
                         <DeleteCategoryButton categoryId={category.id}></DeleteCategoryButton>
                         <Link href={`/dashboard/categories/${category.slug}`}>Открыть </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      
    </div>
  );
}