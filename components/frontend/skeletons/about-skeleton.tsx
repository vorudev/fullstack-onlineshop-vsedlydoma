// components/frontend/skeletons/about-skeleton.tsx
export default function AboutSkeleton() {
    return (
      <div className="p-[16px] bg-white flex-col flex gap-5 rounded-xl animate-pulse">
        {/* Заголовок skeleton */}
        <div className="h-8 md:h-10 bg-gray-200 rounded-lg w-3/4" />
        
        {/* Описание skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
        
        {/* Карта skeleton */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-4 items-center">
            <div className="w-6 h-6 bg-gray-200 rounded" />
            <div className="h-6 bg-gray-200 rounded w-40" />
          </div>
          <div className="relative w-full h-[400px] bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }