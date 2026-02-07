"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Video } from "../../types";
import { useToast } from "../../context/ToastContext";
import Link from "next/link";

export default function CustomerDashboard() {
    const { user, token, isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();
    const [purchasedVideos, setPurchasedVideos] = useState<Video[]>([]);
    const [allVideos, setAllVideos] = useState<Video[]>([]);
    const [purchasedIds, setPurchasedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    const backendUrl = "http://localhost:8000";

    const fetchDashboardData = async () => {
        if (!token) return;

        try {
            // Fetch Purchased Videos
            const pRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            const pData = await pRes.json();
            setPurchasedVideos(pData);
            setPurchasedIds(pData.map((v: Video) => v.id));

            // Fetch All Available Videos for the Store
            const vRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`, {
                headers: { "Accept": "application/json" }
            });
            const vData = await vRes.json();
            setAllVideos(vData);

        } catch (err) {
            console.error("Dashboard fetch error:", err);
            showToast("Failed to load dashboard data", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        fetchDashboardData();
    }, [isAuthenticated, token]);

    const handleBuy = async (videoId: number) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify({ video_id: videoId })
            });

            const data = await res.json();

            if (res.ok) {
                showToast("Purchase successful! Content added to your library.", "success");
                // Refresh data to show in library and update button
                fetchDashboardData();
            } else {
                if (res.status === 409) {
                    showToast("You already own this production.", "info");
                } else {
                    showToast(data.message || "Purchase failed", "error");
                }
            }
        } catch (error) {
            showToast("Transaction failed. Please try again.", "error");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen space-y-20">
            {/* My Collection Section */}
            <section className="animate-fade-in">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl font-bold text-gradient mb-2 tracking-tight">My Library</h1>
                        <p className="text-gray-400">Your premium high-definition collection.</p>
                    </div>
                    <div className="hidden md:flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">Total Assets</div>
                            <div className="text-xl font-bold text-white">{purchasedVideos.length} Items</div>
                        </div>
                    </div>
                </header>

                {purchasedVideos.length === 0 ? (
                    <div className="text-center py-20 glass-card">
                        <p className="text-gray-400 text-lg mb-6">Your library is empty. Discover content below.</p>
                        <button
                            onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                            className="btn-primary"
                        >
                            Browse Marketplace
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {purchasedVideos.map((video, idx) => (
                            <div key={video.id} className="glass-card overflow-hidden group shadow-2xl" style={{ animationDelay: `${idx * 0.1}s` }}>
                                <div className="bg-black aspect-video relative">
                                    <video
                                        src={`${backendUrl}${video.video_path}`}
                                        controls
                                        controlsList="nodownload"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                        onContextMenu={(e) => e.preventDefault()}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-emerald-500 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white shadow-xl">Premium Access</div>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{video.title}</h3>
                                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">{video.description}</p>
                                    <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-emerald-400 font-bold text-sm">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                        Authorized Production
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Marketplace Section - Now available for logged-in users too! */}
            <section className="animate-fade-in pb-20">
                <div className="flex items-center gap-6 mb-12">
                    <h2 className="text-3xl font-bold">Discover New Productions</h2>
                    <div className="h-[1px] flex-1 bg-white/10"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {allVideos.length > 0 ? (
                        allVideos.map((video, idx) => (
                            <div key={video.id + '_store'} className="glass-card overflow-hidden group border-white/5" style={{ animationDelay: `${idx * 0.05}s` }}>
                                <div className="relative aspect-video bg-black/40 overflow-hidden">
                                    <video
                                        src={`${backendUrl}${video.video_path}`}
                                        controls
                                        controlsList="nodownload"
                                        onContextMenu={(e) => e.preventDefault()}
                                        className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity duration-500"
                                    />
                                    <div className="absolute top-4 right-4 py-1.5 px-3 bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                        4K HDR
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">{video.title}</h3>
                                    <p className="text-gray-500 text-xs mb-8 line-clamp-2 leading-relaxed">{video.description}</p>

                                    <div className="flex justify-between items-center bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Market Value</span>
                                            <span className="text-xl font-bold text-white">${video.price}</span>
                                        </div>
                                        {purchasedIds.includes(video.id) ? (
                                            <div className="flex items-center gap-2 text-emerald-400 font-bold px-4 py-2 bg-emerald-400/10 rounded-xl border border-emerald-400/20 text-xs uppercase tracking-widest">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                Owned
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleBuy(video.id)}
                                                className="btn-primary !px-6 !py-2 !text-sm"
                                            >
                                                Buy Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">Checking cinematic library...</p>
                    )}
                </div>
            </section>
        </div>
    );
}
