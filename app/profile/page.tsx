'use client'
import { User2 } from "lucide-react"
import {Profile, Security, Orders} from "./tabs/cases"
import {useState} from "react"
export default function ProfilePage() { 
    const [activeTab, setActiveTab] = useState("profile");

    const ActiveStatusDisplay = () => {
        switch (activeTab) {
            case "profile":
                return <Profile />;
            case "security":
                return <Security />;
            case "orders":
                return <Orders />;
            case "archive":
                return <Orders />;
        }
    }
    return ( 
        <div className="text-black min-h-screen xl:max-w-[1400px] mx-auto lg:max-w-[1000px] pb-40 ">
            <div className="flex flex-col gap-6 py-4 px-0  lg:ml-11">
                <h1 className="text-[24px] font-semibold px-8">Профиль</h1>
                <div className="flex flex-row gap-3 px-8">
 <div className="rounded-full w-16 h-16 flex items-center justify-center font-semibold text-gray-600 border-gray-300 border"><User2  className="w-10 h-10"/></div>
 <div className="flex flex-col">
    <p className="text-[20px] font-semibold">Кирилл</p>
    <p className="text-[16px] text-gray-400 font-semibold">Example123@gmail.com</p>
    <p className="text-[16px] text-gray-400 font-semibold">+7 953 533 55 55</p>
 </div>
                </div>
                <div className="flex overflow-x-auto w-full gap-2 px-8 md:px-0 snap-x snap-mandatory " style={{ 
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}>
  

<div className="  min-w-[25vw] flex justify-center py-2">
<button
 onClick={() => setActiveTab("profile")}
 className={` font-semibold text-[18px] transition border-b-2 duration-300 ${activeTab === "profile" ? "border-b-2 border-blue-600/50 text-blue-600/70" : "text-gray-400"}`}> Профиль
</button>
  </div>
  <div className="  min-w-[30vw] flex justify-center py-2">
<button
 onClick={() => setActiveTab("security")}
 className={` font-semibold text-[18px] border-b-2 transition duration-300 ${activeTab === "security" ? "border-b-2 border-blue-600/50 text-blue-600/70" : "text-gray-400"}`}>Безопасность</button>
  </div>
  <div className="  min-w-[30vw] flex justify-center py-2">
<button
 onClick={() => setActiveTab("orders")}
 className={` font-semibold text-[18px] border-b-2 transition duration-300 ${activeTab === "orders" ? "border-b-2 border-blue-600/50 text-blue-600/70" : "text-gray-400"}`}>Мои заказы</button>
  </div>
<div className="  min-w-[30vw] flex justify-center py-2">
<button
 onClick={() => setActiveTab("archive")}
 className={` font-semibold text-[18px] border-b-2 transition duration-300 ${activeTab === "archive" ? "border-b-2 border-blue-600/50 text-blue-600/70" : "text-gray-400"}`}>Архив заказов
</button>
</div>
                </div>
                <div className="px-4 "> {/* поправить padding */}
                    <ActiveStatusDisplay />
                </div>
            </div>
        </div>
    )
}