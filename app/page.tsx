"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { Loader2 } from "lucide-react";

export default function Home() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6); // Get 6 products for featured section

      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      // Transform Supabase data to match ProductCard expected format
      const transformedProducts = data?.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price.toFixed(2),
        image: product.image_url || "/placeholder-image.jpg", // Add a default image
        category: product.category || "General",
        rx: product.requires_prescription || false, // Map requires_prescription to rx
        description: product.description,
        stock: product.stock_quantity
      })) || [];

      setProducts(transformedProducts);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Hero />
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="animate-spin mx-auto mb-4 text-brand" size={48} />
              <p className="text-zinc-500">Loading essential care products...</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Hero />

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-950">
              Essential Care
            </h2>
            <p className="text-zinc-500 font-medium">
              Pharmacist-vetted products delivered with precision.
            </p>
            {products.length > 0 && (
              <p className="text-sm text-brand font-medium">
                {products.length}+ products available
              </p>
            )}
          </div>
          <a href="/pharmacy">
            <button className="px-6 py-3 rounded-full border border-zinc-200 font-bold text-sm hover:bg-zinc-50 transition-colors">
              Browse All Categories
            </button>
          </a>
        </div>

        {/* The Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-zinc-50 rounded-3xl">
            <p className="text-zinc-500">No products available at the moment.</p>
            <p className="text-sm text-zinc-400 mt-2">Check back soon for new medications.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Show "View All" button if there are more products in database */}
        <div className="text-center mt-12">
          <a href="/pharmacy">
            <button className="px-8 py-4 bg-zinc-900 text-white rounded-full font-bold hover:bg-zinc-800 transition-colors">
              View All Products
            </button>
          </a>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-zinc-950 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-white">
          <div className="space-y-3">
            <h4 className="font-bold text-lg text-brand">Secure Pharmacy</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">
              All medications are sourced from certified global distributors with full traceability.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-lg text-brand">Expert Consultation</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Live chat with licensed pharmacists available 24/7 for dosage guidance.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-lg text-brand">Express Delivery</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Temperature-controlled packaging and real-time tracking for every order.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}