import { getNewBySlug } from "@/lib/actions/news";
import { CreateImagesToNewsForm } from "@/components/forms/add/add-image-to-news";
import Image from "next/image";
import { AddNews } from "@/components/forms/add/add-news-form";
import {
    Dialog, 
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // Ожидаем params перед использованием
  const { slug } = await params;
  const newDesc = await getNewBySlug(slug);

  if (!newDesc) {
    return <div>News not found</div>;
  }

   const sortedImages = newDesc.images.sort((a, b) => {
    if (a.isArticle && !b.isArticle) return -1;
    if (!a.isArticle && b.isArticle) return 1;
    if (a.order === null && b.order !== null) return 1;
    if (a.order !== null && b.order === null) return -1;
    if (a.order !== null && b.order !== null) return a.order - b.order;
    return 0;
  });
  return (
    <main className="min-h-screen mx-auto bg-gray-100 lg:bg-white flex-col flex gap-5 xl:max-w-[1400px] lg:max-w-[1000px] text-black pt-[24px] pr-[12px] pl-[12px] pb-30">
 <div className="flex flex-col gap-5">

    <div className=" lg:p-0 bg-white rounded-xl lg:border-none justify-items-center grid grid-cols-1 gap-[20px]  border border-gray-200">
 <div className="flex flex-col gap-2 w-full">
<div className="relative min-w-[270px]  rounded-tl-md rounded-tr-md aspect-[617/217] w-full h-auto overflow-hidden">
{sortedImages.length > 0 ? <Image src={sortedImages[0]?.imageUrl || "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="} alt="" fill 
className="object-contain aspect-[617/217]"/> : null}
{sortedImages.length === 0 ? <div className="flex bg-gray-300 w-full h-full justify-center items-center">
    <Dialog>
    <DialogTrigger>
        <button className="bg-blue-600 text-white cursor-pointer px-[15px] py-[10px] rounded-lg text-center font-semibold">Добавить изображение</button>
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Добавить изображение</DialogTitle>
        </DialogHeader>
        <CreateImagesToNewsForm news={newDesc} />
    </DialogContent>
</Dialog> </div>: null}
</div>
<div className="flex flex-col gap-2 p-[12px]">
<div className="flex flex-row gap-2"><h2 className="text-[15px] font-bold leading-tight lg:text-[24px]">{newDesc.title}</h2>
<Dialog>
    <DialogTrigger className="cursor-pointer bg-blue-600 text-white py-2 px-3 rounded-md">
     <Pencil className="h-4 w-4 cursor-pointer   " />
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Редактировать новость</DialogTitle>
        </DialogHeader>
        <AddNews news={newDesc} />
    </DialogContent>
</Dialog>
 </div>
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
    </main>
  );
}