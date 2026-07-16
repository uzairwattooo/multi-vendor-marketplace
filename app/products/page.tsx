import Container from "@/components/common/Container";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import PublicProducts from "@/components/marketplace/PublicProducts";

export default function ProductsPage() {
    return (
        <main className="min-h-screen">
            <Navbar />

            <section className="py-12 sm:py-16">
                <Container>
                    <PublicProducts />
                </Container>
            </section>

            <Footer />
        </main>
    );
}