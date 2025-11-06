import { getApprovedReviews } from "@/lib/actions/reviews";

import {getPendingReviews} from "@/lib/actions/reviews";
import { StarDisplay } from "./star-rating-in-tables";
import {   ApproveReviewButton } from "./approve-review-button";
import { Review } from "@/db/schema";
import { DeleteReviewButton } from "./delete-review-button";
 import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";
import { Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { get } from "http";
interface ApprovedReviewsTableProps {
    reviews: Review[];
}
export async function ApprovedReviewsTable({ reviews }: ApprovedReviewsTableProps) { 
    return ( 
          <Table className="w-2/3 mx-auto"> 
        <TableCaption>Список отзывов</TableCaption>
        <TableHeader>
          <TableRow >
            <TableHead className="w-[100px]">Имя</TableHead>
            <TableHead>Рейтинг</TableHead>
            <TableHead>Отзыв</TableHead>
            <TableHead className="text-right">Controls</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
        <TableRow key={review.id}>
  <TableCell className="font-medium">{review.author_name}</TableCell>
  <TableCell><StarDisplay rating={review.rating} /></TableCell>
  <TableCell className="whitespace-normal break-words max-w-md">
    {review.comment}
  </TableCell>

              
              <TableCell className="text-right">
        <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost"  className="text-red-500 hover:text-red-700 hover:bg-red-50">
          <Trash className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Удалить отзыв</DialogTitle>
    
 

        </DialogHeader>
               <DeleteReviewButton reviewId={review.id} />
      </DialogContent>
    </Dialog>
    

 

        </TableCell>
            </TableRow>
          ))}
        </TableBody>
       </Table>
    )
}