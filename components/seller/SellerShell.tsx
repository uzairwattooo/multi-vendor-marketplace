"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import SellerHeader from "./SellerHeader";
import SellerSidebar from "./SellerSidebar";

const SIDEBAR_STORAGE_KEY = "seller-sidebar-collapsed";

type SellerShellProps = {
    sellerName: string;
    storeName: string;
    children: React.ReactNode;
};

export default function SellerShell({
    sellerName,
    storeName,
    children,
}: SellerShellProps) {
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window === "undefined") return false;

        return (
            window.localStorage.getItem(
                SIDEBAR_STORAGE_KEY,
            ) === "true"
        );
    });

    function toggleSidebar() {
        setCollapsed((currentState) => {
            const nextState = !currentState;

            window.localStorage.setItem(
                SIDEBAR_STORAGE_KEY,
                String(nextState),
            );

            return nextState;
        });
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <SellerSidebar
                collapsed={collapsed}
                onToggle={toggleSidebar}
            />

            <div
                className={cn(
                    "min-h-screen transition-[padding] duration-300 ease-in-out",
                    collapsed ? "lg:pl-20" : "lg:pl-72",
                )}
            >
                <SellerHeader
                    sellerName={sellerName}
                    storeName={storeName}
                />

                <main className="px-4 py-5 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}