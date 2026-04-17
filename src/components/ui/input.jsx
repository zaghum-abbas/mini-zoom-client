import React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(
  (
    {
      label,
      isRequired,
      className,
      type,
      touched,
      errors,
      endAdornment,
      ...props
    },
    ref
  ) => {
    const hasEndAdornment = Boolean(endAdornment);
    const endAdornmentTopClass = label ? "top-[30px]" : "top-1/2 -translate-y-1/2";
    return (
      <div className={cn("relative")}>
        {label && (
          <p className="!font-Inter_medium text-sm font-medium  mb-[5px]">
            {label} {isRequired && <span className="text-[#FD0D0D]">*</span>}
          </p>
        )}

        <input
          type={type}
          className={cn(
            "h-9 w-full rounded-md border text-[#1F1F20] border-[#414A66]  px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:!outline-none focus-visible:!ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300",
            hasEndAdornment ? "pr-10" : null,
            className
          )}
          ref={ref}
          {...props}
        />

        {hasEndAdornment ? (
          <div className={cn("absolute right-2", endAdornmentTopClass)}>
            {endAdornment}
          </div>
        ) : null}

        {touched && errors && (
          <span className="text-[#FD0D0D] absolute left-0 text-xs -bottom-[18px]">
            {errors}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };