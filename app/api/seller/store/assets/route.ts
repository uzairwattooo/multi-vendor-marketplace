import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { store } from "@/db/schema";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const BUCKET_NAME = "product-images";
const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

const extensionByMimeType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        const [sellerStore] = await db
            .select({
                id: store.id,
                status: store.status,
            })
            .from(store)
            .where(eq(store.ownerId, session.user.id))
            .limit(1);

        if (!sellerStore) {
            return NextResponse.json(
                { message: "Store not found" },
                { status: 404 },
            );
        }

        if (sellerStore.status !== "approved") {
            return NextResponse.json(
                { message: "Your store must be approved before uploading images" },
                { status: 403 },
            );
        }

        const formData = await request.formData();
        const file = formData.get("file");
        const assetType = formData.get("assetType");

        if (!(file instanceof File)) {
            return NextResponse.json(
                { message: "Please select an image" },
                { status: 400 },
            );
        }

        if (assetType !== "logo" && assetType !== "banner") {
            return NextResponse.json(
                { message: "Invalid image type" },
                { status: 400 },
            );
        }

        if (!allowedMimeTypes.has(file.type)) {
            return NextResponse.json(
                { message: "Only JPG, PNG and WebP images are allowed" },
                { status: 400 },
            );
        }

        const maxSize = assetType === "logo" ? 3 * 1024 * 1024 : 6 * 1024 * 1024;

        if (file.size > maxSize) {
            return NextResponse.json(
                {
                    message:
                        assetType === "logo"
                            ? "Logo must be smaller than 3MB"
                            : "Banner must be smaller than 6MB",
                },
                { status: 400 },
            );
        }

        const extension = extensionByMimeType[file.type];
        const filePath = `stores/${sellerStore.id}/${assetType}-${crypto.randomUUID()}.${extension}`;
        const bytes = new Uint8Array(await file.arrayBuffer());

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, bytes, {
                contentType: file.type,
                cacheControl: "31536000",
                upsert: false,
            });

        if (error) {
            console.error("STORE_ASSET_UPLOAD_ERROR:", error);

            return NextResponse.json(
                { message: "Unable to upload image" },
                { status: 500 },
            );
        }

        const { data } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        return NextResponse.json({
            message: "Image uploaded successfully",
            url: data.publicUrl,
        });
    } catch (error) {
        console.error("STORE_ASSET_UPLOAD_ERROR:", error);

        return NextResponse.json(
            { message: "Unable to upload image" },
            { status: 500 },
        );
    }
}
