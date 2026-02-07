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

            // Call register from context to update state and redirect
            showToast("Registration successful!", "success");
            register(data.access_token, data.user);

        } catch (err: any) {
            console.error("Catch error:", err);
            setError(err.message || "An unexpected error occurred");
            showToast(err.message || "Registration failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Customer Registration</h1>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">{error}</div>}

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        required
                        minLength={8}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full text-white py-2 rounded transition ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login here</Link></p>
                </div>
            </form>
        </div>
    );
}
