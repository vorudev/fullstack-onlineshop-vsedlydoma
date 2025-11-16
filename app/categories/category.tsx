import { getFeaturedCategoryImage } from '@/lib/actions/image-actions';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
interface CategoryProps {
    category: {
        id: string;
        name: string;
        slug: string;
    }
}

export default async function Category({ category }: CategoryProps) {
    const featuredImage = await getFeaturedCategoryImage(category.id);
    return (
       <Link href={`/categories/${category.slug}`} 
       className="bg-white rounded-2xl p-[16px] lg:p-[24px] hover:shadow-xl transition-all duration-300 overflow-hidden  group flex flex-col items-center " key={category.id}> 
        <div className="w-full hidden lg:flex h-[150px] max-w-[182px] relative items-center justify-center">
              <Image
                src={featuredImage?.imageUrl || "https://via.placeholder.com/150"}
                alt={category.name}
                loading="lazy"
                width={120}
                height={120}
                className=" hidden lg:block  object-cover transition-transform duration-300 group-hover:scale-105"
              />
              </div>
              
        
            
            <div className=" flex flex-row justify-between items-center gap-1">
            
              <h3 className="text-gray-900  text-[16px]  lg:font-semibold line-clamp-2 ">
                {category.name} 
              </h3>
           <ChevronRight className="w-4 h-4 lg:hidden" />
           
              
              
            </div>
          </Link>
    );
}