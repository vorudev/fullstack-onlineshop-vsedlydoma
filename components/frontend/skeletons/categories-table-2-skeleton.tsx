export default function CategoriesTableSkeleton() {

  return (
    <div className="w-80 px-3 py-3 rounded-xl overflow-y-auto shadow-">
      {Array(8).fill(0).map((_, index) => (
        <div
          key={index}
          className="px-4 py-4 border-b rounded-2xl"
        >
          <div className="flex items-center justify-between">
            {/* Название категории */}
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
            {/* Иконка стрелки */}
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};


    