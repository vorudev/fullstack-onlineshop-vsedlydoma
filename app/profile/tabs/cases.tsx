'use client'
 import { Pencil } from "lucide-react" 
 import { ChangePasswordForm } from "@/components/forms/auth/change-password-form"
 import Pagination from "@/components/pagination"
 import { ChangeUserNameForm } from "@/components/forms/auth/change-user-name-form"
 import { useSession} from "@/lib/auth-client"
 import { TwoFactorAuthForm } from "@/components/forms/auth/two-factor-form"
 import AddPhoneToUser from "@/components/forms/add/add-phone-to-user"
 import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
 } from "@/components/ui/dialog"
 import SearchBar from "@/components/searchbar-client"
 import OrderHistoryTable from "@/components/frontend/order-history-table"
import Link from "next/link"
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
    sku: string | null;
    customerName: string | null;
    customerEmail: string | null;
    customerPhone: string | null;
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
export function Profile() {
const session = useSession()
    return (
        
        <div className="flex flex-col relative gap-4 bg-white rounded-xl p-5 ">
           
<div className="flex flex-col items-start">
    <h3 className="text-[16px] text-gray-400">Имя:</h3>
   <div className="flex items-center gap-2"> <p className="text-[16px] text-black font-semibold">{session?.data?.user?.name}</p>
   <Dialog>
                <DialogTrigger><Pencil className="w-4 h-5" /></DialogTrigger>
                <DialogContent className="w-[400px] bg-white text-black">
                    <DialogHeader>
                        <DialogTitle>Изменить имя</DialogTitle>
                    </DialogHeader>
                    <ChangeUserNameForm name={session?.data?.user?.name || ""} />
                </DialogContent>
            </Dialog>
            </div>
    </div>
<div className="flex flex-col items-start">
    <h3 className="text-[16px] text-gray-400">Email</h3>
    <p className="text-[16px] text-black font-semibold">{session?.data?.user?.email}</p>
    </div>
<div className="flex flex-col items-start">
    <h3 className="text-[16px] text-gray-400">Телефон:</h3>
      <div className="flex items-center gap-2"> <p className="text-[16px] text-black font-semibold">{session?.data?.user?.phoneNumber || "Не указан"
        }</p>
   <Dialog>
                <DialogTrigger><Pencil className="w-4 h-5" /></DialogTrigger>
                <DialogContent className="w-[400px] bg-white text-black">
                    <DialogHeader>
                        <DialogTitle>{session?.data?.user?.phoneNumber ? "Изменить номер" : "Добавить номер"}</DialogTitle>
                    </DialogHeader>
                     <AddPhoneToUser />
                </DialogContent>
            </Dialog>
            </div>
    </div>


        </div>
    )
}

export function Security() {
    return (
       <div className="flex flex-col relative gap-4 bg-white rounded-xl p-5 ">
        <h3 className="text-[16px] text-gray-400">Двухфакторная аутентификация</h3>
<div className="flex flex-col lg:w-1/3 items-start">
 <Link href="/2fa-enable"className="bg-blue-500 hover:bg-blue-600 text-white rounded-md w-full h-[48px] text-[12px] uppercase flex items-center justify-center">
 <p className="text-center">
    Управление двухфакторной аутентификацией
 </p></Link>
     </div>
            <h3 className="text-[16px] text-gray-400">Изменить пароль</h3>
<div className="flex flex-col lg:w-1/3 items-start">
   <ChangePasswordForm />
    </div>
    

        </div>
    )
}
export function Orders({ orders, pagination }: Props) {
    return (
        <OrderHistoryTable orders={orders} pagination={pagination} />
    )
}
