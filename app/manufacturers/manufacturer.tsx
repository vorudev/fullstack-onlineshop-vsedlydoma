import { getFeaturedCategoryImage } from '@/lib/actions/image-actions';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { getFeaturedManufacturerImage } from '@/lib/actions/image-actions';
import Link from 'next/link';
interface CategoryProps {
    manufacturer: {
        id: string;
        name: string;
        slug: string;

    }
}

export default async function Category({ manufacturer }: CategoryProps) {
    const featuredImage = await getFeaturedManufacturerImage(manufacturer.id);
    return (
       <Link href={`/manufacturers/${manufacturer.slug}`} 
       className="bg-white rounded-2xl px-[16px] py-2 lg:p-[24px] hover:shadow-xl transition-all duration-300 overflow-hidden  group flex flex-col items-center " key={manufacturer.id}> 
        <div className="w-full hidden lg:flex h-[150px] max-w-[182px] relative items-center justify-center">
              <Image
                src={featuredImage?.imageUrl || "https://via.placeholder.com/150"}
                alt={manufacturer.name}
                loading="lazy"
                width={100}
                height={100}
                className=" hidden lg:block  object-cover transition-transform duration-300 group-hover:scale-105"
              />
              </div>
              <div className="flex flex-col items-center relative justify-center">

              <Image
                src={featuredImage?.imageUrl || "https://via.placeholder.com/150"}
                alt={manufacturer.name}
                loading="lazy"
                width={30}
                height={30}
                className=" lg:hidden  object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
        
            
            <div className=" flex flex-row justify-between items-center gap-1">
            
              <h3 className="text-gray-900  lg:text-[16px] t lg:font-semibold line-clamp-2 ">
                {manufacturer.name} 
              </h3>
           
              
              
            </div>

              </div>

              
          </Link>
    );
}