'use client'
import { User2 } from "lucide-react"
import {Profile, Security, Orders, TwoFactorAuth} from "./tabs/cases"
import { useSession } from "@/lib/auth-client"
import {useState} from "react"
interface Props {
    orders: {
    orderItems: {
        id: string;
        orderId: string | null;
        productId: string | null;
        productSku: string | null;
        price: number;
        title: string;
        quantity: number;
        createdAt: Date | null;
        updatedAt: Date | null;
    }[];
    id: string;
    userId: string | null;
    status: string;
    notes: string | null;
    total: number;
    customerName: string | null;
    customerEmail: string | null;
    customerPhone: string | null;
    sku: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}[]
pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}
}
export default function ProfilePage({ orders, pagination }: Props) { 
    const [activeTab, setActiveTab] = useState("profile");
    const { data: session } = useSession();
    const ActiveStatusDisplay = () => {
        switch (activeTab) {
            case "profile":
                return <Profile />;
            case "security":
                return <Security />;
            case "orders":
                return <Orders orders={orders} pagination={pagination} />;
            case "twoFactorAuth":
                return <TwoFactorAuth />;
          
        }
    }
    return ( 
        <div className="text-black min-h-screen xl:max-w-[1400px] mx-auto lg:max-w-[1000px] pb-40 ">
            <div className="flex flex-col gap-6 py-4 px-0 ">
                <h1 className="text-[24px] font-semibold px-8">Профиль</h1>
                <div className="flex flex-row gap-3 px-8">
 <div className="rounded-full w-16 h-16 flex items-center justify-center font-semibold text-gray-600 border-gray-300 border"><User2  className="w-10 h-10"/></div>
 <div className="flex flex-col">
    <p className="text-[20px] font-semibold">{session?.user?.name}</p>
    <p className="text-[16px] text-gray-400 font-semibold">{session?.user?.email}</p>
    <p className="text-[16px] text-gray-400 font-semibold">{session?.user?.phoneNumber || "Телефон не указан"}</p>
 </div>
                </div>
                <div className="flex lg:flex-row lg:gap-5 overflow-x-auto w-full gap-2 px-8 md:px-0 snap-x lg:justify-start lg:ml-11 snap-mandatory " style={{ 
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}>
  

<div className="  min-w-[25vw] lg:min-w-[0vw] flex justify-center py-2">
<button
 onClick={() => setActiveTab("profile")}
 className={` font-semibold text-[18px] transition border-b-2 duration-300 ${activeTab === "profile" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-400"}`}> Профиль
</button>
  </div>
  <div className="  min-w-[30vw] lg:min-w-[0vw] flex justify-center py-2">
<button
 onClick={() => setActiveTab("security")}
 className={` font-semibold text-[18px] border-b-2 transition duration-300 ${activeTab === "security" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-400"}`}>Безопасность</button>
  </div>
  <div className="  min-w-[30vw] lg:min-w-[0vw] flex justify-center py-2">
    <button
    onClick={() => setActiveTab("orders")}
    className={` font-semibold text-[18px] border-b-2 transition duration-300 ${activeTab === "orders" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-400"}`}>Мои заказы</button>
    </div>
    <div className="  min-w-[80vw] lg:min-w-[0vw] flex justify-center py-2">
    <button
    onClick={() => setActiveTab("twoFactorAuth")}
    className={` font-semibold text-[18px] border-b-2 transition duration-300 ${activeTab === "twoFactorAuth" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-400"}`}>Двухфакторная аутентификация</button>
    </div>
                </div>
                <div className="px-4 "> {/* поправить padding */}
                    <ActiveStatusDisplay />
                </div>
            </div>
        </div>
    )
}