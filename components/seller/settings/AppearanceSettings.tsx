"use client";

import Image from "next/image";
import { ImagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AppearanceSettings() {
    return (
        <section className="space-y-6">

            <div className="grid gap-8 lg:grid-cols-2">

                {/* Logo */}

                <div className="rounded-xl border p-5">
                    <h3 className="font-semibold">
                        Store Logo
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Recommended size: 512 × 512
                    </p>

                    <div className="mt-5 flex items-center gap-5">

                        <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border bg-muted">

                            <Image
                                src="/placeholder-logo.png"
                                alt="Store Logo"
                                fill
                                className="object-cover"
                            />

                        </div>

                        <div className="space-y-3">

                            <Input
                                type="file"
                                accept="image/*"
                            />

                            <Button variant="outline">
                                <ImagePlus className="mr-2 h-4 w-4" />
                                Upload Logo
                            </Button>

                        </div>

                    </div>
                </div>

                {/* Banner */}

                <div className="rounded-xl border p-5">
                    <h3 className="font-semibold">
                        Store Banner
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Recommended size: 1500 × 500
                    </p>

                    <div className="mt-5">

                        <div className="relative h-40 overflow-hidden rounded-xl border bg-muted">

                            <Image
                                src="/placeholder-banner.jpg"
                                alt="Banner"
                                fill
                                className="object-cover"
                            />

                        </div>

                        <div className="mt-4 space-y-3">

                            <Input
                                type="file"
                                accept="image/*"
                            />

                            <Button variant="outline">
                                <ImagePlus className="mr-2 h-4 w-4" />
                                Upload Banner
                            </Button>

                        </div>

                    </div>

                </div>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Primary Brand Color
                    </label>

                    <Input
                        type="color"
                        defaultValue="#2563eb"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Secondary Color
                    </label>

                    <Input
                        type="color"
                        defaultValue="#111827"
                    />

                </div>

            </div>

            <div className="rounded-xl border p-6">

                <h3 className="mb-4 font-semibold">
                    Store Preview
                </h3>

                <div className="overflow-hidden rounded-xl border">

                    <div className="h-40 bg-blue-600" />

                    <div className="p-6">

                        <div className="flex items-center gap-4">

                            <div className="h-20 w-20 rounded-full border bg-muted" />

                            <div>

                                <h2 className="text-2xl font-bold">
                                    Your Store
                                </h2>

                                <p className="text-muted-foreground">
                                    Store description will appear here.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <div className="flex justify-end">

                <Button>
                    Save Appearance
                </Button>

            </div>

        </section>
    );
}