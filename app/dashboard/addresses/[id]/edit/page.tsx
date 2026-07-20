import { notFound } from "next/navigation";

import { getAddress } from "@/lib/actions/address";

import AddressForm from "../../_components/AddressForm";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditAddressPage({
    params,
}: Props) {
    const { id } = await params;

    const address = await getAddress(id);

    if (!address) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">
                    Edit Address
                </h1>

                <p className="text-muted-foreground">
                    Update your shipping address.
                </p>
            </div>

            <AddressForm address={address} />
        </div>
    );
}