export function ProductSkeleton() {
    return (
      <div className="animate-pulse">
        {/* Breadcrumbs */}
        <div className="px-4 pt-4">
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
  
        {/* Top section */}
        <div className="mt-4 flex flex-col lg:flex-row gap-6 px-4">
          {/* Left: images */}
          <div className="flex gap-4 justify-center lg:justify-start ">
            {/* Thumbnails */}
            <div className="hidden lg:flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 bg-gray-200 rounded"
                />
              ))}
            </div>
  
            {/* Main image */}
            <div className="w-[280px]  h-[280px] sm:w-[360px] sm:h-[360px] bg-gray-200 rounded" />
          </div>
  
          {/* Right: product info */}
          <div className="flex-1 space-y-4">
            {/* Title */}
            <div className="h-6 w-3/4 bg-gray-200 rounded" />
  
            {/* Code */}
            <div className="h-4 w-48 bg-gray-200 rounded" />
  
            {/* Rating */}
            <div className="h-4 w-32 bg-gray-200 rounded" />
  
            {/* Characteristics */}
            <div className="space-y-2 mt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
  
            {/* Price */}
            <div className="h-8 w-32 bg-gray-200 rounded mt-6" />
  
            {/* Buttons */}
            <div className="flex gap-3 mt-4">
              <div className="h-10 w-40 bg-gray-200 rounded" />
              <div className="h-10 w-40 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
  
        {/* Divider */}
        <div className="my-10 h-px bg-gray-200" />
  
        {/* Description */}
        <div className="px-4 space-y-3 max-w-3xl">
          <div className="h-6 w-40 bg-gray-200 rounded" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 w-full bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }
  