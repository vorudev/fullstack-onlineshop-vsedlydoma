// app/catalog/categories-list.tsx
import { getRootCategories } from '@/lib/actions/categories';
import Category from './category';

export default async function CategoriesList() {
  const rootCategories = await getRootCategories();

  if (rootCategories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Категории не найдены</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 pt-2 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 lg:gap-6 gap-1">
      {rootCategories.map((subcat) => (
        <Category key={subcat.id} category={subcat} />
      ))}
    </div>
  );
}