import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, FC } from "react";

// Button Variants defined using class-variance-authority.
// It is a utility library that allows you to define variants for your components.
// default it will have the active and focus style.
// You can define your own variants and default variants.
const buttonVariants = cva(
  "active: scale-95, inline-flex items-center justify-center rounded-md text-sm font-medium trnasition-color focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disable:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800",
        ghost: "bg-transparent hover:text-slate-900 hover:bg-slate-200",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/// With this we will be able to see the properties of the button in the editor.
// Since it is a custom button but extends the HTMLButtonElement, we will be able to inherit all the properties of the HTMLButtonElement.
// by passing it Variant Props, we will be able to see the Variant and Size properties in the editor when we are using the Button.
// Hence making this custom button work exactly like the HTMLButtonElement but will more power.sss
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

/**
 *Custom Button Component behaving exactly like the HTMLButtonElement but with more power.
 *
 * @param {*} {
 *   className,
 *   children,
 *   variant,
 *   isLoading,
 *   size,
 *   ...props
 * }
 * @return {*}
 */
const Button: FC<ButtonProps> = ({
  className,
  children,
  variant,
  isLoading,
  size,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
};

export default Button;
