import { cn } from "@/lib/utils";

export const Spinner = ({ className, size = 20, ...props }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn("animate-spin text-muted-foreground", className)}
      aria-hidden="true"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4z"
      />
    </svg>
  );
};

