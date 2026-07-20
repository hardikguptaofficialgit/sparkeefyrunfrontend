import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  SquaresFour,
  Users,
  ChatCircle,
  ClockCounterClockwise,
  Gear,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { SparkeefyLogo, SparkeefyWordmark } from "@/components/brand/logo";
import { MenuToggle } from "@/components/layout/menu-toggle";

export const navItems = [
  { href: "/", label: "Dashboard", icon: SquaresFour },
  { href: "/people", label: "People", icon: Users },
  { href: "/wingman/new", label: "New Run", icon: ChatCircle },
  { href: "/wingman", label: "Run History", icon: ClockCounterClockwise },
  { href: "/settings", label: "Settings", icon: Gear },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/wingman") {
    return (
      pathname === "/wingman" ||
      (pathname.startsWith("/wingman/") && !pathname.startsWith("/wingman/new"))
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({
  collapsed,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const { pathname } = useLocation();

  return (
    <nav className="flex flex-1 flex-col gap-0.5 px-2 py-3">
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
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors duration-200",
              collapsed && "justify-center px-0",
              active
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
            )}
          >
            {active ? (
              <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-primary" />
            ) : null}
            <Icon
              size={18}
              weight={active ? "fill" : "regular"}
              className={cn("shrink-0", active && "text-primary")}
            />
            {!collapsed ? <span className="truncate">{item.label}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}

function CollapsedSidebarHeader({ onExpand }: { onExpand: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex h-[60px] items-center justify-center border-b border-border/40"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {hovered ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.16, ease: [0.4, 0, 0.2, 1] }}
          >
            <MenuToggle open={false} variant="minimal" onClick={onExpand} />
          </motion.div>
        ) : (
          <motion.div
            key="logo"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.16, ease: [0.4, 0, 0.2, 1] }}
          >
            <Link to="/" className="flex items-center justify-center p-1">
              <SparkeefyLogo size={30} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DesktopSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 248 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden border-r border-border/40 bg-[#0a0a0a] lg:flex"
    >
      {collapsed ? (
        <CollapsedSidebarHeader onExpand={() => onToggle()} />
      ) : (
        <div className="flex h-[60px] items-center justify-between gap-2 border-b border-border/40 px-4">
          <SparkeefyWordmark subtitle="AI Wingman" />
          <MenuToggle open={false} onClick={onToggle} />
        </div>
      )}

      <NavLinks collapsed={collapsed} />

      {!collapsed ? (
        <div className="border-t border-border/40 px-4 py-5">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-accent italic text-primary">Caring</span> shouldn&apos;t feel this
            hard.
          </p>
        </div>
      ) : null}
    </motion.aside>
  );
}

export function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close menu overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-black/80 lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-y-0 left-0 z-50 flex w-[min(280px,88vw)] flex-col border-r border-border/40 bg-[#0a0a0a] lg:hidden"
          >
            <div className="flex h-[60px] items-center justify-between gap-3 border-b border-border/40 px-4">
              <SparkeefyWordmark subtitle="AI Wingman" />
              <MenuToggle open onClick={onClose} />
            </div>

            <NavLinks onNavigate={onClose} />

            <div className="mt-auto border-t border-border/40 px-4 py-5">
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                <span className="font-accent italic text-primary">Caring</span> shouldn&apos;t feel
                this hard.
              </p>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
