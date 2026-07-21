"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
    profileSchema,
    type ProfileSchema,
} from "@/lib/validations/profile-schema";
import { updateProfile } from "@/lib/actions/profile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
    user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        image: string | null;
    };
};
export default function ProfileForm({
    user,
}: Props) {
    const router = useRouter();
    const [preview, setPreview] = useState(
        user.image,
    );
    const [imageUrl, setImageUrl] = useState(
        user.image,
    );
    const [uploading, setUploading] =
        useState(false);
    const [isPending, startTransition] =
        useTransition();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileSchema>({
        resolver:
            zodResolver(profileSchema),

        defaultValues: {
            name: user.name,
            phone: user.phone ?? "",
            image: user.image,
        },
    });
    async function handleImageUpload(
        e: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file = e.target.files?.[0];

        if (!file) return;

        try {
            setUploading(true);

            const extension =
                file.name.split(".").pop();

            const fileName =
                `${user.id}-${Date.now()}.${extension}`;

            const filePath =
                `profiles/${fileName}`;

            const previewUrl =
                URL.createObjectURL(file);

            setPreview(previewUrl);

            const { error } =
                await supabase.storage
                    .from("product-images")
                    .upload(filePath, file, {
                        upsert: true,
                    });

            if (error) {
                throw error;
            }

            const { data } =
                supabase.storage
                    .from("product-images")
                    .getPublicUrl(filePath);

            setImageUrl(data.publicUrl);

            toast.success(
                "Image uploaded successfully."
            );
            reset({
                name: "",
                phone: "",
                image: null,
            });
        } catch {
            toast.error(
                "Image upload failed."
            );
        } finally {
            setUploading(false);
        }
    }

    async function onSubmit(
        values: ProfileSchema,
    ) {
        startTransition(async () => {
            try {
                await updateProfile({
                    ...values,
                    image: imageUrl,
                });

                toast.success(
                    "Profile updated successfully."
                );

                router.refresh();
            } catch {
                toast.error(
                    "Something went wrong."
                );
            }
        });
    }
    return (
        <>
            <div className="flex items-center gap-5">

                <Image
                    src={
                        preview ||
                        "/placeholder.png"
                    }
                    alt="Profile"
                    width={100}
                    height={100}
                    className="h-24 w-24 rounded-full object-cover border"
                />

                <div className="space-y-2">

                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />

                    {uploading && (
                        <p className="text-sm text-muted-foreground">
                            Uploading...
                        </p>
                    )}

                </div>

            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-8"
            ><div className="space-y-2">

                    <label className="text-sm font-medium">
                        Full Name
                    </label>

                    <Input
                        {...register("name")}
                    />

                    {errors.name && (
                        <p className="text-sm text-red-500">
                            {errors.name.message}
                        </p>
                    )}

                </div>
                <div className="space-y-2">

                    <label className="text-sm font-medium">
                        Email
                    </label>

                    <Input
                        defaultValue={user.email}
                        disabled
                    />

                </div>
                <div className="space-y-2">

                    <label className="text-sm font-medium">
                        Phone
                    </label>

                    <Input
                        {...register("phone")}
                    />

                    {errors.phone && (
                        <p className="text-sm text-red-500">
                            {errors.phone.message}
                        </p>
                    )}

                </div>
                <div className="flex justify-end">

                    <Button
                        type="submit"
                        disabled={
                            isPending || uploading
                        }
                    >
                        {isPending
                            ? "Saving..."
                            : "Save Changes"}
                    </Button>

                </div>
            </form>
        </>
    );
}