import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import GeneralInformation from "@/components/seller/settings/GeneralInformation";
import BusinessInformation from "@/components/seller/settings/BusinessInformation";
import AddressInformation from "@/components/seller/settings/AddressInformation";
import PaymentSettings from "@/components/seller/settings/PaymentSettings";
import ShippingSettings from "@/components/seller/settings/ShippingSettings";
import StorePolicies from "@/components/seller/settings/StorePolicies";
import SocialLinks from "@/components/seller/settings/SocialLinks";
import AppearanceSettings from "@/components/seller/settings/AppearanceSettings";
import DangerZone from "@/components/seller/settings/DangerZone";

export default function SellerSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">
                    Store Settings
                </h1>

                <p className="text-muted-foreground mt-2">
                    Manage your store information and preferences.
                </p>
            </div>

            <Accordion
                type="multiple"
                className="space-y-4"
            >
                <AccordionItem value="general">
                    <AccordionTrigger>
                        General Information
                    </AccordionTrigger>

                    <AccordionContent>
                        <GeneralInformation />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="business">
                    <AccordionTrigger>
                        Business Information
                    </AccordionTrigger>

                    <AccordionContent>
                        <BusinessInformation />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="address">
                    <AccordionTrigger>
                        Store Address
                    </AccordionTrigger>

                    <AccordionContent>
                        <AddressInformation />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="payment">
                    <AccordionTrigger>
                        Payment Settings
                    </AccordionTrigger>

                    <AccordionContent>
                        <PaymentSettings />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping">
                    <AccordionTrigger>
                        Shipping Settings
                    </AccordionTrigger>

                    <AccordionContent>
                        <ShippingSettings />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="policies">
                    <AccordionTrigger>
                        Store Policies
                    </AccordionTrigger>

                    <AccordionContent>
                        <StorePolicies />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="social">
                    <AccordionTrigger>
                        Social Links
                    </AccordionTrigger>

                    <AccordionContent>
                        <SocialLinks />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="appearance">
                    <AccordionTrigger>
                        Appearance
                    </AccordionTrigger>

                    <AccordionContent>
                        <AppearanceSettings />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="danger">
                    <AccordionTrigger className="text-red-600">
                        Danger Zone
                    </AccordionTrigger>

                    <AccordionContent>
                        <DangerZone />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}