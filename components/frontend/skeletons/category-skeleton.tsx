const CategorySkeleton = () => {
  return (

    <div className="bg-white rounded-xl p-4 shadow-sm">
      {/* Изображение категории */}
      <div className="w-full  aspect-square bg-gray-200 rounded-lg animate-pulse mb-3 hidden lg:block"></div>
      
      {/* Название категории */}
      <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
      
      {/* Количество товаров (опционально) */}
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
    </div>
  );
};
export default CategorySkeleton;
