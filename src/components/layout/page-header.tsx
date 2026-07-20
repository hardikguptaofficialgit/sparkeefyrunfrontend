import { motion } from "framer-motion";
import { BrandLoader } from "@/components/brand/brand-loader";

export function PageHeader({
  title,
  description,
  action,
  accent,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  accent?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="space-y-2.5">
        <h1 className="font-display text-[1.75rem] sm:text-[2rem] font-semibold tracking-[-0.02em] text-balance leading-[1.15]">
          {accent ? (
            <>
              <span className="font-accent italic text-primary">{accent}</span> {title}
            </>
          ) : (
            title
          )}
        </h1>
        {description ? (
          <p className="font-body max-w-xl text-[13px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </motion.div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-secondary/30 px-6 py-16 text-center">
      <h3 className="text-base font-medium tracking-tight">{title}</h3>
      <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function LoadingState() {
  return <BrandLoader />;
}
