'use client';
import { getUsers } from "@/lib/actions/admin";
import { ChangeUserForm } from "@/components/forms/change-user-form";
import { Button } from "@/components/ui/button";
import type { User } from "@/db/schema";
import { Pencil } from "lucide-react";

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
  role: "user" | "admin";  // Changed from string
    banned: boolean
  }[]
}
export function GetAllUsers( { users }: GetAllUsersProps) {
  

    return ( 
       <Table className=""> 
        <TableCaption>A list of all registered users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Controls</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
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
          <DialogTitle>Update Product</DialogTitle>
    

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