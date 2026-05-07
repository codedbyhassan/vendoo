import { useEffect, useState } from "react";
import { Truck, Sparkles } from "lucide-react";

const messages = [
  { i: Truck, t: "Free delivery across Ghana over GH₵ 2,000" },
  { i: Sparkles, t: "Use code VENDOO10 for 10% off" },
  { i: Truck, t: "Pay with MTN MoMo, Vodafone Cash & cards" },
];

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % messages.length), 3500); return () => clearInterval(t); }, []);
  const M = messages[i];
  const Icon = M.i;
  return (
    <div className="bg-foreground text-background">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-2 px-6 text-[11px] tracking-[0.14em] uppercase">
        <Icon className="h-3 w-3" />
        <span key={i} className="animate-fade-up">{M.t}</span>
      </div>
    </div>
  );
}
