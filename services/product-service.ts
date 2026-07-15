export async function createProduct(data: unknown) {
    const response = await fetch("/api/seller/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Unable to create product");
    }

    return result;
}

export async function getProducts() {
    const response = await fetch("/api/seller/products", {
        method: "GET",
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error ||
            data.message ||
            "Unable to fetch products",
        );
    }

    return data;
}
export async function getProduct(id: string) {
    const response = await fetch(
        `/api/seller/products/${id}`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        return null;
    }

    return response.json();
}

export async function updateProduct(
    id: string,
    data: unknown
) {
    const response = await fetch(
        `/api/seller/products/${id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Unable to update product"
        );
    }

    return result;
}

export async function deleteProduct(
    id: string
) {
    const response = await fetch(
        `/api/seller/products/${id}`,
        {
            method: "DELETE",
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Unable to delete product"
        );
    }

    return result;
}