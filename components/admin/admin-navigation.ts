import {
    BarChart3,
    Boxes,
    CreditCard,
    FolderTree,
    House,
    LayoutDashboard,
    Package,
    Settings,
    ShoppingBag,
    Store,
    Users,
    WalletCards,
    type LucideIcon,
} from "lucide-react";

export type AdminNavigationItem = {
    label: string;
    href: string;
    icon: LucideIcon;
    exact?: boolean;
};

export type AdminNavigationGroup = {
    label: string;
    items: AdminNavigationItem[];
};

export const adminNavigation: AdminNavigationGroup[] = [
    {
        label: "Overview",
        items: [
            {
                label: "Dashboard",
                href: "/admin",
                icon: LayoutDashboard,
                exact: true,
            },
        ],
    },
    {
        label: "Marketplace",
        items: [
            {
                label: "Users",
                href: "/admin/users",
                icon: Users,
            },
            {
                label: "Stores",
                href: "/admin/stores",
                icon: Store,
            },
            {
                label: "Products",
                href: "/admin/products",
                icon: Package,
            },
            {
                label: "Categories",
                href: "/admin/categories",
                icon: FolderTree,
            },
            {
                label: "Orders",
                href: "/admin/orders",
                icon: ShoppingBag,
            },
            {
                label: "Inventory",
                href: "/admin/inventory",
                icon: Boxes,
            },
        ],
    },
    {
        label: "Finance",
        items: [
            {
                label: "Payments",
                href: "/admin/payments",
                icon: CreditCard,
            },
            {
                label: "Payouts",
                href: "/admin/payouts",
                icon: WalletCards,
            },
        ],
    },
    {
        label: "Insights",
        items: [
            {
                label: "Reports",
                href: "/admin/reports",
                icon: BarChart3,
            },
        ],
    },
    {
        label: "System",
        items: [
            {
                label: "Settings",
                href: "/admin/settings",
                icon: Settings,
            },
            {
                label: "Marketplace Home",
                href: "/",
                icon: House,
                exact: true,
            },
        ],
    },
];

export function getAdminPageTitle(pathname: string) {
    const items = adminNavigation.flatMap((group) => group.items);

    const activeItem = items
        .filter((item) => item.href.startsWith("/admin"))
        .sort((first, second) => second.href.length - first.href.length)
        .find((item) => {
            if (item.exact) {
                return pathname === item.href;
            }

            return (
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`)
            );
        });

    return activeItem?.label ?? "Admin Panel";
}
