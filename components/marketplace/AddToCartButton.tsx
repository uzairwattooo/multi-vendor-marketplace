"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/CartProvider";

type AddToCartButtonProps = {
    product: {
        productId: string;
        name: string;
        slug: string;
        image: string | null;
        price: number;
        stock: number;
        storeId: string;
        storeName: string;
    };
};

export default function AddToCartButton({
    product,
}: AddToCartButtonProps) {
    const { addItem } = useCart();

    function handleAddToCart() {
        addItem(product);
        toast.success("Product added to cart");
    }

    return (
        <Button
            type="button"
            size="lg"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
        >
            <ShoppingCart className="size-5" />
            Add to Cart
        </Button>
    );
}