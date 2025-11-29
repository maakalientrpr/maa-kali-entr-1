import { Star, UserIcon } from "lucide-react";
import { getReviews } from "@/actions/review-actions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default async function ReviewList() {
  const reviews = await getReviews(6);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No reviews yet. Be the first to share your experience!
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white p-6 rounded-xl shadow-xs border border-gray-100 flex flex-col h-full"
        >
          {/*User Header*/}
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={review.user.image || ""} />
              <AvatarFallback>
                <UserIcon className="h-5 w-5 text-gray-400" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{review.user.name}</p>
              <p className="text-xs text-gray-500">
                {new Date(review.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Stars */}
          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < review.rating
                    ? "fill-orange-400 text-orange-400"
                    : "fill-gray-100 text-gray-200"
                }
              />
            ))}
          </div>

          {/* Linked Tour (Optional) */}
          {review.tourPackage && (
            <div className="mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-orange-600 bg-orange-50 px-2 py-1 rounded-sm">
                Trip: {review.tourPackage.title}
              </span>
            </div>
          )}

          {/* Comment */}
          <p className="text-gray-600 text-sm italic leading-relaxed">
            "{review.comment}"
          </p>
        </div>
      ))}
    </div>
  );
}
