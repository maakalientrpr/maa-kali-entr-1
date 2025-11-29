import { getReviewStats, getReviews } from "@/actions/review-actions";
import ReviewsHeader from "@/components/reviews/ReviewsHeader";
import ReviewList from "@/components/reviews/ReviewList";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const revalidate = 0; // Ensure fresh data on every load

export default async function ReviewsPage() {
  // 1. Fetch Session (to get userId)
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  const userId = session?.user?.id;

  // 2. Fetch Data in Parallel
  const [stats, reviews] = await Promise.all([
    getReviewStats(),
    getReviews(50), // Fetch top 50 reviews
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

        {/* List of Reviews */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 ml-1">
            Recent Feedback
          </h3>
          <ReviewList />{" "}
          {/* You might need to pass the 'reviews' prop if you modify ReviewList to accept props instead of fetching internally */}
        </div>
      </div>
    </div>
  );
}
