import { Link } from "react-router-dom";

export function SparkeefyLogo({ size = 32 }: { size?: number }) {
  return (
    <img
      src="/brand/logo-heart.png"
      alt="Sparkeefy"
      width={size}
      height={size}
      className="shrink-0"
    />
  );
}

export function SparkeefyWordmark({ subtitle }: { subtitle?: string }) {
  return (
    <Link to="/" className="flex items-center gap-2 group max-w-full">
      <SparkeefyLogo size={28} />
      <div className="flex min-w-0 flex-col justify-center">
        <img
          src="/brand/logo-text.svg"
          alt="Sparkeefy"
          className="h-4 w-auto max-w-[7.5rem] object-contain object-left sm:h-5 sm:max-w-none"
        />
        {subtitle ? (
          <span className="mt-0.5 truncate text-[10px] leading-none text-muted-foreground">
            {subtitle}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
