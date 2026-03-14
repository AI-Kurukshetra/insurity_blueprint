"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { canAccessRole, type UserRole } from "@/lib/auth";

const items: Array<{
  href: string;
  label: string;
  requiresAuth?: boolean;
  allowedRoles?: UserRole[];
}> = [
  { href: "/", label: "Dashboard", requiresAuth: true },
  { href: "/policies", label: "Policies", requiresAuth: true },
  { href: "/claims", label: "Claims", requiresAuth: true, allowedRoles: ["broker", "adjuster", "admin"] },
  { href: "/portal", label: "Portal", requiresAuth: true, allowedRoles: ["policyholder", "broker", "admin"] },
  { href: "/broker", label: "Broker", requiresAuth: true, allowedRoles: ["broker", "admin"] },
  { href: "/admin", label: "Admin", requiresAuth: true, allowedRoles: ["admin"] },
  { href: "/login", label: "Login" },
];

export function Navigation() {
  const pathname = usePathname();
  const { isAuthenticated, role } = useAuth();
  const visibleItems = items.filter((item) => {
    if (item.requiresAuth && !isAuthenticated) {
      return false;
    }

    if (item.href === "/login" && isAuthenticated) {
      return false;
    }

    return canAccessRole(role, item.allowedRoles);
  });

  return (
    <nav className="flex flex-wrap gap-2">
      {visibleItems.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? "rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white"
                : "rounded-full border border-stone-200 bg-white/80 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-white"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
