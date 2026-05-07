export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <h3 className="font-display text-lg font-semibold">Vendoo<span className="text-accent">.</span></h3>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Considered essentials, designed in Accra. The wardrobe you keep forever.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">📍 Osu, Accra · Ghana</p>
        </div>
        {[
          { t: "Shop", l: ["New Arrivals","Outerwear","Knitwear","Accessories"] },
          { t: "Help", l: ["Delivery (Ghana)","Returns","Size Guide","WhatsApp us"] },
          { t: "Company", l: ["About","Sustainability","Journal","Press"] },
        ].map((c) => (
          <div key={c.t}>
            <h4 className="text-sm font-medium">{c.t}</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {c.l.map((x) => <li key={x} className="hover:text-foreground transition-smooth cursor-pointer">{x}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60 px-6 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Vendoo. Crafted with intention.
      </div>
    </footer>
  );
}
