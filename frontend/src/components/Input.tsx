type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, ...props }: Props) {
  return (
    <label className="block space-y-1">
      <div className="text-sm text-gray-600">{label}</div>
      <input
        {...props}
        className={`w-full rounded-xl px-3 py-2 text-sm transition outline-none ${
          error
            ? "border border-rose-400 bg-peach-100"
            : "border border-gray-200 bg-white focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
        }`}
      />
      {error ? <div className="text-xs text-rose-600">{error}</div> : null}
    </label>
  );
}
