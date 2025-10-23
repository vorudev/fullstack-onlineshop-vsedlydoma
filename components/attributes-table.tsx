import {getProductAttributesByProductId} from "@/lib/actions/attributes";
import {getAttributeCategories} from "@/lib/actions/attributes-categories";
import AttributeForm from "./forms/attributes-form";
import {getProductAttributesWithCategories} from "@/lib/actions/attributes";
import DeleteAttributeButton from "./delete-attribute-button";
import DeleteAttributeCategoryButton from "./delete-attribute-category-button";
import type { Product } from "@/db/schema";
interface AttributesTableProps {
  ProductID: Product;
  attributesID: AttributeWithCategory[];
}

type AttributeWithCategory = {
    id: string;
    productId: string;
    categoryId: string;
    name: string;
    value: string;
    order: number | null;
    category: {
        id: string;
        name: string;
        slug: string;
        displayOrder: number | null;
    } | null;
};

type GroupedCategory = {
    categoryId: string;
    categoryName: string;
    displayOrder: number;
    attributes: {
        id: string;
        name: string;
        value: string;
        order: number;
    }[];
};
export default async function AttributesTable({ ProductID, attributesID }: AttributesTableProps) {
    const attributes = await getProductAttributesByProductId(ProductID.id);
    const categories = await getAttributeCategories();
    const attributesWithCategories = await getProductAttributesWithCategories(ProductID.id);
    function groupAttributesByCategory(attributes: AttributeWithCategory[]): GroupedCategory[] {
    const grouped = attributes.reduce((acc, attr) => {
        if (!attr.category) return acc;
        
        const categoryId = attr.categoryId;
        
        if (!acc[categoryId]) {
            acc[categoryId] = {
                categoryId: attr.category.id,
                categoryName: attr.category.name,
                displayOrder: attr.category.displayOrder ?? 999,
                attributes: []
            };
        }
        
        acc[categoryId].attributes.push({
            id: attr.id,
            name: attr.name,
            value: attr.value,
            order: attr.order ?? 999
        });
        
        return acc;
    }, {} as Record<string, GroupedCategory>);

    return Object.values(grouped)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map(category => ({
            ...category,
            attributes: category.attributes.sort((a, b) => a.order - b.order)
        }));
}
const groupedAttributes = groupAttributesByCategory(attributesWithCategories);
    return (
        <div>
    
        <div className="overflow-x-auto">
            <div>
                {groupedAttributes.map((category) => (
                    <div 
                        key={category.categoryId} 
                        className=" overflow-hidden hover:shadow-md transition-shadow"
                    >  
                        {/* Заголовок категории */}
                        <div className=" px-2 py-1 border-b ">
                            <h3 className="text-xl font-semibold text-white">
                                {category.categoryName} <DeleteAttributeCategoryButton categoryId={category.categoryId} />
                            </h3>
                        </div>
                        
                        {/* Список атрибутов */}
                        <div className="divide-y ">
                            {category.attributes.map((attr, index) => (
                                <div
                                    key={attr.id}
                                    className={`flex justify-between items-center px-2 py-2 transition-colors ${
                                        index % 2 === 0 ? '' : ''
                                    }`}
                                >
                                    <span className="text-white font-medium text-sm md:text-base">
                                        {attr.name}
                                    </span>
                                    <span className="text-white font-semibold text-sm md:text-base ml-4 text-right">
                                        {attr.value}
                                    </span>
                                    <span>  <DeleteAttributeButton attributeId={attr.id} /></span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
       
  </div>
</div>
    );
} 