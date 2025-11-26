import prisma from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { bookingDate: "desc" },
    include: {
      user: true,
      tourPackage: true,
      passengers: true,
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Bookings</h1>

      {bookings.length === 0 && (
        <p className="text-gray-500">No bookings found.</p>
      )}

      <div className="grid grid-cols-1 gap-6">
        {bookings.map((b) => (
          <Card key={b.id} className="shadow-lg border rounded-xl">
            <CardContent className="p-6 space-y-4">

              {/* HEADER */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">
                    {b.tourPackage.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Booking ID: {b.id}
                  </p>
                </div>

                <Badge variant="outline" className="text-base">
                  {b.status}
                </Badge>
              </div>

              {/* USER DETAILS */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold">User</p>
                  <p>{b.user.name}</p>
                  <p className="text-gray-600 text-sm">{b.user.email}</p>
                  <p className="text-gray-600 text-sm">Phone: {b.contactNumber}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold">Tour</p>
                  <p>{b.tourPackage.destination}</p>
                  <p className="text-gray-600 text-sm">
                    Starts: {new Date(b.tourPackage.startDate).toDateString()}
                  </p>
                </div>
              </div>

              {/* PAYMENT DETAILS */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold">Total Amount</p>
                  <p>₹ {b.totalAmount / 100}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold">Payment Status</p>
                  <Badge className="text-base">{b.paymentStatus}</Badge>
                </div>
              </div>

              {/* PAN NUMBER (IF APPLICABLE) */}
              {b.panNumber && (
                <div>
                  <p className="text-sm font-semibold">PAN Number</p>
                  <p>{b.panNumber}</p>
                </div>
              )}

              {/* PASSENGERS */}
              <div>
                <p className="text-sm font-semibold mb-2">Passengers</p>

                {b.passengers.length === 0 ? (
                  <p className="text-gray-600 text-sm">No passengers added.</p>
                ) : (
                  <ul className="space-y-1">
                    {b.passengers.map((p) => (
                      <li key={p.id} className="text-sm">
                        <strong>{p.name}</strong> — Age: {p.age}, {p.gender}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
