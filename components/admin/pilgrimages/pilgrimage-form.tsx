"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, ImageIcon, UploadCloud } from "lucide-react";
import {
  createPilgrimage,
  updatePilgrimage,
} from "@/actions/pilgrimage-actions";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { toast } from "sonner";
import { Pilgrimage } from "@/prisma/generated/client";

const formSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description is too short (min 10 chars)"),
  image: z.string().min(1, "Cover image is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface PilgrimageFormProps {
  initialData?: Pilgrimage | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PilgrimageForm = ({
  initialData,
  onSuccess,
  onCancel,
}: PilgrimageFormProps) => {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      image: initialData?.image || "",
    },
  });

  const imageUrl = watch("image");

  const handleUpload = (result: any) => {
    if (result.info?.secure_url) {
      setValue("image", result.info.secure_url, {
        shouldValidate: true,
        shouldDirty: true,
      });
      toast.success("Image uploaded");
    }
  };

  const handleRemoveImage = () => {
    setValue("image", "", { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      let result;
      if (initialData) {
        result = await updatePilgrimage(initialData.id, {
          title: data.title,
          description: data.description,
          image: data.image,
        });
      } else {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("image", data.image);
        result = await createPilgrimage(formData);
      }

      if (result.success) {
        toast.success(result.message);
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.error || "Something went wrong");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Inputs */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              Pilgrimage Title
            </Label>
            <Input
              id="title"
              placeholder="e.g. Divine Kedarnath Yatra"
              disabled={isPending}
              {...register("title")}
              className="h-10"
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </Label>
            <Textarea
              id="description"
              rows={8}
              disabled={isPending}
              placeholder="Describe the journey details..."
              {...register("description")}
              className="resize-none"
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Image Upload */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Cover Image
          </Label>
          <div className="mt-2">
            {imageUrl ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 h-8 w-8 shadow-sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <CldUploadButton
                options={{ maxFiles: 1, folder: "pilgrimages" }}
                onSuccess={handleUpload}
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 hover:border-orange-500 transition-all duration-200"
              >
                <div className="p-3 bg-orange-50 rounded-full">
                  <UploadCloud className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-center text-sm text-gray-600">
                  <span className="font-semibold text-orange-600">
                    Click to upload
                  </span>
                  <br /> or drag and drop
                </div>
              </CldUploadButton>
            )}
            {errors.image && (
              <p className="text-xs text-red-500 mt-2">
                {errors.image.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-orange-600 hover:bg-orange-700 min-w-[120px]"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Save Changes" : "Create"}
        </Button>
      </div>
    </form>
  );
};
