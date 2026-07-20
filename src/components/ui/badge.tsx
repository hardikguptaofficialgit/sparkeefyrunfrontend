import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive" | "teal";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium",
        variant === "default" && "bg-primary/15 text-primary",
        variant === "secondary" && "bg-secondary text-muted border border-border",
        variant === "success" && "bg-success/15 text-success",
        variant === "warning" && "bg-primary/10 text-highlight",
        variant === "destructive" && "bg-destructive/15 text-destructive",
        variant === "teal" && "bg-accent-teal/15 text-accent-teal",
        className,
      )}
      {...props}
    />
  );
}
