"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardFooter } from "../ui/card";
import { UserIcon, Mail, LogOut, EditIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import StatusBadge from "./status-badge";
import { cn } from "@/lib/utils";

export interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other" | string;
}

export interface TourPackageInfo {
  title: string;
  destination: string;
  images: string[];
  startDate: Date;
  endDate?: Date | null;
  durationDays: number;
  durationNights?: number;
}

export interface TripProps {
  id: string;
  bookingDate: Date;
  paymentStatus: "pending" | "completed" | "failed" | string;
  paymentId?: string | null;
  status?: "confirmed" | "pending" | "cancelled" | string;
  totalAmount: number;

  contactNumber?: string | null;
  panNumber?: string | null;

  passengers: Passenger[];

  tourPackage: TourPackageInfo;
}

const Account = ({ trips }: { trips: TripProps[] }) => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const getTripStatus = (startDate: Date, endDate: Date) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(startDate);
    end.setDate(end.getDate() + 10);

    if (now < start) return "upcoming";
    if (now > end) return "completed";
    return "ongoing";
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-orange-600">
        Your Account
      </h1>

      {/* USER CARD */}
      <Card className="shadow-lg border rounded-2xl max-w-xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center gap-3">
            {session?.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name}
                width={90}
                height={90}
                className="rounded-full border shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center shadow-sm">
                <UserIcon className="w-12 h-12 text-gray-600" />
              </div>
            )}
            <h2 className="text-xl font-semibold">{session?.user.name}</h2>
          </div>
        </CardHeader>

        <EditIcon className="absolute right-3 cursor-pointer text-orange-500 top-3" />

        <CardContent className="space-y-4 mt-4">
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            <Mail className="w-5 h-5 text-orange-600" />
            <p className="text-gray-700">{session?.user.email}</p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center pt-4 pb-6">
          <Button
            variant="destructive"
            className="flex items-center gap-2 px-6 py-2 rounded-lg"
            onClick={async () =>
              await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => router.push("/login"),
                },
              })
            }
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </CardFooter>
      </Card>

      {/* USER TRIPS SECTION */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-orange-600 text-center">
          Your Trips
        </h2>

        {trips.length === 0 && (
          <p className="text-gray-600 text-center">No trips booked yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => {
            const status = getTripStatus(
              trip.tourPackage.startDate,
              trip.tourPackage.startDate
            );

            const start = new Date(trip.tourPackage.startDate);
            const end = trip.tourPackage.endDate
              ? new Date(trip.tourPackage.endDate)
              : (() => {
                  let d = new Date(start);
                  d.setDate(d.getDate() + trip?.tourPackage?.durationDays);
                  return d;
                })();

            return (
              <Card
                key={trip.id}
                className="rounded-xl p-0 shadow-md hover:shadow-xl transition-all border border-gray-200 overflow-hidden"
              >
                {/* IMAGE */}
                <div className="relative h-44 w-full">
                  <Image
                    src={trip.tourPackage.images?.[0]}
                    alt={trip.tourPackage.title}
                    fill
                    className="object-cover"
                  />

                  <div className="absolute top-3 right-3">
                    <StatusBadge status={status} />
                  </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="p-5 space-y-4">
                  {/* TITLE */}
                  <div>
                    <h3 className="font-semibold text-xl">
                      {trip.tourPackage.title}
                    </h3>
                    <p className="text-gray-600">
                      {trip.tourPackage.destination}
                    </p>
                  </div>

                  {/* BOOKING INFO */}
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>
                      <span className="font-semibold">Booking ID:</span>{" "}
                      {trip.id}
                    </p>
                    <p>
                      <span className="font-semibold">Booking Date:</span>{" "}
                      {new Date(trip.bookingDate).toDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Trip Start:</span>{" "}
                      {start.toDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Trip End:</span>{" "}
                      {end.toDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Duration:</span>{" "}
                      {trip.tourPackage.durationDays} Days /{" "}
                      {trip.tourPackage.durationNights} Nights
                    </p>
                  </div>

                  {/* PAYMENT STATUS */}
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>
                      <span className="font-semibold">Payment Status:</span>{" "}
                      <span
                        className={cn(
                          "font-semibold",
                          trip.paymentStatus === "UNPAID"
                            ? "text-red-500"
                            : "text-green-600"
                        )}
                      >
                        {trip.paymentStatus}
                      </span>
                    </p>

                    <p>
                      <span className="font-semibold">Booking Status:</span>{" "}
                      <span
                        className={cn(
                          "font-semibold",
                          trip.status === "cancelled"
                            ? "text-red-500"
                            : trip.status === "pending"
                            ? "text-orange-500"
                            : "text-green-600"
                        )}
                      >
                        {trip.status?.toUpperCase()}
                      </span>
                    </p>

                    <p className="font-semibold text-orange-600 text-lg">
                      Total Paid: ₹ {(trip.totalAmount / 100).toLocaleString()}
                    </p>
                  </div>

                  {/* CONTACT & PAN */}
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>
                      <span className="font-semibold">Contact Number:</span>{" "}
                      {trip.contactNumber}
                    </p>

                    {trip.panNumber && (
                      <p>
                        <span className="font-semibold">PAN Number:</span>{" "}
                        {trip.panNumber}
                      </p>
                    )}
                  </div>

                  {/* PASSENGERS */}
                  {trip.passengers.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Passengers</h4>
                      <ul className="space-y-2">
                        {trip.passengers.map((p) => (
                          <li
                            key={p.id}
                            className="p-3 bg-gray-50 border rounded-lg flex justify-between items-center"
                          >
                            <div>
                              <p className="font-medium">{p.name}</p>
                              <p className="text-xs text-gray-600">
                                Age: {p.age} | Gender: {p.gender}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Account;
