"use client";

import { useState, useCallback } from "react";
import { Eye, Clock, MousePointerClick, Link2, Copy, Check, TrendingUp, Shield } from "lucide-react";
import { toast } from "sonner";

type TrackingData = {
  id: string;
  title: string;
  clientName: string;
  createdAt: string;
  views: number;
  lastViewed: string | null;
  totalTimeSeconds: number;
  sections: { name: string; timeSeconds: number; scrollDepth: number }[];
};

export default function HomePage() {
  const [proposals, setProposals] = useState<TrackingData[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const createProposal = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const tracking: TrackingData = {
      id: crypto.randomUUID(),
      title: fd.get("title") as string,
      clientName: fd.get("client") as string,
      createdAt: new Date().toISOString(),
      views: 0,
      lastViewed: null,
      totalTimeSeconds: 0,
      sections: [
        { name: "Executive Summary", timeSeconds: 0, scrollDepth: 0 },
        { name: "Scope of Work", timeSeconds: 0, scrollDepth: 0 },
        { name: "Timeline", timeSeconds: 0, scrollDepth: 0 },
        { name: "Pricing", timeSeconds: 0, scrollDepth: 0 },
      ],
    };
    setProposals((prev) => [tracking, ...prev]);
    setShowCreate(false);
    toast.success("Proposal tracking link created!");
  }, []);

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/track/${id}`;
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const simulateView = (id: string) => {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          views: p.views + 1,
          lastViewed: new Date().toISOString(),
          totalTimeSeconds: p.totalTimeSeconds + Math.floor(Math.random() * 180 + 30),
          sections: p.sections.map((s) => ({
            ...s,
            timeSeconds: s.timeSeconds + Math.floor(Math.random() * 45 + 5),
            scrollDepth: Math.min(100, s.scrollDepth + Math.floor(Math.random() * 30)),
          })),
        };
      })
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-sm mb-4">
          <Eye className="w-4 h-4" />
          Stop guessing. Start knowing.
        </div>
        <h1 className="text-4xl font-bold mb-3">PropWatch</h1>
        <p className="text-zinc-500 text-lg max-w-md mx-auto">
          Know exactly when clients open your proposals, which sections they read, and how long they spend on pricing.
        </p>
      </header>

      {/* Quick Stats */}
      {proposals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="border border-zinc-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">{proposals.length}</p>
            <p className="text-xs text-zinc-400">Active Proposals</p>
          </div>
          <div className="border border-zinc-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">{proposals.reduce((s, p) => s + p.views, 0)}</p>
            <p className="text-xs text-zinc-400">Total Views</p>
          </div>
          <div className="border border-zinc-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">
              {proposals.filter((p) => p.views > 0).length}
            </p>
            <p className="text-xs text-zinc-400">Opened</p>
          </div>
          <div className="border border-zinc-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">
              {Math.round(proposals.reduce((s, p) => s + p.totalTimeSeconds, 0) / 60)}m
            </p>
            <p className="text-xs text-zinc-400">Total Reading Time</p>
          </div>
        </div>
      )}

      {/* Create Button */}
      <div className="text-center mb-10">
        <button
          onClick={() => setShowCreate(true)}
          className="bg-zinc-900 text-white rounded-xl px-6 py-3 font-semibold hover:bg-zinc-800 transition inline-flex items-center gap-2"
        >
          <Link2 className="w-5 h-5" /> Create Tracking Link
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4">New Proposal Tracker</h2>
            <form onSubmit={createProposal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Proposal Title</label>
                <input name="title" required placeholder="Website Redesign Proposal" className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Client Name</label>
                <input name="client" required placeholder="Acme Corp" className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-zinc-900 text-white rounded-lg py-2.5 font-medium hover:bg-zinc-800 transition">Create Tracker</button>
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Proposal List */}
      <div className="space-y-4">
        {proposals.map((p) => (
          <div key={p.id} className="border border-zinc-200 rounded-xl p-5 hover:border-violet-200 transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <p className="text-sm text-zinc-500">For {p.clientName} · Created {new Date(p.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => simulateView(p.id)} className="text-xs px-2 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 hover:bg-amber-100 transition">
                  Simulate View
                </button>
                <button onClick={() => copyLink(p.id)} className="flex items-center gap-1 text-xs px-2 py-1 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition">
                  {copied === p.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copied === p.id ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Eye className="w-4 h-4 text-violet-500" />
                <span className="font-semibold">{p.views}</span> views
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-violet-500" />
                <span className="font-semibold">{Math.round(p.totalTimeSeconds / 60)}m</span> reading
              </div>
              {p.lastViewed && (
                <div className="flex items-center gap-2 text-sm col-span-2">
                  <MousePointerClick className="w-4 h-4 text-emerald-500" />
                  Last viewed {new Date(p.lastViewed).toLocaleTimeString()}
                </div>
              )}
            </div>

            {/* Section Breakdown */}
            {p.views > 0 && (
              <div className="mt-4 pt-4 border-t border-zinc-100">
                <p className="text-xs text-zinc-400 mb-2">Section Engagement</p>
                <div className="space-y-2">
                  {p.sections.map((sec) => (
                    <div key={sec.name} className="flex items-center gap-2">
                      <span className="text-xs w-32 shrink-0">{sec.name}</span>
                      <div className="flex-1 h-5 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-500 rounded-full transition-all"
                          style={{ width: `${sec.scrollDepth}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-400 w-12 text-right">{Math.round(sec.timeSeconds / 60)}m</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {proposals.length === 0 && (
        <div className="text-center py-16 text-zinc-400">
          <Eye className="w-12 h-12 mx-auto mb-4 text-zinc-200" />
          <p className="text-lg font-medium text-zinc-500">No proposals yet</p>
          <p className="text-sm">Create a tracking link and share it with your client.</p>
        </div>
      )}

      {/* Features */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 border border-zinc-200 rounded-xl">
          <Eye className="w-8 h-8 mx-auto mb-3 text-violet-500" />
          <h3 className="font-semibold mb-1">Real-Time Alerts</h3>
          <p className="text-sm text-zinc-500">Know the moment a client opens your proposal. No more refreshing your inbox.</p>
        </div>
        <div className="text-center p-6 border border-zinc-200 rounded-xl">
          <TrendingUp className="w-8 h-8 mx-auto mb-3 text-violet-500" />
          <h3 className="font-semibold mb-1">Section Analytics</h3>
          <p className="text-sm text-zinc-500">See which parts they read most. Pricing section getting attention? Time to follow up.</p>
        </div>
        <div className="text-center p-6 border border-zinc-200 rounded-xl">
          <Shield className="w-8 h-8 mx-auto mb-3 text-violet-500" />
          <h3 className="font-semibold mb-1">Privacy First</h3>
          <p className="text-sm text-zinc-500">No client data collected. Just engagement metrics. GDPR compliant by design.</p>
        </div>
      </section>

      {/* Pro Upgrade */}
      <div className="mt-16 bg-zinc-50 border border-zinc-200 rounded-2xl p-8 text-center max-w-lg mx-auto">
        <h3 className="text-xl font-bold mb-2">PropWatch Pro</h3>
        <p className="text-zinc-500 mb-4">Unlimited proposals, email alerts, PDF export, custom branding, team dashboard.</p>
        <p className="text-2xl font-bold mb-4">$15<span className="text-sm font-normal text-zinc-400">/month</span></p>
        <a href="https://ko-fi.com/penn662500" target="_blank" className="inline-block bg-zinc-900 text-white rounded-xl px-8 py-3 font-semibold hover:bg-zinc-800 transition">
          Support Pro — $15/mo
        </a>
      </div>
    </div>
  );
}
