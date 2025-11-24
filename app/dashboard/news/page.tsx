import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/searchbar";
import { Pencil } from "lucide-react";
import { DeleteNewsButton } from "@/components/delete-news-button";
import { DeleteImageFromNewsButton } from "@/components/images/delete-image-from-news";
import Pagination from "@/components/pagination";
import { getAllNews } from "@/lib/actions/news";
import { CreateImagesToNewsForm } from "@/components/forms/add/add-image-to-news";
import {
    Dialog, 
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { AddNews } from "@/components/forms/add/add-news-form";
interface PageProps {
  searchParams: Promise<{ // Добавляем Promise
    page?: string;
    search?: string;
  }>;

}
 export default async function NewsPage({searchParams}: PageProps) {
    const {page, search} = await searchParams;
    const currentPage = Number(page) || 1;
    const searchQuery = search || '';
    const {allNews, pagination} = await getAllNews({
        page: currentPage,
        search: searchQuery,
    });
    
    return (
        <main  className="min-h-screen mx-auto bg-gray-100 lg:bg-white flex-col flex gap-5 xl:max-w-[1400px] lg:max-w-[1000px] text-black pt-[24px] pr-[12px] pl-[12px] pb-30">
<div className=" flex-col flex gap-[10px]">
    <h1 className="text-[24px] pl-4 lg:text-[32px] font-semibold leading-tight lg:mb-5">Новости</h1>
    <SearchBar />
    <Dialog>
        <DialogTrigger>
            <button className="bg-blue-600 text-white px-[15px] py-[10px] rounded-lg text-center font-semibold">Добавить новость</button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Добавить новость</DialogTitle>
            </DialogHeader>
            <AddNews />
        </DialogContent>
    </Dialog>
    <div className="p-[20px] lg:p-0 bg-white rounded-xl lg:border-none justify-items-center grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-[20px]  border border-gray-200">
 {allNews.map((news) => {
    const featuredImage = news.images.find(img => img.isFeatured) || news.images[0];
    return (<div key={news.id} className="flex flex-col gap-5 w-full  md:max-w-[356px]">
<div className="relative min-w-[270px]  rounded-md aspect-[356/240] max-w-[356px] max-h-[240px] overflow-hidden">

 {news.images.length > 0 ?
  <div><Link href={`/dashboard/news/${news.slug}`}><Image src={featuredImage.imageUrl} alt="" fill

className="object-cover aspect-[356/240]"/></Link>
<DeleteImageFromNewsButton image={featuredImage} />
</div>
 : null}
{news.images.length === 0 ? 
<div className="flex bg-gray-300 w-full h-full justify-center items-center">
    <Dialog>
    <DialogTrigger>
        <button className="bg-blue-600 text-white cursor-pointer px-[15px] py-[10px] rounded-lg text-center font-semibold">Добавить изображение</button>
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Добавить изображение</DialogTitle>
        </DialogHeader>
        <CreateImagesToNewsForm news={news} />
    </DialogContent>
</Dialog> </div>: null}
</div>
<div className="flex flex-col gap-2">
<div className="flex flex-row gap-2">
<Link href={`/dashboard/news/${news.slug}`}><h2 className="text-[15px] font-bold leading-tight">{news.title}</h2></Link>
<Dialog>
    <DialogTrigger className="cursor-pointer bg-blue-600 text-white py-2 px-3 rounded-md">
     <Pencil className="h-4 w-4 cursor-pointer   " />
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Редактировать новость</DialogTitle>
        </DialogHeader>
        <AddNews news={news} />
    </DialogContent>
</Dialog>

 </div>
 <Link href={`/dashboard/news/${news.slug}`}><p className="text-[15px] ">
                {news.description.length > 100
    ? news.description.slice(0, 100) + "..."
    : news.description}	</p></Link>
</div>
<div className="flex flex-row gap-2"><div className="border border-gray-200 rounded-md self-start p-[7px]">
<p className="text-[13px]">
  {news.createdAt?.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}
</p>
</div>
<DeleteNewsButton id={news.id} />
</div>
 </div>
    )
 })} 
    </div>
    <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.totalItems}
      />
</div>
        </main>
    );
}