'use client';
import React, { useState } from 'react';
import { DeleteTelephoneButton, DeleteSocialsButton } from "@/components/delete-socials";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

import { AddContactUsTelephone } from "@/components/forms/add/add-contact-us-telephones";
import { AddContactUsInfo } from "@/components/forms/add/add-contact-us-info";
import { Button } from '@/components/ui/button';
import { AddAboutInfo } from "@/components/forms/add/add-about-info";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Иконки
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Globe,
  Save,
  Plus,
  Trash2,
  Edit,
  Eye,
  Copy,
  Check,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Link,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ExternalLink,
  Smartphone,
  Building,
  Users,
  HelpCircle,
  ChevronRight,
  Share2,
  QrCode,
  Download,
  RotateCcw,
} from 'lucide-react';
import { AddContactUsPhones } from '@/components/forms/add/add-contact-us-phones';
import Image from 'next/image';

interface PhoneNumber {
  id: string;
  number: string;
  label: string;
  isPrimary: boolean;
  description?: string;
}

interface SocialMedia {
  id: string;
  name: string;
  url: string;
  icon: string;
  iconFile?: string;
  displayText: string;
  isActive: boolean;
  order: number;
}

interface ContactInfo {
  title: string;
  description: string;
  email: string;
  address: string;
  workHours: string;
  phones: PhoneNumber[];
  socials: SocialMedia[];
  updatedAt: string;
}
interface ContactUs {
   contactUs: {
        clientInfo: {
            id: string;
            phone: string;
            src: string;
            link: string;
            contactUsId: string | null;
            createdAt: Date | null;
            updatedAt: Date | null;
        }[];
        contactUsTelephones: {
            id: string;
            phone: string;
            contactUsId: string | null;
            createdAt: Date | null;
            updatedAt: Date | null;
        }[];
        id: string;
        title: string;
        description: string;
        createdAt: Date | null;
        updatedAt: Date | null;
    } | null
}
interface About {
     about: {
        id: string;
        title: string;
        home: string;
        description: string;
        createdAt: Date | null;
        updatedAt: Date | null;
    } | null
}
// Предустановленные иконки соцсетей
const SOCIAL_ICONS = [
  { name: 'Facebook', icon: 'facebook', color: '#1877F2' },
  { name: 'Instagram', icon: 'instagram', color: '#E4405F' },
  { name: 'Twitter', icon: 'twitter', color: '#1DA1F2' },
  { name: 'YouTube', icon: 'youtube', color: '#FF0000' },
  { name: 'Telegram', icon: 'telegram', color: '#26A5E4' },
  { name: 'WhatsApp', icon: 'whatsapp', color: '#25D366' },
  { name: 'VK', icon: 'vk', color: '#0077FF' },
  { name: 'TikTok', icon: 'tiktok', color: '#000000' },
  { name: 'LinkedIn', icon: 'linkedin', color: '#0A66C2' },
];

const AdminContactsPage = ({ contactUs, about }: ContactUs & About) => {
  // Основное состояние
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    title: 'Свяжитесь с нами и получите консультацию',
    description: 'Наша команда всегда готова разобраться в вашем вопросе с 9 до 21 каждый день',
    email: 'info@magazin.ru',
    address: 'г. Москва, ул. Примерная, д. 1, офис 101',
    workHours: 'Пн-Вс: 9:00 - 21:00',
    updatedAt: '2024-03-20',
    phones: [
      { id: '1', number: '+7 (999) 123-45-67', label: 'Основной', isPrimary: true, description: 'Звонки и WhatsApp' },
      { id: '2', number: '+7 (495) 765-43-21', label: 'Городской', isPrimary: false, description: 'Факс доступен' },
      { id: '3', number: '+7 (800) 555-35-35', label: 'Бесплатный', isPrimary: false, description: 'По России' },
    ],
    socials: [
      { id: '1', name: 'Telegram', url: 'https://t.me/magazin', icon: 'telegram', displayText: 'Telegram канал', isActive: true, order: 1 },
      { id: '2', name: 'WhatsApp', url: 'https://wa.me/79991234567', icon: 'whatsapp', displayText: 'Написать в WhatsApp', isActive: true, order: 2 },
      { id: '3', name: 'VK', url: 'https://vk.com/magazin', icon: 'vk', displayText: 'Группа ВКонтакте', isActive: true, order: 3 },
      { id: '4', name: 'Instagram', url: 'https://instagram.com/magazin', icon: 'instagram', displayText: 'Instagram', isActive: false, order: 4 },
    ],
  });

  // Состояния формы
  const [title, setTitle] = useState(contactInfo.title);
  const [description, setDescription] = useState(contactInfo.description);
  const [email, setEmail] = useState(contactInfo.email);
  const [address, setAddress] = useState(contactInfo.address);
  const [workHours, setWorkHours] = useState(contactInfo.workHours);
  const [phones, setPhones] = useState<PhoneNumber[]>(contactInfo.phones);
  const [socials, setSocials] = useState<SocialMedia[]>(contactInfo.socials);

  // UI состояния
  const [activeTab, setActiveTab] = useState('general');
  const [showPreview, setShowPreview] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);


  // Проверка изменений



  // Сохранение


  // Вспомогательные функции
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Скопировано в буфер обмена!');
  };

 
  // Предпросмотр
  const ContactPreview = () => (
    <Dialog open={showPreview} onOpenChange={setShowPreview}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Предпросмотр контактов</DialogTitle>
          <DialogDescription>
            Так будут выглядеть контакты на сайте для пользователей
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{description}</p>
          </div>
         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Телефоны */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Телефоны
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {phones
                  .filter(phone => phone.isPrimary)
                  .map(phone => (
                    <div key={phone.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-lg">{phone.number}</span>
                        <Badge>Основной</Badge>
                      </div>
                      {phone.label && <p className="text-sm text-muted-foreground">{phone.label}</p>}
                      {phone.description && <p className="text-xs text-muted-foreground">{phone.description}</p>}
                    </div>
                  ))}
                
                {phones.filter(phone => !phone.isPrimary).length > 0 && (
                  <>
                    <Separator className="my-2" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Другие телефоны:</p>
                      {phones
                        .filter(phone => !phone.isPrimary)
                        .map(phone => (
                          <div key={phone.id} className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">{phone.number}</span>
                              {phone.label && <span className="text-sm text-muted-foreground ml-2">({phone.label})</span>}
                            </div>
                            <Button size="sm" variant="outline">
                              Позвонить
                            </Button>
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Контакты */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Контакты
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{email}</span>
                    <Button size="sm" variant="outline">
                      Написать
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Адрес</Label>
                  <p className="font-medium">{address}</p>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Часы работы</Label>
                  <p className="font-medium">{workHours}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Соцсети */}
          {socials.filter(s => s.isActive).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Мы в соцсетях
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {socials
                    .filter(s => s.isActive)
                    .sort((a, b) => a.order - b.order)
                    .map(social => (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
                      >
                  
                        <span>{social.displayText}</span>
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Хлебные крошки */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Админка</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Контакты</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Заголовок и кнопки */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Контакты магазина</h1>
              <p className="text-muted-foreground mt-2">
                Управление контактной информацией, телефонами и социальными сетями
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
             
              
            </div>
          </div>

         
        </div>

        {/* Табы */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full lg:w-auto">
            <TabsTrigger value="general" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Основное
            </TabsTrigger>
            <TabsTrigger value="phones" className="gap-2">
              <Phone className="h-4 w-4" />
              Телефоны
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {contactUs?.contactUsTelephones.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="socials" className="gap-2">
              <Share2 className="h-4 w-4" />
              Соцсети
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {contactUs?.clientInfo.length}
              </Badge>
            </TabsTrigger>
        
          </TabsList>

          {/* Вкладка: Основное */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Левая колонка */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Информация о контактах</CardTitle>
                    <CardDescription>
                      Заголовок и описание, которые будут отображаться на странице контактов
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                  <AddContactUsInfo contactUs={contactUs} />
                    
                  </CardContent>
                </Card>

                
            
              </div>

              {/* Правая колонка */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Информация о нас</CardTitle>
                    <CardDescription>
                      Информация, которая будет отображаться на странице о нас
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                  <AddAboutInfo about={about} />
                    

                   
                  </CardContent>
                </Card>

                
              </div>
            </div>
          </TabsContent>

          {/* Вкладка: Телефоны */}
          <TabsContent value="phones">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Телефонные номера</CardTitle>
                    <CardDescription>
                      Добавьте номера телефонов, по которым можно связаться с магазином
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <Phone className="h-3 w-3" />
                    {contactUs?.contactUsTelephones.length} номеров
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Список телефонов */}
                  {contactUs?.contactUsTelephones?.length && contactUs?.contactUsTelephones?.length > 0 ? (
                    <div className="space-y-4">
                      <Label>Список телефонов</Label>
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                             
                              <TableHead>Номер телефона</TableHead>
                              
                              <TableHead className="w-20">Действия</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {contactUs?.contactUsTelephones.map((phone) => (
                              <TableRow key={phone.id}>
                              
                                <TableCell>
                                  <div className="font-medium">{phone.phone}</div>
                                </TableCell>
                              
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => copyToClipboard(phone.phone)}
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                     <DeleteTelephoneButton id={phone.id} />
                                     
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ) : (
                    <Alert>
                      <Phone className="h-4 w-4" />
                      <AlertTitle>Нет добавленных телефонов</AlertTitle>
                      <AlertDescription>
                        Добавьте хотя бы один номер телефона для связи
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Форма добавления нового телефона */}
                  <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Добавить новый телефон</h3>
                  <AddContactUsTelephone contactTelephone={null} contactUsId={contactUs?.id || ""} />
                  </div>

                  {/* Советы */}
                
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Вкладка: Соцсети */}
          <TabsContent value="socials">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Социальные сети</CardTitle>
                    <CardDescription>
                      Добавьте ссылки на социальные сети магазина
                   
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Share2 className="h-3 w-3" />
                      {socials.filter(s => s.isActive).length} активных
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Список соцсетей */}
                  {socials.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Настроенные соцсети</Label>
                        <span className="text-sm text-muted-foreground">
                          Порядок отображения можно менять
                        </span>
                      </div>
                      
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12"></TableHead>
                              <TableHead className="w-12">Иконка</TableHead>
                              <TableHead>Название</TableHead>
                              <TableHead>Ссылка</TableHead>
                             
                              
                              <TableHead className="w-32">Действия</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {contactUs?.clientInfo
                            
                              .map((social) => (
                                <TableRow key={social.id}>
                                  <TableCell>
                                     
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center justify-center">
                                    <Image src={social.src} alt={social.phone} width={24} height={24}/>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                     <p>{social.phone}</p>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1">
                                       <p>{social.link}</p>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => copyToClipboard(social.link)}
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </TableCell>
                            
                                  
                                  <TableCell>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => window.open(social.link, '_blank')}
                                        disabled={!social.link}
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                      </Button>
                                       <DeleteSocialsButton id={social.id} />
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ) : (
                    <Alert>
                      <Share2 className="h-4 w-4" />
                      <AlertTitle>Нет добавленных соцсетей</AlertTitle>
                      <AlertDescription>
                        Добавьте ссылки на социальные сети магазина
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Форма добавления новой соцсети */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4">Добавить новую соцсеть</h3>
                    <AddContactUsPhones contactPhone={null} contactUsId={contactUs?.id || ""} />
                  
                    
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-sm text-muted-foreground">
                        * Ссылка должна вести на профиль/канал магазина. Иконка должна быть прямой ссылкой на иконку соцсети.
                      </p>
                    
                    
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Вкладка: SEO */}
        
        </Tabs>

        {/* Футер с информацией */}
        
      </div>

      {/* Модальное окно помощи по соцсетям */}
    

      {/* Компонент предпросмотра */}
      <ContactPreview />
    </div>
  );
};

export default AdminContactsPage;