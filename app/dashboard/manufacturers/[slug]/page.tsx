import { getManufacturerBySlug } from "@/lib/actions/manufacturer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateImagesToManufacturerForm } from "@/components/forms/add-image-to-manufacturer-form";
import { Button } from "@/components/ui/button";
import { getManufacturerImages } from "@/lib/actions/image-actions";
import ImagesSlider from "@/components/images/images-slider-manufacturer";
import { FileText, Pencil, Plus, Tag } from "lucide-react";
import {ManufacturerForm} from "@/components/forms/create-manufacturert-form";
 export default async function ManufacturersPage( {params}: {params: Promise<{slug: string}>}){
  const {slug} = await params;
  const manufacturer = await getManufacturerBySlug(slug);  
  const images = await getManufacturerImages(manufacturer.id);  
 return (
    <>
     
<div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-400">Управление производителем</h1>
          <p className="text-gray-600 mt-1">Редактируйте информацию о производителе</p>
<div className="mt-2 flex items-center gap-1 text-gray-500 text-sm">
          
        </div>
        </div>
<Dialog>
                  <DialogTrigger>
                    <Button variant="ghost" className="h-9 w-9 p-0">
                      <Plus className="size-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Добавить изображение</DialogTitle>
                      <CreateImagesToManufacturerForm manufacturer={manufacturer} images={images} />
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
 
          {/* Left Column - Product Image */}
          <div className="lg:col-span-1">
                   <ImagesSlider images={images} title={manufacturer.name} />
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Info Card */}
            <div className="bg-gray-900 border-gray-800 border rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="size-5 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-400">Основная информация</h2>
                </div>
                <Dialog>
                  <DialogTrigger>
                    <Button variant="ghost" className="h-9 w-9 p-0">
                      <Pencil className="size-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Изменить товар</DialogTitle>
                       <ManufacturerForm manufacturer={manufacturer} /> 
                    </DialogHeader>
                  </DialogContent>
                </Dialog> 
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-1 block">Название</label>
                  <p className="text-xl font-semibold text-white">{manufacturer.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-1 block">Slug</label>
                  <p className="text-xl font-semibold text-white">{manufacturer.slug}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-1 block">Описание</label>
                  <p className="text-white leading-relaxed">{manufacturer.description}</p>
                </div>
                
                <div className="flex items-center gap-2 pt-2">

         
                </div>
                
              </div>
            </div>

            {/* Attributes Card */}
            
            {/* Action Buttons */}
            
          </div>
        </div>
      </div>
    </div>
     
     </>
  );
}

