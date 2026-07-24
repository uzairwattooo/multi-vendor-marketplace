"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const SIDEBAR_STORAGE_KEY = "admin-sidebar-collapsed";

type AdminShellProps = {
    adminName: string;
    children: React.ReactNode;
};

export default function AdminShell({
    adminName,
    children,
}: AdminShellProps) {
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const savedState = window.localStorage.getItem(
            SIDEBAR_STORAGE_KEY,
        );

        setCollapsed(savedState === "true");
    }, []);

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
            <AdminSidebar
                collapsed={collapsed}
                onToggle={toggleSidebar}
            />

            <div
                className={cn(
                    "min-h-screen transition-[padding] duration-300 ease-in-out",
                    collapsed ? "lg:pl-20" : "lg:pl-72",
                )}
            >
                <AdminHeader adminName={adminName} />

                <main className="px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}