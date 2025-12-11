"use client";

import { useEffect, useState } from "react";
import { getPopupSettings, updatePopupSettings } from "@/actions/popup-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";
import { Loader2, Megaphone, Save } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

export default function AdminPopupPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [isActive, setIsActive] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("/contact");
  const [title, setTitle] = useState("Plan Your Next Yatra?");
  const [description, setDescription] = useState("Get exclusive discounts!");

  // Load initial data from DB
  useEffect(() => {
    getPopupSettings().then((data) => {
      setIsActive(data.isActive);
      setImageUrl(data.imageUrl || "");
      setLinkUrl(data.linkUrl || "/contact");
      setTitle(data.title || "");
      setDescription(data.description || "");
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePopupSettings({
        isActive,
        imageUrl,
        linkUrl,
        title,
        description,
      });
      toast.success("Popup updated successfully!");
    } catch (error) {
      toast.error("Failed to update popup");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">Loading settings...</div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Popup Manager</h1>
            <p className="text-sm text-gray-500">
              Edit the special offer popup shown on the website.
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-orange-600 hover:bg-orange-700"
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- LEFT: EDITOR --- */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
          {/* 1. ON/OFF Switch */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Enable Popup</Label>
              <p className="text-xs text-gray-500">
                Toggle visibility for all visitors.
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
              className="data-[state=unchecked]:bg-gray-400 data-[state=checked]:bg-orange-600 "
            />
          </div>

          {/* 2. Image */}
          <div className="space-y-2">
            <Label>Main Image</Label>
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={(result: any) => setImageUrl(result.info.secure_url)}
            >
              {({ open }) => (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => open()}
                  className="w-full h-24 border-dashed flex flex-col gap-2 hover:bg-gray-50"
                >
                  {imageUrl ? (
                    <span className="text-green-600 font-medium">
                      ✓ Image Selected (Click to change)
                    </span>
                  ) : (
                    <span className="text-gray-500">Click to Upload Image</span>
                  )}
                </Button>
              )}
            </CldUploadWidget>
          </div>

          {/* 3. Text Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Headline (Title)</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer Sale!"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Book now to get 20% off..."
                rows={3}
              />
            </div>
          </div>

          {/* 4. Link */}
          <div className="space-y-2">
            <Label>Button Redirect Link</Label>
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="/contact"
            />
          </div>
        </div>

        {/* --- RIGHT: PREVIEW --- */}
        <div className="space-y-2">
          <Label className="text-gray-500 font-medium ml-1">
            Live Preview (What customers see)
          </Label>

          <div className="bg-gray-100 rounded-xl border p-8 h-[600px] flex items-center justify-center relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

            {/* THE POPUP CARD */}
            <div className="relative w-full max-w-[350px] bg-white rounded-2xl overflow-hidden shadow-2xl z-10 animate-in zoom-in-95 duration-500">
              {/* Close X */}
              <div className="absolute top-3 right-3 z-20 bg-black/50 text-white rounded-full p-1">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>

              <div className="relative h-[450px] w-full bg-slate-200">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 font-medium">
                    No Image Uploaded
                  </div>
                )}

                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pt-20 flex flex-col items-center text-center">
                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                    {title || "Your Headline"}
                  </h3>
                  <p className="text-gray-200 text-sm mb-5 leading-relaxed">
                    {description || "Your description text..."}
                  </p>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8 shadow-lg w-full">
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
