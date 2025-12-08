import {getProductAttributesByProductId} from "@/lib/actions/attributes";
import AttributeForm from "./forms/attributes-form";
import {getProductAttributesWithCategories} from "@/lib/actions/attributes";
import DeleteAttributeButton from "./delete-attribute-button";
import type { Product, ProductAttribute } from "@/db/schema";
interface AttributesTableProps {
  ProductID: Product;
  attributesID: ProductAttribute[];
}




export default async function AttributesTable({ ProductID, attributesID }: AttributesTableProps) {
 return ( 
    <div></div>
 )
} 