"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function ShippingSettings() {
    return (
        <section className="space-y-6">

            <div className="grid gap-5 md:grid-cols-2">

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Processing Time
                    </label>

                    <select className="h-10 w-full rounded-md border bg-background px-3 text-sm">
                        <option>Same Day</option>
                        <option>1 Business Day</option>
                        <option>2 Business Days</option>
                        <option>3–5 Business Days</option>
                        <option>1 Week</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Shipping Cost (Rs.)
                    </label>

                    <Input
                        type="number"
                        placeholder="250"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Free Shipping Above (Rs.)
                    </label>

                    <Input
                        type="number"
                        placeholder="5000"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Return Window
                    </label>

                    <select className="h-10 w-full rounded-md border bg-background px-3 text-sm">
                        <option>7 Days</option>
                        <option>14 Days</option>
                        <option>30 Days</option>
                        <option>No Returns</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">
                        Shipping Regions
                    </label>

                    <Input placeholder="Pakistan, UAE, Saudi Arabia" />
                </div>

            </div>

            <div className="space-y-4 rounded-xl border p-5">

                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium">
                            Cash on Delivery
                        </h4>

                        <p className="text-sm text-muted-foreground">
                            Allow customers to pay on delivery.
                        </p>
                    </div>

                    <Switch />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium">
                            Local Pickup
                        </h4>

                        <p className="text-sm text-muted-foreground">
                            Customers can collect orders themselves.
                        </p>
                    </div>

                    <Switch />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium">
                            International Shipping
                        </h4>

                        <p className="text-sm text-muted-foreground">
                            Ship products outside your country.
                        </p>
                    </div>

                    <Switch />
                </div>

            </div>

            <div className="flex justify-end">
                <Button>
                    Save Shipping Settings
                </Button>
            </div>

        </section>
    );
}