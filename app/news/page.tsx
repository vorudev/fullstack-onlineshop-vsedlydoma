import Link from "next/link";
import Image from "next/image";
import { getAllNews } from "@/lib/actions/news";
import SearchBar from "@/components/searchbar-client";
import Pagination from "@/components/frontend/pagination-client";
interface PageProps {
    searchParams: Promise<{ // Добавляем Promise
      page?: string;
      search?: string;
      limit?: string;
    }>;
  }
 export default async function NewsPage({searchParams}: PageProps) {
    const {page, search, limit} = await searchParams;
    const currentPage = Number(page) || 1;
    const searchQuery = search || '';
    const {allNews, pagination} = await getAllNews({
        page: currentPage,
        pageSize: Number(limit) || 20,
        search: searchQuery,
    });

    return (
        <main  className="min-h-screen mx-auto bg-gray-100 lg:bg-white flex-col flex gap-5 xl:max-w-[1400px] lg:max-w-[1000px] text-black pt-[16px] lg:pt-[24px] pr-[16px] pl-[16px] pb-30">
<div className=" flex-col flex gap-[10px]">
    <h1 className="text-[24px] lg:pl-4 lg:text-[32px] font-bold lg:mb-5">Новости</h1>
    <div className="p-[20px] lg:p-0 bg-white rounded-xl lg:border-none justify-items-center grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-[20px]  border border-gray-200">
{allNews.map((news) => {
  const featuredImage = news.images.find(img => img.isFeatured) || news.images[0];

  return (
    <Link href={`/news/${news.slug}`} className="flex flex-col gap-5 md:max-w-[356px] w-full" key={news.id}>
      <div className="relative min-w-[270px] w-full rounded-md aspect-[356/240] max-w-[356px] max-h-[240px] overflow-hidden">
        <img
          src={featuredImage?.imageUrl || "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="}
          alt=""
          className="object-cover aspect-[356/240] w-full" 
        />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-[15px] font-bold leading-tight">{news.title}</h2>
     {news.description.length > 100
    ? news.description.slice(0, 100) + "..."
    : news.description}

      </div>

      <div className="border border-gray-200 rounded-md self-start p-[7px]">
        <p className="text-[13px]">
          {news.createdAt?.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </Link>
  );
})}
    </div>
</div>
 <div className="w-full max-w-[600px] mx-auto">
<Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.totalItems}
        limit={pagination.pageSize}
      />
      </div>
        </main>
    );
}