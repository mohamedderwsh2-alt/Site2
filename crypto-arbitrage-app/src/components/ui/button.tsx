"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = {
  primary:
    "bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25 hover:brightness-105 active:translate-y-[1px]",
  outline:
    "border border-white/10 bg-white/5 text-white hover:bg-white/10 active:translate-y-[1px]",
  subtle:
    "bg-white/5 text-white hover:bg-white/10 border border-transparent active:translate-y-[1px]",
  ghost:
    "bg-transparent text-white hover:bg-white/10 active:bg-white/15 active:translate-y-[1px]",
  danger:
    "bg-red-500/90 text-white hover:bg-red-500 shadow-red-500/30 active:translate-y-[1px]",
} as const;

type ButtonVariant = keyof typeof buttonVariants;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fluid?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", fluid, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-[18px] px-4 py-2 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
          buttonVariants[variant],
          fluid && "w-full",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
