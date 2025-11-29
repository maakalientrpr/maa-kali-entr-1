"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MapPin, Loader2 } from "lucide-react";
import {  toggleVote } from "@/actions/poll-actions";
import { toast } from "sonner";

type PollCardProps = {
  id: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string | null;
  voteCount: number;
  hasVoted: boolean;
  status: string
};

const PollCard = ({ id, title, status , description, location, imageUrl, voteCount, hasVoted }: PollCardProps) => {
 const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    setIsVoting(true);
    // Optimistic UI could be implemented here for instant feedback
    try {
      const res = await toggleVote(id);
      if (!res.success) toast.error(res.error);
    } catch {
      toast.error("Failed to vote");
    } finally {
      setIsVoting(false);
    }
  };

  const isClosed = status !== "OPEN";

  return (
    <Card className={`overflow-hidden pt-0 transition-all duration-300 ${hasVoted ? 'border-orange-500 shadow-md ring-1 ring-orange-500/20' : 'hover:border-gray-300'}`}>
      <div className="relative h-48 bg-gray-100">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <MapPin size={48} opacity={0.2} />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant={hasVoted ? "default" : "secondary"} className={hasVoted ? "bg-orange-500" : "bg-white/90 text-gray-700"}>
            {voteCount} Votes
          </Badge>
        </div>
      </div>
      
      <CardContent className="pt-6">
        <div className="mb-4">
          <h3 className="font-bold text-xl mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin size={14} /> {location}
          </p>
        </div>
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={handleVote} 
          disabled={isVoting || isClosed}
          variant={hasVoted ? "secondary" : "default"}
          className={`w-full ${!hasVoted ? "bg-orange-500 hover:bg-orange-800" : "bg-orange-100 text-orange-700 hover:bg-orange-200"}`}
        >
          {isVoting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : hasVoted ? (
            <>
              <ThumbsUp className="mr-2 h-4 w-4 fill-current" /> Voted!
            </>
          ) : (
            <>
              <ThumbsUp className="mr-2 h-4 w-4" /> Vote for this Trip
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PollCard
