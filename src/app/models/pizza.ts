export interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  size: string;
  imageUrl: string;
  toppings: string[];
}
