'use client';
import { getUsers } from "@/lib/actions/admin";
import { ChangeUserForm } from "@/components/forms/change-user-form";
import { Button } from "@/components/ui/button";
import type { User } from "@/db/schema";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface GetAllUsersProps {
  users: { 
    id: string;
    name: string;
    email: string;
    phoneNumber: string | null;
    
  role: "user" | "admin";  // Changed from string
    banned: boolean
  }[]
}
export function GetAllUsers( { users }: GetAllUsersProps) {
  const router = useRouter();

    return ( 
       <Table className=""> 
        <TableCaption>A list of all registered users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Имя</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Телефон</TableHead>
            <TableHead>Роль</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="cursor-pointer " onClick={() => router.push(`/dashboard/users/${user.id}`)}>
              <TableCell className="font-medium">
                {user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phoneNumber || 'Нет номера'}</TableCell>
              <TableCell>{user.role}</TableCell>
              
              <TableCell className="text-right">
        <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>  
          <DialogTitle>Изменить пользователя</DialogTitle>
    

          <ChangeUserForm user={user} />
        </DialogHeader>
      </DialogContent>
    </Dialog>

 

        </TableCell>
            </TableRow>
          ))}
        </TableBody>
       </Table>
    )
} 