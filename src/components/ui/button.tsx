import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-body text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "rounded-pill bg-primary text-primary-foreground hover:bg-primary/90 shadow-none",
        hero:
          "rounded-pill bg-primary text-primary-foreground hover:bg-primary/90 shadow-none",
        coral:
          "rounded-lg border border-coral/40 bg-coral-soft/40 text-coral hover:bg-coral-soft/60 shadow-none",
        destructive:
          "rounded-pill bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "rounded-pill border border-primary/25 bg-transparent text-foreground hover:bg-muted shadow-none",
        secondary:
          "rounded-pill border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-none",
        ghost: "rounded-md text-foreground hover:bg-muted shadow-none",
        link: "rounded-xs text-brand-action underline-offset-4 hover:underline p-0 h-auto font-normal",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-base",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
