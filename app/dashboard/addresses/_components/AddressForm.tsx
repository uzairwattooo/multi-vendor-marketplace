"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createAddress, updateAddress, } from "@/lib/actions/address";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { addressSchema, type AddressSchema,} from "@/lib/validations/address-schema";

type Props = {
    address?: {
        id: string;
        fullName: string;
        phone: string;
        address: string;
        apartment: string | null;
        city: string;
        state: string;
        postalCode: string | null;
        country: string;
        isDefault: boolean;
    };
};

export default function AddressForm({
    address,
}: Props) {
    const router = useRouter();

    const [isPending, startTransition] =
        useTransition();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<AddressSchema>({
        resolver: zodResolver(addressSchema),
        
        defaultValues: {
            fullName: address?.fullName ?? "",
            phone: address?.phone ?? "",
            address: address?.address ?? "",
            apartment:
                address?.apartment ?? "",
            city: address?.city ?? "",
            state: address?.state ?? "",
            postalCode:
                address?.postalCode ?? "",
            country:
                address?.country ??
                "Pakistan",
            isDefault:
                address?.isDefault ??
                false,
        },
    });

    async function onSubmit(
        values: AddressSchema,
    ) {
        startTransition(async () => {
            try {
                if (address) {
                    await updateAddress(
                        address.id,
                        values,
                    );

                    toast.success(
                        "Address updated successfully.",
                    );
                } else {
                    await createAddress(
                        values,
                    );

                    toast.success(
                        "Address created successfully.",
                    );
                }

                router.push(
                    "/dashboard/addresses",
                );

                router.refresh();
            } catch {
                toast.error(
                    "Something went wrong."
                );
            }
        });
    }
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <div className="grid gap-6 md:grid-cols-2">

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Full Name
                    </label>

                    <Input
                        {...register("fullName")}
                    />

                    {errors.fullName && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.fullName.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Phone
                    </label>

                    <Input
                        {...register("phone")}
                    />

                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.phone.message}
                        </p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">
                        Address
                    </label>

                    <Input
                        {...register("address")}
                    />

                    {errors.address && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.address.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Apartment
                    </label>

                    <Input
                        {...register("apartment")}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        City
                    </label>

                    <Input
                        {...register("city")}
                    />

                    {errors.city && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.city.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        State
                    </label>

                    <Input
                        {...register("state")}
                    />

                    {errors.state && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.state.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Postal Code
                    </label>

                    <Input
                        {...register("postalCode")}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Country
                    </label>

                    <Input
                        {...register("country")}
                    />
                </div>

            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">

                <Checkbox
                    checked={watch("isDefault")}
                    onCheckedChange={(checked) =>
                        setValue(
                            "isDefault",
                            Boolean(checked)
                        )
                    }
                />

                <span className="text-sm">
                    Set as default address
                </span>

            </div>

            <Button
                type="submit"
                disabled={isPending}
            >
                {isPending
                    ? "Saving..."
                    : address
                        ? "Update Address"
                        : "Save Address"}
            </Button>

        </form>
    );
}