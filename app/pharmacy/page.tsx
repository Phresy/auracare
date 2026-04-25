"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import { Pill, Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function PharmacyPage() {
    const supabase = createClient();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch products from Supabase
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("medications")
                .select("*")
                .order("name", { ascending: true });

            if (error) {
                console.error("Error fetching products:", error);
                return;
            }

            // Transform Supabase data to match ProductCard expected format
            const transformedProducts = data?.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price.toFixed(2),
                image: product.image_url || "/placeholder-image.jpg",
                category: product.category || "General",
                rx: product.requires_prescription || false,
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

    // Get unique categories from products
    const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

    // Filter products by category and search
    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === "All" || product.category === activeCategory;
        const matchesSearch = searchTerm === "" ||
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-center">
                        <Loader2 className="animate-spin mx-auto mb-4 text-brand" size={48} />
                        <p className="text-zinc-500">Loading medications...</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-zinc-950">Pharmacy Shop</h1>
                    <p className="text-zinc-500 font-medium mt-1">
                        Browse our verified healthcare essentials. ({filteredProducts.length} products)
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:border-brand"
                    />
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === cat
                            ? "bg-brand text-white shadow-lg shadow-brand/20"
                            : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-zinc-50 rounded-3xl">
                    <Pill size={64} className="mx-auto text-zinc-300 mb-4" />
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">No products found</h3>
                    <p className="text-zinc-500">
                        {searchTerm ? "Try a different search term" : "Check back later for new products"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </main>
    );
}