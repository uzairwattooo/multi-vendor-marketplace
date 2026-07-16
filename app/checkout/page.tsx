import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <CheckoutForm />
            <Footer />
        </main>
    );
}