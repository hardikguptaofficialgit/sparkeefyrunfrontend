import { Link, useLocation } from "react-router-dom";
import {
  SquaresFour,
  Users,
  ChatCircle,
  ClockCounterClockwise,
  Gear,
  X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { SparkeefyWordmark } from "@/components/brand/logo";
import { MenuToggle } from "@/components/layout/menu-toggle";

const navItems = [
  { href: "/", label: "Dashboard", shortLabel: "Home", icon: SquaresFour },
  { href: "/people", label: "People", shortLabel: "People", icon: Users },
  { href: "/wingman/new", label: "New Run", shortLabel: "Run", icon: ChatCircle },
  { href: "/wingman", label: "Run History", shortLabel: "History", icon: ClockCounterClockwise },
  { href: "/settings", label: "Settings", shortLabel: "Settings", icon: Gear },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href) && href !== "/";
}

function NavLinks({
  pathname,
  collapsed,
  onNavigate,
  mobile = false,
}: {
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  return (
    <>
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={cn(
              "flex items-center gap-3 rounded-full font-medium transition-colors duration-200",
              mobile ? "px-4 py-3 text-base" : "text-sm",
              collapsed ? "justify-center px-3 py-2.5" : mobile ? "" : "px-4 py-2.5",
              active
                ? "bg-foreground text-background"
                : "text-muted hover:bg-card-hover hover:text-foreground",
            )}
          >
            <Icon size={mobile ? 20 : 18} weight={active ? "fill" : "regular"} />
            {!collapsed && item.label}
          </Link>
        );
      })}
    </>
  );
}

export function DesktopSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { pathname } = useLocation();

  return (
    <aside
      className={cn(
        "relative z-10 hidden h-full min-h-0 shrink-0 flex-col border-r border-border/60 bg-card/85 backdrop-blur-md transition-[width] duration-300 lg:flex",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-border",
          collapsed ? "justify-center px-2" : "px-6",
        )}
      >
        {collapsed ? (
          <div className="group relative flex h-10 w-10 items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
              <img
                src="/brand/logo-heart.png"
                alt="Sparkeefy"
                className="h-6 w-6 object-contain transition-transform duration-300 group-hover:scale-95"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <MenuToggle open={false} onClick={onToggle} />
            </div>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between gap-2">
            <SparkeefyWordmark subtitle="AI Wingman" />
            <MenuToggle open={false} onClick={onToggle} />
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        <NavLinks pathname={pathname} collapsed={collapsed} />
      </nav>

      {!collapsed && (
        <div className="border-t border-border p-6">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Caring shouldn&apos;t feel this hard. Show up thoughtfully for the people who matter most.
          </p>
        </div>
      )}
    </aside>
  );
}

export function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { pathname } = useLocation();

  return (
    <>
      <div
        className={cn(
          "absolute inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={cn(
          "absolute inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] flex-col border-r border-border bg-card shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!open}
        aria-label="Navigation menu"
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4 sm:h-16 sm:px-5">
          <SparkeefyWordmark subtitle="AI Wingman" />
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-card-hover hover:text-foreground"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          <NavLinks pathname={pathname} onNavigate={onClose} mobile />
        </nav>

        <div className="border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Caring shouldn&apos;t feel this hard. Show up thoughtfully for the people who matter most.
          </p>
        </div>
      </aside>
    </>
  );
}

export function MobileBottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="z-30 shrink-0 border-t border-border/80 bg-card/95 backdrop-blur-md lg:hidden"
      aria-label="Primary navigation"
    >
      <div className="grid grid-cols-5 gap-0.5 px-1 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1.5 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-muted hover:text-foreground",
              )}
            >
              <Icon size={20} weight={active ? "fill" : "regular"} />
              <span className="truncate leading-none">{item.shortLabel}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
