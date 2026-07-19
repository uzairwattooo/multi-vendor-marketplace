"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
    notes: string;
    setNotes: (value: string) => void;
};

const MAX_NOTES_LENGTH = 500;

export default function OrderNotes({
    notes,
    setNotes,
}: Props) {
    return (
        <section className="rounded-2xl border bg-card p-6 shadow-sm">

            <h2 className="text-xl font-semibold">
                Order Notes
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
                Add any special instructions for the seller or delivery partner.
            </p>

            <div className="mt-6 space-y-2">

                <div className="flex items-center justify-between">

                    <Label htmlFor="order-notes">
                        Notes (Optional)
                    </Label>

                    <span className="text-xs text-muted-foreground">
                        {notes.length}/{MAX_NOTES_LENGTH}
                    </span>

                </div>

                <Textarea
                    id="order-notes"
                    rows={5}
                    maxLength={MAX_NOTES_LENGTH}
                    value={notes}
                    onChange={(e) =>
                        setNotes(e.target.value)
                    }
                    placeholder={`Example:
• Please call before delivery.
• Deliver after 6 PM.
• Leave at reception if unavailable.`}
                />

                <p className="text-xs text-muted-foreground">
                    These notes will be shared with the seller.
                </p>

            </div>

        </section>
    );
}