"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
} from "lucide-react";

import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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



const tourSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(5, "Slug must be at least 5 characters"),
  destination: z.string().min(2, "Destination is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),

  startDate: z.string().nonempty("Start date is required"),
  totalSeats: z
    .number({ error: "Total seats is required" })
    .min(1, "Total seats must be at least 1"),

  durationNights: z
    .number({ error: "Duration (nights) is required" })
    .min(0, "Duration nights cannot be negative"),
  durationDays: z
    .number({ error: "Duration (days) is required" })
    .min(1, "Duration days must be at least 1"),

  pickupPoints: z
    .array(z.object({ value: z.string().min(2, "Pickup point is required") }))
    .min(1, "Add at least one pickup point"),

  priceDoubleSharing: z
    .number({ error: "Double sharing price is required" })
    .min(1, "Price must be at least 1"),
  priceTripleSharing: z
    .number({ error: "Triple sharing price is required" })
    .min(1, "Price must be at least 1"),

  inclusions: z
    .array(z.object({ value: z.string().min(1, "Inclusion is required") }))
    .min(1, "Add at least one inclusion"),
  exclusions: z
    .array(z.object({ value: z.string().min(1, "Exclusion is required") }))
    .optional(),
  images: z
    .array(z.object({ value: z.string().url("Must be a valid URL") }))
    .min(1, "Add at least one image"),

  itinerary: z
    .array(
      z.object({
        day: z.number().min(1),
        title: z.string().min(2, "Itinerary title required"),
        description: z.string().min(5, "Itinerary description required"),
      })
    )
    .min(1, "Add at least one itinerary day"),
});

type TourFormValues = z.infer<typeof tourSchema>;

type TourDBType = {
  id: string;
  title: string;
  slug: string;
  destination: string;
  description: string;
  startDate: string;
  totalSeats: number;
  durationDays: number;
  durationNights: number;
  priceDoubleSharing: number;
  priceTripleSharing: number;
  pickupPoints: string[];
  inclusions: string[];
  exclusions?: string[];
  images: string[];
  itineraries: {
    day: number;
    title: string;
    description: string;
  }[];
};



export default function EditTourPage({ tour } : {tour: TourDBType}) {
  const router = useRouter();
  const [isSamePrice, setIsSamePrice] = useState(false);

  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      title: tour?.title ?? "",
      slug: tour?.slug ?? "",
      destination: tour?.destination ?? "",
      description: tour?.description ?? "",
      startDate: tour?.startDate
        ? new Date(tour.startDate).toISOString().slice(0, 10)
        : "", // YYYY-MM-DD for date input
      totalSeats: typeof tour?.totalSeats === "number" ? tour.totalSeats : 1,

      durationDays:
        typeof tour?.durationDays === "number" ? tour.durationDays : 1,
      durationNights:
        typeof tour?.durationNights === "number" ? tour.durationNights : 0,

      priceDoubleSharing:
        typeof tour?.priceDoubleSharing === "number"
          ? tour.priceDoubleSharing
          : 1,
      priceTripleSharing:
        typeof tour?.priceTripleSharing === "number"
          ? tour.priceTripleSharing
          : 1,

      pickupPoints: Array.isArray(tour?.pickupPoints)
        ? tour.pickupPoints.map((p: string) => ({ value: p }))
        : [{ value: "" }],

      inclusions: Array.isArray(tour?.inclusions)
        ? tour.inclusions.map((i: string) => ({ value: i }))
        : [{ value: "" }],
      exclusions: Array.isArray(tour?.exclusions)
        ? tour.exclusions.map((e: string) => ({ value: e }))
        : [],

      images: Array.isArray(tour?.images)
        ? tour.images.map((img: string) => ({ value: img }))
        : [{ value: "" }],

      itinerary:
        Array.isArray(tour?.itineraries) && tour.itineraries.length
          ? tour.itineraries.map((it: any, idx: number) => ({
              day: it.day ?? idx + 1,
              title: it.title ?? "",
              description: it.description ?? "",
            }))
          : [{ day: 1, title: "", description: "" }],
    },
  });

  const doublePrice = form.watch("priceDoubleSharing");

  // Keep triple in sync when isSamePrice is true
  useEffect(() => {
    if (isSamePrice) {
      // only set when isSamePrice is enabled
      form.setValue("priceTripleSharing", doublePrice ?? 0, {
        shouldValidate: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doublePrice, isSamePrice]);

  const pickupFields = useFieldArray({
    control: form.control,
    name: "pickupPoints",
  });
  const incFields = useFieldArray({
    control: form.control,
    name: "inclusions",
  });
  const excFields = useFieldArray({
    control: form.control,
    name: "exclusions",
  });
  const imgFields = useFieldArray({ control: form.control, name: "images" });
  const itinFields = useFieldArray({
    control: form.control,
    name: "itinerary",
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: TourFormValues) {
    try {
      const formatted = {
        ...data,
        // keep startDate as ISO
        startDate: new Date(data.startDate).toISOString(),
        // arrays to string arrays
        pickupPoints: data.pickupPoints.map((p) => p.value),
        inclusions: data.inclusions.map((i) => i.value),
        exclusions: data.exclusions?.map((e) => e.value) || [],
        images: data.images.map((i) => i.value),
        // itinerary already shaped
      };

      await axios.put(`/api/tours/${tour.id}`, formatted);

      toast.success("Tour Updated Successfully ✅");
      router.push("/admin/tour-package");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update tour");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold">
            Edit <span className="text-orange-600">Tour Package</span>
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT COLUMN */}
              <div className="lg:col-span-2 space-y-8">
                {/* BASIC DETAILS */}
                <Card className="border-t-4 border-orange-600">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="text-orange-600" /> Trip Details
                    </CardTitle>
                    <CardDescription>
                      Basic information about this tour.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
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

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={5} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* SCHEDULE & DURATION */}
                <Card className="border-t-4 border-orange-600">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="text-orange-600" /> Schedule
                    </CardTitle>
                    <CardDescription>
                      Tour date, seats and duration.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="totalSeats"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Seats</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(e.target.valueAsNumber)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          control={form.control}
                          name="durationDays"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Days</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(e.target.valueAsNumber)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="durationNights"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nights</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(e.target.valueAsNumber)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* PICKUP POINTS */}
                <Card className="border-t-4 border-orange-600">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="text-orange-600" /> Pickup Points
                    </CardTitle>
                    <CardDescription>
                      Add pickup locations for this tour.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pickupFields.fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex gap-2 items-start bg-white p-3 rounded border"
                      >
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name={`pickupPoints.${index}.value`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pickup Point {index + 1}</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Pickup location"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex flex-col gap-2 pt-6">
                          <Button
                            variant="ghost"
                            onClick={() => pickupFields.remove(index)}
                            type="button"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => pickupFields.append({ value: "" })}
                    >
                      <Plus size={16} /> Add Pickup Point
                    </Button>
                  </CardContent>
                </Card>

                {/* ITINERARY */}
                <Card className="border-t-4 border-orange-600">
                  <CardHeader>
                    <CardTitle className="flex gap-2">
                      <Map className="text-orange-600" /> Day-wise Itinerary
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {itinFields.fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="border-l-2 border-orange-300 pl-6 pb-6"
                      >
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="flex justify-between mb-2">
                            <span className="text-orange-600 font-bold">
                              Day{" "}
                              {form.getValues(`itinerary.${index}.day`) ??
                                index + 1}
                            </span>
                            <Button
                              variant="ghost"
                              onClick={() => itinFields.remove(index)}
                              type="button"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>

                          <FormField
                            control={form.control}
                            name={`itinerary.${index}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Day Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Day Title" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`itinerary.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Day Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Day description..."
                                    {...field}
                                  />
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
                      onClick={() =>
                        itinFields.append({
                          day: itinFields.fields.length + 1,
                          title: "",
                          description: "",
                        })
                      }
                    >
                      <Plus size={16} /> Add Day
                    </Button>
                  </CardContent>
                </Card>

                {/* INCLUSIONS / EXCLUSIONS / IMAGES */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Card className="col-span-1 border-t-4 border-orange-600">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ListChecks className="text-orange-600" /> Inclusions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {incFields.fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex gap-2 items-start mb-2"
                        >
                          <div className="flex-1">
                            <FormField
                              control={form.control}
                              name={`inclusions.${index}.value`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="What's included?"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <Button
                            variant="ghost"
                            onClick={() => incFields.remove(index)}
                            type="button"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => incFields.append({ value: "" })}
                      >
                        <Plus size={16} /> Add Inclusion
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="col-span-1 border-t-4 border-orange-600">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="text-orange-600" /> Exclusions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {excFields.fields.length === 0 && (
                        <p className="text-sm text-muted-foreground mb-2">
                          No exclusions added.
                        </p>
                      )}

                      {excFields.fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex gap-2 items-start mb-2"
                        >
                          <div className="flex-1">
                            <FormField
                              control={form.control}
                              name={`exclusions.${index}.value`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="What's excluded?"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <Button
                            variant="ghost"
                            onClick={() => excFields.remove(index)}
                            type="button"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => excFields.append({ value: "" })}
                      >
                        <Plus size={16} /> Add Exclusion
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="col-span-1 border-t-4 border-orange-600">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="text-orange-600" /> Images
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {imgFields.fields.map((item, index) => (
                        <div
                          key={item.id}
                          className="flex gap-2 items-start mb-4"
                        >
                          <div className="flex-1">
                            <FormField
                              control={form.control}
                              name={`images.${index}.value`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div className="flex flex-col gap-2">
                                      {/* 1. PREVIEW IMAGE */}
                                      {field.value ? (
                                        <div className="relative w-full h-32 mt-2">
                                          <img
                                            src={field.value}
                                            alt="preview"
                                            className="w-full h-full object-cover rounded border"
                                          />
                                        </div>
                                      ) : (
                                        <div className="w-full h-32 mt-2 border-2 border-dashed border-slate-200 rounded flex items-center justify-center text-slate-400 text-sm">
                                          No Image Selected
                                        </div>
                                      )}

                                      {/* 2. UPLOAD WIDGET */}
                                      <CldUploadWidget
                                        uploadPreset={
                                          process.env
                                            .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                                        }
                                        // CHANGED: onUpload -> onSuccess
                                        onSuccess={(
                                          result: CloudinaryUploadWidgetResults
                                        ) => {
                                          // 1. Check if 'info' is an object (it can be a string sometimes)
                                          if (
                                            typeof result.info === "object" &&
                                            result.info?.secure_url
                                          ) {
                                            const url = result.info.secure_url;

                                            // 2. Update the form field
                                            field.onChange(url);

                                            toast.success(
                                              "Image uploaded successfully"
                                            );
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
                                            variant="secondary"
                                            className="w-full"
                                            onClick={() => open()}
                                          >
                                            {field.value
                                              ? "Change Image"
                                              : "Upload Image"}
                                          </Button>
                                        )}
                                      </CldUploadWidget>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* REMOVE BUTTON */}
                          <Button
                            variant="ghost"
                            className="mt-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => imgFields.remove(index)}
                            type="button"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => imgFields.append({ value: "" })}
                      >
                        <Plus size={16} /> Add Image Slot
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <Card className="border-t-4 border-orange-600">
                  <CardHeader>
                    <CardTitle>
                      <IndianRupee /> Pricing
                    </CardTitle>
                    <CardDescription>
                      Set pricing for different sharing types.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex gap-2 items-center">
                      <Checkbox
                        checked={isSamePrice}
                        onCheckedChange={(val) => {
                          const checked = val === true;
                          setIsSamePrice(checked);
                          if (checked) {
                            // immediately sync for UX
                            form.setValue(
                              "priceTripleSharing",
                              form.getValues("priceDoubleSharing") ?? 0,
                              { shouldValidate: true }
                            );
                          }
                        }}
                      />
                      <span>Same price for triple</span>
                    </div>

                    <FormField
                      name="priceDoubleSharing"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Double Sharing</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="priceTripleSharing"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Triple Sharing</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              disabled={isSamePrice}
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="border-t-4 border-orange-600">
                  <CardHeader>
                    <CardTitle>
                      <Users /> Group Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Additional optional fields can go here */}
                    <p className="text-sm text-muted-foreground">
                      Add more group-level info if needed.
                    </p>
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
              Update Tour
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
