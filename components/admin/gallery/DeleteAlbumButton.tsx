"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteTripAlbum } from "@/actions/gallery-actions";
import { toast } from "sonner";

export function DeleteAlbumButton({ albumId }: { albumId: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this album and all its images?")) return;

    setLoading(true);
    const res = await deleteTripAlbum(albumId);
    setLoading(false);

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.error);
    }
  };

  return (
    <Button variant="destructive" size="icon" onClick={handleDelete} disabled={loading}>
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </Button>
  );
}