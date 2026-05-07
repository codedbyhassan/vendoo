import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductStore";
import { CATEGORIES, type Product } from "@/lib/products";
import { ChevronLeft, Upload, X, Trash2, Plus, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { validateAndProcessImage, MAX_FILE_BYTES } from "@/lib/image";

export const Route = createFileRoute("/admin/product/$id")({
  head: ({ params }) => ({ meta: [{ title: params.id === "new" ? "New product — Admin" : `Edit product — Admin` }] }),
  component: Page,
});

const FALLBACK_IMG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 250'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' text-anchor='middle' fill='%23999' font-family='sans-serif' font-size='16'>No image</text></svg>";

const empty = (id: string): Product => ({
  id,
  name: "",
  price: 0,
  category: "Tops",
  image: FALLBACK_IMG,
  images: [],
  description: "",
  details: [],
  sizes: [],
  colors: [],
  stock: 0,
});

function slug(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `prod-${Date.now()}`;
}

function Page() {
  const { id } = Route.useParams();
  const { user, isAdmin } = useAuth();
  const { get, upsert, remove } = useProducts();
  const navigate = useNavigate();
  const isNew = id === "new";

  useEffect(() => {
    if (!user) navigate({ to: "/signin", search: { redirect: `/admin/product/${id}` } });
  }, [user, id, navigate]);

  const existing = isNew ? null : get(id);
  const [form, setForm] = useState<Product>(existing ?? empty("new"));
  const [detailDraft, setDetailDraft] = useState("");
  const [sizeDraft, setSizeDraft] = useState("");
  const [colorDraft, setColorDraft] = useState({ name: "", hex: "#cccccc" });

  if (!user) return null;
  if (!isAdmin) return <Layout><div className="mx-auto max-w-md p-16 text-center text-sm text-muted-foreground">Admin only.</div></Layout>;
  if (!isNew && !existing) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <h1 className="font-display text-3xl">Product not found</h1>
          <Link to="/admin" className="mt-6 inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">Back to admin</Link>
        </div>
      </Layout>
    );
  }

  const [uploading, setUploading] = useState(false);
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const accepted: string[] = [];
    let rejected = 0;
    for (const file of Array.from(files)) {
      try {
        const out = await validateAndProcessImage(file);
        accepted.push(out.dataUrl);
      } catch (err) {
        rejected++;
        toast.error(file.name, { description: (err as Error).message });
      }
    }
    setUploading(false);
    if (accepted.length) {
      const next = [...(form.images ?? []), ...accepted];
      setForm({ ...form, images: next, image: form.image && form.image !== FALLBACK_IMG ? form.image : next[0] });
      toast.success(`${accepted.length} image${accepted.length > 1 ? "s" : ""} added${rejected ? ` (${rejected} skipped)` : ""}`);
    }
  };

  const removeImage = (idx: number) => {
    const next = (form.images ?? []).filter((_, i) => i !== idx);
    setForm({ ...form, images: next, image: next[0] ?? FALLBACK_IMG });
  };

  const setMainImage = (src: string) => setForm({ ...form, image: src });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name required");
    if (form.price <= 0) return toast.error("Price must be > 0");

    const finalId = isNew ? slug(form.name) : form.id;
    const product: Product = {
      ...form,
      id: finalId,
      image: form.image && form.image !== FALLBACK_IMG ? form.image : (form.images?.[0] ?? FALLBACK_IMG),
    };
    upsert(product);
    toast.success(isNew ? "Product created" : "Product saved");
    navigate({ to: "/admin/product/$id", params: { id: finalId } });
  };

  const handleDelete = () => {
    if (!confirm(`Delete "${form.name}"?`)) return;
    remove(form.id);
    toast.success("Deleted");
    navigate({ to: "/admin" });
  };

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link to="/admin" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-3 w-3" /> Back to admin
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{isNew ? "Create" : "Edit"}</p>
            <h1 className="mt-2 font-display text-4xl font-semibold">{isNew ? "New product" : form.name || "Edit product"}</h1>
          </div>
          {!isNew && (
            <button onClick={handleDelete} className="inline-flex h-10 items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-4 text-xs font-medium text-destructive hover:bg-destructive/20">
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          )}
        </div>

        <form onSubmit={submit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Section title="Details">
              <Field label="Name">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" required />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Category">
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Product["category"] })} className="input">
                    {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Price ($)">
                  <input type="number" min={0} step="1" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="input" required />
                </Field>
                <Field label="Stock">
                  <input type="number" min={0} value={form.stock ?? 0} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="input" />
                </Field>
                <Field label="Featured">
                  <select value={form.featured ? "yes" : "no"} onChange={(e) => setForm({ ...form, featured: e.target.value === "yes" })} className="input">
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </Field>
              </div>
              <Field label="Description">
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="input min-h-24 rounded-2xl py-3" />
              </Field>
            </Section>

            <Section title="Specs / details">
              <ul className="space-y-2">
                {form.details.map((d, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="flex-1 rounded-full bg-secondary px-4 py-2 text-sm">{d}</span>
                    <button type="button" onClick={() => setForm({ ...form, details: form.details.filter((_, idx) => idx !== i) })} className="rounded-full p-1.5 hover:bg-destructive/10 text-destructive">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex gap-2">
                <input value={detailDraft} onChange={(e) => setDetailDraft(e.target.value)} placeholder="Add a spec" className="input flex-1" />
                <button type="button" onClick={() => { if (detailDraft.trim()) { setForm({ ...form, details: [...form.details, detailDraft.trim()] }); setDetailDraft(""); } }} className="rounded-full bg-foreground px-4 text-xs font-medium text-background">
                  Add
                </button>
              </div>
            </Section>

            <Section title="Variants">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Sizes</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(form.sizes ?? []).map((s, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs">
                      {s}
                      <button type="button" onClick={() => setForm({ ...form, sizes: form.sizes!.filter((_, idx) => idx !== i) })}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <input value={sizeDraft} onChange={(e) => setSizeDraft(e.target.value)} placeholder="e.g. M" className="input flex-1" />
                  <button type="button" onClick={() => { if (sizeDraft.trim()) { setForm({ ...form, sizes: [...(form.sizes ?? []), sizeDraft.trim()] }); setSizeDraft(""); } }} className="rounded-full bg-foreground px-4 text-xs font-medium text-background">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Colors</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(form.colors ?? []).map((c, i) => (
                    <span key={i} className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs">
                      <span className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
                      {c.name}
                      <button type="button" onClick={() => setForm({ ...form, colors: form.colors!.filter((_, idx) => idx !== i) })}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <input value={colorDraft.name} onChange={(e) => setColorDraft({ ...colorDraft, name: e.target.value })} placeholder="Name" className="input flex-1" />
                  <input type="color" value={colorDraft.hex} onChange={(e) => setColorDraft({ ...colorDraft, hex: e.target.value })} className="h-11 w-14 cursor-pointer rounded-full border border-border bg-background" />
                  <button type="button" onClick={() => { if (colorDraft.name.trim()) { setForm({ ...form, colors: [...(form.colors ?? []), colorDraft] }); setColorDraft({ name: "", hex: "#cccccc" }); } }} className="rounded-full bg-foreground px-4 text-xs font-medium text-background">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </Section>
          </div>

          <aside className="space-y-6">
            <Section title="Images">
              <div className="grid grid-cols-3 gap-2">
                {(form.images ?? []).map((src, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded-xl bg-secondary ring-1 ring-border/40">
                    <img src={src} alt={`Product image ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
                    {form.image === src && (
                      <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-foreground px-2 py-0.5 text-[9px] font-medium text-background">
                        <Star className="h-2.5 w-2.5 fill-background" /> MAIN
                      </span>
                    )}
                    <div className="absolute inset-0 flex items-end justify-between gap-1 bg-gradient-to-t from-foreground/70 via-transparent to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <button type="button" onClick={() => setMainImage(src)} className="rounded-full bg-background px-2 py-0.5 text-[10px] font-medium" disabled={form.image === src}>
                        Set main
                      </button>
                      <button type="button" onClick={() => removeImage(i)} className="rounded-full bg-destructive p-1 text-destructive-foreground" aria-label="Remove image">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
                <label className={`relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border bg-secondary/40 text-center text-xs text-muted-foreground hover:border-foreground/40 hover:text-foreground ${uploading ? "pointer-events-none opacity-60" : ""}`}>
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  <span>{uploading ? "Processing..." : "Upload"}</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={uploading} onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }} className="hidden" />
                </label>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">
                JPG, PNG, or WebP · max {Math.round(MAX_FILE_BYTES / 1024 / 1024)}MB · auto-resized to 1280px.
              </p>
            </Section>

            <button className="inline-flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background shadow-glow">
              {isNew ? "Create product" : "Save changes"}
            </button>
            <Link to="/admin" className="block text-center text-xs text-muted-foreground hover:text-foreground">Cancel</Link>
          </aside>
        </form>
      </div>

      <style>{`.input{width:100%;height:2.75rem;border-radius:9999px;border:1px solid var(--color-border);background:color-mix(in oklab, var(--color-background) 60%, transparent);padding-left:1rem;padding-right:1rem;font-size:.875rem;outline:none}.input:focus{box-shadow:0 0 0 2px color-mix(in oklab, var(--color-accent) 40%, transparent)}`}</style>
    </Layout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-strong rounded-3xl p-6 shadow-soft">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
