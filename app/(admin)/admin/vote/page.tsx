import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import PollManagementTable from "@/components/admin/polls/PollManagementTable";
import CreatePollForm from "@/components/poll components/create-poll-form";

export const revalidate = 0;

export default async function AdminPollsPage() {
  // Fetch raw poll data for admin view
  const polls = await prisma.proposedTour.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { votes: true },
      },
    },
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="text-orange-600" /> Community Polls
          </h1>
          <p className="text-gray-500">
            Manage tour proposals, upload images, and track voting results.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* The Create Form Component (renders as a button initially) */}
          <CreatePollForm />
          
          <Link href="/polls">
            <Button variant="outline">View Public Page</Button>
          </Link>
        </div>
      </div>

      {/* Main Content Table */}
      <PollManagementTable polls={polls} />
    </div>
  );
}