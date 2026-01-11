export interface Product {
  id: number;
  sku: string;
  name: string;
  category: string | null;
  price_default: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ProductCreateInput = {
  sku: string;
  name: string;
  category?: string | null;
  price_default?: number | null;
  is_active?: boolean;
};

export type ProductUpdateInput = Partial<ProductCreateInput>;
