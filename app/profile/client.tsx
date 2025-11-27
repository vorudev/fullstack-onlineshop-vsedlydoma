'use client'
import { User2 } from "lucide-react"
import {Profile, Security, Orders} from "./tabs/cases"
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
               <div className="
  w-full 
  px-4

">
  <div
    className="
      
      mx-auto
      lg:mx-0 
      flex 
      lg:max-w-[400px]
      bg-white
      rounded-xl
      gap-4 
      justify-center
      
      overflow-x-auto 
      scrollbar-hide 
      px-4 
      py-3 
      snap-x 
      snap-mandatory
    "
  >
    {[
      { key: "profile", label: "Профиль" },
      { key: "security", label: "Безопасность" },
      { key: "orders", label: "Мои заказы" },
    ].map((tab) => (
      <button
        key={tab.key}
        onClick={() => setActiveTab(tab.key)}
        className={`
          relative 
          font-medium 
          whitespace-nowrap 
          lg:text-[16px] 
          text-[14px] 

          snap-start
          transition-colors
          ${
            activeTab === tab.key
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }
        `}
      >
        {tab.label}

        {/* underline */}
      
      </button>
    ))}
  </div>
</div>

                <div className="px-4 "> {/* поправить padding */}
                    <ActiveStatusDisplay />
                </div>
            </div>
        </div>
    )
}