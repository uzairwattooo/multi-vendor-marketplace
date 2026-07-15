import Link from "next/link";
import {
    Mail,
    MapPin,
    Phone,
    Store,
} from "lucide-react";

import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
} from "react-icons/fa";

import Container from "@/components/common/Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const marketplaceLinks = [
    { label: "All Products", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "Stores", href: "/stores" },
    { label: "Top Deals", href: "/deals" },
];

const sellerLinks = [
    { label: "Become a Seller", href: "/seller/onboarding" },
    { label: "Seller Dashboard", href: "/seller/dashboard" },
    { label: "Seller Guide", href: "/seller-guide" },
    { label: "Commission", href: "/commission" },
];

const supportLinks = [
    { label: "Help Center", href: "/help" },
    { label: "Track Order", href: "/account/orders" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "Contact Us", href: "/contact" },
];

export default function Footer() {
    return (
        <footer className="border-t bg-zinc-950 text-white">
            <Container>
                <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-16">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                <Store className="size-5" />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold">
                                    MarketNest
                                </h2>

                                <p className="text-xs text-zinc-400">
                                    Multi Vendor Marketplace
                                </p>
                            </div>
                        </Link>

                        <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-400">
                            Trusted sellers se products purchase kro ya apna online store
                            create karke apna business grow kro.
                        </p>

                        <div className="mt-6 space-y-3 text-sm text-zinc-400">
                            <div className="flex items-center gap-3">
                                <Mail className="size-4 text-primary" />
                                support@marketnest.com
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone className="size-4 text-primary" />
                                +92 300 1234567
                            </div>

                            <div className="flex items-center gap-3">
                                <MapPin className="size-4 text-primary" />
                                Pakistan
                            </div>
                        </div>
                    </div>

                    <FooterLinks
                        title="Marketplace"
                        links={marketplaceLinks}
                    />

                    <FooterLinks
                        title="For Sellers"
                        links={sellerLinks}
                    />

                    <FooterLinks
                        title="Support"
                        links={supportLinks}
                    />
                </div>

                <div className="border-t border-white/10 py-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h3 className="font-semibold">
                                Subscribe to our newsletter
                            </h3>

                            <p className="mt-1 text-sm text-zinc-400">
                                New products aur marketplace updates receive kro.
                            </p>
                        </div>

                        <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="border-white/10 bg-white/10 text-white placeholder:text-zinc-500"
                            />

                            <Button type="submit">
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="flex flex-col gap-5 border-t border-white/10 py-6 text-sm text-zinc-400 md:flex-row md:items-center md:justify-between">
                    <p>
                        © {new Date().getFullYear()} MarketNest. All rights reserved.
                    </p>

                    <div className="flex items-center gap-5">
                        <Link href="/privacy" className="hover:text-white">
                            Privacy Policy
                        </Link>

                        <Link href="/terms" className="hover:text-white">
                            Terms
                        </Link>

                        <Link href="/cookies" className="hover:text-white">
                            Cookies
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <SocialLink href="#" label="Facebook">
                            <FaFacebookF />
                        </SocialLink>

                        <SocialLink href="#" label="Instagram">
                            <FaInstagram />
                        </SocialLink>

                        <SocialLink href="#" label="LinkedIn">
                            <FaLinkedinIn />
                        </SocialLink>
                    </div>
                </div>
            </Container>
        </footer>
    );
}

type FooterLinksProps = {
    title: string;
    links: {
        label: string;
        href: string;
    }[];
};

function FooterLinks({
    title,
    links,
}: FooterLinksProps) {
    return (
        <div>
            <h3 className="font-semibold">
                {title}
            </h3>

            <ul className="mt-5 space-y-3">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className="text-sm text-zinc-400 transition hover:text-white"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

type SocialLinkProps = {
    href: string;
    label: string;
    children: React.ReactNode;
};

function SocialLink({
    href,
    label,
    children,
}: SocialLinkProps) {
    return (
        <Link
            href={href}
            aria-label={label}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-primary transition"
        >
            {children}
        </Link>
    );
}