// components/contact-us/contact-us-skeleton.tsx
export default function ContactUsSkeleton() {
    return (
      <div className="p-[16px] bg-white flex-col flex gap-5 rounded-xl animate-pulse">
        {/* Заголовок */}
        <div className="h-8 md:h-10 bg-gray-200 rounded-lg w-1/2" />
        
        {/* Описание */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
        
        {/* Секция телефонов */}
        <div className="flex flex-col gap-3 mt-2">
          <div className="h-6 bg-gray-200 rounded w-40" />
          <div className="space-y-2 pl-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-5 bg-gray-200 rounded w-48" />
            ))}
          </div>
        </div>
        
        {/* Секция соцсетей */}
        <div className="flex flex-col gap-3 mt-2">
          <div className="h-6 bg-gray-200 rounded w-40" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded" />
                <div className="h-5 bg-gray-200 rounded w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }