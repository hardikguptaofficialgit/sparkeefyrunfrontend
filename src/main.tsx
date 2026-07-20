import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Providers } from "@/components/providers";
import { AppShell } from "@/components/layout/app-shell";
import { AppRoutes } from "@/App";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Providers>
        <AppShell>
          <AppRoutes />
        </AppShell>
      </Providers>
    </BrowserRouter>
  </StrictMode>,
);
