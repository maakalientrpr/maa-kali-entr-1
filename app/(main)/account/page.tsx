import Account from "@/components/account/accounts";
import { auth } from "@/lib/auth";
import { requireAuth } from "@/lib/auth-utils";
import prisma from "@/lib/db";
import { headers } from "next/headers";

const page = async () => {
  await requireAuth();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) return null;

  // ⬇️ Fetch bookings with more details
  const trips = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      bookings: {
        orderBy: { bookingDate: "desc" },
        select: {
          id: true,
          bookingDate: true,
          totalAmount: true,
          paymentStatus: true,
          paymentId: true,
          status: true,
          contactNumber: true,
          panNumber: true,
          passengers: {
            select: {
              id: true,
              name: true,
              age: true,
              gender: true,
            },
          },
          tourPackage: {
            select: {
              title: true,
              destination: true,
              images: true,
              startDate: true,
              endDate: true,
              durationDays: true,
              durationNights: true,
            },
          },
        },
      },
    },
  });

  return <Account trips={trips?.bookings || []} />;
};

export default page;
