import { cn } from "@/lib/utils";

type EyebrowProps = {
  children: React.ReactNode;
  className?: string;
};

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "block font-mono uppercase",
        "tracking-[0.1em]",
        "text-[length:var(--text-label)]",
        "text-faint",
        className,
      )}
    >
      {children}
    </span>
  );
}
