import { cn } from "@/lib/utils";

export function MenuToggle({
  open,
  onClick,
  className,
}: {
  open: boolean;
  onClick: () => void;
  className?: string;
}) {
  const line =
    "absolute left-0 h-[2.3px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className={cn(
        "group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl",
        "bg-transparent outline-none transition-all duration-300",
        "hover:scale-105 active:scale-95",
        "focus-visible:ring-2 focus-visible:ring-pink-400/20",
        className
      )}
    >
      <span className="relative h-[18px] w-[22px] transition-transform duration-300 group-hover:rotate-2">
        {/* Top */}
        <span
          className={cn(
            line,
            "top-0 w-[22px]",
            "bg-gradient-to-r from-white via-[#fff5fa] via-40% to-[#ff4d8d]",
            open &&
              "top-1/2 w-[22px] -translate-y-1/2 rotate-45"
          )}
        />

        {/* Middle */}
        <span
          className={cn(
            line,
            "top-1/2 w-[18px] -translate-y-1/2",
            "bg-gradient-to-r from-white via-[#fff5fa] to-[#ff75aa]",
            open &&
              "left-1/2 w-0 -translate-x-1/2 opacity-0"
          )}
        />

        {/* Bottom */}
        <span
          className={cn(
            line,
            "bottom-0 w-[22px]",
            "bg-gradient-to-r from-white via-[#fff5fa] via-40% to-[#ff4d8d]",
            open &&
              "top-1/2 bottom-auto w-[22px] -translate-y-1/2 -rotate-45"
          )}
        />
      </span>
    </button>
  );
}