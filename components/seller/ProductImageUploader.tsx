"use client";

import {
  ImagePlus,
  Loader2,
  Star,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { uploadProductImage } from "@/services/upload-service";

export type ProductImageValue = {
  url: string;
  path: string;
  isPrimary: boolean;
  sortOrder: number;
};

type ProductImageUploaderProps = {
  value: ProductImageValue[];
  onChange: (images: ProductImageValue[]) => void;
  maxImages?: number;
};

export default function ProductImageUploader({
  value,
  onChange,
  maxImages = 8,
}: ProductImageUploaderProps) {
  const [uploading, setUploading] =
    useState(false);

  async function handleImages(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(
      event.target.files || [],
    );

    if (files.length === 0) return;

    if (value.length + files.length > maxImages) {
      toast.error(
        `You can upload a maximum of ${maxImages} images`,
      );
      return;
    }

    setUploading(true);

    try {
      const uploadedImages =
        await Promise.all(
          files.map(async (file, index) => {
            const uploaded =
              await uploadProductImage(file);

            return {
              url: uploaded.url,
              path: uploaded.path,
              isPrimary:
                value.length === 0 && index === 0,
              sortOrder: value.length + index,
            };
          }),
        );

      onChange([...value, ...uploadedImages]);

      toast.success(
        "Images uploaded successfully",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to upload images",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function removeImage(index: number) {
    const nextImages = value
      .filter((_, currentIndex) => {
        return currentIndex !== index;
      })
      .map((image, currentIndex) => ({
        ...image,
        sortOrder: currentIndex,
      }));

    if (
      value[index]?.isPrimary &&
      nextImages.length > 0
    ) {
      nextImages[0].isPrimary = true;
    }

    onChange(nextImages);
  }

  function setPrimary(index: number) {
    onChange(
      value.map((image, currentIndex) => ({
        ...image,
        isPrimary: currentIndex === index,
      })),
    );
  }

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold">
          Product Images
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Upload up to {maxImages} product images.
        </p>
      </div>

      <div className="mt-6">
        <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 p-6 text-center transition hover:border-primary hover:bg-primary/5">
          {uploading ? (
            <>
              <Loader2 className="size-8 animate-spin text-primary" />

              <p className="mt-3 text-sm font-medium">
                Uploading images...
              </p>
            </>
          ) : (
            <>
              <ImagePlus className="size-8 text-primary" />

              <p className="mt-3 font-medium">
                Choose product images
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                PNG, JPG or WEBP. Maximum 5MB.
              </p>
            </>
          )}

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            disabled={uploading}
            onChange={handleImages}
            className="hidden"
          />
        </label>
      </div>

      {value.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {value.map((image, index) => (
            <div
              key={image.path}
              className="group relative overflow-hidden rounded-xl border bg-muted"
            >
              <div className="relative aspect-square">
                <Image
                  src={image.url}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 220px"
                />
              </div>

              {image.isPrimary && (
                <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                  Primary
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-black/50 p-2 opacity-0 transition group-hover:opacity-100">
                {!image.isPrimary && (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    onClick={() =>
                      setPrimary(index)
                    }
                    aria-label="Set as primary image"
                  >
                    <Star className="size-4" />
                  </Button>
                )}

                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() =>
                    removeImage(index)
                  }
                  aria-label="Remove image"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}