"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const supabase = createClient();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setMessage("Password reset link sent! Check your email.");
            setEmail("");
        } catch (error: any) {
            setError(error.message || "Failed to send reset link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Mail size={32} className="text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-black text-zinc-900">Reset Password</h1>
                    <p className="text-zinc-500 mt-2">
                        Enter your email and we'll send you a link to reset your password
                    </p>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                        <CheckCircle size={18} className="text-green-600" />
                        <p className="text-sm text-green-700">{message}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                        <AlertCircle size={18} className="text-red-600" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-zinc-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                            placeholder="you@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            "Send Reset Link"
                        )}
                    </button>

                    <Link href="/auth" className="block text-center">
                        <button
                            type="button"
                            className="text-sm text-blue-600 font-bold hover:underline"
                        >
                            Back to Login
                        </button>
                    </Link>
                </form>
            </motion.div>
        </div>
    );
}