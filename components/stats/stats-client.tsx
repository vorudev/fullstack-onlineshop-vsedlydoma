'use client'
import { ShoppingCart, DollarSign, TrendingUp, CheckCircle, Clock, XCircle, ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface StatCardProps {
    current: { 
      totalOrders: number;
      totalRevenue: number;
      averageOrderValue: number;
      completedOrders: number;
      pendingOrders: number;
      cancelledOrders: number;
    }, 
    previous: { 
      totalOrders: number;
      totalRevenue: number;
      averageOrderValue: number;
      completedOrders: number;
      pendingOrders: number;
      cancelledOrders: number;
    }, 
    growth: { 
      totalOrders: number | null;
      totalRevenue: number | null;
      averageOrderValue: number | null;
      completedOrders: number | null;
      pendingOrders: number | null;
      cancelledOrders: number | null;
    }, 
}
export default function AdminStats({ stats }: { stats: StatCardProps }) {


  const statCards = [
    {
      title: 'Всего заказов',
      value: stats.current.totalOrders,
      growth: stats.growth.totalOrders,
      icon: ShoppingCart,
      color: 'text-blue-500',
      iconBgColor: 'bg-blue-500/20'
    },
    {
      title: 'Общая выручка',
      value: `${stats.current.totalRevenue.toLocaleString()} руб`,
      growth: stats.growth.totalRevenue,
      icon: DollarSign,
      color: 'text-emerald-500',
      iconBgColor: 'bg-emerald-500/20'
    },
    {
      title: 'Средний чек',
      value: `${stats.current.averageOrderValue.toLocaleString()} руб`,
      growth: stats.growth.averageOrderValue,
      icon: TrendingUp,
      color: 'text-purple-500',
      iconBgColor: 'bg-purple-500/20'
    },
    {
      title: 'Завершено',
      value: stats.current.completedOrders,
      growth: stats.growth.completedOrders,
      icon: CheckCircle,
      color: 'text-green-500',
      iconBgColor: 'bg-green-500/20'
    },
    {
      title: 'В обработке',
      value: stats.current.pendingOrders,
      growth: stats.growth.pendingOrders,
      icon: Clock,
      color: 'text-yellow-500',
      iconBgColor: 'bg-yellow-500/20'
    },
    {
      title: 'Отменено',
      value: stats.current.cancelledOrders,
      growth: stats.growth.cancelledOrders,
      icon: XCircle,
      color: 'text-red-500',
      iconBgColor: 'bg-red-500/20'
    }
  ];

  const renderGrowth = (growth: number | null) => {
    if (growth === null) {
      return (
        <div className="flex items-center gap-1 text-neutral-500">
          <Minus className="w-3 h-3" />
          <span className="text-xs font-medium">Нет данных</span>
        </div>
      );
    }

    const isPositive = growth > 0;
    const isZero = growth === 0;

    if (isZero) {
      return (
        <div className="flex items-center gap-1 text-neutral-500">
          <Minus className="w-3 h-3" />
          <span className="text-xs font-medium">0%</span>
        </div>
      );
    }

    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? (
          <ArrowUp className="w-3 h-3" />
        ) : (
          <ArrowDown className="w-3 h-3" />
        )}
        <span className="text-xs font-medium">
          {Math.abs(growth).toFixed(1)}%
        </span>
      </div>
    );
  };

  return (
    <div className=" bg-neutral-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-100 mb-2">Статистика</h1>
          <p className="text-neutral-400 text-sm">Сравнение с предыдущим периодом</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.iconBgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  {renderGrowth(stat.growth)}
                </div>
                
                <div>
                  <p className="text-neutral-400 text-sm font-medium mb-2">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-neutral-100">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
