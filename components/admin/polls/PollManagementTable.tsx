"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { deletePoll, updatePollStatus } from "@/actions/poll-actions";
import { PollStatus } from "@/prisma/generated/enums";

type PollData = {
  id: string;
  title: string;
  location: string;
  status: PollStatus;
  imageUrl: string | null;
  _count: { votes: number };
  createdAt: Date;
};

export default function PollManagementTable({ polls }: { polls: PollData[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete all votes associated with this poll.")) return;
    
    setLoadingId(id);
    const res = await deletePoll(id);
    if (res.success) toast.success(res.message);
    else toast.error(res.error);
    setLoadingId(null);
  };

  const handleStatusChange = async (id: string, newStatus: PollStatus) => {
    const res = await updatePollStatus(id, newStatus);
    if (res.success) toast.success(`Status changed to ${newStatus}`);
    else toast.error(res.error);
  };

  return (
    <div className="bg-white rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Title & Location</TableHead>
            <TableHead>Votes</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {polls.map((poll) => (
            <TableRow key={poll.id}>
              {/* Image */}
              <TableCell>
                {poll.imageUrl ? (
                  <img src={poll.imageUrl} alt="poll" className="h-12 w-16 object-cover rounded bg-gray-100" />
                ) : (
                  <div className="h-12 w-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">No Img</div>
                )}
              </TableCell>
              
              {/* Info */}
              <TableCell>
                <p className="font-semibold">{poll.title}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin size={10} /> {poll.location}
                </p>
              </TableCell>

              {/* Votes */}
              <TableCell>
                <Badge variant="secondary" className="font-bold">
                  {poll._count.votes}
                </Badge>
              </TableCell>

              {/* Status Selector */}
              <TableCell>
                <Select 
                  defaultValue={poll.status} 
                  onValueChange={(val) => handleStatusChange(poll.id, val as PollStatus)}
                >
                  <SelectTrigger className="w-[130px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                    <SelectItem value="PLANNED">Planned</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-8 w-8"
                  disabled={loadingId === poll.id}
                  onClick={() => handleDelete(poll.id)}
                >
                  {loadingId === poll.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 size={14} />}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {polls.length === 0 && (
        <div className="p-8 text-center text-gray-500 text-sm">
          No polls created yet.
        </div>
      )}
    </div>
  );
}