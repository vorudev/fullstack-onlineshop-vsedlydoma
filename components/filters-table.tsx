import { getFiltersByCategory } from "@/lib/actions/filters";
import { FilterCategory } from "@/db/schema";

interface FiltersTableProps {
    categoryId: string;
}
export async function FiltersTable({ categoryId }: FiltersTableProps) {
    const filters = await getFiltersByCategory(categoryId);    
    return (
        <table className="w-full text-left">
            <thead>
                <tr>
                    <th className="px-4 py-2">Значение</th>
                    <th className="px-4 py-2">Slug</th>
                    <th className="px-4 py-2">Порядковый номер </th>
                </tr>
            </thead>
            <tbody>
                {filters.map((filter) => (
                    <tr key={filter.id}>
                        <td className="px-4 py-2">{filter.name}</td>
                        <td className="px-4 py-2">{filter.slug}</td>
                        <td className="px-4 py-2">{filter.displayOrder}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}