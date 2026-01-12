type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ open, title, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow">
        <div className="flex items-center justify-between rounded-t-2xl bg-lavender-100 px-4 py-3">
          <div className="font-semibold text-gray-700">{title}</div>
          <button className="rounded px-2 py-1 hover:bg-gray-100" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
