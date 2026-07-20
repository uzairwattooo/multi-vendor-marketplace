import Link from "next/link";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAddresses } from "@/lib/actions/address";



export default async function AddressesPage() {
    const addresses = await getAddresses();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Addresses</h1>
                    <p className="mt-1 text-muted-foreground">
                        Manage your shipping addresses.
                    </p>
                </div>

                <Link href="/dashboard/addresses/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Address
                    </Button>
                </Link>
            </div>

            {
                addresses.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-12 text-center">
                        <h3 className="text-lg font-semibold">
                            No addresses found
                        </h3>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Add your first shipping address.
                        </p>

                        <Link href="/dashboard/addresses/new">
                            <Button className="mt-6">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Address
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {addresses.map((address) => (
                            <div
                                key={address.id}
                                className="rounded-xl border bg-card p-6 shadow-sm"
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-primary/10 p-2">
                                            <MapPin className="h-5 w-5 text-primary" />
                                        </div>

                                        <div>
                                            <h2 className="font-semibold">
                                                {address.fullName}
                                            </h2>

                                            {address.isDefault && (
                                                <span className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <p>{address.phone}</p>

                                    <p>{address.address}</p>

                                    <p>
                                        {address.city}, {address.state}
                                    </p>

                                    <p>
                                        {address.country} - {address.postalCode}
                                    </p>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <Link
                                        href={`/dashboard/addresses/${address.id}/edit`}
                                    >
                                        <Button variant="outline">
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                    </Link>

                                    <Button variant="destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    );

}