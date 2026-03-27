"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Briefcase, Video, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "首页" },
  { href: "/jobs", icon: Briefcase, label: "职位" },
  { href: "/interview", icon: Video, label: "面试" },
  { href: "/profile", icon: User, label: "我的" },
];

export function BottomNav() {
  const pathname = usePathname() || "";
  const router = useRouter();

  const navigate = (href: string) => {
    router.push(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-bottom z-50">
      <div className="flex justify-around items-center h-14 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors active:bg-gray-50",
                isActive
                  ? "text-blue-600"
                  : "text-gray-400"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
