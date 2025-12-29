// components/frontend/skeletons/home-page-skeleton.tsx
import ProductCardSkeleton from "./product-card-home-skeleton";
export default function HomePageSkeleton() {
    return (
      <div className="animate-pulse">
        {/* Категории слева (десктоп) */}
        <div className="absolute z-10 border-2 border-gray-100 rounded-xl hidden lg:flex w-80 h-96 bg-gray-200" />
        
        <div className="lg:ml-81 ml-0 overflow-hidden md:pt-10 lg:pt-5 pt-4 flex flex-col gap-7 md:px-10">
          {/* Верхние карточки */}
          <div className="flex gap-4 px-4 md:px-0">
            <div className="min-w-[80vw] md:min-w-[40vw] lg:min-w-[20vw] md:w-full xl:w-[30%] bg-gray-200 rounded-xl h-40" />
            <div className="min-w-[80vw] md:min-w-[40vw] lg:min-w-[20vw] md:w-full xl:w-[30%] bg-gray-200 rounded-xl h-40 lg:hidden" />
            <div className="w-[20%] hidden xl:flex bg-gray-200 rounded-xl h-40" />
            <div className="flex-1 bg-gray-200 rounded-xl h-40 hidden xl:flex" />
          </div>
          
          {/* Каталог и Производители (мобильная версия) */}
          <div className="flex gap-4 xl:hidden px-4 md:px-0">
            <div className="w-[35%] bg-gray-200 rounded-xl h-40" />
            <div className="flex-1 bg-gray-200 rounded-xl h-40" />
          </div>
          
          {/* Слайдер продуктов */}
          <div className="w-full px-4 md:px-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <ProductCardSkeleton />
              ))}
            </div>
          </div>
          
          {/* Нижние карточки */}
          <div className="flex gap-4 px-4 md:px-0">
            <div className="min-w-[80vw] md:min-w-[40vw] lg:min-w-[30vw] xl:w-[60%] bg-gray-200 rounded-xl h-40" />
            <div className="min-w-[50vw] md:min-w-[40vw] lg:min-w-[20vw] xl:w-[40%] bg-gray-200 rounded-xl h-40" />
          </div>
          
          {/* Карта */}
          <div className="w-full hidden lg:flex h-96 bg-gray-200 rounded-xl px-4 md:px-0" />
        </div>
      </div>
    );
  }