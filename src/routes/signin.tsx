import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { Layout } from "@/components/Layout";
import { useAuth, ADMIN_EMAILS } from "@/context/AuthContext";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

const schema = z.object({ redirect: fallback(z.string(), "/").default("/") });

export const Route = createFileRoute("/signin")({
  head: () => ({ meta: [{ title: "Sign in — Vendooo" }] }),
  validateSearch: zodValidator(schema),
  component: Page,
});

function Page() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/signin" });
  const [email, setEmail] = useState(user?.email ?? "");
  const [name, setName] = useState(user?.name ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Enter a valid email");
    const u = signIn(email, name);
    toast.success(`Welcome${u.name ? `, ${u.name}` : ""}`);
    navigate({ to: redirect || "/" });
  };

  return (
    <Layout>
      <div className="mx-auto max-w-md px-6 py-20">
        <div className="glass-strong rounded-3xl p-8 shadow-soft">
          <h1 className="font-display text-3xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Demo sign-in — any email works. Use{" "}
            <code className="rounded bg-secondary px-1.5 py-0.5 text-[11px]">{ADMIN_EMAILS[0]}</code> for admin access.
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="mt-1.5 h-11 w-full rounded-full border border-border bg-background/60 px-4 text-sm outline-none focus:ring-2 focus:ring-accent/40"
              />
            </label>
            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 h-11 w-full rounded-full border border-border bg-background/60 px-4 text-sm outline-none focus:ring-2 focus:ring-accent/40"
              />
            </label>
            <button className="inline-flex h-11 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background shadow-glow transition-smooth hover:opacity-90">
              Continue
            </button>
          </form>
          <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3 w-3" /> Stored locally in your browser only.
          </p>
          <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-foreground">
            ← Back home
          </Link>
        </div>
      </div>
    </Layout>
  );
}
