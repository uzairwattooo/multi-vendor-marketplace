"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SocialLinks() {
    return (
        <section className="space-y-6">

            <div>
                <h3 className="text-xl font-semibold">
                    Social Links
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                    Connect your social media profiles with your store.
                </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Website
                    </label>

                    <Input placeholder="https://yourstore.com" />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Facebook
                    </label>

                    <Input placeholder="https://facebook.com/yourstore" />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Instagram
                    </label>

                    <Input placeholder="https://instagram.com/yourstore" />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        TikTok
                    </label>

                    <Input placeholder="https://tiktok.com/@yourstore" />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        YouTube
                    </label>

                    <Input placeholder="https://youtube.com/@yourstore" />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        X (Twitter)
                    </label>

                    <Input placeholder="https://x.com/yourstore" />
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">
                        WhatsApp
                    </label>

                    <Input placeholder="+923001234567" />
                </div>

            </div>

            <div className="flex justify-end">
                <Button>
                    Save Social Links
                </Button>
            </div>

        </section>
    );
}