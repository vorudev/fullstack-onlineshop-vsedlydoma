import { getReviewsByProductId } from "@/lib/actions/reviews";
import { getApprovedReviewsByProductId } from "@/lib/actions/reviews";
import { ReviewForm } from "./forms/review-form";
import { StarDisplay } from "./star-rating-in-tables";
import { DeleteReviewButton } from "./delete-review-button";
import { reviews, Review } from "@/db/schema";

import { ApproveReviewButton } from "./approve-review-button";

export function ReviewsTableAdmin({reviews}: { reviews: Review[] }) {
    return (
        <div>
            
                <div className="overflow-x-auto">
                    <div>
                        {reviews.map((review) => (
                            <div 
                                key={review.id} 
                                className=" overflow-hidden hover:shadow-md transition-shadow"
                            >  
                                {/* Заголовок категории */}
                                <div className=" px-2 pt-4 pb-3 border-b flex-col flex gap-4">
                                    <span className="text-gray-400 text-sm md:text-base">
                                        {review.author_name}
                                    </span>
                                    <span className="text-white font-semibold text-sm md:text-base  ">
                                        {review.comment}
                                    </span>
                                    <StarDisplay rating={review.rating} />
                                    <span>  <DeleteReviewButton reviewId={review.id} /></span>
                                </div>


                            </div>
                        ))}
                    </div>
                    
               
          </div>
        </div>
    )
}