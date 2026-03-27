"use client";

import { BottomNav } from "./BottomNav";
import { usePathname } from "next/navigation";

const noNavRoutes = ["/register"];

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNav = !noNavRoutes.includes(pathname);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <main className="max-w-lg mx-auto">{children}</main>
      {showNav && <BottomNav />}
    </div>
  );
}
