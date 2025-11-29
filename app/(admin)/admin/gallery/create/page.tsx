"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { createAlbum } from "@/actions/gallery-actions"; 

// 1. Define categories manually to avoid importing @prisma/client runtime
const ALBUM_CATEGORIES = ["TOURS", "PILGRIMAGE", "EVENTS", "CATERING"];

export default function CreateGalleryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  // 2. Use string type for state instead of the Enum type
  const [category, setCategory] = useState(ALBUM_CATEGORIES[0]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleUpload = (result: any) => {
    if (result.info?.secure_url) {
      setUploadedImages((prev) => [...prev, result.info.secure_url]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createAlbum({
        title,
        location,
        // Cast string back to specific type if needed by the action, 
        // though the action usually accepts string if defined as AlbumCategory
        category: category as any, 
        images: uploadedImages,
      });

      if (res.success) {
        toast.success("Album Created Successfully!");
        router.push("/admin/gallery"); 
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
          <CardTitle>Create New Album</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Album Title</Label>
                <Input 
                  placeholder="e.g. Summer Vacation" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Location</Label>
                <Input 
                  placeholder="e.g. Manali, India" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  required 
                />
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {ALBUM_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Uploader */}
            <div className="space-y-3">
              <Label>Gallery Images ({uploadedImages.length})</Label>
              
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={handleUpload}
                options={{ multiple: true, folder: "albums" }}
              >
                {({ open }) => (
                  <div 
                    onClick={() => open()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                  >
                    <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload images</p>
                  </div>
                )}
              </CldUploadWidget>

              {/* Preview Grid */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-4">
                  {uploadedImages.map((url, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-md overflow-hidden">
                      <img src={url} alt="preview" className="object-cover w-full h-full" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
              Create Album
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}