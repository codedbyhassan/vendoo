import { useEffect, useState } from "react";

export function Countdown({ to, label = "Drop ends in" }: { to: number; label?: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const diff = Math.max(0, to - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  const Cell = ({ v, l }: { v: number; l: string }) => (
    <div className="flex min-w-14 flex-col items-center rounded-2xl bg-foreground/90 px-3 py-2 text-background">
      <span className="font-display text-2xl font-semibold tabular-nums">{String(v).padStart(2, "0")}</span>
      <span className="text-[10px] uppercase tracking-wider opacity-70">{l}</span>
    </div>
  );
  return (
    <div className="flex flex-col items-start gap-3">
      <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <div className="flex gap-2"><Cell v={d} l="days" /><Cell v={h} l="hrs" /><Cell v={m} l="min" /><Cell v={s} l="sec" /></div>
    </div>
  );
}
