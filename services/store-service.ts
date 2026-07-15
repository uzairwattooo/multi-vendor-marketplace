import type { CreateStoreInput } from "@/lib/validations/store";

type CreateStoreResponse = {
    message: string;
    store: {
        id: string;
        name: string;
        slug: string;
        status: "pending" | "approved" | "rejected" | "suspended";
    };
};

type ApiErrorResponse = {
    message?: string;
    errors?: Record<string, string[] | undefined>;
};

export async function createStore(
    values: CreateStoreInput,
): Promise<CreateStoreResponse> {
    const response = await fetch("/api/stores", {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify(values),
    });

    const data = (await response.json()) as
        | CreateStoreResponse
        | ApiErrorResponse;

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to submit store application",
        );
    }

    return data as CreateStoreResponse;
}