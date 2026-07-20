import { Link, useLocation } from "react-router-dom";
import {
  SquaresFour,
  Users,
  ChatCircle,
  ClockCounterClockwise,
  Gear,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { SparkeefyWordmark } from "@/components/brand/logo";

const navItems = [
  { href: "/", label: "Dashboard", icon: SquaresFour },
  { href: "/people", label: "People", icon: Users },
  { href: "/wingman/new", label: "New Run", icon: ChatCircle },
  { href: "/wingman", label: "Run History", icon: ClockCounterClockwise },
  { href: "/settings", label: "Settings", icon: Gear },
];

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="relative z-10 hidden lg:flex w-64 flex-col border-r border-border/60 bg-card/85 backdrop-blur-md">
      <div className="flex h-16 items-center border-b border-border px-6">
        <SparkeefyWordmark subtitle="AI Wingman" />
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href) && item.href !== "/";

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-200",
                active
                  ? "bg-foreground text-background"
                  : "text-muted hover:text-foreground hover:bg-card-hover",
              )}
            >
              <Icon size={18} weight={active ? "fill" : "regular"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-6">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Caring shouldn&apos;t feel this hard. Show up thoughtfully for the people who matter most.
        </p>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const { pathname } = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border bg-card">
      <div className="grid grid-cols-5 gap-1 p-2">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href) && item.href !== "/";

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl py-2 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-muted",
              )}
            >
              <Icon size={18} weight={active ? "fill" : "regular"} />
              <span className="truncate">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
