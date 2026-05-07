import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AnnouncementBar } from "./AnnouncementBar";
import type { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
