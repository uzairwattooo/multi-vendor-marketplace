"use client";

import Image from "next/image";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import {
    ImageIcon,
    Loader2,
    Trash2,
    Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadStoreAsset } from "@/services/store-settings-service";

type StoreAssetUploaderProps = {
    assetType: "logo" | "banner";
    value: string;
    onChange: (url: string) => void;
    storeName: string;
};

export default function StoreAssetUploader({
    assetType,
    value,
    onChange,
    storeName,
}: StoreAssetUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const isLogo = assetType === "logo";

    const uploadMutation = useMutation({
        mutationFn: (file: File) => uploadStoreAsset(file, assetType),
        onSuccess: (data) => {
            onChange(data.url);
            toast.success(
                isLogo
                    ? "Store logo uploaded successfully"
                    : "Store banner uploaded successfully",
            );
        },
        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to upload image",
            );
        },
    });

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (file) {
            uploadMutation.mutate(file);
        }

        event.target.value = "";
    }

    return (
        <div className="space-y-4">
            <div
                className={cn(
                    "relative overflow-hidden rounded-2xl border bg-muted/40",
                    isLogo ? "aspect-square max-w-44" : "aspect-[3/1] w-full",
                )}
            >
                {value ? (
                    <Image
                        src={value}
                        alt={`${storeName || "Store"} ${assetType}`}
                        fill
                        sizes={isLogo ? "176px" : "(max-width: 768px) 100vw, 720px"}
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        <div className="text-center">
                            <ImageIcon className="mx-auto size-8" />
                            <p className="mt-2 text-xs">
                                No {assetType} uploaded
                            </p>
                        </div>
                    </div>
                )}

                {uploadMutation.isPending && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/75 backdrop-blur-sm">
                        <Loader2 className="size-6 animate-spin text-primary" />
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
            />

            <div className="flex flex-wrap gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploadMutation.isPending}
                >
                    {uploadMutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Upload className="size-4" />
                    )}
                    {value ? "Replace image" : "Upload image"}
                </Button>

                {value && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onChange("")}
                        disabled={uploadMutation.isPending}
                        className="text-destructive hover:text-destructive"
                    >
                        <Trash2 className="size-4" />
                        Remove
                    </Button>
                )}
            </div>

            <p className="text-xs leading-5 text-muted-foreground">
                {isLogo
                    ? "Recommended: square JPG, PNG or WebP image up to 3MB."
                    : "Recommended: 1500 × 500 JPG, PNG or WebP image up to 6MB."}
            </p>
        </div>
    );
}
