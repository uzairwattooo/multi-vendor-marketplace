import { Camera, Mail, Phone, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">
                    My Profile
                </h1>

                <p className="mt-1 text-muted-foreground">
                    Manage your personal information.
                </p>
            </div>

            <div className="rounded-xl border bg-card p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-5">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-10 w-10 text-primary" />
                    </div>

                    <div>
                        <Button variant="outline">
                            <Camera className="mr-2 h-4 w-4" />
                            Change Photo
                        </Button>

                        <p className="mt-2 text-sm text-muted-foreground">
                            JPG, PNG up to 2MB
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Full Name
                        </label>

                        <Input
                            defaultValue="Muhammad Uzair"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Username
                        </label>

                        <Input
                            defaultValue="uzair"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium">
                            <Mail className="h-4 w-4" />
                            Email
                        </label>

                        <Input
                            defaultValue="uzair@example.com"
                            disabled
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium">
                            <Phone className="h-4 w-4" />
                            Phone Number
                        </label>

                        <Input
                            defaultValue="+92 300 1234567"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <Button>
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="rounded-xl border bg-card p-8 shadow-sm">
                <h2 className="mb-6 text-xl font-semibold">
                    Change Password
                </h2>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Current Password
                        </label>

                        <Input
                            type="password"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            New Password
                        </label>

                        <Input
                            type="password"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Confirm Password
                        </label>

                        <Input
                            type="password"
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button>
                            Update Password
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}