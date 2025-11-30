"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Edit,
  Plus,
  Trash2,
  Loader2,
  ImageIcon,
  ArrowLeft,
  Sparkles,
  MapPin,
} from "lucide-react";
import { deletePilgrimage } from "@/actions/pilgrimage-actions";
import { Pilgrimage } from "@/prisma/generated/client";
import { PilgrimageForm } from "./pilgrimage-form";
import { toast } from "sonner";

interface PilgrimageClientProps {
  data: Pilgrimage[];
}

export const PilgrimageClient = ({ data }: PilgrimageClientProps) => {
  const [isPending, startTransition] = useTransition();
  const [editingItem, setEditingItem] = useState<Pilgrimage | null | "new">(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pilgrimage?")) return;

    startTransition(async () => {
      const result = await deletePilgrimage(id);
      if (result.success) toast.success("Pilgrimage deleted");
      else toast.error(result.error);
    });
  };

  /* ------------------------------------------------------------------ */
  /*                          FORM VIEW (EDIT + CREATE)                  */
  /* ------------------------------------------------------------------ */
  if (editingItem) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in-50 duration-700">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingItem(null)}
            className="gap-2 text-muted-foreground hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <h2 className="text-3xl font-bold text-foreground">
            {editingItem === "new" ? "Add New Pilgrimage" : "Edit Pilgrimage"}
          </h2>
        </div>

        <div className="bg-white border rounded-xl shadow-lg p-8">
          <PilgrimageForm
            initialData={editingItem === "new" ? null : editingItem}
            onSuccess={() => setEditingItem(null)}
            onCancel={() => setEditingItem(null)}
          />
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*                        CARD GRID VIEW (MAIN LIST)                  */
  /* ------------------------------------------------------------------ */

  return (
    <div className="space-y-10 animate-in fade-in-50 duration-700">
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b">
        <div className="space-y-2">
          <h2 className="text-4xl font-extrabold text-foreground flex items-center gap-3">
            <Sparkles className="h-7 w-7 text-orange-600" />
            Pilgrimage Packages
          </h2>
          <p className="text-muted-foreground text-sm max-w-md">
            Manage spiritual trips, holy destinations and sacred journeys offered
            to your customers.
          </p>
        </div>

        <Button
          onClick={() => setEditingItem("new")}
          className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20"
        >
          <Plus className="mr-2 h-4 w-4" /> New Pilgrimage
        </Button>
      </div>

      {/* EMPTY STATE */}
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 bg-white/60 border border-dashed border-muted rounded-2xl">
          <div className="p-5 rounded-full bg-orange-50 border-2 border-orange-200">
            <ImageIcon className="h-12 w-12 text-orange-400" />
          </div>
          <h3 className="text-xl font-semibold mt-5">No pilgrimages added</h3>
          <p className="text-muted-foreground text-sm max-w-sm mt-2 mb-6 text-center">
            Start adding destinations to help devotees explore their spiritual path.
          </p>

          <Button
            variant="outline"
            onClick={() => setEditingItem("new")}
            className="border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            <Plus className="mr-2 h-4 w-4" /> Add First Pilgrimage
          </Button>
        </div>
      ) : (
        /* ------------------------------------------------------------------ */
        /*                          CARD GRID                                */
        /* ------------------------------------------------------------------ */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {data.map((item) => (
            <Card
              key={item.id}
              className="rounded-xl pt-0 overflow-hidden shadow-sm border hover:shadow-xl hover:border-orange-300 transition-all duration-300 group bg-white"
            >
              {/* IMAGE */}
              <div className="relative h-40 w-full overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground/30">
                    <ImageIcon className="h-14 w-14" />
                  </div>
                )}

                {/* BADGE */}
                <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  #{item.id.slice(-4)}
                </div>
              </div>

              {/* TITLE */}
              <CardHeader className="px-5 pt-4 pb-2">
                <CardTitle className="text-lg font-semibold tracking-tight group-hover:text-orange-600 transition-colors">
                  {item.title}
                </CardTitle>
              </CardHeader>

              {/* DESCRIPTION */}
              <CardContent className="px-5 pb-2">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </CardContent>

              {/* FOOTER */}
              <CardFooter className="px-5 pb-4 pt-3 border-t flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-muted-foreground/20 hover:border-orange-300 hover:text-orange-700"
                  onClick={() => setEditingItem(item)}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
