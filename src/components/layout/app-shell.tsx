import { useState } from "react";
import { DesktopSidebar, MobileDrawer } from "@/components/layout/sidebar";
import { MenuToggle } from "@/components/layout/menu-toggle";
import { SparkeefyWordmark } from "@/components/brand/logo";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-background">
      <DesktopSidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[60px] items-center gap-3 border-b border-border/40 bg-background px-4 lg:px-8">
          <div className="lg:hidden">
            <MenuToggle open={mobileOpen} onClick={() => setMobileOpen((value) => !value)} />
          </div>

          <div className="lg:hidden">
            <SparkeefyWordmark subtitle="Wingman" />
          </div>
        </header>

        <main className="flex-1 px-4 py-7 lg:px-10 lg:py-9">
          <div className="mx-auto w-full max-w-[720px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
