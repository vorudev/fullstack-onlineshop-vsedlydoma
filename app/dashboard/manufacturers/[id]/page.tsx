import { getManufacturerById, getManufacturerBySlug } from "@/lib/actions/manufacturer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateImagesToManufacturerForm } from "@/components/forms/add/add-image-to-manufacturer-form";
import { Button } from "@/components/ui/button";
import { getManufacturerImages } from "@/lib/actions/image-actions";
import ImagesSlider from "@/components/images/images-slider-manufacturer";
import AdminManufacturerPage from "@/components/manufacturer-page-admin";
import { FileText, Pencil, Plus, Tag } from "lucide-react";
import {ManufacturerForm} from "@/components/forms/create-manufacturert-form";
 export default async function ManufacturersPage( {params}: {params: Promise<{id: string}>}){
  const {id} = await params;
 const [manufacturer, images] = await Promise.all([
  getManufacturerById(id),
  getManufacturerImages(id),
 ]);
 
 return (
    <>
     <AdminManufacturerPage manufacturer={manufacturer} images={images} />
     </>
  );
}

