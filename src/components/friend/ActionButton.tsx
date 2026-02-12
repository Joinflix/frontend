import type { ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils"; // standard shadcn/tailwind merge util

interface ActionButtonProps extends ComponentProps<"button"> {
  icon: LucideIcon;
  iconSize?: number;
  label: string;
  variantClassName: string;
  baseStyle?: string;
}

export const ActionButton = ({
  icon: Icon,
  iconSize = 14,
  label,
  variantClassName,
  className,
  ...props
}: ActionButtonProps) => {
  return (
    <button {...props} className={cn(variantClassName, className)}>
      <Icon
        size={iconSize}
        className="text-inherit"
        style={{ width: iconSize, height: iconSize }}
      />
      <span>{label}</span>
    </button>
  );
};
