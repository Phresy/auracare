"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isValidToken, setIsValidToken] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        // Check if we have a valid reset token
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setIsValidToken(false);
                setError("Invalid or expired reset link. Please request a new one.");
            }
        };
        checkSession();
    }, []);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            setMessage("Password updated successfully! Redirecting to login...");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error: any) {
            setError(error.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    if (!isValidToken) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} className="text-red-600" />
                    </div>
                    <h1 className="text-2xl font-black text-zinc-900 mb-2">Invalid Link</h1>
                    <p className="text-zinc-500 mb-6">{error}</p>
                    <Link href="/forgot-password">
                        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                            Request New Reset Link
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Lock size={32} className="text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-black text-zinc-900">Set New Password</h1>
                    <p className="text-zinc-500 mt-2">
                        Choose a strong password for your account
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
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500 transition pr-12"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2 text-zinc-700">
                            Confirm Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                            placeholder="Confirm new password"
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
                            "Reset Password"
                        )}
                    </button>

                    <p className="text-center text-sm text-zinc-500">
                        <Link href="/login" className="text-blue-600 font-bold hover:underline">
                            Back to Login
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}