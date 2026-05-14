"use client";
import { useState } from 'react';

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    // This calls your /api/generate route
    await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
    alert("Video generation started! Check back in 2 minutes.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-500">Video Factory</h1>
        
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <textarea 
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 h-40 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Describe your 1-minute video idea (e.g., 'A mysterious fact about Ancient Egypt')..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-lg transition-all"
          >
            {loading ? "Initializing AI..." : "Generate 1-Minute Short (Free)"}
          </button>
        </div>
      </div>
    </div>
  );
}