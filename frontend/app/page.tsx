"use client";

import { useEffect, useState } from "react";
import { Video } from "../types";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const backendUrl = "http://localhost:8000";

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`)
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mx-auto p-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Discover Amazing Videos</h1>
        <p className="text-xl text-gray-600">Browse our collection of premium content</p>
      </header>

      {videos.length === 0 ? (
        <p className="text-center text-gray-500">No videos available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-black aspect-video">
                <video
                  src={`${backendUrl}${video.video_path}`}
                  controls
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">{video.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{video.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-2xl font-bold text-blue-600">${video.price}</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
