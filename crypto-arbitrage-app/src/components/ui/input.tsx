"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leadingIcon, trailingIcon, type = "text", ...props }, ref) => {
    return (
      <label className="relative flex items-center">
        {leadingIcon && (
          <span className="pointer-events-none absolute left-3 text-slate-300">
            {leadingIcon}
          </span>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400/80 focus:outline-none focus:ring-2 focus:ring-cyan-400/80",
            leadingIcon && "pl-10",
            trailingIcon && "pr-10",
            className
          )}
          {...props}
        />
        {trailingIcon && (
          <span className="pointer-events-none absolute right-3 text-slate-300">
            {trailingIcon}
          </span>
        )}
      </label>
    );
  }
);
Input.displayName = "Input";
