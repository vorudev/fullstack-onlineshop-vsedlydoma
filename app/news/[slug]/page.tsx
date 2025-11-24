import { getNewBySlug } from "@/lib/actions/news";
import Image from "next/image";
import Link from "next/link";
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // Ожидаем params перед использованием
  const { slug } = await params;
  const newDesc = await getNewBySlug(slug);

  const sortedImages = newDesc.images.sort((a, b) => {
    if (a.isArticle && !b.isArticle) return -1;
    if (!a.isArticle && b.isArticle) return 1;
    if (a.order === null && b.order !== null) return 1;
    if (a.order !== null && b.order === null) return -1;
    if (a.order !== null && b.order !== null) return a.order - b.order;
    return 0;
  });

  return ( <main className="min-h-screen mx-auto bg-gray-100 lg:bg-white flex-col flex gap-5 xl:max-w-[1400px] lg:max-w-[1000px] text-black pt-[20px] pr-[12px] pl-[12px] pb-30">
   <div className="flex flex-col gap-5">
  <div className="flex flex-row gap-2 items-center lg:pl-2 overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide"
  style={{
    scrollBehavior: 'smooth',
    scrollbarWidth: 'none',
    scrollbarColor: 'transparent transparent',
    
  }}>
  <Link href={`/`} className="text-[14px]">Все для дома</Link>
  <span className="text-[13px] text-gray-600">/</span>

  <Link href={`/news/`} className="text-[14px]">Новости</Link>
  <span className="text-[14px] text-gray-600">/</span>

  <Link href={`/news/${newDesc.slug}`} className="text-[13px] text-gray-600">
    {newDesc.title}
  </Link>
</div>
      <div className=" lg:p-0 bg-white rounded-xl lg:border-none justify-items-center grid grid-cols-1 gap-[20px]  border border-gray-200">
   <div className="flex flex-col gap-2">
  <div className="relative min-w-[270px]  rounded-tl-md rounded-tr-md aspect-[617/217] w-full h-auto max-h-[370px] overflow-hidden">
  <Image src={sortedImages[0]?.imageUrl || "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="} alt="" fill 
  className="object-contain aspect-[617/217]"/>
  </div>
  <div className="flex flex-col gap-2 p-[12px]">
  <h2 className="text-[15px] font-bold leading-tight lg:text-[24px]">{newDesc.title}</h2>
  <p className="text-[15px] lg:text-[18px] ">
                        {newDesc.description}
                          </p>
  </div>
  <div className="border m-[12px] border-gray-200 rounded-md self-start p-[7px]">
   <p className="text-[16px]">{newDesc.createdAt?.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}</p>
  </div>
   </div>
      </div>
  </div>
      </main> )
}