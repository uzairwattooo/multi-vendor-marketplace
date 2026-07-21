"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { toggleWishlist } from "@/lib/wishlist/toggle-wishlist";

interface Props {
    productId: string;
}

export default function RemoveWishlistButton({
    productId,
}: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleRemove = () => {
        startTransition(async () => {
            const result = await toggleWishlist(productId);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success("Removed from wishlist");
            router.refresh();
        });
    };

    return (
        <Button
            variant="outline"
            size="icon"
            disabled={isPending}
            onClick={handleRemove}
        >
            <Trash2 className="size-4 text-red-500" />
        </Button>
    );
}