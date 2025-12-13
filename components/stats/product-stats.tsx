import { TrendingUp, Package, ShoppingCart, DollarSign } from 'lucide-react';
interface TopProduct {
    productId: string;
    totalQuantity: number;
    totalOrders: number;
    totalRevenue: number;
    productSku: string | null;
    productTitle: string;
}
export default function TopProducts({ topProducts }: { topProducts: TopProduct[] }) {
 

  return (
    <div className=" bg-neutral-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-yellow-500/20 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-100">Топ продуктов</h1>
          </div>
          <p className="text-neutral-400 text-sm">Самые продаваемые товары за период</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          {/* Заголовки таблицы */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-neutral-800/50 border-b border-neutral-800">
            <div className="col-span-1 text-neutral-400 text-xs font-semibold uppercase">#</div>
            <div className="col-span-5 text-neutral-400 text-xs font-semibold uppercase">Продукт</div>
            <div className="col-span-2 text-neutral-400 text-xs font-semibold uppercase text-center">Продано</div>
            <div className="col-span-2 text-neutral-400 text-xs font-semibold uppercase text-center">Заказов</div>
            <div className="col-span-2 text-neutral-400 text-xs font-semibold uppercase text-right">Выручка</div>
          </div>

          {/* Строки продуктов */}
          {topProducts.map((product, index) => (
            <div
              key={product.productId}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-neutral-800 last:border-b-0 hover:bg-neutral-800/30 transition-colors"
            >
              {/* Номер */}
              <div className="hidden md:flex col-span-1 items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' : 
                    index === 1 ? 'bg-neutral-700 text-neutral-300' : 
                    index === 2 ? 'bg-orange-900/40 text-orange-400' : 
                    'bg-neutral-800 text-neutral-400'}
                `}>
                  {index + 1}
                </div>
              </div>

              {/* Информация о продукте */}
              <div className="col-span-1 md:col-span-5">
                <div className="flex items-start gap-3">
                  <div className="md:hidden w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-neutral-800 text-neutral-400 shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-neutral-100 font-medium text-sm mb-1 truncate">
                      {product.productTitle}
                    </h3>
                    {product.productSku && (
                      <p className="text-neutral-500 text-xs font-mono">
                        {product.productSku}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Продано */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex md:justify-center items-center gap-2">
                  <div className="md:hidden bg-blue-500/20 p-1.5 rounded">
                    <Package className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="md:hidden text-neutral-400 text-xs mb-0.5">Продано</p>
                    <p className="text-neutral-100 font-semibold text-sm md:text-center">
                      {product.totalQuantity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Заказов */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex md:justify-center items-center gap-2">
                  <div className="md:hidden bg-purple-500/20 p-1.5 rounded">
                    <ShoppingCart className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="md:hidden text-neutral-400 text-xs mb-0.5">Заказов</p>
                    <p className="text-neutral-100 font-semibold text-sm md:text-center">
                      {product.totalOrders}
                    </p>
                  </div>
                </div>
              </div>

              {/* Выручка */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex md:justify-end items-center gap-2">
                  <div className="md:hidden bg-emerald-500/20 p-1.5 rounded">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="md:hidden text-neutral-400 text-xs mb-0.5">Выручка</p>
                    <p className="text-neutral-100 font-semibold text-sm md:text-right">
                      {product.totalRevenue.toLocaleString()} руб
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}