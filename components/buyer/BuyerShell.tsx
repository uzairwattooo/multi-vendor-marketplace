"use client";

import { useState } from "react";

import BuyerSidebar from "@/components/buyer/BuyerSidebar";
import { cn } from "@/lib/utils";

const SIDEBAR_STORAGE_KEY = "buyer-sidebar-collapsed";

type BuyerShellProps = {
    user: {
        name: string;
        image: string | null;
    };
    children: React.ReactNode;
};

export default function BuyerShell({
    user,
    children,
}: BuyerShellProps) {
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
            <BuyerSidebar
                user={user}
                collapsed={collapsed}
                onToggle={toggleSidebar}
            />

            <main
                className={cn(
                    "min-h-screen transition-[margin] duration-300 ease-in-out",
                    collapsed ? "lg:ml-20" : "lg:ml-72",
                )}
            >
                <div className="p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}