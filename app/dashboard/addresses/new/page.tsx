import AddressForm from "../_components/AddressForm";
export const dynamic = "force-dynamic";

export default function NewAddressPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">
                    Add New Address
                </h1>

                <p className="mt-1 text-muted-foreground">
                    Add a new shipping address.
                </p>
            </div>

            <AddressForm />
        </div>
    );
}