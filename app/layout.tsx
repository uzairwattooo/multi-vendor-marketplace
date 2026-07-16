import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/components/providers/QueryProvider";
import CartProvider from "@/components/providers/CartProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Multi Vendor Marketplace",
  description: "Buy and sell products from trusted stores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable}  bg-[#F8F8F8] text-[#18181B] antialiased`} cz-shortcut-listen="true"
      >
        <QueryProvider>
          <CartProvider>


            {children}
            <Toaster richColors />
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}