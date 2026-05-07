import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search as SearchIcon, TrendingUp, Clock, X } from "lucide-react";
import { useProducts } from "@/context/ProductStore";
import { formatPrice } from "@/lib/format";

const RECENT_KEY = "vendoo-recent-searches";
const TRENDING = ["Cashmere", "Trench coat", "Sneakers", "Linen", "Tote bag"];

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { products } = useProducts();
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    try { const r = localStorage.getItem(RECENT_KEY); if (r) setRecent(JSON.parse(r)); } catch {}
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  const matches = useMemo(() => {
    if (!q.trim()) return [];
    const s = q.toLowerCase();
    return products.filter((p) =>
      p.name.toLowerCase().includes(s) || p.category.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
    ).slice(0, 6);
  }, [q, products]);

  const submitTerm = (term: string) => {
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    setRecent(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    onClose();
    navigate({ to: "/shop", search: { q: term, cat: "All", sort: "featured", min: 0, max: 1000, color: "", size: "" } });
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 px-4 pt-24 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="glass-strong w-full max-w-2xl overflow-hidden rounded-3xl border border-border/40 shadow-glow animate-fade-up">
        <div className="flex items-center gap-3 border-b border-border/40 px-5">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && q.trim()) submitTerm(q.trim()); }}
            placeholder="Search products, collections, categories…"
            className="h-14 flex-1 bg-transparent text-sm outline-none"
          />
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {q ? (
            matches.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">No results for "{q}"</p>
            ) : (
              <ul className="space-y-1">
                {matches.map((p) => (
                  <li key={p.id}>
                    <Link to="/product/$id" params={{ id: p.id }} onClick={onClose}
                      className="flex items-center gap-3 rounded-2xl px-3 py-2 hover:bg-secondary">
                      <img src={p.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.category}</p>
                      </div>
                      <span className="text-sm font-medium">${p.price}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )
          ) : (
            <div className="space-y-4 p-2">
              {recent.length > 0 && (
                <div>
                  <p className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground"><Clock className="h-3 w-3" /> Recent</p>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <button key={r} onClick={() => submitTerm(r)} className="rounded-full bg-secondary px-3 py-1.5 text-xs hover:bg-muted">{r}</button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground"><TrendingUp className="h-3 w-3" /> Trending</p>
                <div className="flex flex-wrap gap-2">
                  {TRENDING.map((r) => (
                    <button key={r} onClick={() => submitTerm(r)} className="rounded-full bg-secondary px-3 py-1.5 text-xs hover:bg-muted">{r}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
