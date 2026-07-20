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
    <Link to="/" className="flex items-center gap-2.5 group">
      <SparkeefyLogo size={32} />
      <div className="flex flex-col justify-center">
        <img
          src="/brand/logo-text.svg"
          alt="Sparkeefy"
          className="h-5 w-auto object-contain"
        />
        {subtitle ? (
          <span className="text-[10px] text-muted-foreground mt-0.5 leading-none">
            {subtitle}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
