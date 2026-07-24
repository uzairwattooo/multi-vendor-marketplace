import {
    ArrowLeft,
    CheckCircle2,
    Circle,
    CreditCard,
    MapPin,
    Package,
    Store as StoreIcon,
    UserRound,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import AdminOrderActions from "@/components/admin/orders/AdminOrderActions";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { getAdminOrderDetails } from "@/lib/admin/get-admin-order-details";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function money(value: number) {
    return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(value);
}
function safeDate(value: Date | string | null | undefined) {
    if (!value) return "Not available";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "Not available";
    return new Intl.DateTimeFormat("en-PK", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

export default async function AdminOrderDetailsPage({
    params,
}: {
    params: Promise<{ orderId: string }>;
}) {
    const { orderId } = await params;
    const details = await getAdminOrderDetails(orderId);
    if (!details) notFound();

    const steps = ["pending", "confirmed", "processing", "shipped", "delivered"];
    const currentIndex = steps.indexOf(details.status);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <Link href="/admin/orders" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2 mb-3")}><ArrowLeft />Back to orders</Link>
                    <div className="flex flex-wrap items-center gap-3"><h1 className="text-3xl font-bold tracking-tight">{details.orderNumber}</h1><AdminStatusBadge value={details.status} /><AdminStatusBadge value={details.paymentStatus} /></div>
                    <p className="mt-2 text-sm text-muted-foreground">Placed {safeDate(details.createdAt)} · Last updated {safeDate(details.updatedAt)}</p>
                </div>
                <AdminOrderActions orderId={details.id} orderNumber={details.orderNumber} status={details.status} paymentMethod={details.paymentMethod} paymentStatus={details.paymentStatus} />
            </div>

            <section className="rounded-3xl border bg-card p-5 shadow-sm">
                <h2 className="font-semibold">Order timeline</h2>
                {details.status === "cancelled" || details.status === "refunded" ? (
                    <div className="mt-4 rounded-2xl bg-destructive/5 p-4"><AdminStatusBadge value={details.status} /><p className="mt-2 text-sm text-muted-foreground">{details.cancelledReason ?? "No reason was provided."}</p></div>
                ) : (
                    <div className="mt-5 grid gap-3 sm:grid-cols-5">
                        {steps.map((step, index) => {
                            const done = index <= currentIndex;
                            return <div key={step} className={cn("rounded-2xl border p-4", done && "border-primary/30 bg-primary/5")}><div className="flex items-center gap-2">{done ? <CheckCircle2 className="size-4 text-primary" /> : <Circle className="size-4 text-muted-foreground" />}<span className="text-sm font-medium capitalize">{step}</span></div></div>;
                        })}
                    </div>
                )}
            </section>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.8fr)]">
                <div className="space-y-6">
                    <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
                        <div className="border-b px-5 py-4"><h2 className="flex items-center gap-2 font-semibold"><Package className="size-4" />Order items</h2></div>
                        <div className="divide-y">
                            {details.items.map((item) => <div key={item.id} className="grid gap-3 p-5 sm:grid-cols-[1fr_auto_auto] sm:items-center"><div><p className="font-medium">{item.productName}</p><p className="mt-1 text-xs text-muted-foreground">SKU {item.sku}</p></div><p className="text-sm text-muted-foreground">{item.quantity} × {money(item.unitPrice)}</p><p className="font-semibold">{money(item.totalPrice)}</p></div>)}
                        </div>
                    </section>

                    <section className="rounded-3xl border bg-card p-5 shadow-sm">
                        <h2 className="font-semibold">Amount and commission</h2>
                        <dl className="mt-5 space-y-3 text-sm">
                            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{money(details.subtotal)}</dd></div>
                            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{money(details.shippingAmount)}</dd></div>
                            <div className="flex justify-between"><dt className="text-muted-foreground">Tax</dt><dd>{money(details.taxAmount)}</dd></div>
                            <div className="flex justify-between"><dt className="text-muted-foreground">Discount</dt><dd>-{money(details.discountAmount)}</dd></div>
                            <div className="flex justify-between border-t pt-3 text-base font-semibold"><dt>Total</dt><dd>{money(details.totalAmount)}</dd></div>
                            <div className="flex justify-between"><dt className="text-muted-foreground">Platform fee</dt><dd>{details.platformFee === null ? "Not recorded" : money(details.platformFee)}</dd></div>
                            <div className="flex justify-between"><dt className="text-muted-foreground">Seller amount</dt><dd>{details.sellerAmount === null ? "Not recorded" : money(details.sellerAmount)}</dd></div>
                        </dl>
                    </section>
                </div>

                <aside className="space-y-6">
                    <Info title="Customer" icon={UserRound}><p className="font-medium">{details.buyerName}</p><p>{details.buyerEmail}</p><p>{details.buyerPhone ?? "Phone not available"}</p><Link href={`/admin/users/${details.buyerId}`} className="mt-3 inline-block text-sm font-medium text-primary">View customer</Link></Info>
                    <Info title="Seller / store" icon={StoreIcon}><p className="font-medium">{details.storeName}</p><p>{details.storeEmail}</p><p>{details.storePhone}</p><div className="mt-2"><AdminStatusBadge value={details.storeStatus} /></div><Link href={`/admin/stores/${details.storeId}`} className="mt-3 inline-block text-sm font-medium text-primary">View store</Link></Info>
                    <Info title="Shipping address" icon={MapPin}>{details.shippingAddress ? <address className="not-italic"><p className="font-medium">{details.shippingAddress.fullName}</p><p>{details.shippingAddress.address}{details.shippingAddress.apartment ? `, ${details.shippingAddress.apartment}` : ""}</p><p>{details.shippingAddress.city}, {details.shippingAddress.state}</p><p>{details.shippingAddress.postalCode ?? ""} {details.shippingAddress.country}</p><p className="mt-2">{details.shippingAddress.phone}</p></address> : <p>Address not available</p>}</Info>
                    <Info title="Payment" icon={CreditCard}><p className="capitalize">{details.paymentMethod === "cod" ? "Cash on delivery" : "Stripe"}</p><p className="mt-2 break-all text-xs">{details.paymentTransactionId ?? details.stripePaymentIntentId ?? "No transaction ID"}</p><p className="mt-2">Paid: {safeDate(details.paymentPaidAt)}</p><p>Payout: <span className="capitalize">{details.payoutStatus ?? "not recorded"}</span></p></Info>
                </aside>
            </div>
        </div>
    );
}

function Info({ title, icon: Icon, children }: { title: string; icon: typeof UserRound; children: React.ReactNode }) {
    return <section className="rounded-3xl border bg-card p-5 shadow-sm"><h2 className="flex items-center gap-2 font-semibold"><Icon className="size-4" />{title}</h2><div className="mt-4 space-y-1 text-sm text-muted-foreground">{children}</div></section>;
}
