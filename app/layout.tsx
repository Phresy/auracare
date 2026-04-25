import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar"; // Assuming your Navbar is in components
import Footer from "@/components/Footer";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AuraCare | Premium Pharmacy",
  description: "Your modern healthcare companion for medicines and wellness.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${jakarta.className} antialiased bg-white text-zinc-950`}>
        <CartProvider>
          {/* The Navbar is placed here so it persists across all routes 
              (Pharmacy, Dashboard, Checkout, etc.) 
          */}
          <Navbar />

          <main className="min-h-screen">
            {children}
          </main>

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}