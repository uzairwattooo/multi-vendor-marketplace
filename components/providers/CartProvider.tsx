"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

export type CartItem = {
    productId: string;
    name: string;
    slug: string;
    image: string | null;
    price: number;
    stock: number;
    quantity: number;
    storeId: string;
    storeName: string;
};

type AddToCartItem = Omit<CartItem, "quantity">;

type CartContextType = {
    items: CartItem[];
    loading: boolean;
    totalItems: number;
    subtotal: number;
    addItem: (
        product: AddToCartItem,
    ) => Promise<void>;
    removeItem: (
        productId: string,
    ) => Promise<void>;
    updateQuantity: (
        productId: string,
        quantity: number,
    ) => Promise<void>;
    clearCart: () => Promise<void>;
    loadCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export default function CartProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);

    async function loadCart() {
        setLoading(true);

        try {
            const res = await fetch("/api/cart");

            if (!res.ok) return;

            const data = await res.json();

            setItems(data.items);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    async function addItem(product: AddToCartItem) {
        setLoading(true);

        try {
            const res = await fetch("/api/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId: product.productId,
                    quantity: 1,
                }),
            });

            if (!res.ok) return;

            await loadCart();
        } finally {
            setLoading(false);
        }
    }
    async function removeItem(productId: string) {
        setLoading(true);

        try {
            await fetch("/api/cart/remove", {
                method: "DELETE",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    productId,
                }),
            });

            await loadCart();
        } finally {
            setLoading(false);
        }
    }
    async function updateQuantity(
        productId: string,
        quantity: number,
    ) {
        setLoading(true);

        try {
            await fetch("/api/cart/update", {
                method: "PATCH",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    productId,
                    quantity,
                }),
            });

            await loadCart();
        } finally {
            setLoading(false);
        }

    }

    async function clearCart() {
        setLoading(true);

        try {
            await fetch("/api/cart/clear", {
                method: "DELETE",
            });

            setItems([]);
        } finally {
            setLoading(false);
        }
    }

    const totalItems = useMemo(
        () =>
            items.reduce(
                (total, item) => total + item.quantity,
                0,
            ),
        [items],
    );

    const subtotal = useMemo(
        () =>
            items.reduce(
                (total, item) =>
                    total + item.price * item.quantity,
                0,
            ),
        [items],
    );

    return (
        <CartContext.Provider
            value={{
                items,
                totalItems,
                loading,
                subtotal,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                loadCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCart must be used inside CartProvider",
        );
    }

    return context;
}