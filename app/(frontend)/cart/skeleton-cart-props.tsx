export default function SkeletonCartProps() {
return (
<li className="flex gap-4 w-full p-3 bg-white rounded-lg border animate-pulse">
  <div className="flex flex-col items-between lg:gap-0 lg:items-start w-full">
    <div className="flex gap-4 w-full items-start">
      {/* Image Section - Desktop */}
      <div className="flex-shrink-0 hidden items-center justify-center lg:flex flex-col overflow-hidden w-full lg:w-[180px]">
        <div className="relative overflow-hidden lg:max-w-[180px] lg:max-h-[150px] w-full h-[150px] bg-gray-200 rounded-lg"></div>
        <div className="h-3 w-20 bg-gray-200 rounded mt-2"></div>
      </div>

      {/* Content Section - Desktop */}
      <div className="flex-1 flex-col gap-10 py-3 px-2 hidden lg:flex">
        <div className="flex justify-between items-start gap-4">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
        </div>

        <div className="justify-between items-center hidden lg:flex">
          <div className="flex items-center gap-2">
            <div className="w-16 h-9 bg-gray-200 rounded-md"></div>
            <div className="h-4 w-6 bg-gray-200 rounded"></div>
            <div className="flex items-center gap-1 ml-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-4 w-8 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded ml-1"></div>
            </div>
          </div>
          <div className="h-6 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    {/* Mobile Section */}
    <div className="flex lg:hidden flex-row items-start gap-2">
      <div className="w-[80px] h-[80px] bg-gray-200 rounded"></div>

      <div className="flex flex-col justify-between h-full flex-1 lg:hidden gap-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-7 w-24 bg-gray-200 rounded-md"></div>
      </div>

      <div className="flex flex-col gap-2 justify-start h-full">
        <div className="w-5 h-5 bg-gray-200 rounded"></div>
        <div className="w-5 h-5 bg-gray-200 rounded"></div>
      </div>
    </div>

    {/* Mobile Bottom Section */}
    <div className="flex gap-4 justify-between pt-4 items-center lg:hidden">
      <div className="flex items-center gap-2">
        <div className="w-16 h-9 bg-gray-200 rounded-md"></div>
        <div className="h-4 w-6 bg-gray-200 rounded"></div>
      </div>
      <div className="h-6 w-24 bg-gray-200 rounded"></div>
    </div>
  </div>
</li>
)}