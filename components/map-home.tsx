'use client'
import Map from "./frontend/map";
import { useEffect, useState } from "react";
interface About {
    home: string;

}
 export default function MapHome({ home }: { home: string }) {
    const [showMap, setShowMap] = useState(false);
    useEffect(() => {
        // Проверяем только один раз при монтировании
        if (window.innerWidth >= 1024) {
          setShowMap(true);
        }
      }, []);
      
      if (!showMap) return null;
    return (
        
            
            <div className="hidden lg:block">
  <div className="bg-white rounded-2xl p-8 mb-12 overflow-hidden flex w-full">
    <div className="flex-col lg:flex-row gap-8 items-center flex w-full">
      <div className="flex flex-col gap-4 max-w-[600px]">
        <h1 className="2xl:text-3xl text-2xl font-bold text-gray-900">
          Все для дома
        </h1>
        <p className="text-base 2xl:text-lg text-gray-600 leading-relaxed">
          {home}
        </p>
        <div className="flex flex-wrap gap-3 mt-2">
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-sm font-semibold text-blue-600">Проверены временем</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-sm font-semibold text-blue-600">Большой ассортимент</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-sm font-semibold text-blue-600">Консультация специалистов</span>
          </div>
        </div>
      </div>
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
        <Map />
      </div>
    </div>
  </div>
</div>
        )
    }
 