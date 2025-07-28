export interface StockHistory {
  id: string;
  storeId: string;
  productId: string;
  quantityChange: number;
  reason: string;
  timestamp: string; // ISO date string from backend
}