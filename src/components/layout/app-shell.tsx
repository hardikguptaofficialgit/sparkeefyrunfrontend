import { useState } from "react";
import { DesktopSidebar, MobileBottomNav, MobileDrawer } from "@/components/layout/sidebar";
import { MenuToggle } from "@/components/layout/menu-toggle";
import { SparkeefyWordmark } from "@/components/brand/logo";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="box-border h-dvh bg-background p-1 sm:p-1.5 lg:p-2">
      <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border-2 border-white bg-background sm:rounded-2xl sm:border-[3px] lg:flex-row lg:rounded-[18px] lg:border-4">
        <DesktopSidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />

        <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
          <header className="z-30 grid shrink-0 grid-cols-[2.75rem_1fr_2.75rem] items-center border-b border-border/40 bg-background/95 px-2 backdrop-blur-md sm:px-4 lg:hidden">
            <MenuToggle open={mobileOpen} onClick={() => setMobileOpen((value) => !value)} />

            <div className="flex justify-center">
              <SparkeefyWordmark subtitle="Wingman" />
            </div>

            <div aria-hidden />
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto px-3 py-5 sm:px-5 sm:py-7 lg:px-10 lg:py-9">
            <div className="mx-auto w-full max-w-[720px]">{children}</div>
          </main>

          <MobileBottomNav />
        </div>
      </div>
    </div>
  );
}
