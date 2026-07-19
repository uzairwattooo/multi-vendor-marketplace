"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function StorePolicies() {
    return (
        <section className="space-y-6">

            <div>

                <h3 className="text-xl font-semibold">
                    Store Policies
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                    Set your policies to help customers understand your store rules.
                </p>

            </div>

            <div className="space-y-6">

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Return Policy
                    </label>

                    <Textarea
                        rows={5}
                        placeholder="Explain how customers can return products..."
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Refund Policy
                    </label>

                    <Textarea
                        rows={5}
                        placeholder="Describe refund eligibility and processing time..."
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Shipping Policy
                    </label>

                    <Textarea
                        rows={5}
                        placeholder="Mention delivery time, shipping charges and conditions..."
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Privacy Policy
                    </label>

                    <Textarea
                        rows={5}
                        placeholder="Explain how customer information is handled..."
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Terms & Conditions
                    </label>

                    <Textarea
                        rows={5}
                        placeholder="Write your store terms and conditions..."
                    />
                </div>

            </div>

            <div className="flex justify-end">

                <Button>
                    Save Policies
                </Button>

            </div>

        </section>
    );
}