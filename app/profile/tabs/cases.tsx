 import { Pencil } from "lucide-react"
 import { ChangePasswordForm } from "@/components/forms/change-password-form"
export function Profile() {
    return (
        <div className="flex flex-col relative gap-4 bg-white rounded-xl p-5 ">
            <div className="absolute top-3 px-2 py-1 rounded-md right-3 bg-gray-100 flex items-center gap-2 justify-center cursor-pointer border-gray-300 border">
              Изменить  <Pencil className="w-4 h-5
              4" />
            </div>
<div className="flex flex-col items-start">
    <h3 className="text-[16px] text-gray-400">Имя:</h3>
    <p className="text-[16px] text-black font-semibold">Кирилл</p>
    </div>
<div className="flex flex-col items-start">
    <h3 className="text-[16px] text-gray-400">Email</h3>
    <p className="text-[16px] text-black font-semibold">Example123@gmail.com</p>
    </div>
<div className="flex flex-col items-start">
    <h3 className="text-[16px] text-gray-400">Телефон:</h3>
    <p className="text-[16px] text-black font-semibold">+7 953 533 55 55</p>
    </div>


        </div>
    )
}

export function Security() {
    return (
       <div className="flex flex-col relative gap-4 bg-white rounded-xl p-5 ">
            <h3 className="text-[16px] text-gray-400">Изменить пароль</h3>
<div className="flex flex-col items-start">
   <ChangePasswordForm />
    </div>


        </div>
    )
}

export function Orders() {
    return (
        <div>Orders</div>
    )
}
