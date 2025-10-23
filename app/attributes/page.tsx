import { getProducts } from "@/lib/actions/product";
import { getProductAttributes } from "@/lib/actions/attributes";
import AttributeForm from "@/components/forms/attributes-form";


export default async function AttributesPage() {
    const attributes = await getProductAttributes();
    const products = await getProducts();
    console.log("Attributes:", attributes);
    return <AttributeForm products={products} />;
}
