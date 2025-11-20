import { getFiltersByCategory } from "@/lib/actions/filters";
import { FilterCategory, Filter } from "@/db/schema";
import { Trash } from "lucide-react";
import { DeleteFilterButton } from "./delete-filter-button";
import { Dialog, DialogContent, DialogHeader, DialogTitle,  } from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";

interface FiltersTableProps {
    categoryId: string;
}
export async function FiltersTable({ categoryId }: FiltersTableProps) {
    const filters = await getFiltersByCategory(categoryId);    
    return (
        <table className="w-full text-center ">
            <thead>
                <tr>
                    <th className="px-4 py-2">Значение</th>
                    <th className="px-4 py-2">Порядковый номер </th>
                    <th className="px-4 py-2">Действие</th>
                </tr>
            </thead>
            <tbody className="text-center">
                {filters.map((filter: Filter) => (
                    <tr key={filter.id} >
                        <td className="px-4 py-2">{filter.name}</td>
                        <td className="px-4 py-2">{filter.displayOrder}</td>
                        <td className="px-4 py-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="cursor-pointer">
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Удалить фильтр?</DialogTitle>
                                    </DialogHeader>
                                    <DeleteFilterButton filterId={filter.id} />
                                </DialogContent>
                            </Dialog>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}