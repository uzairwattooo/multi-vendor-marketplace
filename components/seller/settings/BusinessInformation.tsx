"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BusinessInformation() {
    return (
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">
                    Business Information
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Update your legal business information.
                </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Business Type
                    </label>

                    <select className="h-10 w-full rounded-md border bg-background px-3 text-sm">
                        <option value="individual">
                            Individual
                        </option>

                        <option value="company">
                            Company
                        </option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Business Name
                    </label>

                    <Input placeholder="ABC Traders" />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Registration Number
                    </label>

                    <Input placeholder="REG-123456" />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        NTN Number
                    </label>

                    <Input placeholder="1234567-8" />
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">
                        STRN (Optional)
                    </label>

                    <Input placeholder="Sales Tax Registration Number" />
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