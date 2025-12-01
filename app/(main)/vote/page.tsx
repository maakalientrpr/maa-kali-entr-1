import { getPolls } from "@/actions/poll-actions";
import {  MapPin, Trophy, UserCheck, StarIcon, VoteIcon } from "lucide-react";
import CreatePollForm from "@/components/poll components/create-poll-form";
import PollCard from "@/components/poll components/poll-card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardContent } from "@/components/ui/card";
import PollControls from "@/components/poll components/poll-controls";
import { cn } from "@/lib/utils";
import AnnouncementBar from "@/components/AnnouncementBar";

export const revalidate = 0; // Ensure realtime data

type SearchParams = Promise<{ sort?: string }>;

export default async function PollsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  // 1. Fetch Data
  const rawPolls = await getPolls();
  
  // 2. Resolve Search Params (Next.js 15)
  const { sort } = await searchParams;
  const sortOption = sort || "popular";

  // 3. Calculate Stats on the fly
  const totalDestinations = rawPolls.length;
  const totalVotes = rawPolls.reduce((acc, poll) => acc + poll.voteCount, 0);
  const userVotes = rawPolls.filter((poll) => poll.hasVoted).length;

  // Calculate Top Choice
  const topPoll = rawPolls.length > 0 
    ? rawPolls.reduce((prev, current) => (prev.voteCount > current.voteCount) ? prev : current) 
    : null;

  // 4. Handle Sorting
  // Create a copy to sort without mutating the original reference
  const polls = [...rawPolls].sort((a, b) => {
    if (sortOption === "alpha") {
      return a.title.localeCompare(b.title);
    } else {
      // Default: Popular (High votes first)
      // If votes are tied, sort alphabetically by title
      if (b.voteCount !== a.voteCount) {
        return b.voteCount - a.voteCount;
      }
      return a.title.localeCompare(b.title);
    }
  });

  return (
    <div className="min-h-screen bg-muted">
      <AnnouncementBar />
      <div className="max-w-6xl mx-auto space-y-12 px-4 py-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full mb-2">
            <VoteIcon className="h-6 w-6 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-orange-600">Vote for Your Dream Destination</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Help us plan the perfect tours! Vote for the destinations you'd love to visit with Maa Kali Enterprise.
          </p>
          
          {/* Top Choice Highlight */}
          {topPoll && topPoll.voteCount > 0 && (
            <div className="flex items-center justify-center pt-2">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-yellow-50 text-yellow-800 rounded-full font-bold border border-yellow-200 shadow-sm">
                <StarIcon className="h-5 w-5 fill-yellow-400 text-yellow-500" />
                <span>
                  Community Top Choice: <span className="underline decoration-yellow-400 decoration-2">{topPoll.title}</span> ({topPoll.voteCount} votes)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard 
            icon={<MapPin className="text-blue-100" />} 
            label="Destinations" 
            value={totalDestinations} 
            subLabel="Proposed trips"
            className="bg-gradient-to-br from-blue-500 to-blue-700 text-white"
          />
          <StatsCard 
            icon={<Trophy className="text-orange-100" />} 
            label="Total Votes" 
            value={totalVotes} 
            subLabel="Community choices"
            className="bg-gradient-to-br from-orange-500 to-orange-700 text-white"
          />
          <StatsCard 
            icon={<UserCheck className="text-green-100" />} 
            label="Your Votes" 
            value={userVotes} 
            subLabel="Contributions made"
            className="bg-gradient-to-br from-green-500 to-green-700 text-white"
          />
        </div>

        {/* Toolbar: Admin Actions & Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200 pb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {sortOption === "alpha" ? "All Destinations (A-Z)" : "Most Popular Trips"}
          </h2>
          
          <div className="flex items-center gap-4">
             {/* Sort Dropdown */}
             <PollControls />
             
          </div>
        </div>

        {/* Polls Grid */}
        {polls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => (
              <PollCard key={poll.id} {...poll} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
            <p className="text-gray-500">
              No active polls right now. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Component for Stats
function StatsCard({ icon, label, value, subLabel, className }: { icon: React.ReactNode, label: string, value: number, subLabel: string, className: string }) {
  return (
    <Card className={cn("border-none shadow-md", className)}>
      <CardContent className="p-6 flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-xl shadow-inner backdrop-blur-sm">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium opacity-90">{label}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold">{value}</h3>
            <span className="text-xs opacity-80">{subLabel}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}