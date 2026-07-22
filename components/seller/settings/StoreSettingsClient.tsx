"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
    Building2,
    CheckCircle2,
    CreditCard,
    ExternalLink,
    Loader2,
    Mail,
    MapPin,
    Palette,
    Save,
    Store,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    updateStoreSettingsSchema,
    type StoreSettingsInput,
} from "@/lib/validations/store";
import { updateStoreSettings } from "@/services/store-settings-service";
import type {
    StoreSettingsData,
    StripeConnectionStatus,
} from "@/types/store-settings";
import AddressInformation from "./AddressInformation";
import AppearanceSettings from "./AppearanceSettings";
import BusinessInformation from "./BusinessInformation";
import ContactInformation from "./ContactInformation";
import GeneralInformation from "./GeneralInformation";
import PaymentSettings from "./PaymentSettings";

type SectionId =
    | "general"
    | "contact"
    | "business"
    | "address"
    | "appearance"
    | "payment";

const sections = [
    {
        id: "general" as const,
        label: "Store information",
        description: "Name, category and description",
        icon: Store,
    },
    {
        id: "contact" as const,
        label: "Contact details",
        description: "Email and phone number",
        icon: Mail,
    },
    {
        id: "business" as const,
        label: "Business details",
        description: "Legal and tax information",
        icon: Building2,
    },
    {
        id: "address" as const,
        label: "Store address",
        description: "Business location details",
        icon: MapPin,
    },
    {
        id: "appearance" as const,
        label: "Appearance",
        description: "Logo, banner and colors",
        icon: Palette,
    },
    {
        id: "payment" as const,
        label: "Payment settings",
        description: "Stripe Connect account",
        icon: CreditCard,
    },
];

const fieldSectionMap: Partial<
    Record<keyof StoreSettingsInput, SectionId>
> = {
    name: "general",
    category: "general",
    description: "general",
    email: "contact",
    phone: "contact",
    businessType: "business",
    businessName: "business",
    registrationNumber: "business",
    ntn: "business",
    strn: "business",
    address: "address",
    city: "address",
    state: "address",
    postalCode: "address",
    landmark: "address",
    mapsUrl: "address",
    country: "address",
    logo: "appearance",
    banner: "appearance",
    primaryColor: "appearance",
    secondaryColor: "appearance",
};

type StoreSettingsClientProps = {
    initialData: StoreSettingsData;
};

export default function StoreSettingsClient({
    initialData,
}: StoreSettingsClientProps) {
    const router = useRouter();
    const [activeSection, setActiveSection] =
        useState<SectionId>("general");
    const [storeMeta, setStoreMeta] = useState({
        slug: initialData.slug,
        status: initialData.status,
        rejectionReason: initialData.rejectionReason,
    });

    const form = useForm<StoreSettingsInput>({
        resolver: zodResolver(updateStoreSettingsSchema),
        defaultValues: {
            name: initialData.name,
            category: initialData.category,
            description: initialData.description,
            email: initialData.email,
            phone: initialData.phone,
            businessType: initialData.businessType,
            businessName: initialData.businessName,
            registrationNumber: initialData.registrationNumber,
            ntn: initialData.ntn,
            strn: initialData.strn,
            address: initialData.address,
            city: initialData.city,
            state: initialData.state,
            postalCode: initialData.postalCode,
            landmark: initialData.landmark,
            mapsUrl: initialData.mapsUrl,
            country: initialData.country,
            logo: initialData.logo,
            banner: initialData.banner,
            primaryColor: initialData.primaryColor,
            secondaryColor: initialData.secondaryColor,
        },
    });

    const stripeStatus = useMemo<StripeConnectionStatus>(
        () => ({
            hasAccount: Boolean(initialData.stripeAccountId),
            connected: initialData.isStripeConnected,
            accountId: initialData.stripeAccountId,
            chargesEnabled: initialData.stripeChargesEnabled,
            payoutsEnabled: initialData.stripePayoutsEnabled,
            detailsSubmitted: initialData.stripeDetailsSubmitted,
        }),
        [initialData],
    );

    const updateMutation = useMutation({
        mutationFn: updateStoreSettings,
        onSuccess: (data) => {
            form.reset({
                name: data.store.name,
                category: data.store.category,
                description: data.store.description,
                email: data.store.email,
                phone: data.store.phone,
                businessType: data.store.businessType,
                businessName: data.store.businessName,
                registrationNumber: data.store.registrationNumber,
                ntn: data.store.ntn,
                strn: data.store.strn,
                address: data.store.address,
                city: data.store.city,
                state: data.store.state,
                postalCode: data.store.postalCode,
                landmark: data.store.landmark,
                mapsUrl: data.store.mapsUrl,
                country: data.store.country,
                logo: data.store.logo,
                banner: data.store.banner,
                primaryColor: data.store.primaryColor,
                secondaryColor: data.store.secondaryColor,
            });
            setStoreMeta({
                slug: data.store.slug,
                status: data.store.status,
                rejectionReason: data.store.rejectionReason,
            });
            toast.success(data.message);
            router.refresh();
        },
        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to update store settings",
            );
        },
    });

    function handleInvalid(errors: FieldErrors<StoreSettingsInput>) {
        const firstField = Object.keys(errors)[0] as
            | keyof StoreSettingsInput
            | undefined;

        if (firstField) {
            setActiveSection(fieldSectionMap[firstField] ?? "general");
        }

        toast.error("Please fix the highlighted fields");
    }

    const isPaymentSection = activeSection === "payment";

    return (
        <form
            onSubmit={form.handleSubmit(
                (values) => updateMutation.mutate(values),
                handleInvalid,
            )}
            className="space-y-6"
        >
            <header className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                <div className="border-b bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-5 py-6 sm:px-7">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    Store Settings
                                </h1>
                                <StatusBadge status={storeMeta.status} />
                            </div>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                                Manage your store profile, business details, branding and
                                payment account from one place.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                nativeButton={false}
                                render={
                                    <Link
                                        href={`/stores/${storeMeta.slug}`}
                                        target="_blank"
                                    />
                                }
                            >
                                <ExternalLink className="size-4" />
                                View store
                            </Button>

                            {!isPaymentSection && (
                                <Button
                                    type="submit"
                                    disabled={
                                        updateMutation.isPending ||
                                        !form.formState.isDirty
                                    }
                                >
                                    {updateMutation.isPending ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        <Save className="size-4" />
                                    )}
                                    Save changes
                                </Button>
                            )}
                        </div>
                    </div>

                    {form.formState.isDirty && !isPaymentSection && (
                        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-amber-700">
                            <span className="size-2 rounded-full bg-amber-500" />
                            You have unsaved changes
                        </div>
                    )}
                </div>

                {storeMeta.status === "rejected" &&
                    storeMeta.rejectionReason && (
                        <div className="border-b border-destructive/20 bg-destructive/5 px-5 py-4 text-sm text-destructive sm:px-7">
                            <span className="font-semibold">Rejection reason:</span>{" "}
                            {storeMeta.rejectionReason}
                        </div>
                    )}
            </header>

            <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                <aside className="lg:sticky lg:top-5 lg:self-start">
                    <nav className="flex gap-2 overflow-x-auto rounded-2xl border bg-card p-2 shadow-sm lg:flex-col lg:overflow-visible">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            const active = activeSection === section.id;

                            return (
                                <button
                                    key={section.id}
                                    type="button"
                                    onClick={() => setActiveSection(section.id)}
                                    className={cn(
                                        "flex min-w-56 items-center gap-3 rounded-xl px-3 py-3 text-left transition lg:min-w-0",
                                        active
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "flex size-9 shrink-0 items-center justify-center rounded-lg",
                                            active
                                                ? "bg-primary-foreground/15"
                                                : "bg-muted",
                                        )}
                                    >
                                        <Icon className="size-4" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold">
                                            {section.label}
                                        </p>
                                        <p
                                            className={cn(
                                                "mt-0.5 truncate text-xs",
                                                active
                                                    ? "text-primary-foreground/75"
                                                    : "text-muted-foreground",
                                            )}
                                        >
                                            {section.description}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="mt-4 hidden rounded-2xl border bg-card p-4 shadow-sm lg:block">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                            <div>
                                <p className="text-sm font-semibold">
                                    Backend protected
                                </p>
                                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                    Store updates are validated on the server and the slug
                                    cannot be edited from the frontend.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="min-w-0">
                    {activeSection === "general" && (
                        <GeneralInformation
                            form={form}
                            slug={storeMeta.slug}
                        />
                    )}
                    {activeSection === "contact" && (
                        <ContactInformation form={form} />
                    )}
                    {activeSection === "business" && (
                        <BusinessInformation form={form} />
                    )}
                    {activeSection === "address" && (
                        <AddressInformation form={form} />
                    )}
                    {activeSection === "appearance" && (
                        <AppearanceSettings form={form} />
                    )}
                    {activeSection === "payment" && (
                        <PaymentSettings initialStatus={stripeStatus} />
                    )}
                </main>
            </div>

            {!isPaymentSection && (
                <div className="sticky bottom-4 z-20 flex justify-end rounded-2xl border bg-background/90 p-3 shadow-lg backdrop-blur lg:hidden">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={
                            updateMutation.isPending ||
                            !form.formState.isDirty
                        }
                    >
                        {updateMutation.isPending ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Save className="size-4" />
                        )}
                        Save changes
                    </Button>
                </div>
            )}
        </form>
    );
}

type StatusBadgeProps = {
    status: StoreSettingsData["status"];
};

function StatusBadge({ status }: StatusBadgeProps) {
    const variant =
        status === "approved"
            ? "default"
            : status === "rejected" || status === "suspended"
              ? "destructive"
              : "secondary";

    return (
        <Badge variant={variant} className="capitalize">
            {status}
        </Badge>
    );
}
