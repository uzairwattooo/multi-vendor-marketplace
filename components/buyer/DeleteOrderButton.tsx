"use client";

import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { deleteBuyerOrder } from "@/lib/actions/ordercrud";

export default function DeleteOrderButton({
    orderId,
}: {
    orderId: string;
}) {
    async function handleDelete() {
        const confirmed = window.confirm(
            "Are you sure you want to delete this order?"
        );

        if (!confirmed) return;

        try {
            await deleteBuyerOrder(orderId);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Something went wrong");
        }
    }

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
        >
            <Trash2 className="mr-2 size-4" />
            Delete
        </Button>
    );
}