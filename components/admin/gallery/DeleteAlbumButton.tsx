"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteAlbum } from "@/actions/gallery-actions"; // Updated import

export function DeleteAlbumButton({ albumId }: { albumId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this album?")) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteAlbum(albumId); // Updated function call
      if (res.success) {
        toast.success("Album deleted");
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button 
      variant="destructive" 
      size="icon" 
      onClick={handleDelete} 
      disabled={isDeleting}
    >
      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 size={16} />}
    </Button>
  );
}