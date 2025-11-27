
export default function ProductCardSkeleton() {
    return (
<div className="bg-white rounded-2xl lg:max-w-[450px] transition-all duration-300 overflow-hidden group lg:p-[12px] lg:min-w-[300px]">
  {/* Desktop версия */}
  <div className="hidden lg:block flex flex-col px-2 py-2">
    {/* Изображение скелетон */}
    <div className="relative overflow-hidden rounded-lg bg-gray-200 animate-pulse">
      <div className="w-full h-[200px]"></div>
    </div>
    
    {/* Заголовок скелетон */}
    <div className="mt-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
    </div>
    
    {/* Рейтинг скелетон */}
    <div className="flex flex-row gap-2 pt-2 text-sm items-center">
      <div className="flex items-center gap-2">
        <div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
    
    {/* Цена и кнопки скелетон */}
    <div className="flex flex-row gap-2 pt-3 text-sm items-center justify-between">
      <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
      <div className="flex items-center flex-row pr-1 gap-3">
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>

  {/* Mobile версия */}
  <div className="lg:hidden">
    {/* Изображение скелетон */}
    <div className="relative overflow-hidden flex items-center justify-center bg-gray-200 animate-pulse">
      <div className="w-[156px] h-[156px]"></div>
    </div>
    
    <div className="p-1 flex flex-col gap-2">
      {/* Цена скелетон */}
      <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
      
      {/* Заголовок скелетон */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
      </div>
      
      {/* Рейтинг скелетон */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      {/* Кнопка скелетон */}
      <div className="pt-1">
        <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
      </div>
    </div>
  </div>
</div>
    )}