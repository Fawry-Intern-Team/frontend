import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}
export interface Cart {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}