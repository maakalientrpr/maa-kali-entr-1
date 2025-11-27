"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UploadCloud, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { updateTripAlbum } from "@/actions/gallery-actions";

// Type matching the Prisma include
type AlbumData = {
  id: string;
  title: string;
  location: string | null;
  year: { yearNumber: number };
  images: { id: string; imageUrl: string }[];
};

export default function EditGalleryForm({ album }: { album: AlbumData }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState(album.title);
  const [location, setLocation] = useState(album.location || "");
  const [year, setYear] = useState(album.year.yearNumber);

  // State for Images
  const [existingImages, setExistingImages] = useState(album.images);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<string[]>([]);

  // Handle New Uploads
  const handleUpload = (result: any) => {
    if (result.info?.secure_url) {
      setNewImages((prev) => [...prev, result.info.secure_url]);
    }
  };

  // Mark existing image for deletion
  const handleDeleteExisting = (imageId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    setImagesToDelete((prev) => [...prev, imageId]);
  };

  // Remove newly uploaded image (before save)
  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await updateTripAlbum({
        albumId: album.id,
        title,
        location,
        year: Number(year),
        newImages,
        // ✅ FIXED: Map the state variable 'imagesToDelete' to the expected prop 'imageIdsToDelete'
        imageIdsToDelete: imagesToDelete, 
      });

      if (res.success) {
        toast.success("Album Updated!");
        router.push("/admin/gallery");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Album: {album.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Trip Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            {/* Existing Images Section */}
            <div className="space-y-3">
              <Label>Existing Images</Label>
              {existingImages.length === 0 && (
                <p className="text-sm text-gray-500 italic">No existing images remaining.</p>
              )}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {existingImages.map((img) => (
                  <div key={img.id} className="relative group aspect-square rounded-md overflow-hidden border">
                    <img src={img.imageUrl} alt="trip" className="object-cover w-full h-full" />
                    {/* Delete Button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteExisting(img.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* New Upload Section */}
            <div className="space-y-3 pt-4 border-t">
              <Label>Add New Images</Label>
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={handleUpload}
                options={{ multiple: true, folder: "trips" }}
              >
                {({ open }) => (
                  <div
                    onClick={() => open()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                  >
                    <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload new images</p>
                  </div>
                )}
              </CldUploadWidget>

              {newImages.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-4">
                  {newImages.map((url, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-md overflow-hidden border border-blue-500">
                      <img src={url} alt="new-preview" className="object-cover w-full h-full" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
              Update Album
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}