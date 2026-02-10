export interface OrderResponse {
  publicId: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  pickupTime: string;
  email: string;
  orderItems: {
    pizzaName: string;
    size: string;
    quantity: number;
    price: number;
  }[];
}
