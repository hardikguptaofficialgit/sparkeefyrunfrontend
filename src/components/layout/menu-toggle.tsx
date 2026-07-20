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
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className={cn(
        "group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
        "bg-transparent transition-all duration-300",
        "hover:bg-white/[0.04]",
        "focus-visible:outline-none",
        className
      )}
    >
      <span className="relative flex h-[18px] w-5 flex-col justify-between">
        {/* Top Line */}
        <span
          className={cn(
            "block h-[2.8px] w-5 rounded-full",
            "bg-gradient-to-r from-white via-[#ffe3f0] to-[#ff5c9d]",
            "transition-all duration-300 ease-in-out",
            open && "translate-y-[7px] rotate-45"
          )}
        />

        {/* Middle Line */}
        <span
          className={cn(
            "block h-[2.8px] w-5 rounded-full",
            "bg-gradient-to-r from-white via-[#ffe3f0] to-[#ff5c9d]",
            "transition-all duration-300 ease-in-out",
            open && "scale-x-0 opacity-0"
          )}
        />

        {/* Bottom Line */}
        <span
          className={cn(
            "block h-[2.8px] w-5 rounded-full",
            "bg-gradient-to-r from-white via-[#ffe3f0] to-[#ff5c9d]",
            "transition-all duration-300 ease-in-out",
            open && "-translate-y-[7px] -rotate-45"
          )}
        />
      </span>
    </button>
  );
}