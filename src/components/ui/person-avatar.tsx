import { cn } from "@/lib/utils";
import { getPersonAvatarUrl, getPersonInitials } from "@/lib/avatars";

const sizeClasses = {
  sm: "h-9 w-9 rounded-full",
  md: "h-11 w-11 rounded-full",
  lg: "h-14 w-14 rounded-full",
  xl: "h-20 w-20 rounded-full",
};

export function PersonAvatar({
  personId,
  displayName,
  size = "md",
  className,
}: {
  personId: string;
  displayName: string;
  size?: keyof typeof sizeClasses;
  className?: string;
}) {
  const px = size === "sm" ? 72 : size === "md" ? 88 : size === "lg" ? 112 : 160;

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden border border-border/60 bg-secondary",
        sizeClasses[size],
        className,
      )}
    >
      <img
        src={getPersonAvatarUrl(personId, displayName, px)}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.style.display = "none";
          const fallback = event.currentTarget.nextElementSibling;
          if (fallback instanceof HTMLElement) fallback.style.display = "flex";
        }}
      />
      <div
        className="absolute inset-0 hidden items-center justify-center bg-secondary text-[11px] font-semibold text-muted-foreground"
        aria-hidden
      >
        {getPersonInitials(displayName)}
      </div>
    </div>
  );
}

export function PersonAvatarStack({
  people,
  max = 4,
}: {
  people: Array<{ id: string; displayName: string }>;
  max?: number;
}) {
  const visible = people.slice(0, max);
  const remaining = people.length - visible.length;

  return (
    <div className="flex items-center">
      {visible.map((person, index) => (
        <PersonAvatar
          key={person.id}
          personId={person.id}
          displayName={person.displayName}
          size="sm"
          className={cn("ring-2 ring-background", index > 0 && "-ml-2.5")}
        />
      ))}
      {remaining > 0 ? (
        <span className="ml-2 text-xs text-muted-foreground">+{remaining}</span>
      ) : null}
    </div>
  );
}
