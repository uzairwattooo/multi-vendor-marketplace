"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function GeneralInformation() {
    return (
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
                General Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Store Name
                    </label>

                    <Input placeholder="Tech Store" />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Store Slug
                    </label>

                    <Input placeholder="tech-store" />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Business Email
                    </label>

                    <Input
                        type="email"
                        placeholder="store@email.com"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Business Phone
                    </label>

                    <Input placeholder="+92xxxxxxxxxx" />
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">
                        Description
                    </label>

                    <Textarea
                        rows={5}
                        placeholder="Tell customers about your store..."
                    />
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