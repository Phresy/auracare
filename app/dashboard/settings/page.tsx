"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { User, Mail, Trash2, Save, Loader2, AlertTriangle, Lock, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [fullName, setFullName] = useState("");

    // New state for password updates
    const [newPassword, setNewPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setFullName(user?.user_metadata?.full_name || "");
        };
        getUser();
    }, []);

    const updateProfile = async () => {
        setLoading(true);
        const { error } = await supabase.auth.updateUser({
            data: { full_name: fullName }
        });
        if (error) alert(error.message);
        else alert("Profile updated successfully!");
        setLoading(false);
    };

    const handleUpdatePassword = async () => {
        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        setPasswordLoading(true);
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            alert(error.message);
        } else {
            alert("Password updated successfully!");
            setNewPassword("");
        }
        setPasswordLoading(false);
    };

    const deleteAccount = async () => {
        const confirmed = window.confirm("Are you sure? This action is permanent and will delete all your order history.");
        if (!confirmed) return;
        alert("Account deletion request sent to admin.");
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <h1 className="text-3xl font-black mb-10">Account Settings</h1>

            <div className="grid gap-8">
                {/* Profile Section */}
                <section className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <User size={20} className="text-brand" /> Profile Information
                    </h3>

                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-xs font-black uppercase text-zinc-400 tracking-widest">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="checkout-input bg-zinc-50 border-transparent focus:bg-white"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="grid gap-2 opacity-60">
                            <label className="text-xs font-black uppercase text-zinc-400 tracking-widest">Email Address</label>
                            <div className="checkout-input bg-zinc-100 flex items-center gap-3 cursor-not-allowed">
                                <Mail size={16} /> {user?.email}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={updateProfile}
                        disabled={loading}
                        className="mt-8 bg-zinc-950 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </section>

                {/* Security Section */}
                <section className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Lock size={20} className="text-brand" /> Security
                    </h3>

                    <div className="grid gap-2">
                        <label className="text-xs font-black uppercase text-zinc-400 tracking-widest">Update Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="checkout-input bg-zinc-50 border-transparent focus:bg-white"
                            placeholder="Min. 6 characters"
                        />
                    </div>

                    <button
                        onClick={handleUpdatePassword}
                        disabled={passwordLoading || !newPassword}
                        className="mt-8 bg-zinc-100 text-zinc-950 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-200 transition-all disabled:opacity-50"
                    >
                        {passwordLoading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                        Update Password
                    </button>
                </section>

                {/* Danger Zone */}
                <section className="bg-red-50/50 border border-red-100 rounded-[2.5rem] p-8">
                    <h3 className="text-lg font-bold text-red-600 mb-2 flex items-center gap-2">
                        <AlertTriangle size={20} /> Danger Zone
                    </h3>
                    <p className="text-sm text-red-800/60 mb-6 font-medium">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>

                    <button
                        onClick={deleteAccount}
                        className="bg-white border border-red-200 text-red-600 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all"
                    >
                        <Trash2 size={18} />
                        Delete Account
                    </button>
                </section>
            </div>
        </div>
    );
}