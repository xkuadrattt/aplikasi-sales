import { Button } from "@/components/Button";
import type { Product } from "@/types/product";

type Props = {
  rows: Product[];
  sort: string;
  dir: "asc" | "desc";
  onSort: (sort: string) => void;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
};

function SortHeader({
  label,
  field,
  sort,
  dir,
  onSort,
}: {
  label: string;
  field: string;
  sort: string;
  dir: "asc" | "desc";
  onSort: (field: string) => void;
}) {
  const active = sort === field;
  return (
    <button
      className="flex items-center gap-1"
      onClick={() => onSort(field)}
      type="button"
    >
      <span>{label}</span>
      {active ? (
        <span className="text-xs">{dir === "asc" ? "▲" : "▼"}</span>
      ) : null}
    </button>
  );
}

export function ProductsTable({
  rows,
  sort,
  dir,
  onSort,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-primary-50 text-primary-700">
          <tr className="text-left">
            <th className="p-2">
              <SortHeader
                label="SKU"
                field="sku"
                sort={sort}
                dir={dir}
                onSort={onSort}
              />
            </th>
            <th className="p-2">
              <SortHeader
                label="Name"
                field="name"
                sort={sort}
                dir={dir}
                onSort={onSort}
              />
            </th>
            <th className="p-2">Category</th>
            <th className="p-2">
              <SortHeader
                label="Price"
                field="price_default"
                sort={sort}
                dir={dir}
                onSort={onSort}
              />
            </th>
            <th className="p-2">
              <SortHeader
                label="Active"
                field="is_active"
                sort={sort}
                dir={dir}
                onSort={onSort}
              />
            </th>
            <th className="p-2">
              <SortHeader
                label="Created"
                field="created_at"
                sort={sort}
                dir={dir}
                onSort={onSort}
              />
            </th>
            <th className="p-2 w-40">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="p-3 text-gray-500" colSpan={7}>
                No data
              </td>
            </tr>
          ) : (
            rows.map((p) => (
              <tr
                key={p.id}
                className="border-t hover:bg-primary-50/60 transition"
              >
                <td className="p-2">{p.sku}</td>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.category ?? "-"}</td>
                <td className="p-2">{p.price_default ?? "-"}</td>
                <td className={`p-2 flex items-center justify-center`}>
                  <div
                    className={`rounded-full px-3 py-2 text-xs font-medium ${
                      p.is_active
                        ? "bg-mint-100 text-teal-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {p.is_active ? "Active" : "Inactive"}
                  </div>
                </td>
                <td className="p-2">
                  {new Date(p.created_at).toLocaleString()}
                </td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => onEdit(p)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => onDelete(p)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
