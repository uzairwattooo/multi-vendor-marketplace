import { supabase } from "@/lib/supabase";

export async function uploadProductImage(
    file: File,
) {
    if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file");
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
        throw new Error(
            "Image size must be less than 5MB",
        );
    }

    const extension =
        file.name.split(".").pop() || "jpg";

    const fileName = `${crypto.randomUUID()}.${extension}`;

    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) {
        throw new Error(error.message);
    }

    const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

    return {
        url: data.publicUrl,
        path: filePath,
    };
}