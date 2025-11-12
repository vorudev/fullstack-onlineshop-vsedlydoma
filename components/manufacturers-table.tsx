'use client';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ManufacturerForm } from './forms/create-manufacturert-form';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Manufacturer } from '@/db/schema';
import { DeleteManufacturerButton } from './delete-manufacturer-button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Pencil } from 'lucide-react';


export default function ManufacturersTable({ manufacturers}: { manufacturers: Manufacturer[] }) {
const router = useRouter();
  return (
    <div className="space-y-4">
      <Table>
        <TableCaption>Список производителей</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Описание</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {manufacturers.map((manufacturer) => (
            <TableRow key={manufacturer.id} >
              <TableCell className="font-medium">
                
                  {manufacturer.name}

              </TableCell>
              <TableCell>{manufacturer.description}</TableCell>
              <TableCell>{manufacturer.slug}</TableCell>
              <TableCell className="text-right">
                <div className="flex flex-row justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Pencil className="size-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Обновить производителя</DialogTitle>
                      </DialogHeader>
                      <ManufacturerForm manufacturer={manufacturer} />
                    </DialogContent>
                  </Dialog>
                  <DeleteManufacturerButton id={manufacturer.id} />
                </div>
                          
              </TableCell>
            <TableCell>
            <div
              className="cursor-pointer p-2  rounded-md hover:bg-gray-900"
              onClick={() => router.push(`/dashboard/manufacturers/${manufacturer.slug}`)}>
                  открыть
                </div>           
            </TableCell>           
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}