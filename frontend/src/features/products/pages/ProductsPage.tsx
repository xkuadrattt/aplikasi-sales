import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { ProductsTable } from "../components/ProductsTable";
import { ProductFormModal } from "../components/ProductFormModal";
import { deleteProduct } from "../api";
import type { Product } from "@/types/product";
import { useDebouncedValue, useProducts } from "../hooks";

export default function ProductsPage() {
  const [q, setQ] = useState("");
  const qDebounced = useDebouncedValue(q, 400);


  const [active, setActive] = useState<boolean | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [sort, setSort] = useState<"created_at" | "name" | "sku" | "price_default" | "is_active" | "updated_at">("created_at");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const query = useMemo(
    () => ({
      q: qDebounced || undefined,
      active,
      page,
      per_page: perPage,
      sort,
      dir,
    }),
    [qDebounced, active, page, perPage, sort, dir]
  );

  const { data, rows, loading, error, refetch } = useProducts(query);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<Product | null>(null);

  function openCreate() {
    setSelected(null);
    setModalMode("create");
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setSelected(p);
    setModalMode("edit");
    setModalOpen(true);
  }

  async function onDelete(p: Product) {
    const ok = confirm(`Delete ${p.name}?`);
    if (!ok) return;

    await deleteProduct(p.id);
    setPage(1);
    refetch()
  }

  function onSort(field: string) {
    const f = field as any;
    if (sort === f) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSort(f);
      setDir("asc");
    }
    setPage(1);
  }

  function onSuccess() {
    setPage(1);
    refetch()
  }

  

  return (
    <div className="min-h-screen bg-lavender-100 p-6">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xl font-semibold">Products</div>
        <Button onClick={openCreate}>+ New</Button>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Search sku / name..."
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="rounded border px-3 py-2"
          value={active === null ? "" : active ? "1" : "0"}
          onChange={(e) => {
            const v = e.target.value;
            setActive(v === "" ? null : v === "1");
            setPage(1);
          }}
        >
          <option value="">All</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>

        <select
          className="rounded border px-3 py-2"
          value={perPage}
          onChange={(e) => {
            setPerPage(Number(e.target.value));
            setPage(1);
          }}
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}/page
            </option>
          ))}
        </select>
      </div>

      {error ? <div className="text-red-600">{error}</div> : null}
      {loading ? <div>Loading...</div> : null}

      <ProductsTable
        rows={rows}
        sort={sort}
        dir={dir}
        onSort={onSort}
        onEdit={openEdit}
        onDelete={onDelete}
      />

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          disabled={!data || data.current_page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </Button>

        <div className="text-sm">
          Page {data?.current_page ?? 1} / {data?.last_page ?? 1} (total{" "}
          {data?.total ?? 0})
        </div>

        <Button
          variant="ghost"
          disabled={!data || data.current_page >= data.last_page}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

      <ProductFormModal
        open={modalOpen}
        mode={modalMode}
        initial={selected}
        onClose={() => setModalOpen(false)}
        onSuccess={onSuccess}
      />

    </div>
    
  );
}
