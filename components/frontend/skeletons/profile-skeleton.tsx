// components/profile/profile-skeleton.tsx
export default function ProfileSkeleton() {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8 animate-pulse">
        <div className="max-w-7xl mx-auto">
          {/* Заголовок профиля */}
          <div className="bg-white rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          </div>
  
          {/* Фильтры и поиск */}
          <div className="bg-white rounded-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 h-10 bg-gray-200 rounded" />
              <div className="w-full md:w-48 h-10 bg-gray-200 rounded" />
            </div>
          </div>
  
          {/* Список заказов */}
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-gray-200 rounded w-32" />
                    <div className="h-4 bg-gray-200 rounded w-48" />
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-24" />
                </div>
                
                <div className="space-y-3 mt-4">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="h-6 bg-gray-200 rounded w-24" />
                  <div className="h-10 bg-gray-200 rounded w-32" />
                </div>
              </div>
            ))}
          </div>
  
          {/* Пагинация */}
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-10 h-10 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }