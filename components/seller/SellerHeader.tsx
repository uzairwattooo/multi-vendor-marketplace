"use client";

import { Bell, Menu, Store } from "lucide-react";

import { Button } from "@/components/ui/button";

type SellerHeaderProps = {
    storeName: string;
    sellerName: string;
};

export default function SellerHeader({
    storeName,
    sellerName,
}: SellerHeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="lg:hidden"
                >
                    <Menu className="size-5" />
                </Button>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Welcome back, {sellerName}
                    </p>

                    <h2 className="font-semibold">
                        {storeName}
                    </h2>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Notifications"
            >
                <Bell className="size-5" />
            </Button>
        </header>
    );
}