"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function DangerZone() {
    return (
        <section className="space-y-8">

            {/* Vacation Mode */}

            <div className="rounded-xl border p-6">

                <div className="flex items-center justify-between">

                    <div>
                        <h3 className="font-semibold">
                            Vacation Mode
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            Temporarily stop receiving new orders.
                        </p>
                    </div>

                    <Switch />

                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Start Date
                        </label>

                        <Input type="date" />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            End Date
                        </label>

                        <Input type="date" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium">
                            Vacation Message
                        </label>

                        <Textarea
                            rows={4}
                            placeholder="We'll be back soon..."
                        />
                    </div>

                </div>

            </div>

            {/* Store Visibility */}

            <div className="rounded-xl border p-6">

                <h3 className="font-semibold">
                    Store Visibility
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                    Control whether customers can view your store.
                </p>

                <div className="mt-5 space-y-3">

                    <label className="flex items-center gap-3">
                        <input
                            type="radio"
                            name="visibility"
                            defaultChecked
                        />

                        Public
                    </label>

                    <label className="flex items-center gap-3">
                        <input
                            type="radio"
                            name="visibility"
                        />

                        Private
                    </label>

                    <label className="flex items-center gap-3">
                        <input
                            type="radio"
                            name="visibility"
                        />

                        Temporarily Closed
                    </label>

                </div>

            </div>

            {/* Delete */}

            <div className="rounded-xl border border-red-300 bg-red-50 p-6">

                <div className="flex items-start gap-4">

                    <AlertTriangle className="mt-1 h-7 w-7 text-red-600" />

                    <div className="flex-1">

                        <h3 className="font-semibold text-red-700">
                            Danger Zone
                        </h3>

                        <p className="mt-2 text-sm text-red-600">
                            Deleting your store is permanent. Products,
                            orders, analytics and settings cannot be recovered.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">

                            <Button
                                variant="destructive"
                            >
                                Delete Store
                            </Button>

                            <Button
                                variant="outline"
                            >
                                Deactivate Store
                            </Button>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}