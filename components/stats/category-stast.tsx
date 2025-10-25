import { Package, ShoppingCart, DollarSign, ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface CategoryStatsProps {
  category: {
    categoryId: string;
    categoryName: string;
    current: {
      totalQuantity: number;
      totalOrders: number;
      totalRevenue: number;
    };
    previous: {
      totalQuantity: number;
      totalOrders: number;
      totalRevenue: number;
    };
    growth: {
      quantity: number | null;
      orders: number | null;
      revenue: number | null;
    };
  }[];
}
export default function CategoriesStats({ category }: CategoryStatsProps) {


  const renderGrowth = (growth: number | null) => {
    if (growth === null) {
      return (
        <span className="flex items-center gap-1 text-neutral-500">
          <Minus className="w-3 h-3" />
          <span className="text-xs">—</span>
        </span>
      );
    }

    const isPositive = growth > 0;
    const isZero = growth === 0;

    if (isZero) {
      return (
        <span className="flex items-center gap-1 text-neutral-500">
          <Minus className="w-3 h-3" />
          <span className="text-xs">0%</span>
        </span>
      );
    }

    return (
      <span className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
        <span className="text-xs font-medium">{Math.abs(growth).toFixed(1)}%</span>
      </span>
    );
  };

  return (
    <div className=" bg-neutral-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-100 mb-2">Статистика по категориям</h1>
          <p className="text-neutral-400 text-sm">Сравнение с предыдущим периодом</p>
        </div>

        <div className="grid gap-6">
          {category.map((category) => (
            <div
              key={category.categoryId}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-colors"
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-neutral-100">
                  {category.categoryName}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Количество товаров */}
                <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                      <Package className="w-5 h-5 text-blue-500" />
                    </div>
                    {renderGrowth(category.growth.quantity)}
                  </div>
                  <p className="text-neutral-400 text-xs font-medium mb-1">
                    Продано товаров
                  </p>
                  <p className="text-2xl font-bold text-neutral-100">
                    {category.current.totalQuantity.toLocaleString()}
                  </p>
                </div>

                {/* Количество заказов */}
                <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-purple-500/20 p-2 rounded-lg">
                      <ShoppingCart className="w-5 h-5 text-purple-500" />
                    </div>
                    {renderGrowth(category.growth.orders)}
                  </div>
                  <p className="text-neutral-400 text-xs font-medium mb-1">
                    Заказов
                  </p>
                  <p className="text-2xl font-bold text-neutral-100">
                    {category.current.totalOrders.toLocaleString()}
                  </p>
                </div>

                {/* Выручка */}
                <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-emerald-500/20 p-2 rounded-lg">
                      <DollarSign className="w-5 h-5 text-emerald-500" />
                    </div>
                    {renderGrowth(category.growth.revenue)}
                  </div>
                  <p className="text-neutral-400 text-xs font-medium mb-1">
                    Выручка
                  </p>
                  <p className="text-2xl font-bold text-neutral-100">
                    ₽{category.current.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
          ))}
        </div>
      </div>
    </div>
  );
}