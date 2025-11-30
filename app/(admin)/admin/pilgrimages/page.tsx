import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth-utils"; // Ensure you have this
import { PilgrimageClient } from "@/components/admin/pilgrimages/pilgrimages-card";

export default async function PilgrimagesAdminPage() {
  // 1. Protect the route
  await requireAdmin();

  // 2. Fetch data
  const pilgrimages = await prisma.pilgrimage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  if(!pilgrimages){
    return (
      <div>
        No Pilgrimage found
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2
          className="text-3xl font-bold tracking-tight text-orange-600
        "
        >
          Pilgrimage Management
        </h2>
      </div>

      {/* 3. Render Client Component */}
      <PilgrimageClient data={pilgrimages} />
    </div>
  );
}
