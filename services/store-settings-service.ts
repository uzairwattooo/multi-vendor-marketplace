import type { StoreSettingsInput } from "@/lib/validations/store";
import type { StoreSettingsData } from "@/types/store-settings";

type ApiError = {
    message?: string;
    errors?: Record<string, string[] | undefined>;
};

type UpdateStoreSettingsResponse = {
    message: string;
    store: StoreSettingsData;
};

export async function updateStoreSettings(
    values: StoreSettingsInput,
): Promise<UpdateStoreSettingsResponse> {
    const response = await fetch("/api/seller/store/settings", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
    });

    const data = (await response.json()) as
        | UpdateStoreSettingsResponse
        | ApiError;

    if (!response.ok) {
        throw new Error(data.message ?? "Unable to update store settings");
    }

    return data as UpdateStoreSettingsResponse;
}

export async function uploadStoreAsset(
    file: File,
    assetType: "logo" | "banner",
): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("assetType", assetType);

    const response = await fetch("/api/seller/store/assets", {
        method: "POST",
        body: formData,
    });

    const data = (await response.json()) as {
        message?: string;
        url?: string;
    };

    if (!response.ok || !data.url) {
        throw new Error(data.message ?? "Unable to upload image");
    }

    return { url: data.url };
}
