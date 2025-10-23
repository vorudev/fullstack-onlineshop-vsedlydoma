'use client';
import { z } from "zod";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Review } from "@/db/schema";
import React from "react";
import { useSession } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createReview } from "@/lib/actions/reviews";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Star } from 'lucide-react';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxRating?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  onRatingChange, 
  maxRating = 5 
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= (hoverRating || rating);
        
        return (
          <button
            key={index}
            type="button"
            className={`transition-colors duration-200 ${
              isActive 
                ? 'text-yellow-400 hover:text-yellow-500' 
                : 'text-gray-300 hover:text-yellow-200'
            }`}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onRatingChange(starValue)}
          >
            <Star 
              className="w-6 h-6" 
              fill={isActive ? 'currentColor' : 'none'}
            />
          </button>
        );
      })}
      <span className="ml-2 text-sm text-gray-600">
        {rating > 0 ? `${rating}/5` : 'Выберите рейтинг'}
      </span>
    </div>
  );
};
const formSchema = z.object({
    rating: z.number().min(1, "Rating is required").max(5, "Rating must be between 1 and 5"),
    comment: z.string().optional(),
    author_name: z.string().min(1, "Login to create a review"),
    status: z.string(),

});

export function ReviewForm({ product_id }: { product_id: string}) {

    
    // Получаем username из сессии


    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rating: 5,
            comment: "",
            author_name: "", // Используем username из сессии
            status: "pending",
        },
    });
    

    async function onSubmit(values: z.infer<typeof formSchema>) { 
        setIsLoading(true);
        try {
            const reviewData = {
                ...values,
                product_id,
            };
            await createReview(reviewData);
            toast.success("Review created successfully");
            form.reset( {
               rating: 5,
                comment: "",
                author_name: "", // Сохраняем username после reset
            });
            router.refresh();
        } catch (error) {
            console.error("Error creating review:", error);
            toast.error("Failed to create review");
        } finally {
            setIsLoading(false);
        }
    } 
    return ( 
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
        <FormField
  control={form.control}
  name="rating"
  render={({ field }) => (
    <FormItem>
     
      <FormControl>
        <StarRating
          rating={field.value || 0}
          onRatingChange={field.onChange}
        />
      </FormControl>
    </FormItem>
  )}
/>
       
        <FormField
          control={form.control}
            name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Textarea placeholder="Comment"   {...field} 
                  
                 />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
            name="author_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Input  {...field}   placeholder="Имя"/> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        
        
       <button type="submit" disabled={isLoading} className="bg-[rgb(35,25,22)] text-[rgb(228,224,212)] w-full h-[48px] bdog text-[12px] uppercase flex justify-center items-center">{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />   :
"Submit Review"
}</button>
      </form>
    </Form>
    )
 }