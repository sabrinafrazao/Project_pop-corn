export interface BomboniereProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface BomboniereOrder {
  product: BomboniereProduct;
  quantity: number;
}