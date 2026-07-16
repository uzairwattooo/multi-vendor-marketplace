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
    totalItems: number;
    subtotal: number;
    addItem: (product: AddToCartItem) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (
        productId: string,
        quantity: number,
    ) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export default function CartProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const storedCart = localStorage.getItem("marketplace-cart");

        if (storedCart) {
            try {
                setItems(JSON.parse(storedCart));
            } catch {
                localStorage.removeItem("marketplace-cart");
            }
        }

        setLoaded(true);
    }, []);

    useEffect(() => {
        if (!loaded) return;

        localStorage.setItem(
            "marketplace-cart",
            JSON.stringify(items),
        );
    }, [items, loaded]);

    function addItem(product: AddToCartItem) {
        setItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) =>
                    item.productId === product.productId,
            );

            if (existingItem) {
                return currentItems.map((item) =>
                    item.productId === product.productId
                        ? {
                            ...item,
                            quantity: Math.min(
                                item.quantity + 1,
                                product.stock,
                            ),
                        }
                        : item,
                );
            }

            return [
                ...currentItems,
                {
                    ...product,
                    quantity: 1,
                },
            ];
        });
    }

    function removeItem(productId: string) {
        setItems((currentItems) =>
            currentItems.filter(
                (item) => item.productId !== productId,
            ),
        );
    }

    function updateQuantity(
        productId: string,
        quantity: number,
    ) {
        setItems((currentItems) =>
            currentItems.map((item) =>
                item.productId === productId
                    ? {
                        ...item,
                        quantity: Math.max(
                            1,
                            Math.min(quantity, item.stock),
                        ),
                    }
                    : item,
            ),
        );
    }

    function clearCart() {
        setItems([]);
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
                subtotal,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
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