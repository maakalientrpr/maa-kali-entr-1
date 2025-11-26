import prisma from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      bookings: true,
      accounts: true,
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Users</h1>

      {users.length === 0 && (
        <p className="text-gray-500">No users found.</p>
      )}

      <div className="grid grid-cols-1 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="shadow-md border rounded-xl">
            <CardContent className="p-6 space-y-4">

              {/* HEADER */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                  <p className="text-gray-600 text-sm">Phone: {user.phoneNumber}</p>
                </div>

                <Badge
                  className="text-base"
                  variant={user.role === "admin" ? "default" : "outline"}
                >
                  {user.role}
                </Badge>
              </div>

              {/* USER DETAILS */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold">Email Verified</p>
                  <Badge variant={user.emailVerified ? "default" : "outline"}>
                    {user.emailVerified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-semibold">Bookings</p>
                  <p className="font-medium">{user.bookings.length} bookings</p>
                </div>

                <div>
                  <p className="text-sm font-semibold">Created At</p>
                  <p className="text-sm text-gray-700">
                    {new Date(user.createdAt).toDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold">Last Updated</p>
                  <p className="text-sm text-gray-700">
                    {new Date(user.updatedAt).toDateString()}
                  </p>
                </div>
              </div>

              {/* BAN INFO */}
              {user.banned ? (
                <div className="p-3 border border-red-300 bg-red-50 rounded-md">
                  <p className="text-red-700 font-semibold">BANNED USER</p>

                  {user.banReason && (
                    <p className="text-sm text-red-700 mt-1">
                      Reason: {user.banReason}
                    </p>
                  )}

                  {user.banExpires && (
                    <p className="text-sm text-red-700">
                      Expires: {new Date(user.banExpires).toDateString()}
                    </p>
                  )}
                </div>
              ) : (
                <Badge
                  className="text-base"
                  variant="outline"
                >
                  Active Account
                </Badge>
              )}

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
