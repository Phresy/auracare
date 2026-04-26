"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, Shield, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const supabase = createClient();
    const router = useRouter();

    // Check if already logged in
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.email === "obenggyanp@gmail.com") {
                router.push("/admin");
            }
        };
        checkSession();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }

            if (data.user) {
                // Check if user is the master admin
                if (data.user.email !== "obenggyanp@gmail.com") {
                    setError("Unauthorized access. Admin only.");
                    await supabase.auth.signOut();
                    setLoading(false);
                    return;
                }

                // Redirect to admin panel using window.location for hard redirect
                window.location.href = "/admin";
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("An unexpected error occurred");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Shield size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-zinc-900">Admin Access</h1>
                    <p className="text-zinc-500 text-sm mt-1">Secure portal for administrators</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                        <AlertCircle size={18} className="text-red-600" />
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-zinc-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900 transition"
                            placeholder="obenggyanp@gmail.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2 text-zinc-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900 transition"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-zinc-900 text-white py-3 rounded-xl font-bold hover:bg-zinc-800 transition disabled:opacity-50 mt-6"
                    >
                        {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Access Admin Panel"}
                    </button>
                </form>

                <p className="text-center text-xs text-zinc-400 mt-6">
                    Restricted access. Unauthorized attempts will be logged.
                </p>
            </div>
        </div>
    );
}