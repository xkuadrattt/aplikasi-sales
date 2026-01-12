type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "danger" | "ghost";
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
  const base = "rounded-xl px-4 py-2 text-sm font-medium transition-all disabled:opacity-50";
   const styles =
    variant === "primary"
      ? "bg-primary-100 text-primary-700 hover:bg-primary-200"
      : variant === "danger"
      ? "bg-peach-100 text-rose-600 hover:bg-peach-200"
      : "bg-gray-100 text-gray-600 hover:bg-gray-200";


  return <button {...props} className={`${base} ${styles} ${className}`} />;
}
