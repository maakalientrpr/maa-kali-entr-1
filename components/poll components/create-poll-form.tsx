"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { createPoll } from "@/actions/poll-actions";
import { toast } from "sonner";
import { CldUploadWidget } from "next-cloudinary";

const CreatePollForm = () => {
    
  const [imageUrl, setImageUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  async function clientAction(formData: FormData) {
    if (imageUrl) formData.set("imageUrl", imageUrl);

    const res = await createPoll(formData);

    if (res.success) {
      toast.success(res.message);
      setIsOpen(false);
      setImageUrl("");
    } else {
      toast.error(res.error);
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-orange-600 hover:bg-orange-700"
      >
        <Plus className="mr-2 h-4 w-4" /> Propose New Tour
      </Button>
    );
  }

  return (
    <Card className="mb-8 border-orange-200 bg-orange-50/30">
      <CardHeader>
        <CardTitle>Propose a Tour</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={clientAction} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="title"
              placeholder="Trip Title (e.g. Kedarnath Trek)"
              required
            />
            <Input
              name="location"
              placeholder="Location (e.g. Uttarakhand)"
              required
            />
          </div>
          <Textarea
            name="description"
            placeholder="Why should we go here? Describe the experience..."
            required
          />

          {/* Simple Cloudinary Widget */}
          <div className="flex items-center gap-4">
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={(res: any) => setImageUrl(res.info.secure_url)}
            >
              {({ open }) => (
                <Button type="button" variant="outline" onClick={() => open()}>
                  {imageUrl ? "Change Image" : "Upload Image"}
                </Button>
              )}
            </CldUploadWidget>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="preview"
                className="h-10 w-10 rounded object-cover"
              />
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePollForm;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-orange-600">
      {pending ? <Loader2 className="animate-spin" /> : "Create Poll"}
    </Button>
  );
}
