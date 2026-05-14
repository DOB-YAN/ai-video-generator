import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <nav className="p-6 flex justify-between items-center border-b border-slate-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Reapersaint AI
        </h1>
        <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full transition shadow-lg shadow-blue-500/20">
          Get Started Free
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="text-6xl font-extrabold mb-6 leading-tight">
          Turn Text into <span className="text-blue-500">Viral Shorts</span> <br />
          Completely Free.
        </h2>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          The world's first unlimited AI video generator powered by a distributed network. 
          No subscriptions. No limits. Just your creativity.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mt-20 text-left">
          <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800">
            <div className="text-blue-500 text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Instant Scripting</h3>
            <p className="text-slate-400">Powered by Groq Llama 3 for lighting-fast script generation.</p>
          </div>
          <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800">
            <div className="text-blue-500 text-3xl mb-4">🌍</div>
            <h3 className="text-xl font-bold mb-2">Distributed Compute</h3>
            <p className="text-slate-400">Uses 21+ free AI servers to ensure your videos are always free.</p>
          </div>
          <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800">
            <div className="text-blue-500 text-3xl mb-4">🎬</div>
            <h3 className="text-xl font-bold mb-2">9:16 Vertical</h3>
            <p className="text-slate-400">Perfectly formatted for TikTok, YouTube Shorts, and Reels.</p>
          </div>
        </div>
      </main>
    </div>
  );
}