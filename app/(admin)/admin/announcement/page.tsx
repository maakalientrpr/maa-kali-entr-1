"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updateAnnouncement } from "@/actions/announcement";
import { Loader2 } from "lucide-react"; // Optional loading icon
import { Button } from "@/components/ui/button";

export default function AnnouncementForm({ initialText }: { initialText?: string }) {
  // useActionState handles the 'isPending' state and the action response automatically
  const [state, formAction, isPending] = useActionState(updateAnnouncement, null);

  // Trigger toast when the server responds
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <textarea
        name="text"
        defaultValue={initialText}
        disabled={isPending}
        className="w-full p-4 border rounded-lg bg-background text-foreground disabled:opacity-50"
        placeholder="Enter the scrolling message..."
        rows={3}
      />
      
      <Button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:opacity-90 transition disabled:cursor-not-allowed disabled:bg-orange-700"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin size-4" />
            Updating...
          </>
        ) : (
          "Update Live Message"
        )}
      </Button>
    </form>
  );
}