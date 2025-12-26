import { cn } from "@/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

export const Button = ({
  children,
  className,
  type = "button",
  loading,
  ref,
  ...props
}: ButtonProps) => {
  return (
    <button
      ref={ref}
      type={type}
      className={cn("cursor-pointer", className)}
      style={{ outline: "none" }}
      {...props}
    >
      {children}
    </button>
  );
};
