import { getReviewStats, getReviews } from "@/actions/review-actions";
import ReviewsHeader from "@/components/reviews/ReviewsHeader";
import ReviewFeed from "@/components/reviews/ReviewFeed"; // Updated Import
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const revalidate = 0;

export default async function ReviewsPage() {
  const session = await auth.api.getSession({
    headers: await headers(), 
  });
  const userId = session?.user?.id;

  // Fetch Stats and ONLY the first page (6 items)
  const [stats, initialReviews] = await Promise.all([
    getReviewStats(),
    getReviews(1, 6), 
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-orange-500">
            What Our Travelers Say
          </h1>
          <p className="text-gray-500">Read reviews from our happy customers</p>
        </div>

        {/* Interactive Header & Form */}
        <ReviewsHeader
          average={stats.average}
          total={stats.total}
          userId={userId}
        />

        {/* The List with Load More Button */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 ml-1">
            Recent Feedback
          </h3>
          <ReviewFeed initialReviews={initialReviews} />
        </div>
      </div>
    </div>
  );
}