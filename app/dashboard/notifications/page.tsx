import {getAdminEmails, getTelegramChatIds} from "@/lib/actions/admin";
import { AddAdminEmail } from "@/components/forms/add/add-admin-email";
import { AddTelegramChatId } from "@/components/forms/add/add-telegram-chatid";
import { DeleteAdminChatIdButton } from "@/components/delete-admin-chatid";
import { DeleteAdminEmailButton } from "@/components/delete-admin-email";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";
import { Bell, Mail, MessageCircle, Plus, Trash2, Pencil } from "lucide-react";
export default async function Notifications() {
const [ adminEmails, telegramChatIds ] = await Promise.all([
    getAdminEmails(),
    getTelegramChatIds(),
]);
    return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Настройки уведомлений</h1>
          </div>
          <p className="text-gray-400">
            Управляйте каналами получения уведомлений о новых заказах
          </p>
        </div>

        {/* Карточки с уведомлениями */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Email уведомления */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Email уведомления</h2>
                </div>
               <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="ml-2">
                        <Plus className="w-4 h-4 mr-2" /> Добавить 
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Добавить Email</DialogTitle>
                    <DialogDescription>
                      Введите email адрес для получения уведомлений
                    </DialogDescription>
                  </DialogHeader>
                  <AddAdminEmail />
                </DialogContent>
               </Dialog>
              </div>
              <p className="text-sm text-gray-400">
                Получайте уведомления на указанные email адреса
              </p>
            </div>

            <div className="p-6">
              {adminEmails.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Нет добавленных email адресов
                </p>
              ) : (
                <ul className="space-y-3">
                  {adminEmails.map((email) => (
                    <li
                      key={email.id}
                      className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-gray-100 font-medium">{email.email}</span>
                      <div className="flex items-center gap-2">
                        <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" >
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 text-white">
                          <DialogHeader>
                            <DialogTitle>Редактировать Email</DialogTitle>
                            <DialogDescription>
                              Введите новый email адрес для получения уведомлений
                            </DialogDescription>
                          </DialogHeader>
                          <AddAdminEmail adminEmail={email} />
                        </DialogContent>
                       </Dialog>
                       <DeleteAdminEmailButton id={email.id} />
                       </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Telegram уведомления */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Telegram уведомления</h2>
                </div>
                <Dialog>
                 <DialogTrigger asChild>
                     <Button variant="outline" className="ml-2">
                         <Plus className="w-4 h-4 mr-2" /> Добавить 
                     </Button>
                 </DialogTrigger>
                 <DialogContent className="bg-gray-800 text-white">
                   <DialogHeader>
                     <DialogTitle>Добавить Telegram Chat ID</DialogTitle>
                     <DialogDescription>
                       Введите Chat ID для получения уведомлений
                     </DialogDescription>
                   </DialogHeader>
                   <AddTelegramChatId />
                 </DialogContent>
                </Dialog>
              </div>
              <p className="text-sm text-gray-400">
                Получайте уведомления в Telegram бота Все для дома 
              </p>
            </div>

            <div className="p-6">
              {telegramChatIds.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Нет добавленных Telegram Chat ID
                </p>
              ) : (
                <ul className="space-y-3">
                  {telegramChatIds.map((chatId) => (
                    <li
                      key={chatId.id}
                      className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-gray-100 font-medium font-mono">{chatId.chatId}</span>
                     <div className="flex items-center gap-2"> 
                         <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" >
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 text-white">
                          <DialogHeader>
                            <DialogTitle>Редактировать Chat ID</DialogTitle>
                            <DialogDescription>
                              Введите новый Chat ID для получения уведомлений
                            </DialogDescription>
                          </DialogHeader>
                          <AddTelegramChatId telegramChatId={chatId} />
                        </DialogContent>
                       </Dialog>
                       <DeleteAdminChatIdButton id={chatId.id} />
                     
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Информационный блок */}
        <div className="mt-6 p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h3 className="font-semibold text-blue-300 mb-2">ℹ️ Как получать уведомления в Telegram боте?</h3>
          <ol className="text-sm text-blue-200 space-y-1 list-decimal list-inside">
            <li>Найдите бота Все Для Дома (@AllForHomeBot)</li>
            <li>Отправте комманду /start боту</li>
            <li>Найдите бота @userinfobot</li>
            <li>Отправьте боту команду /start</li>
            <li>Бот вернёт ваш Chat ID</li>
            <li>Скопируйте ID и добавьте его выше</li>
          </ol>
        </div>
      </div>

     

    
    </div>
  );
}