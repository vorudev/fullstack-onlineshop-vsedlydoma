import CategoriesTable from "../categories-table-user"
type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

type CategoriesTableProps = {
  categories: Category[];
};

export default function HomePage (categories: CategoriesTableProps) {
    return (
        <div className="bg-white w-2/3 min-h-screen mx-auto  ">
            <CategoriesTable categories={categories.categories}  />
        </div>
    )
}