"use client";

import { useEffect, useState } from "react";
import { Video } from "../types";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "../context/ToastContext";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [purchasedIds, setPurchasedIds] = useState<number[]>([]);
  const { user, token, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const backendUrl = "http://localhost:8000";

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleBuy = async (videoId: number) => {
    if (!isAuthenticated) {
      showToast("Please login to buy videos", "info");
      router.push("/login");
      return;
    }

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
        showToast("Purchase successful! You can watch it in your dashboard.", "success");
        setPurchasedIds(prev => [...prev, videoId]); // Update UI immediately
      } else {
        if (res.status === 409) {
          showToast("You have already purchased this video.", "info");
        } else {
          showToast(data.message || "Purchase failed", "error");
        }
      }
    } catch (error) {
      console.error("Purchase error:", error);
      showToast("An error occurred while purchasing.", "error");
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setPurchasedIds(data.map((v: Video) => v.id));
          }
        })
        .catch(err => console.error('Purchases fetch error:', err));
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`, {
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API Error: ${res.status} ${res.statusText}\n${text}`);
        }
        return res.json();
      })
      .then((data) => setVideos(data))
      .catch((err) => console.error('Videos fetch error:', err));
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-gradient mb-8 leading-tight">
            Elevate Your <br />
            <span className="text-indigo-500">Video Experience</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Discover a curated collection of premium high-definition videos.
            Own your favorite content forever with a single click.
          </p>
          <div className="flex justify-center gap-6">
            <button className="btn-primary !px-10 !py-4 text-lg">Browse Collection</button>
            <button className="px-10 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-semibold text-lg">Learn More</button>
          </div>
        </div>
      </section>

      {/* Video Grid */}
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">Trending Now</h2>
          <div className="h-[1px] flex-1 bg-white/10 mx-8"></div>
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 cursor-pointer transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </div>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 cursor-pointer transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-20 glass-card">
            <p className="text-gray-400 text-lg">No premium content available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {videos.map((video, idx) => (
              <div
                key={video.id}
                className="glass-card overflow-hidden group animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="relative aspect-video bg-black/40 overflow-hidden">
                  <video
                    src={`${backendUrl}${video.video_path}`}
                    controls
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  >
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute top-4 right-4 py-1.5 px-3 bg-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                    4K Ultra HD
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{video.title}</h3>
                  <p className="text-gray-400 mb-8 line-clamp-2 leading-relaxed text-sm">{video.description}</p>

                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Price</span>
                      <span className="text-2xl font-bold text-white">${video.price}</span>
                    </div>
                    {purchasedIds.includes(video.id) ? (
                      <div className="flex items-center gap-2 text-emerald-400 font-bold px-4 py-2 bg-emerald-400/10 rounded-xl border border-emerald-400/20">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        Own It
                      </div>
                    ) : (
                      <button
                        onClick={() => handleBuy(video.id)}
                        className="btn-primary !px-8"
                      >
                        Buy Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
