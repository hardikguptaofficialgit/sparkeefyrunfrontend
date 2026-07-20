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
import { MenuToggle } from "@/components/layout/menu-toggle";

const navItems = [
  { href: "/", label: "Dashboard", icon: SquaresFour },
  { href: "/people", label: "People", icon: Users },
  { href: "/wingman/new", label: "New Run", icon: ChatCircle },
  { href: "/wingman", label: "Run History", icon: ClockCounterClockwise },
  { href: "/settings", label: "Settings", icon: Gear },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href) && href !== "/";
}

function NavLinks({
  pathname,
  collapsed,
  onNavigate,
}: {
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
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
              "flex items-center gap-3 rounded-full text-sm font-medium transition-colors duration-200",
              collapsed ? "justify-center px-3 py-2.5" : "px-4 py-2.5",
              active
                ? "bg-foreground text-background"
                : "text-muted hover:bg-card-hover hover:text-foreground",
            )}
          >
            <Icon size={18} weight={active ? "fill" : "regular"} />
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
        "relative z-10 hidden shrink-0 flex-col border-r border-border/60 bg-card/85 backdrop-blur-md transition-[width] duration-300 lg:flex",
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
            <div className="absolute inset-0 flex items-center justify-center transition-opacity group-hover:opacity-0">
              <span className="text-lg font-semibold text-primary">S</span>
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
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col border-r border-border bg-card transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!open}
      >
        <div className="flex h-16 items-center border-b border-border px-5">
          <SparkeefyWordmark subtitle="AI Wingman" />
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          <NavLinks pathname={pathname} onNavigate={onClose} />
        </nav>

        <div className="border-t border-border p-5">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Caring shouldn&apos;t feel this hard. Show up thoughtfully for the people who matter most.
          </p>
        </div>
      </aside>
    </>
  );
}
