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

  const scrollToCollection = () => {
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 mb-8 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-[0.2em] animate-fade-in">
            Premium Cinematic Marketplace
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-gradient mb-8 leading-tight tracking-tighter">
            Cinema in Your <br />
            <span className="text-indigo-500">Digital Library</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-16 leading-relaxed">
            Access a curated selection of ultra high-definition productions.
            No subscriptions. No limits. Own your content forever.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
            <button
              onClick={scrollToCollection}
              className="btn-primary !px-12 !py-5 text-lg w-full sm:w-auto"
            >
              Browse Collection
            </button>
            <button
              onClick={scrollToFeatures}
              className="px-12 py-5 rounded-2xl border border-white/10 hover:bg-white/5 transition-all font-bold text-lg w-full sm:w-auto flex items-center justify-center gap-2 group"
            >
              Learn More
              <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">Why Choose VideoLux?</h2>
          <p className="text-gray-500 max-w-xl mx-auto uppercase tracking-widest text-xs font-bold">Standard Setting in Digital Distribution</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: "Ultra HD Quality", desc: "Experience videos in 4K HDR, optimized for any screen size without compromise.", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
            { title: "Forever Ownership", desc: "One-time purchase gives you lifetime access to your library. No recurring fees.", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
            { title: "Instant Playback", desc: "Start watching immediately after acquisition with our high-speed global CDN.", icon: "M13 10V3L4 14h7v7l9-11h-7z" }
          ].map((feature, i) => (
            <div key={i} className="glass-card p-10 group hover:bg-white/[0.05]">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-8 border border-indigo-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Video Grid */}
      <div id="collection" className="container mx-auto px-6 pt-32">
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
