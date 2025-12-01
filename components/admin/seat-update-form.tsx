"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateAvailableSeats } from "@/actions/tour-actions"; // Adjust path if needed
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SeatUpdateFormProps {
  id: string;
  currentSeats: number;
  totalSeats: number;
}

export const SeatUpdateForm = ({ id, currentSeats, totalSeats }: SeatUpdateFormProps) => {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    
    // Call the server action
    const result = await updateAvailableSeats(formData);

    if (result.success) {
      toast.success("Seats updated successfully");
    } else {
      toast.error(result.error || "Failed to update seats");
    }

    setIsPending(false);
  };

  return (
    <form action={handleSubmit} className="flex flex-col gap-3">
      <div className="space-y-1">
        <h4 className="font-semibold text-sm">Update Availability</h4>
        <p className="text-xs text-muted-foreground">
          Adjust for offline bookings.
        </p>
      </div>
      <div className="flex gap-2">
        <input type="hidden" name="id" value={id} />
        <Input
          type="number"
          name="availableSeats"
          defaultValue={currentSeats}
          min={0}
          max={totalSeats}
          className="h-8"
          disabled={isPending}
        />
        <Button 
          type="submit" 
          size="sm" 
          className="h-8 bg-orange-600 hover:bg-orange-700"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
        </Button>
      </div>
    </form>
  );
};