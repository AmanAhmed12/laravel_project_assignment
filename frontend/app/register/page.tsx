"use client";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "../../context/ToastContext";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { register } = useAuth();
    const { showToast } = useToast();
    const router = useRouter(); // Use App Router's useRouter
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("Registration error:", data);
                // Handle Laravel validation errors (often an object with a 'message' and 'errors' field)
                if (data.errors) {
                    // Combine all error messages
                    const messages = Object.values(data.errors).flat().join(", ");
                    throw new Error(messages || "Registration failed");
                }
                throw new Error(data.message || "Registration failed");
            }

            // Inform the user and redirect to login after a delay
            showToast("Account created successfully! Redirecting to login...", "success");

            setTimeout(() => {
                router.push("/login");
            }, 2500);

        } catch (err: any) {
            console.error("Catch error:", err);
            setError(err.message || "An unexpected error occurred");
            showToast(err.message || "Registration failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[90vh] px-6 py-12">
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="glass-card p-10 w-full max-w-lg animate-fade-in">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gradient mb-3">Join VideoLux</h1>
                    <p className="text-gray-400">Unlock a world of premium high-definition content</p>
                </div>

                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Secure Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                            placeholder="At least 8 characters"
                            required
                            minLength={8}
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`btn-primary w-full !py-4 text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Creating Account...' : 'Get Instant Access'}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account? <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">Sign In</Link>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
