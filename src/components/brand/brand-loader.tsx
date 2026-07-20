import { SparkeefyLogo } from "@/components/brand/logo";

export function BrandLoader({ fullScreen = false }: { fullScreen?: boolean }) {
  return (
    <div
      className={
        fullScreen
          ? "flex min-h-screen flex-col items-center justify-center gap-6 bg-background"
          : "flex flex-col items-center justify-center gap-6 py-24"
      }
    >
      <div className="flex flex-col items-center gap-4">
        <SparkeefyLogo size={48} />
        <img
          src="/brand/logo-text.svg"
          alt="Sparkeefy"
          className="h-5 w-auto object-contain opacity-80"
        />
      </div>

      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1 w-1 rounded-full bg-muted-foreground/50 animate-pulse"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
