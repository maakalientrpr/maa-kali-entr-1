"use client";

import { useEffect, useState } from "react";
import {
  useForm,
  useFieldArray,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Loader2,
  Plus,
  Trash2,
  IndianRupee,
  MapPin,
  CalendarIcon,
  Users,
  Briefcase,
  ListChecks,
  Image as ImageIcon,
  Map,
  Clock,
  Tag,
} from "lucide-react";

import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

//
// ---------------------- Schema (Matches Add Form) ----------------------
//
const tourSchema = z.object({
  title: z.string().min(5, "Title is too short"),
  slug: z.string().min(5, "Slug is required"),
  destination: z.string().min(2, "Destination is required"),
  description: z.string().min(20, "Description must be detailed"),
  category: z.enum(["DOMESTIC", "INTERNATIONAL", "WEEKEND"]),

  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),

  totalSeats: z.coerce.number().min(1, "At least 1 seat required"),
  durationNights: z.coerce.number().min(0),
  durationDays: z.coerce.number().min(1),

  // Nested Pickup Options with Pricing
  pickupOptions: z
    .array(
      z.object({
        id: z.string().optional(),
        title: z.string().min(2, "Pickup location name required"),
        priceSingleSharing: z.coerce.number().min(0, "Required"),
        priceDoubleSharing: z.coerce.number().min(0, "Required"),
        priceTripleSharing: z.coerce.number().min(0, "Required"),
      })
    )
    .min(1, "Add at least one pickup & pricing option"),

  inclusions: z.array(z.object({ value: z.string().min(1) })).min(1),
  exclusions: z.array(z.object({ value: z.string() })).optional(),
  images: z.array(z.object({ value: z.string().url("Invalid URL") })).min(1),

  itinerary: z
    .array(
      z.object({
        day: z.coerce.number().min(1),
        title: z.string().min(2, "Day title required"),
        description: z.string().optional(),
      })
    )
    .min(1, "Add at least 1 day itinerary"),
});

type TourFormValues = z.infer<typeof tourSchema>;

// Type matching Prisma Return with Relations
type TourDBType = {
  id: string;
  title: string;
  slug: string;
  destination: string;
  description: string;
  category: "DOMESTIC" | "INTERNATIONAL" | "WEEKEND";
  startDate: Date;
  totalSeats: number;
  durationDays: number;
  durationNights: number;
  inclusions: string[];
  exclusions: string[];
  images: string[];
  pickupOptions: {
    id: string;
    title: string;
    priceSingleSharing: number;
    priceDoubleSharing: number | null;
    priceTripleSharing: number | null;
  }[];
  itineraries: {
    id: string;
    day: number;
    title: string;
    description: string;
  }[];
};

//
// ---------------------- Helpers ----------------------
//
const parseNumber = (v: string | number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 240);

//
// ---------------------- Components ----------------------
//

interface NumberInputProps {
  field: ControllerRenderProps<FieldValues, any> | any;
  placeholder?: string;
  min?: number;
  disabled?: boolean;
  className?: string;
}

function NumberInputWrapper({
  field,
  placeholder,
  min,
  disabled = false,
  className = "",
}: NumberInputProps) {
  return (
    <Input
      type="number"
      value={
        field.value === undefined || field.value === null
          ? ""
          : String(field.value)
      }
      onChange={(e) => {
        const v = parseNumber(e.target.value);
        field.onChange(v);
      }}
      placeholder={placeholder}
      min={min}
      disabled={disabled}
      className={className}
    />
  );
}

interface CloudinaryResultInfo {
  secure_url: string;
  [key: string]: any;
}

function ImageUploader({ onUpload }: { onUpload: (url: string) => void }) {
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

  return (
    <CldUploadWidget
      uploadPreset={UPLOAD_PRESET}
      onSuccess={(result: CloudinaryUploadWidgetResults) => {
        const info = result.info as CloudinaryResultInfo;
        if (typeof info === "object" && info?.secure_url) {
          onUpload(info.secure_url);
          toast.success("Image uploaded successfully");
        }
      }}
      options={{
        maxFiles: 1,
        resourceType: "image",
      }}
    >
      {({ open }) => (
        <Button
          type="button"
          onClick={() => open()}
          className="w-full bg-orange-600 text-white hover:bg-orange-700"
        >
          <ImageIcon className="mr-2 h-4 w-4" /> Upload Image via Cloudinary
        </Button>
      )}
    </CldUploadWidget>
  );
}

//
// ---------------------- Main Component ----------------------
//
export default function EditTourForm({ tour }: { tour: TourDBType }) {
  const router = useRouter();
  const [slugTouched, setSlugTouched] = useState(false);

  // Initialize form with DB data
  const form = useForm({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      title: tour.title,
      slug: tour.slug,
      destination: tour.destination,
      description: tour.description,
      category: tour.category,
      startDate: new Date(tour.startDate).toISOString().slice(0, 10), // Format YYYY-MM-DD
      totalSeats: tour.totalSeats,
      durationDays: tour.durationDays,
      durationNights: tour.durationNights,

      // Map Relations
      pickupOptions: tour.pickupOptions.map((opt) => ({
        id: opt.id,
        title: opt.title,
        priceSingleSharing: opt.priceSingleSharing,
        priceDoubleSharing: opt.priceDoubleSharing ?? 0,
        priceTripleSharing: opt.priceTripleSharing ?? 0,
      })),

      inclusions: tour.inclusions.map((val) => ({ value: val })),
      exclusions: tour.exclusions.map((val) => ({ value: val })),
      images: tour.images.map((val) => ({ value: val })),

      itinerary: tour.itineraries.map((it) => ({
        day: it.day,
        title: it.title,
        description: it.description,
      })),
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { isSubmitting },
  } = form;

  // Field Arrays
  const pickupOpts = useFieldArray({ control, name: "pickupOptions" } as any);
  const inc = useFieldArray({ control, name: "inclusions" } as any);
  const exc = useFieldArray({ control, name: "exclusions" } as any);
  const imgs = useFieldArray({ control, name: "images" } as any);
  const itin = useFieldArray({ control, name: "itinerary" } as any);

  const watchedTitle = watch("title");

  // Auto-generate slug only if user hasn't manually touched it
  useEffect(() => {
    if (!slugTouched) {
      const slug = generateSlug(watchedTitle || "");
      if (slug.length > 0) {
        setValue("slug", slug, { shouldTouch: false, shouldValidate: true });
      }
    }
  }, [watchedTitle, slugTouched, setValue]);

  const appendDay = () => {
    const nextDay = itin.fields.length + 1;
    itin.append({
      day: nextDay,
      title: "",
      description: "",
    });
  };

  const onSubmit = async (data: TourFormValues) => {
    try {
      const payload = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        // Flatten simple arrays
        inclusions: data.inclusions.map((i) => i.value),
        exclusions: (data.exclusions || []).map((e) => e.value),
        images: data.images.map((i) => i.value),
        // Nested objects (pickupOptions & itinerary) are sent as is
        // The backend will likely need to handle update/create logic
      };

      await axios.put(`/api/tours/${tour.id}`, payload);

      toast.success("Tour Updated Successfully ✅");
      router.push("/admin/tour-package");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update tour");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-2">
            Edit <span className="text-orange-600">Tour Package</span>
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT COLUMN */}
              <div className="lg:col-span-2 space-y-8">
                {/* Details */}
                <Card className="shadow-sm border-t-4 border-t-orange-600">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Briefcase className="w-5 h-5 text-orange-600" /> Trip
                      Details
                    </CardTitle>
                    <CardDescription>
                      Basic information about the destination.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <FormField
                      control={control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Package Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL Slug</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                onChange={(e) => {
                                  setSlugTouched(true);
                                  field.onChange(e);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destination</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex gap-2 items-center text-orange-800">
                              <Tag className="w-4 h-4" /> Category
                            </FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                {...field}
                              >
                                <option value="DOMESTIC">Domestic Tour</option>
                                <option value="INTERNATIONAL">
                                  International Tour
                                </option>
                                <option value="WEEKEND">Weekend Tour</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                      <FormField
                        control={control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex gap-2 items-center text-orange-800">
                              <CalendarIcon className="w-4 h-4" /> Start Date
                            </FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="totalSeats"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex gap-2 items-center text-orange-800">
                              <Users className="w-4 h-4" /> Total Seats
                            </FormLabel>
                            <FormControl>
                              <NumberInputWrapper field={field} min={1} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* ITINERARY */}
                <Card className="shadow-sm border-t-4 border-t-orange-600">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-orange-700">
                      <Map className="w-5 h-5" /> Day-wise Itinerary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {itin.fields.map((f, idx) => (
                      <div
                        key={f.id}
                        className="relative pl-8 border-l-2 border-orange-200 pb-6 last:border-0 last:pb-0"
                      >
                        <div className="absolute -left-[9px] top-0 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white bg-orange-500" />
                        <div className="bg-slate-50 border rounded-lg p-5 relative">
                          <div className="flex justify-between items-start mb-4">
                            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                              Day {idx + 1}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                itin.remove(idx);
                                const remaining = getValues("itinerary");
                                remaining.forEach((_: any, i: number) => {
                                  setValue(`itinerary.${i}.day` as any, i + 1);
                                });
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="space-y-4">
                            <FormField
                              control={control}
                              name={`itinerary.${idx}.title`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="Day Title" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={control}
                              name={`itinerary.${idx}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Activities..."
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 mt-4"
                      onClick={appendDay}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Day
                    </Button>
                  </CardContent>
                </Card>

                {/* IMAGES */}
                <Card className="shadow-sm border-t-4 border-t-orange-600">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" /> Gallery Images
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ImageUploader
                      onUpload={(url) => {
                        const currentImages = getValues("images");
                        if (
                          currentImages.length === 1 &&
                          !currentImages[0].value
                        ) {
                          setValue("images.0.value" as any, url, {
                            shouldValidate: true,
                          });
                        } else {
                          imgs.append({ value: url });
                        }
                      }}
                    />
                    {imgs.fields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-center">
                        {watch(`images.${index}.value` as any) && (
                          <img
                            src={watch(`images.${index}.value` as any)}
                            className="w-14 h-14 rounded object-cover border"
                            alt="preview"
                          />
                        )}
                        <FormField
                          control={control}
                          name={`images.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="https://..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => imgs.remove(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full border-dashed border-orange-300 text-orange-600"
                      onClick={() => imgs.append({ value: "" })}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Image URL
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-8 h-fit">
                {/* Logistics */}
                <Card className="shadow-sm pt-0">
                  <CardHeader className="bg-slate-100 rounded-t-xl py-4">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Logistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="flex gap-3">
                      <FormField
                        control={control}
                        name="durationNights"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-xs uppercase text-slate-500">
                              Nights
                            </FormLabel>
                            <FormControl>
                              <NumberInputWrapper field={field} min={0} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="durationDays"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-xs uppercase text-slate-500">
                              Days
                            </FormLabel>
                            <FormControl>
                              <NumberInputWrapper field={field} min={1} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing & Pickups */}
                <Card className="shadow-md border-orange-200 bg-linear-to-br from-orange-50 to-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-orange-800 text-lg">
                      <IndianRupee className="w-5 h-5 mr-1" /> Pricing & Pickups
                    </CardTitle>
                    <CardDescription>
                      Set prices for different pickup locations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {pickupOpts.fields.map((field, idx) => (
                      <div
                        key={field.id}
                        className="p-4 bg-white border border-orange-100 rounded-lg shadow-sm space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <FormField
                            control={control}
                            name={`pickupOptions.${idx}.title`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel className="text-xs font-bold uppercase text-slate-500">
                                  Location
                                </FormLabel>
                                <div className="relative flex-1">
                                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-orange-500" />
                                  <FormControl>
                                    <Input
                                      className="pl-9 font-semibold"
                                      placeholder="e.g. Ex-Mumbai"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {pickupOpts.fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="ml-2 mt-6 text-red-500"
                              onClick={() => pickupOpts.remove(idx)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <FormField
                            control={control}
                            name={`pickupOptions.${idx}.priceSingleSharing`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] uppercase">
                                  Single
                                </FormLabel>
                                <FormControl>
                                  <NumberInputWrapper field={field} min={0} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`pickupOptions.${idx}.priceDoubleSharing`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] uppercase">
                                  Double
                                </FormLabel>
                                <FormControl>
                                  <NumberInputWrapper field={field} min={0} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`pickupOptions.${idx}.priceTripleSharing`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] uppercase">
                                  Triple
                                </FormLabel>
                                <FormControl>
                                  <NumberInputWrapper field={field} min={0} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-dashed border-orange-300 text-orange-600"
                      onClick={() =>
                        pickupOpts.append({
                          title: "",
                          priceSingleSharing: 0,
                          priceDoubleSharing: 0,
                          priceTripleSharing: 0,
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Pickup Option
                    </Button>
                  </CardContent>
                </Card>

                {/* Inclusions/Exclusions */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <ListChecks className="w-4 h-4" /> Inclusions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {inc.fields.map((field, idx) => (
                      <div key={field.id} className="flex gap-2">
                        <FormField
                          control={control}
                          name={`inclusions.${idx}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input className="h-8 text-sm" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => inc.remove(idx)}
                        >
                          <Trash2 className="w-3 h-3 text-slate-400 hover:text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs text-slate-500"
                      onClick={() => inc.append({ value: "" })}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Inclusion
                    </Button>

                    <Separator className="my-2" />

                    <div className="flex justify-between items-center mb-2">
                      <FormLabel className="text-red-500 font-bold">
                        Exclusions
                      </FormLabel>
                    </div>

                    {exc.fields.map((field, idx) => (
                      <div key={field.id} className="flex gap-2">
                        <FormField
                          control={control}
                          name={`exclusions.${idx}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input className="h-8 text-sm" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => exc.remove(idx)}
                        >
                          <Trash2 className="w-3 h-3 text-slate-400 hover:text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs text-slate-500"
                      onClick={() => exc.append({ value: "" })}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Exclusion
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Button
              disabled={isSubmitting}
              type="submit"
              className="w-full h-14 text-lg bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Update Tour Package
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
