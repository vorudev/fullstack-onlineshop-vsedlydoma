'use server';
import { getReviewsByProductId } from "@/lib/actions/reviews";
import { getApprovedReviewsByProductId } from "@/lib/actions/reviews";
import { ReviewForm } from "./forms/review-form";
import { StarDisplay } from "./star-rating-in-tables";
export async function ReviewsTable({ productId }: { productId: string }) { 
    const reviews = await getApprovedReviewsByProductId(productId);
    
    return (
        <div className="space-y-8 pt-8 px-[20px] bg-[rgb(251,251,239)] text-[rgb(35,25,22)]  lg:flex ">
            <div className="lg:flex lg:justify-center lg:w-1/2 ">
            <div className="lg:w-1/3 w-full">
            <h2 className="uppercase text-[20px] md:text-[22px] lg:text-[24px] mb-4">Reviews</h2>
            <ReviewForm product_id={productId} />
            </div>
            </div>
            {reviews.length > 0 ? (
                <ul className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 w-full">
                    {reviews.map((review) => (
                        <li key={review.id} className="border p-4 rounded-md ">
                        <div className="flex w-full justify-between">
                            <p className="gap-4 text-[20px] ">{review.author_name} </p>
                            <StarDisplay rating={review.rating} />
                            
                        </div>
                            
                            <p className="text-neutral-600">{review.comment}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No reviews yet.</p>
            )}
        </div>
    );
}