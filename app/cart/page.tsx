import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import CartContent from "@/components/cart/CartContent";

export default function CartPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <CartContent />
            <Footer />
        </main>
    );
}