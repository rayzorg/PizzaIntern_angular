export interface OrderSummary {
  orderId: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: {
    pizzaName: string;
    size: string;
    quantity: number;
    price: number;
  }[];
}