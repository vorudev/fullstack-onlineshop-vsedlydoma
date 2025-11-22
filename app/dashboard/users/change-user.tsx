


import { ChangeUserForm } from "@/components/forms/auth/change-user-form";

import { Button } from "@/components/ui/button";
import type { User } from "@/db/schema";
import { PlusIcon, UserPlusIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/db/drizzle';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface DashboardPageProps {
 user: User;
}
export default  function DashboardPage({user}: DashboardPageProps) {
  return (
    
    <div className="container mx-auto p-4  ">

     
      <div className="flex justify-end">
      <Dialog>
  <DialogTrigger asChild><Button>Add Item<PlusIcon /></Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Item</DialogTitle>
      <DialogDescription>
        Add a new item to the DataBase
      </DialogDescription>
        <ChangeUserForm  user={user} />
    </DialogHeader>
  </DialogContent>
</Dialog>
 
    </div>

    </div>
  );
}