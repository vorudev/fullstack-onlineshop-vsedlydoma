 'use server'
 import { productPageQueries } from "@/lib/actions/prepared-queries"
 
 export default async function Pageaa() { 
    console.time('Product main query');
    const [product] = await productPageQueries.getMain.execute({
      slug: "ugol-paechnyj-wavin-d20x90-grad"
    });
    console.timeEnd('Product main query');
  
    console.time('Parallel queries');
    const [reviews, productImages, attributes, manufacturer, manufacturerImages] = 
      await Promise.all([
        productPageQueries.getReviews.execute({ id: product.id }),
        productPageQueries.getImages.execute({ id: product.id }),
        productPageQueries.getAttributes.execute({ id: product.id }),
        productPageQueries.getManufacturer.execute({ id: product.manufacturerId }),
        productPageQueries.getManufacturerImages.execute({ 
         id: product.manufacturerId 
        })
      ]);
    console.timeEnd('Parallel queries');
  
    return ( 
        <div>

        </div>
    )
}
    
    
    
    
    
    
    
    