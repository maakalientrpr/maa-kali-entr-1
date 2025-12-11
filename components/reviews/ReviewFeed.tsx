"use client";

import { useState } from "react";
import { getReviews } from "@/actions/review-actions";
import ReviewCard from "./ReviewCard";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowDown } from "lucide-react";

const REVIEWS_PER_PAGE = 6;

export default function ReviewFeed({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [page, setPage] = useState(2); // Start fetching from page 2
  const [hasMore, setHasMore] = useState(initialReviews.length >= REVIEWS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreReviews = async () => {
    setIsLoading(true);
    
    // await new Promise((resolve) => setTimeout(resolve, 500)); 

    const nextReviews = await getReviews(page, REVIEWS_PER_PAGE);

    if (nextReviews.length < REVIEWS_PER_PAGE) {
      setHasMore(false); // No more data to fetch after this
    }

    setReviews((prev) => [...prev, ...nextReviews]);
    setPage((prev) => prev + 1);
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* The Grid of Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Empty State */}
      {reviews.length === 0 && (
        <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
          No reviews yet. Be the first to share your experience!
        </div>
      )}

      {/* Load More Button Area */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={loadMoreReviews}
            disabled={isLoading}
            className="w-full md:w-auto min-w-[200px] border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
              </>
            ) : (
              <>
                Load More Reviews <ArrowDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* End of list message */}
      {!hasMore && reviews.length > 0 && (
        <p className="text-center text-gray-400 text-sm italic mt-8">
          You've reached the end of the list.
        </p>
      )}
    </div>
  );
}