import prisma from "@/lib/db";
import Link from "next/link";

const page = async () => {
  const [totalTours, totalBookings, totalUsers] = await Promise.all([
    prisma.tourPackage.count(),

    // ✅ Only PAID bookings
    prisma.booking.count({
      where: {
        paymentStatus: "PAID",
      },
    }),

    prisma.user.count(),
  ]);

  return (
    <>
      {/* ✅ Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total Tours */}
        <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-gray-600 text-sm">Total Tours</h3>
          <p className="text-3xl font-bold">{totalTours}</p>
        </div>

        {/* ✅ Only Paid Bookings */}
        <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-gray-600 text-sm">Paid Bookings</h3>
          <p className="text-3xl font-bold">{totalBookings}</p>
        </div>

        {/* Total Users */}
        <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-gray-600 text-sm">Users</h3>
          <p className="text-3xl font-bold">{totalUsers}</p>
        </div>
      </div>

      {/* ✅ Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>

        <div className="flex gap-3 flex-wrap">
          <Link href="/admin/tour-package/create">
            <button className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition">
              Create Tour
            </button>
          </Link>

          <Link href="/admin/bookings">
            <button className="px-4 py-2 border rounded hover:bg-gray-100 transition">
              View Bookings
            </button>
          </Link>

          <Link href="/admin/tour-package">
            <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">
              Manage Tours
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default page;
