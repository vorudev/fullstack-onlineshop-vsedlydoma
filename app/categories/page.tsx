import { getRootCategories } from '@/lib/actions/categories';

export default async function CatalogPage() {
  const rootCategories = await getRootCategories();

  return (
    <div>
      <h1>Каталог</h1>
      <div className="grid grid-cols-4 gap-4">
        {rootCategories.map((category) => (
          <a 
            key={category.id} 
            href={`/categories/${category.slug}`}
            className="card"
          >
            <h2>{category.name}</h2>
            <p>{category.productsCount} товаров</p>
            {category.hasChildren && <span>→</span>}
          </a>
        ))}
      </div>
    </div>
  );
}