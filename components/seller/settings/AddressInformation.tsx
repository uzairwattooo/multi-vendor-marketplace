"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AddressInformation() {
    return (
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">
                    Store Address
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    This address will be used for shipping, returns and business information.
                </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Country
                    </label>

                    <Input placeholder="Pakistan" />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Province / State
                    </label>

                    <Input placeholder="Punjab" />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        City
                    </label>

                    <Input placeholder="Lahore" />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Postal Code
                    </label>

                    <Input placeholder="54000" />
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">
                        Street Address
                    </label>

                    <Textarea
                        rows={4}
                        placeholder="House No, Street, Area..."
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Landmark
                    </label>

                    <Input placeholder="Near Main Market (Optional)" />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Google Maps Link
                    </label>

                    <Input placeholder="https://maps.google.com/..." />
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <Button>
                    Save Changes
                </Button>
            </div>
        </section>
    );
}