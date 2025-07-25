export interface Product {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  categoryName: string;
  createdAt?: string; // ✅ optional if used only for tracking
  updatedAt?: string; // ✅ optional if used only for tracking
  deletedAt?: string | null; // ✅ optional, may be null
  isDeleted?: boolean; // ✅ optional, depends on API usage
}
