"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createReview } from "@/actions/review-actions";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  userId: string; // Pass the logged-in user ID
  tourPackageId?: string; // Optional: Pass if reviewing a specific tour
  onSuccess?: () => void;
}

export default function ReviewForm({ userId, tourPackageId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createReview({
        userId,
        tourPackageId,
        rating,
        comment,
      });

      if (res.success) {
        toast.success(res.message);
        setIsSubmitted(true);
        setComment("");
        setRating(0);
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 p-6 rounded-xl text-center border border-green-200">
        <h3 className="text-green-800 font-bold text-lg">Thank you!</h3>
        <p className="text-green-600">
          Your review has been submitted successfully.
        </p>
        <Button
          variant="link"
          onClick={() => setIsSubmitted(false)}
          className="text-green-700 mt-2"
        >
          Write another review
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating Input */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                size={28}
                className={cn(
                  "cursor-pointer transition-colors",
                  (hoverRating || rating) >= star
                    ? "fill-orange-400 text-orange-400"
                    : "fill-gray-100 text-gray-300"
                )}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-500 font-medium">
            {rating > 0 ? `${rating} / 5` : "Select stars"}
          </span>
        </div>

        <Textarea
          placeholder="Share your experience with us..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[120px] resize-none focus-visible:ring-orange-500"
          required
          minLength={10}
        />

        <Button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : (
            "Post Review"
          )}
        </Button>
      </form>
    </div>
  );
}
