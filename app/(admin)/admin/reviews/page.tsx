import {
  getAllReviewsForAdmin,
  deleteReview,
} from "@/actions/admin-review-actions";
import { Button } from "@/components/ui/button";
import { Trash2, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function AdminReviewsPage({
  searchParams,
}: {
  // 1. Update Type: It is now a Promise
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 2. Await the params before using them
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = 10;

  const { reviews, totalPages, totalCount } = await getAllReviewsForAdmin(
    page,
    limit
  );

  return (
    <div className="p-6">
      {/* ... keep the rest of your JSX exactly the same ... */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Reviews</h1>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Total: {totalCount}
        </span>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-bold border-b">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Rating</th>
              <th className="p-4 w-1/3">Comment</th>
              <th className="p-4">Tour</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium">{review.user.name}</div>
                  <div className="text-xs text-gray-500">
                    {review.user.email}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-orange-500 font-bold">
                    {review.rating} <Star size={12} fill="currentColor" />
                  </div>
                </td>
                <td className="p-4 max-w-xs truncate" title={review.comment}>
                  {review.comment}
                </td>
                <td className="p-4 text-gray-600">
                  {review.tourPackage ? review.tourPackage.title : "General"}
                </td>
                <td className="p-4 text-right">
                  <form
                    action={async () => {
                      "use server";
                      await deleteReview(review.id);
                    }}
                  >
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No reviews found on this page.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">
          {/* PREVIOUS BUTTON LOGIC */}
          {page <= 1 ? (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/reviews?page=${page - 1}`}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Link>
            </Button>
          )}

          {/* NEXT BUTTON LOGIC */}
          {page >= totalPages ? (
            <Button variant="outline" size="sm" disabled>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/reviews?page=${page + 1}`}>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
