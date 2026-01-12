import { useEffect, useState } from "react";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import type { Product, ProductCreateInput } from "@/types/product";
import { createProduct, updateProduct } from "../api";
import { HttpError, isLaravelValidationError } from "@/lib/http";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: Product | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function ProductFormModal({ open, mode, initial, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<ProductCreateInput>({
    sku: "",
    name: "",
    category: "",
    price_default: null,
    is_active: true,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const title = mode === "create" ? "Create Product" : "Edit Product";

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initial) {
      setForm({
        sku: initial.sku,
        name: initial.name,
        category: initial.category ?? "",
        price_default: initial.price_default ?? null,
        is_active: !!initial.is_active,
      });
    } else {
      setForm({ sku: "", name: "", category: "", price_default: null, is_active: true });
    }

    setFieldErrors({});
  }, [open, mode, initial]);

  async function submit() {
    setSubmitting(true);
    setFieldErrors({});
    try {
      if (mode === "create") {
        await createProduct({
          ...form,
          category: form.category?.trim() ? form.category : null,
        });
      } else {
        if (!initial) return;
        await updateProduct(initial.id, {
          ...form,
          category: form.category?.trim() ? form.category : null,
        });
      }
      onSuccess();
      onClose();
    } catch (e) {
      if (e instanceof HttpError && isLaravelValidationError(e.payload)) {
        const fe: Record<string, string> = {};
        for (const [k, arr] of Object.entries(e.payload.errors)) {
          fe[k] = arr?.[0] ?? "Invalid";
        }
        setFieldErrors(fe);
      } else {
        alert(e instanceof Error ? e.message : "Unknown error");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <div className="space-y-3">
        <Input
          label="SKU"
          value={form.sku}
          onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
          error={fieldErrors.sku}
          placeholder="NB-010"
        />
        <Input
          label="Name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          error={fieldErrors.name}
          placeholder="Acer Swift"
        />
        <Input
          label="Category (optional)"
          value={form.category ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
          error={fieldErrors.category}
          placeholder="Laptop"
        />
        <Input
          label="Price Default (optional)"
          type="number"
          value={form.price_default ?? ""}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              price_default: e.target.value === "" ? null : Number(e.target.value),
            }))
          }
          error={fieldErrors.price_default}
          placeholder="12500000"
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!form.is_active}
            onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
          />
          Active
        </label>
        {fieldErrors.is_active ? <div className="text-sm text-red-600">{fieldErrors.is_active}</div> : null}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
