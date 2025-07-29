import { StoreProductResponse } from './store-product-response.model';

export interface CartItem {
  product: StoreProductResponse;
  quantity: number;
}
export interface Cart {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}
