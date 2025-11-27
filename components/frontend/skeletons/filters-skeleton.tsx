const FilterCategorySkeleton = () => {
  return (
    <div className="cursor-pointer">
      {/* Заголовок категории skeleton */}
      <div className="w-full px-4 py-3 flex items-center justify-between">
        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default FilterCategorySkeleton;